<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\User;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RapportsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:admin');
    }

    public function index()
    {
        // Rapports récents (simulés)
        $rapportsRecents = collect([
            [
                'id' => 1,
                'name' => 'Rapport Ventes - ' . now()->format('F Y'),
                'type' => 'Ventes',
                'generated' => now()->subDays(1)->toDateString(),
                'status' => 'completed',
                'file_size' => '2.3 MB'
            ],
            [
                'id' => 2,
                'name' => 'Analyse Clients - Q4 2023',
                'type' => 'Clients',
                'generated' => now()->subDays(7)->toDateString(),
                'status' => 'completed',
                'file_size' => '1.8 MB'
            ],
            [
                'id' => 3,
                'name' => 'Performance Produits - ' . now()->subMonth()->format('F Y'),
                'type' => 'Produits',
                'generated' => now()->subDays(15)->toDateString(),
                'status' => 'completed',
                'file_size' => '3.1 MB'
            ],
        ]);

        // Types de rapports disponibles
        $typesRapports = [
            'ventes' => [
                'title' => 'Rapport des Ventes',
                'description' => 'Analyse détaillée des ventes par période',
                'icon' => 'BarChart3',
                'color' => 'text-green-600',
                'bgColor' => 'bg-green-50',
            ],
            'clients' => [
                'title' => 'Rapport Clients',
                'description' => 'Comportement et données des clients',
                'icon' => 'TrendingUp',
                'color' => 'text-blue-600',
                'bgColor' => 'bg-blue-50',
            ],
            'produits' => [
                'title' => 'Rapport Produits',
                'description' => 'Performance des produits en stock',
                'icon' => 'Package',
                'color' => 'text-purple-600',
                'bgColor' => 'bg-purple-50',
            ],
            'financier' => [
                'title' => 'Rapport Financier',
                'description' => 'Analyse des revenus et coûts',
                'icon' => 'Euro',
                'color' => 'text-orange-600',
                'bgColor' => 'bg-orange-50',
            ],
        ];

        return Inertia::render('Admin/Rapports/Index', [
            'reports' => $rapportsRecents,
            'report_types' => $typesRapports,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:ventes,clients,produits,financier',
            'period' => 'required|string|in:month,quarter,year,custom',
            'format' => 'required|string|in:pdf,excel,csv',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        // Simulation de génération de rapport
        $reportData = $this->generateReportData($request->type, $request->period, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Rapport généré avec succès',
            'report' => [
                'id' => rand(1000, 9999),
                'name' => "Rapport {$request->type} - " . now()->format('Y-m-d'),
                'type' => ucfirst($request->type),
                'format' => strtoupper($request->format),
                'generated' => now()->toDateString(),
                'status' => 'completed',
                'data' => $reportData
            ]
        ]);
    }

    private function generateReportData($type, $period, $params)
    {
        // Simulation de données selon le type de rapport
        switch ($type) {
            case 'ventes':
                return [
                    'total_ventes' => rand(100, 1000),
                    'montant_total' => rand(10000, 100000),
                    'tendance' => rand(-10, 20),
                ];
            case 'clients':
                return [
                    'total_clients' => rand(50, 500),
                    'nouveaux_clients' => rand(10, 50),
                    'clients_actifs' => rand(30, 200),
                ];
            case 'produits':
                return [
                    'total_produits' => rand(100, 1000),
                    'produits_en_stock' => rand(80, 800),
                    'produits_rupture' => rand(5, 50),
                ];
            case 'financier':
                return [
                    'revenus_totaux' => rand(50000, 500000),
                    'depenses' => rand(20000, 200000),
                    'benefices' => rand(10000, 100000),
                ];
            default:
                return [];
        }
    }
}
