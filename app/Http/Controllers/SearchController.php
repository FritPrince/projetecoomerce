<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return redirect()->route('accueil');
        }

        // Recherche dans les produits
        $produits = Produit::with(['sousCategorie.categorie'])
            ->where(function ($q) use ($query) {
                $q->where('nom', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhereHas('sousCategorie', function ($subQ) use ($query) {
                      $subQ->where('nom', 'like', "%{$query}%")
                           ->orWhereHas('categorie', function ($catQ) use ($query) {
                               $catQ->where('nom', 'like', "%{$query}%");
                           });
                  });
            })
            ->where('stock', '>', 0) // Seulement les produits en stock
            ->orderBy('nom')
            ->paginate(12);

        return Inertia::render('Client/Search/Results', [
            'query' => $query,
            'produits' => $produits->items(),
            'total' => $produits->total(),
        ]);
    }

    public function suggestions(Request $request)
    {
        $query = $request->get('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        // Suggestions basées sur les noms de produits
        $suggestions = Produit::where('nom', 'like', "%{$query}%")
            ->distinct()
            ->pluck('nom')
            ->take(5)
            ->toArray();

        // Ajouter des suggestions de catégories
        $categorySuggestions = \App\Models\Categorie::where('nom', 'like', "%{$query}%")
            ->pluck('nom')
            ->take(3)
            ->toArray();

        $allSuggestions = array_merge($suggestions, $categorySuggestions);
        
        return response()->json(array_unique($allSuggestions));
    }
}