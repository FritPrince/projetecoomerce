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

        list($data, $headers) = $this->generateReportData($request->type, $request->period, $request->all());

        if ($request->format === 'csv') {
            $fileName = 'rapport_' . $request->type . '_' . now()->format('Y-m-d') . '.csv';

            $callback = function() use ($data, $headers) {
                $file = fopen('php://output', 'w');
                fputcsv($file, $headers);

                foreach ($data as $row) {
                    fputcsv($file, $row);
                }

                fclose($file);
            };

            return response()->stream($callback, 200, [
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
                'Content-Type' => 'text/csv',
            ]);
        }

        // Pour PDF et Excel, à implémenter
        return back()->with('error', "Le format {$request->format} n'est pas encore supporté.");
    }

    private function generateReportData($type, $period, $params)
    {
        $query = $this->getBaseQuery($type, $period, $params);
        $results = $query->get();

        if ($results->isEmpty()) {
            return [[], []];
        }

        $headers = array_keys($results->first()->toArray());
        $data = $results->map(function ($row) {
            return $row->toArray();
        })->all();

        return [$data, $headers];
    }

    private function getBaseQuery($type, $period, $params)
    {
        $startDate = $params['start_date'] ?? null;
        $endDate = $params['end_date'] ?? null;

        // Logique de période (simplifiée)
        if ($period !== 'custom') {
            $endDate = now();
            if ($period === 'month') {
                $startDate = now()->subMonth();
            } elseif ($period === 'quarter') {
                $startDate = now()->subQuarter();
            } elseif ($period === 'year') {
                $startDate = now()->subYear();
            }
        }

        switch ($type) {
            case 'ventes':
                return Commande::query()
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->select('id', 'user_id', 'total', 'statut', 'created_at');
            case 'clients':
                return User::query()
                    ->where('role', 'client')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->select('id', 'name', 'email', 'created_at');
            case 'produits':
                return Produit::query()
                    ->select('id', 'nom', 'prix', 'stock', 'sous_categorie_id');
            case 'financier':
                return Paiement::query()
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->select('id', 'commande_id', 'montant', 'methode_paiement', 'statut_paiement', 'created_at');
            default:
                return collect([]);
        }
    }
}
