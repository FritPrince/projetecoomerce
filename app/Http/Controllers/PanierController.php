<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\User;
use App\Models\Notification;
use App\Events\NouvelleCommande;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PanierController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $panier = Commande::with(['produits' => function($query) {
            $query->withPivot('quantite', 'prix_unitaire', 'sous_total');
        }])
        ->where('user_id', $user->id)
        ->where('statut', 'panier')
        ->first();

        return Inertia::render('Client/Panier/Index', [
            'panier' => $panier,
            'total' => $panier->total ?? 0
        ]);
    }

    public function ajouter(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1'
        ]);

        $panier = Commande::firstOrCreate([
            'user_id' => $user->id,
            'statut' => 'panier'
        ], [
            'numero_commande' => 'PANIER-' . $user->id . '-' . time(),
            'date_commande' => now(),
            'total' => 0
        ]);

        $produit = Produit::findOrFail($request->produit_id);

        // Vérifier le stock
        if ($produit->stock < $request->quantite) {
            return redirect()->back()->with('error', 'Stock insuffisant pour ce produit');
        }

        $ligneExistante = $panier->produits()->where('produit_id', $request->produit_id)->first();

        if ($ligneExistante) {
            $nouvelleQuantite = $ligneExistante->pivot->quantite + $request->quantite;
            
            // Vérifier le stock pour la nouvelle quantité
            if ($produit->stock < $nouvelleQuantite) {
                return redirect()->back()->with('error', 'Stock insuffisant pour la quantité demandée');
            }
            
            $panier->produits()->updateExistingPivot($request->produit_id, [
                'quantite' => $nouvelleQuantite,
                'sous_total' => $produit->prix * $nouvelleQuantite
            ]);
        } else {
            $panier->produits()->attach($request->produit_id, [
                'quantite' => $request->quantite,
                'prix_unitaire' => $produit->prix,
                'sous_total' => $produit->prix * $request->quantite
            ]);
        }

        $this->recalculerTotalPanier($panier);

        return redirect()->back()->with('success', 'Produit ajouté au panier');
    }

    public function mettreAJour(Request $request, Commande $commande)
    {
        $user = Auth::user();
        
        if ($commande->user_id !== $user->id || $commande->statut !== 'panier') {
            abort(403);
        }

        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:0'
        ]);

        $produit = Produit::findOrFail($request->produit_id);

        if ($request->quantite === 0) {
            $commande->produits()->detach($request->produit_id);
        } else {
            if ($produit->stock < $request->quantite) {
                return redirect()->back()->with('error', 'Stock insuffisant');
            }
            
            $commande->produits()->updateExistingPivot($request->produit_id, [
                'quantite' => $request->quantite,
                'sous_total' => $produit->prix * $request->quantite
            ]);
        }

        $this->recalculerTotalPanier($commande);

        return redirect()->back()->with('success', 'Panier mis à jour');
    }

    public function supprimer(Commande $commande, Produit $produit)
    {
        $user = Auth::user();
        
        if ($commande->user_id !== $user->id || $commande->statut !== 'panier') {
            abort(403);
        }

        $commande->produits()->detach($produit->id);
        $this->recalculerTotalPanier($commande);

        return redirect()->back()->with('success', 'Produit retiré du panier');
    }

    public function procederAuPaiement(Request $request, Commande $commande)
    {
        $user = Auth::user();
        
        if ($commande->user_id !== $user->id || $commande->statut !== 'panier') {
            abort(403);
        }

        // Vérifier le stock de tous les produits
        foreach ($commande->produits as $produit) {
            if ($produit->stock < $produit->pivot->quantite) {
                return redirect()->back()->with('error', "Stock insuffisant pour le produit: {$produit->nom}");
            }
        }

        // Générer un nouveau numéro de commande
        $numeroCommande = 'CMD-' . date('Ymd') . '-' . str_pad($commande->id, 4, '0', STR_PAD_LEFT);
        
        // Mettre à jour la commande
        $commande->update([
            'numero_commande' => $numeroCommande,
            'statut' => 'en_attente',
            'date_commande' => now()
        ]);

        // Décrémenter le stock des produits
        foreach ($commande->produits as $produit) {
            $produit->decrement('stock', $produit->pivot->quantite);
        }

        // Créer des notifications pour les admins
        $admins = User::where('role', 'admin')->get();
        
        foreach ($admins as $admin) {
            Notification::createNotification(
                $admin->id,
                'nouvelle_commande',
                'Nouvelle commande reçue',
                "Commande #{$numeroCommande} de {$user->name}",
                [
                    'commande_id' => $commande->id,
                    'numero_commande' => $numeroCommande,
                    'total' => $commande->total,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                ]
            );
        }

        // Déclencher l'événement de broadcast
        event(new NouvelleCommande($commande, $user));

        // Rediriger vers la page de sélection des méthodes de paiement
        return redirect()->route('payment.methods', $commande)
                         ->with('success', 'Commande créée ! Veuillez choisir votre méthode de paiement.');
    }

    private function recalculerTotalPanier(Commande $panier)
    {
        $total = $panier->produits->sum(function($produit) {
            return $produit->pivot->sous_total;
        });

        $panier->update(['total' => $total]);
    }
}