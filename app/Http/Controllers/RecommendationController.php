<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\User;
use App\Models\Commande;
use App\Models\Favori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    /**
     * Obtenir les recommandations pour l'utilisateur connecté
     */
    public function getRecommendations(Request $request)
    {
        $user = Auth::user();
        $limit = $request->get('limit', 8);

        if (!$user) {
            // Recommandations populaires pour les utilisateurs non connectés
            return $this->getPopularProducts($limit);
        }

        // Recommandations personnalisées pour l'utilisateur connecté
        $recommendations = $this->getPersonalizedRecommendations($user, $limit);

        return response()->json([
            'recommendations' => $recommendations,
            'type' => 'personalized'
        ]);
    }

    /**
     * Obtenir les produits similaires à un produit donné
     */
    public function getSimilarProducts(Request $request, $produitId)
    {
        $produit = Produit::findOrFail($produitId);
        $limit = $request->get('limit', 4);

        $similarProducts = Produit::where('id', '!=', $produitId)
            ->where('sous_categorie_id', $produit->sous_categorie_id)
            ->where('stock', '>', 0)
            ->orderBy('prix')
            ->limit($limit)
            ->get();

        return response()->json([
            'similar_products' => $similarProducts,
            'base_product' => $produit
        ]);
    }

    /**
     * Recommandations personnalisées basées sur l'historique
     */
    private function getPersonalizedRecommendations(User $user, $limit)
    {
        $recommendations = collect();

        // 1. Basé sur les favoris
        $favoriteCategories = $user->favoris()
            ->with('produit.sousCategorie.categorie')
            ->get()
            ->pluck('produit.sousCategorie.categorie.id')
            ->unique();

        if ($favoriteCategories->isNotEmpty()) {
            $favoriteBased = Produit::whereHas('sousCategorie.categorie', function ($query) use ($favoriteCategories) {
                $query->whereIn('id', $favoriteCategories);
            })
            ->where('stock', '>', 0)
            ->whereNotIn('id', $user->favoris()->pluck('produit_id'))
            ->orderBy('prix')
            ->limit($limit / 2)
            ->get();

            $recommendations = $recommendations->merge($favoriteBased);
        }

        // 2. Basé sur l'historique des commandes
        $orderHistory = $user->commandes()
            ->with('ligneCommandes.produit.sousCategorie.categorie')
            ->get()
            ->pluck('ligneCommandes')
            ->flatten()
            ->pluck('produit.sousCategorie.categorie.id')
            ->unique();

        if ($orderHistory->isNotEmpty()) {
            $orderBased = Produit::whereHas('sousCategorie.categorie', function ($query) use ($orderHistory) {
                $query->whereIn('id', $orderHistory);
            })
            ->where('stock', '>', 0)
            ->whereNotIn('id', $user->favoris()->pluck('produit_id'))
            ->orderBy('prix')
            ->limit($limit / 2)
            ->get();

            $recommendations = $recommendations->merge($orderBased);
        }

        // 3. Si pas assez de recommandations, ajouter des produits populaires
        if ($recommendations->count() < $limit) {
            $popularProducts = $this->getPopularProducts($limit - $recommendations->count());
            $recommendations = $recommendations->merge($popularProducts);
        }

        return $recommendations->unique('id')->take($limit)->values();
    }

    /**
     * Obtenir les produits populaires
     */
    private function getPopularProducts($limit)
    {
        return Produit::where('stock', '>', 0)
            ->orderBy('prix')
            ->limit($limit)
            ->get();
    }

    /**
     * Obtenir les recommandations pour la page d'accueil
     */
    public function getHomeRecommendations()
    {
        $user = Auth::user();
        
        if (!$user) {
            // Produits populaires pour les visiteurs
            $popular = Produit::where('stock', '>', 0)
                ->orderBy('prix')
                ->limit(8)
                ->get();

            return [
                'popular' => $popular,
                'trending' => collect(),
                'personalized' => collect()
            ];
        }

        // Recommandations personnalisées
        $personalized = $this->getPersonalizedRecommendations($user, 4);
        
        // Produits populaires
        $popular = $this->getPopularProducts(4);

        return [
            'popular' => $popular,
            'personalized' => $personalized,
            'trending' => collect()
        ];
    }
}