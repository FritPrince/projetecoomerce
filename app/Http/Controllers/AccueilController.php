<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use App\Models\Produit;
use App\Models\Favori;
use App\Models\Commande;
use App\Models\LigneCommande;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AccueilController extends Controller
{
    /**
     * Page d'accueil avec produits et catégories
     */
    public function index()
    {
        $categories = Categorie::with(['sousCategories' => function($query) {
            $query->withCount('produits');
        }])->get();

        $produits = Produit::with(['sousCategorie.categorie'])
            ->where('stock', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Client/Accueil', [
            'categories' => $categories,
            'produits' => $produits
        ]);
    }

    /**
     * Détails d'un produit
     */
    public function showProduit(Produit $produit)
    {
        $produit->load(['sousCategorie.categorie', 'favoris']);

        // Calcul de la note moyenne (à adapter selon votre système d'avis)
        $noteMoyenne = 4.5; // Exemple statique
        $nombreAvis = 12; // Exemple statique

        return Inertia::render('Client/Produits/Show', [
            'produit' => $produit,
            'note_moyenne' => $noteMoyenne,
            'nombre_avis' => $nombreAvis,
            'avis' => [] // À implémenter si vous avez un système d'avis
        ]);
    }

    /**
     * Page du panier/commandes
     */
    public function commandes()
    {
        $user = Auth::user();
        
        // Récupérer le panier (commandes en statut "panier")
        $panier = Commande::with(['produits' => function($query) {
            $query->withPivot('quantite', 'prix_unitaire', 'sous_total');
        }])
        ->where('user_id', $user->id)
        ->where('statut', 'panier')
        ->first();

        // Si pas de panier, créer un panier vide
        if (!$panier) {
            $panier = new Commande([
                'produits' => collect()
            ]);
        }

        return Inertia::render('Client/Commandes/Index', [
            'panier' => $panier->produits ?? collect()
        ]);
    }

    /**
     * Ajouter un produit au panier
     */
    public function ajouterAuPanier(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1'
        ]);

        // Trouver ou créer le panier
        $panier = Commande::firstOrCreate([
            'user_id' => $user->id,
            'statut' => 'panier'
        ], [
            'numero_commande' => 'PANIER-' . $user->id . '-' . time(),
            'date_commande' => now(),
            'total' => 0
        ]);

        $produit = Produit::findOrFail($request->produit_id);

        // Vérifier si le produit est déjà dans le panier
        $ligneExistante = $panier->produits()->where('produit_id', $request->produit_id)->first();

        if ($ligneExistante) {
            // Mettre à jour la quantité
            $nouvelleQuantite = $ligneExistante->pivot->quantite + $request->quantite;
            $panier->produits()->updateExistingPivot($request->produit_id, [
                'quantite' => $nouvelleQuantite,
                'sous_total' => $produit->prix * $nouvelleQuantite
            ]);
        } else {
            // Ajouter le produit
            $panier->produits()->attach($request->produit_id, [
                'quantite' => $request->quantite,
                'prix_unitaire' => $produit->prix,
                'sous_total' => $produit->prix * $request->quantite
            ]);
        }

        // Recalculer le total
        $this->recalculerTotalPanier($panier);

        return redirect()->back()->with('success', 'Produit ajouté au panier');
    }

    /**
     * Mettre à jour la quantité dans le panier
     */
    public function mettreAJourPanier(Request $request, Commande $commande)
    {
        $user = Auth::user();
        
        // Vérifier que la commande appartient à l'utilisateur
        if ($commande->user_id !== $user->id || $commande->statut !== 'panier') {
            abort(403);
        }

        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1'
        ]);

        $produit = Produit::findOrFail($request->produit_id);

        if ($request->quantite === 0) {
            // Supprimer le produit
            $commande->produits()->detach($request->produit_id);
        } else {
            // Mettre à jour la quantité
            $commande->produits()->updateExistingPivot($request->produit_id, [
                'quantite' => $request->quantite,
                'sous_total' => $produit->prix * $request->quantite
            ]);
        }

        // Recalculer le total
        $this->recalculerTotalPanier($commande);

        return redirect()->back()->with('success', 'Panier mis à jour');
    }

    /**
     * Supprimer un produit du panier
     */
    public function supprimerDuPanier(Commande $commande, Produit $produit)
    {
        $user = Auth::user();
        
        if ($commande->user_id !== $user->id || $commande->statut !== 'panier') {
            abort(403);
        }

        $commande->produits()->detach($produit->id);
        $this->recalculerTotalPanier($commande);

        return redirect()->back()->with('success', 'Produit retiré du panier');
    }

    /**
     * Page des favoris
     */
    public function favoris()
    {
        $user = Auth::user();
        
        $favoris = Favori::with(['produit' => function($query) {
            $query->with(['sousCategorie.categorie']);
        }])
        ->where('user_id', $user->id)
        ->get();

        return Inertia::render('Client/Favoris/Index', [
            'favoris' => $favoris
        ]);
    }

    /**
     * Ajouter un produit aux favoris
     */
    public function ajouterAuxFavoris(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'produit_id' => 'required|exists:produits,id'
        ]);

        // Vérifier si le produit est déjà en favori
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

    /**
     * Supprimer un produit des favoris
     */
    public function supprimerDesFavoris(Favori $favori)
    {
        $user = Auth::user();
        
        if ($favori->user_id !== $user->id) {
            abort(403, 'Non autorisé.');
        }

        $favori->delete();

        return redirect()->back()->with('success', 'Produit retiré des favoris.');
    }

    /**
     * Page de profil utilisateur
     */
    public function profil()
    {
        $user = Auth::user();
        
        $statistiques = [
            'commandes_total' => Commande::where('user_id', $user->id)
                ->where('statut', '!=', 'panier')
                ->count(),
            'favoris_total' => Favori::where('user_id', $user->id)->count(),
        ];

        return Inertia::render('Client/Profil/Index', [
            'user' => $user,
            'statistiques' => $statistiques
        ]);
    }

    /**
     * Procéder au paiement
     */
    public function procederAuPaiement(Commande $commande)
    {
        $user = Auth::user();
        
        if ($commande->user_id !== $user->id || $commande->statut !== 'panier') {
            abort(403);
        }

        // Vérifier le stock des produits
        foreach ($commande->produits as $produit) {
            if ($produit->stock < $produit->pivot->quantite) {
                return redirect()->back()->with('error', 
                    "Le produit \"{$produit->nom}\" n'est plus disponible en quantité suffisante.");
            }
        }

        // Mettre à jour le statut de la commande
        $commande->update([
            'statut' => 'en_attente',
            'numero_commande' => 'CMD-' . $user->id . '-' . time()
        ]);

        // Mettre à jour les stocks
        foreach ($commande->produits as $produit) {
            $produit->decrement('stock', $produit->pivot->quantite);
        }

        return Inertia::render('Client/Paiement/Index', [
            'commande' => $commande->load('produits')
        ]);
    }

    /**
     * Méthode utilitaire pour recalculer le total du panier
     */
    private function recalculerTotalPanier(Commande $panier)
    {
        $total = $panier->produits->sum(function($produit) {
            return $produit->pivot->sous_total;
        });

        $panier->update(['total' => $total]);
    }

    /**
     * Recherche de produits
     */
    public function rechercher(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2'
        ]);

        $produits = Produit::with(['sousCategorie.categorie'])
            ->where('nom', 'like', '%' . $request->q . '%')
            ->orWhere('description', 'like', '%' . $request->q . '%')
            ->where('stock', '>', 0)
            ->get();

        $categories = Categorie::with(['sousCategories'])->get();

        return Inertia::render('Client/Accueil', [
            'categories' => $categories,
            'produits' => $produits,
            'terme_recherche' => $request->q
        ]);
    }

    /**
     * Filtrer par catégorie
     */
    public function filtrerParCategorie(Categorie $categorie)
    {
        $categories = Categorie::with(['sousCategories'])->get();

        // Récupérer les produits de cette catégorie via les sous-catégories
        $sousCategoriesIds = $categorie->sousCategories->pluck('id');
        
        $produits = Produit::with(['sousCategorie.categorie'])
            ->whereIn('sous_categorie_id', $sousCategoriesIds)
            ->where('stock', '>', 0)
            ->get();

        return Inertia::render('Client/Accueil', [
            'categories' => $categories,
            'produits' => $produits,
            'categorie_active' => $categorie->id
        ]);
    }
}