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
use App\Models\Categorie;
use Illuminate\Support\Facades\DB;
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

        $categories = Categorie::with(['sousCategories' => function($query) {
        $query->withCount('produits');
    }])->get();

    $produits = Produit::with(['sousCategorie.categorie'])
        ->select('produits.*')
        ->addSelect(DB::raw('produits.image as image_url'))
        ->where('stock', '>', 0)
        ->orderBy('created_at', 'desc')
        ->get();
        
        $commandes = Commande::where('user_id', $userId)
                            ->with('produits')
                            ->latest()
                            ->take(5)
                            ->get();

        $favoris = Favori::where('user_id', $userId)
                         ->with('produit')
                         ->get();

        return Inertia::render('Client/Accueil', [
    'categories' => $categories,
    'produits' => $produits,
    'commandes' => $commandes,
    'favoris' => $favoris
]);
    }
}