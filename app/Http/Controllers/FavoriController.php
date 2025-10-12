<?php

namespace App\Http\Controllers;

use App\Models\Favori;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoriController extends Controller
{
    public function index()
    {
        $favoris = Auth::user()
            ->favoris()
            ->with(['produit.sousCategorie.categorie'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Client/Favoris/Index', [
            'favoris' => $favoris,
        ]);
    }

    public function ajouter(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
        ]);

        $produit = Produit::findOrFail($request->produit_id);
        
        // Vérifier si le produit est déjà en favori
        $existingFavori = Auth::user()
            ->favoris()
            ->where('produit_id', $request->produit_id)
            ->first();

        if ($existingFavori) {
            return redirect()->back()->with('error', 'Ce produit est déjà dans vos favoris');
        }

        // Créer le favori
        Auth::user()->favoris()->create([
            'produit_id' => $request->produit_id,
        ]);

        return redirect()->back()->with('success', 'Produit ajouté aux favoris');
    }

    public function supprimer(Favori $favori)
    {
        $this->authorize('delete', $favori);

        $favori->delete();

        return redirect()->back()->with('success', 'Produit retiré des favoris');
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
        ]);

        $favori = Auth::user()
            ->favoris()
            ->where('produit_id', $request->produit_id)
            ->first();

        if ($favori) {
            $favori->delete();
            $isFavori = false;
            $message = 'Produit retiré des favoris';
        } else {
            Auth::user()->favoris()->create([
                'produit_id' => $request->produit_id,
            ]);
            $isFavori = true;
            $message = 'Produit ajouté aux favoris';
        }

        return response()->json([
            'success' => true,
            'is_favori' => $isFavori,
            'message' => $message,
        ]);
    }

    public function isFavori(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
        ]);

        $isFavori = Auth::user()
            ->favoris()
            ->where('produit_id', $request->produit_id)
            ->exists();

        return response()->json([
            'is_favori' => $isFavori,
        ]);
    }

    public function getFavorisCount()
    {
        $count = Auth::user()->favoris()->count();

        return response()->json([
            'count' => $count,
        ]);
    }
}