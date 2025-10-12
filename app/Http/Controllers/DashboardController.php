<?php
// app/Http/Controllers/DashboardController.php
namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\User;
use App\Models\Paiement;
use App\Models\Favori;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            return $this->adminDashboard();
        }
        
        return $this->clientDashboard();
    }

    private function adminDashboard()
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            abort(403, 'Accès réservé aux administrateurs.');
        }
        
        $stats = [
            'totalClients' => User::where('role', 'client')->count(),
            'totalProduits' => Produit::count(),
            'totalCommandes' => Commande::count(),
            'totalPaiements' => Paiement::count(),
            'commandesRecentes' => Commande::with('user')->latest()->take(5)->get(),
            'produitsPopulaires' => Produit::withCount('favoris')->orderBy('favoris_count', 'desc')->take(5)->get()
        ];

        return Inertia::render('Admin/Dashboard', ['stats' => $stats]);
    }

    private function clientDashboard()
    {
        $user = Auth::user();
        $userId = $user->id;
        
        $commandes = Commande::where('user_id', $userId)
                            ->with('produits')
                            ->latest()
                            ->take(5)
                            ->get();

        $favoris = Favori::where('user_id', $userId)
                         ->with('produit')
                         ->get();

        return Inertia::render('Client/Accueil', [
        'commandes' => $commandes,
        'favoris' => $favoris
    ]);
    }
}