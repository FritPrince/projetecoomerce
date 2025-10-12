<?php

namespace App\Http\Controllers;

use App\Models\MethodePaiement;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MethodePaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $methodesPaiement = MethodePaiement::with('paiement.user')->get();
        return Inertia::render('Admin/MethodesPaiement/Index', [
            'methodesPaiement' => $methodesPaiement
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $paiements = Paiement::with('user')->get();
        return Inertia::render('Admin/MethodesPaiement/Create', [
            'paiements' => $paiements
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:carte,virement,paypal,especes',
            'details' => 'nullable|string|max:500',
            'paiement_id' => 'required|exists:paiements,id',
        ]);

        MethodePaiement::create($request->all());

        return redirect()->route('methodes-paiement.index')
                         ->with('success', 'Méthode de paiement créée avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MethodePaiement $methodesPaiement)
    {
        $methodesPaiement->load('paiement.user');
        return Inertia::render('Admin/MethodesPaiement/Show', [
            'methodePaiement' => $methodesPaiement
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MethodePaiement $methodesPaiement)
    {
        $methodesPaiement->load('paiement');
        $paiements = Paiement::with('user')->get();
        
        return Inertia::render('Admin/MethodesPaiement/Edit', [
            'methodePaiement' => $methodesPaiement,
            'paiements' => $paiements
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MethodePaiement $methodesPaiement)
    {
        $request->validate([
            'type' => 'required|string|in:carte,virement,paypal,especes',
            'details' => 'nullable|string|max:500',
            'paiement_id' => 'required|exists:paiements,id',
        ]);

        $methodesPaiement->update($request->all());

        return redirect()->route('methodes-paiement.index')
                         ->with('success', 'Méthode de paiement modifiée avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MethodePaiement $methodesPaiement)
    {
        $methodesPaiement->delete();

        return redirect()->route('methodes-paiement.index')
                         ->with('success', 'Méthode de paiement supprimée avec succès.');
    }
}