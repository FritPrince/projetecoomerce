<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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

        return view('admin.coupons.index', compact('coupons'));
    }

    /**
     * Créer un nouveau coupon (admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons',
            'type' => 'required|in:fixe,pourcentage',
            'valeur' => 'required|numeric|min:0',
            'montant_minimum' => 'required|numeric|min:0',
            'montant_maximum' => 'nullable|numeric|min:0',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'description' => 'nullable|string|max:255',
            'actif' => 'boolean'
        ]);

        Coupon::create($request->all());

        return redirect()->back()->with('success', 'Coupon créé avec succès');
    }

    /**
     * Mettre à jour un coupon (admin)
     */
    public function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:fixe,pourcentage',
            'valeur' => 'required|numeric|min:0',
            'montant_minimum' => 'required|numeric|min:0',
            'montant_maximum' => 'nullable|numeric|min:0',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'description' => 'nullable|string|max:255',
            'actif' => 'boolean'
        ]);

        $coupon->update($request->all());

        return redirect()->back()->with('success', 'Coupon mis à jour avec succès');
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