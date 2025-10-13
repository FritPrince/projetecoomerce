<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia; // Ajout de l'import pour Inertia

class CouponController extends Controller
{
    /**
     * Valider un coupon
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50',
            'montant' => 'required|numeric|min:0'
        ]);

        $code = strtoupper(trim($request->code));
        $montant = $request->montant;

        $coupon = Coupon::where('code', $code)
            ->where('actif', true)
            ->where('date_debut', '<=', now())
            ->where('date_fin', '>=', now())
            ->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Code coupon invalide ou expiré'
            ], 400);
        }

        // Vérifier le montant minimum
        if ($montant < $coupon->montant_minimum) {
            return response()->json([
                'valid' => false,
                'message' => "Montant minimum requis: {$coupon->montant_minimum}€"
            ], 400);
        }

        // Calculer la réduction
        $reduction = $this->calculateDiscount($coupon, $montant);

        return response()->json([
            'valid' => true,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $coupon->type,
                'valeur' => $coupon->valeur,
                'montant_minimum' => $coupon->montant_minimum,
                'date_fin' => $coupon->date_fin
            ],
            'reduction' => $reduction,
            'message' => 'Coupon appliqué avec succès'
        ]);
    }

    /**
     * Obtenir les coupons actifs
     */
    public function getActiveCoupons()
    {
        $coupons = Coupon::where('actif', true)
            ->where('date_debut', '<=', now())
            ->where('date_fin', '>=', now())
            ->orderBy('date_fin')
            ->get();

        return response()->json([
            'coupons' => $coupons->map(function ($coupon) {
                return [
                    'id' => $coupon->id,
                    'code' => $coupon->code,
                    'type' => $coupon->type,
                    'valeur' => $coupon->valeur,
                    'montant_minimum' => $coupon->montant_minimum,
                    'date_fin' => $coupon->date_fin,
                    'description' => $coupon->description
                ];
            })
        ]);
    }

    public function create()
{
    return Inertia::render('Admin/Coupons/Create');
}
    /**
     * Calculer la réduction
     */
    private function calculateDiscount(Coupon $coupon, float $montant): float
    {
        if ($coupon->type === 'pourcentage') {
            $reduction = ($montant * $coupon->valeur) / 100;
            // Limiter la réduction au montant maximum si défini
            if ($coupon->montant_maximum && $reduction > $coupon->montant_maximum) {
                $reduction = $coupon->montant_maximum;
            }
        } else {
            $reduction = $coupon->valeur;
        }

        // Ne pas dépasser le montant total
        return min($reduction, $montant);
    }

    /**
     * Afficher la page des coupons (admin)
     */
    public function index()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
        ]);
    }

    /**
     * Afficher le formulaire de modification d'un coupon.
     */
    public function edit(Coupon $coupon)
    {
        return Inertia::render('Admin/Coupons/Edit', [
            'coupon' => $coupon
        ]);
    }

    /**
     * Créer un nouveau coupon (admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:coupons',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        Coupon::create($request->all());

        return redirect()->route('coupons.index')->with('success', 'Coupon créé avec succès');
    }

    /**
     * Mettre à jour un coupon (admin)
     */
    public function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $coupon->update($request->all());

        return redirect()->route('coupons.index')->with('success', 'Coupon mis à jour avec succès');
    }

    /**
     * Supprimer un coupon (admin)
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->back()->with('success', 'Coupon supprimé avec succès');
    }
}