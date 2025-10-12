<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommandeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Afficher la liste des commandes du client
     */
    public function index()
    {
        $commandes = Auth::user()
            ->commandes()
            ->with(['ligneCommandes.produit.sousCategorie.categorie'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Client/Commandes/Index', [
            'commandes' => $commandes,
        ]);
    }

    /**
     * Afficher les détails d'une commande
     */
    public function show($id)
    {
        $commande = Auth::user()
            ->commandes()
            ->with(['ligneCommandes.produit.sousCategorie.categorie'])
            ->findOrFail($id);

        return Inertia::render('Client/Commandes/Show', [
            'commande' => $commande,
        ]);
    }

    /**
     * Annuler une commande (si possible)
     */
    public function cancel($id)
    {
        $commande = Auth::user()->commandes()->findOrFail($id);

        // Vérifier si la commande peut être annulée
        if (!in_array($commande->statut, ['en_attente', 'confirmee'])) {
            return redirect()->back()->with('error', 'Cette commande ne peut pas être annulée.');
        }

        $commande->update(['statut' => 'annulee']);

        return redirect()->back()->with('success', 'Commande annulée avec succès.');
    }
}

