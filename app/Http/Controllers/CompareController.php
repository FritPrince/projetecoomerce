<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompareController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Afficher la page de comparaison
     */
    public function index(Request $request)
    {
        $productIds = $request->get('products', []);
        
        if (empty($productIds)) {
            return Inertia::render('Client/Compare/Index', [
                'produits' => [],
                'message' => 'Aucun produit à comparer'
            ]);
        }

        // Limiter à 4 produits maximum
        $productIds = array_slice($productIds, 0, 4);

        $produits = Produit::with(['sousCategorie.categorie'])
            ->whereIn('id', $productIds)
            ->get();

        return Inertia::render('Client/Compare/Index', [
            'produits' => $produits,
            'productIds' => $productIds
        ]);
    }

    /**
     * Ajouter un produit à la comparaison
     */
    public function add(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id'
        ]);

        $productId = $request->produit_id;
        $sessionKey = 'compare_products';
        
        // Récupérer les produits en cours de comparaison
        $compareProducts = session($sessionKey, []);
        
        // Ajouter le produit s'il n'est pas déjà présent
        if (!in_array($productId, $compareProducts)) {
            $compareProducts[] = $productId;
            
            // Limiter à 4 produits
            if (count($compareProducts) > 4) {
                array_shift($compareProducts);
            }
            
            session([$sessionKey => $compareProducts]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté à la comparaison',
            'count' => count($compareProducts)
        ]);
    }

    /**
     * Supprimer un produit de la comparaison
     */
    public function remove(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id'
        ]);

        $productId = $request->produit_id;
        $sessionKey = 'compare_products';
        
        $compareProducts = session($sessionKey, []);
        $compareProducts = array_values(array_filter($compareProducts, function($id) use ($productId) {
            return $id != $productId;
        }));
        
        session([$sessionKey => $compareProducts]);

        return response()->json([
            'success' => true,
            'message' => 'Produit retiré de la comparaison',
            'count' => count($compareProducts)
        ]);
    }

    /**
     * Vider la liste de comparaison
     */
    public function clear()
    {
        session(['compare_products' => []]);

        return response()->json([
            'success' => true,
            'message' => 'Liste de comparaison vidée'
        ]);
    }

    /**
     * Obtenir les produits en cours de comparaison
     */
    public function getCompareList()
    {
        $sessionKey = 'compare_products';
        $productIds = session($sessionKey, []);
        
        $produits = Produit::with(['sousCategorie.categorie'])
            ->whereIn('id', $productIds)
            ->get();

        return response()->json([
            'produits' => $produits,
            'count' => count($productIds)
        ]);
    }
}