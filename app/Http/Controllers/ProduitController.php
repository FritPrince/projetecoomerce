<?php
// app/Http/Controllers/ProduitController.php
namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\SousCategorie;
use App\Models\User;
use App\Models\Notification;
use App\Events\StockFaible;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::with('sousCategorie.categorie')->get();
        return Inertia::render('Admin/Produits/Index', [
            'produits' => $produits
        ]);
    }

    public function create()
    {
        $sousCategories = SousCategorie::with('categorie')->get();
        return Inertia::render('Admin/Produits/Create', [
            'sousCategories' => $sousCategories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'sous_categorie_id' => 'required|exists:sous_categories,id',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        Produit::create($data);

        return redirect()->route('produits.index')
                         ->with('success', 'Produit créé avec succès.');
    }

    public function show(Produit $produit)
    {
        $produit->load(['sousCategorie.categorie', 'commandes', 'favoris']);
        return Inertia::render('Admin/Produits/Show', [
            'produit' => $produit
        ]);
    }

    public function edit(Produit $produit)
    {
        $sousCategories = SousCategorie::with('categorie')->get();
        return Inertia::render('Admin/Produits/Edit', [
            'produit' => $produit,
            'sousCategories' => $sousCategories
        ]);
    }

    public function update(Request $request, Produit $produit)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'sous_categorie_id' => 'required|exists:sous_categories,id',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($produit->image) {
                Storage::disk('public')->delete($produit->image);
            }
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        $ancienStock = $produit->stock;
        $produit->update($data);

        // Vérifier si le stock est faible (moins de 10 unités)
        if ($request->stock < 10 && $ancienStock >= 10) {
            $admins = User::where('role', 'admin')->get();
            
            foreach ($admins as $admin) {
                Notification::createNotification(
                    $admin->id,
                    'stock_faible',
                    'Stock faible détecté',
                    "Le produit '{$produit->nom}' a un stock faible ({$request->stock} unités)",
                    [
                        'produit_id' => $produit->id,
                        'produit_nom' => $produit->nom,
                        'stock_actuel' => $request->stock,
                        'prix' => $produit->prix,
                    ]
                );
            }

            // Déclencher l'événement de broadcast
            event(new StockFaible($produit, $request->stock));
        }

        return redirect()->route('produits.index')
                         ->with('success', 'Produit modifié avec succès.');
    }

    public function destroy(Produit $produit)
    {
        if ($produit->image) {
            Storage::disk('public')->delete($produit->image);
        }
        
        $produit->delete();

        return redirect()->route('produits.index')
                         ->with('success', 'Produit supprimé avec succès.');
    }
}