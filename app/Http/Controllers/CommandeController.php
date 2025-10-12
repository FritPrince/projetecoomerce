<?php
// app/Http/Controllers/CommandeController.php
namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\User;
use App\Models\Produit;
use App\Models\Notification;
use App\Events\NouvelleCommande;
use App\Events\StatutCommandeModifie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommandeController extends Controller
{
    public function index()
    {
        $commandes = Commande::with(['user', 'produits'])->get();
        return Inertia::render('Admin/Commandes/Index', [
            'commandes' => $commandes
        ]);
    }

    public function create()
    {
        $clients = User::where('role', 'client')->get();
        $produits = Produit::all();
        return Inertia::render('Admin/Commandes/Create', [
            'clients' => $clients,
            'produits' => $produits
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'numero_commande' => 'required|string|unique:commandes',
            'date_commande' => 'required|date',
            'statut' => 'required|in:en_attente,confirmee,expediee,livree,annulee',
            'user_id' => 'required|exists:users,id',
            'produits' => 'required|array|min:1',
            'produits.*.id' => 'required|exists:produits,id',
            'produits.*.quantite' => 'required|integer|min:1',
        ]);

        $total = 0;
        $produitsData = [];

        foreach ($request->produits as $produit) {
            $produitModel = Produit::find($produit['id']);
            $sousTotal = $produitModel->prix * $produit['quantite'];
            $total += $sousTotal;

            $produitsData[$produit['id']] = [
                'quantite' => $produit['quantite'],
                'prix_unitaire' => $produitModel->prix,
                'sous_total' => $sousTotal,
            ];
        }

        $commande = Commande::create([
            'numero_commande' => $request->numero_commande,
            'date_commande' => $request->date_commande,
            'statut' => $request->statut,
            'total' => $total,
            'user_id' => $request->user_id,
        ]);

        $commande->produits()->attach($produitsData);

        // Créer une notification pour les admins
        $user = User::find($request->user_id);
        $admins = User::where('role', 'admin')->get();
        
        foreach ($admins as $admin) {
            Notification::createNotification(
                $admin->id,
                'nouvelle_commande',
                'Nouvelle commande reçue',
                "Commande #{$commande->numero_commande} de {$user->name}",
                [
                    'commande_id' => $commande->id,
                    'numero_commande' => $commande->numero_commande,
                    'total' => $commande->total,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                ]
            );
        }

        // Déclencher l'événement de broadcast
        event(new NouvelleCommande($commande, $user));

        return redirect()->route('commandes.index')
                         ->with('success', 'Commande créée avec succès.');
    }

    public function show(Commande $commande)
    {
        $commande->load(['user', 'ligneCommandes.produit']);
        
        return Inertia::render('Admin/Commandes/Show', [
            'commande' => $commande
        ]);
    }

    public function edit(Commande $commande)
    {
        $commande->load(['produits']);
        $clients = User::where('role', 'client')->get();
        $produits = Produit::all();
        
        return Inertia::render('Admin/Commandes/Edit', [
            'commande' => $commande,
            'clients' => $clients,
            'produits' => $produits
        ]);
    }

    public function update(Request $request, Commande $commande)
    {
        $request->validate([
            'numero_commande' => 'required|string|unique:commandes,numero_commande,' . $commande->id,
            'date_commande' => 'required|date',
            'statut' => 'required|in:en_attente,confirmee,expediee,livree,annulee',
            'user_id' => 'required|exists:users,id',
        ]);

        $ancienStatut = $commande->statut;
        $commande->update($request->only(['numero_commande', 'date_commande', 'statut', 'user_id']));

        // Si le statut a changé, notifier le client
        if ($ancienStatut !== $request->statut) {
            $user = $commande->user;
            
            // Créer une notification pour le client
            Notification::createNotification(
                $user->id,
                'statut_commande_modifie',
                'Statut de commande mis à jour',
                "Votre commande #{$commande->numero_commande} est maintenant " . ucfirst($request->statut),
                [
                    'commande_id' => $commande->id,
                    'numero_commande' => $commande->numero_commande,
                    'ancien_statut' => $ancienStatut,
                    'nouveau_statut' => $request->statut,
                ]
            );

            // Déclencher l'événement de broadcast
            event(new StatutCommandeModifie($commande, $user, $ancienStatut, $request->statut));
        }

        return redirect()->route('commandes.index')
                         ->with('success', 'Commande modifiée avec succès.');
    }

    public function destroy(Commande $commande)
    {
        $commande->produits()->detach();
        $commande->delete();

        return redirect()->route('commandes.index')
                         ->with('success', 'Commande supprimée avec succès.');
    }

    public function updateStatut(Request $request, Commande $commande)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,confirmee,expediee,livree,annulee',
        ]);

        $ancienStatut = $commande->statut;
        $commande->update(['statut' => $request->statut]);

        // Si le statut a changé, notifier le client
        if ($ancienStatut !== $request->statut) {
            $user = $commande->user;
            
            // Créer une notification pour le client
            Notification::createNotification(
                $user->id,
                'statut_commande_modifie',
                'Statut de commande mis à jour',
                "Votre commande #{$commande->numero_commande} est maintenant " . ucfirst($request->statut),
                [
                    'commande_id' => $commande->id,
                    'numero_commande' => $commande->numero_commande,
                    'ancien_statut' => $ancienStatut,
                    'nouveau_statut' => $request->statut,
                ]
            );

            // Déclencher l'événement de broadcast
            event(new StatutCommandeModifie($commande, $user, $ancienStatut, $request->statut));
        }

        return redirect()->back()->with('success', 'Statut de la commande mis à jour.');
    }
}