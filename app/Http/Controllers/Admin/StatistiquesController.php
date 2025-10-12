<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Produit;
use App\Models\Commande;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatistiquesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:admin');
    }

    public function index()
    {
        // Statistiques de base
        $totalClients = User::where('role', 'client')->count();
        $totalProduits = Produit::count();
        $totalCommandes = Commande::count();
        
        // Revenus du mois en cours
        $revenusMensuels = Paiement::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->where('statut', 'confirme')
            ->sum('montant');

        // Commandes par mois (12 derniers mois)
        $commandesParMois = Commande::select(
                DB::raw('MONTH(created_at) as mois'),
                DB::raw('YEAR(created_at) as annee'),
                DB::raw('COUNT(*) as total')
            )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('annee', 'mois')
            ->orderBy('annee', 'asc')
            ->orderBy('mois', 'asc')
            ->get();

        // Produits les plus vendus
        $produitsPopulaires = DB::table('ligne_commandes')
            ->join('produits', 'ligne_commandes.produit_id', '=', 'produits.id')
            ->select('produits.nom', 'produits.id', DB::raw('SUM(ligne_commandes.quantite) as total_vendu'))
            ->groupBy('produits.id', 'produits.nom')
            ->orderBy('total_vendu', 'desc')
            ->limit(5)
            ->get();

        // Activité récente
        $activiteRecente = collect([
            [
                'action' => 'Nouvelle commande',
                'user' => 'Client #1234',
                'time' => 'Il y a 5 min',
                'type' => 'commande'
            ],
            [
                'action' => 'Produit ajouté',
                'user' => 'Admin',
                'time' => 'Il y a 1h',
                'type' => 'produit'
            ],
            [
                'action' => 'Paiement reçu',
                'user' => 'Client #5678',
                'time' => 'Il y a 2h',
                'type' => 'paiement'
            ],
            [
                'action' => 'Stock mis à jour',
                'user' => 'Admin',
                'time' => 'Il y a 3h',
                'type' => 'stock'
            ],
        ]);

        return Inertia::render('Admin/Statistiques/Index', [
            'stats' => [
                'total_ventes' => $totalCommandes,
                'total_clients' => $totalClients,
                'total_produits' => $totalProduits,
                'revenus_mensuels' => $revenusMensuels,
            ],
            'commandes_par_mois' => $commandesParMois,
            'produits_populaires' => $produitsPopulaires,
            'activite_recente' => $activiteRecente,
        ]);
    }
}
