<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Favori;
use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FavoriController extends Controller
{
    public function index()
{
    $user = Auth::user();
    
    $favoris = Favori::with(['produit' => function($query) {
        $query->with(['sousCategorie.categorie'])
              ->select('id', 'nom', 'description', 'prix', 'image', 'stock', 'sous_categorie_id');
    }])
    ->where('user_id', $user->id)
    ->get();

    // Ajouter note_moyenne si elle n'existe pas dans le modèle
    $favoris->each(function ($favori) {
        if ($favori->produit) {
            // Si votre modèle n'a pas note_moyenne, calculez-la ou mettez une valeur par défaut
            $favori->produit->note_moyenne = $favori->produit->note_moyenne ?? 0;
        }
    });

    return Inertia::render('Client/Favoris/Index', [
        'favoris' => $favoris
    ]);
}

    public function ajouter(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'produit_id' => 'required|exists:produits,id'
        ]);

        $favoriExistants = Favori::where('user_id', $user->id)
            ->where('produit_id', $request->produit_id)
            ->exists();

        if ($favoriExistants) {
            return redirect()->back()->with('error', 'Ce produit est déjà dans vos favoris.');
        }

        Favori::create([
            'user_id' => $user->id,
            'produit_id' => $request->produit_id
        ]);

        return redirect()->back()->with('success', 'Produit ajouté aux favoris.');
    }

    public function supprimer(Favori $favori)
    {
        $user = Auth::user();
        
        if ($favori->user_id !== $user->id) {
            abort(403, 'Non autorisé.');
        }

        $favori->delete();

        return redirect()->back()->with('success', 'Produit retiré des favoris.');
    }
}