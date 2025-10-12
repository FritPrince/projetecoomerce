<?php
// app/Http/Controllers/PaiementController.php
namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\User;
use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaiementController extends Controller
{
    public function index()
    {
        $paiements = Paiement::with(['user', 'methodesPaiement', 'produits'])->get();
        return Inertia::render('Admin/Paiements/Index', [
            'paiements' => $paiements
        ]);
    }

    public function create()
    {
        $clients = User::where('role', 'client')->get();
        $produits = Produit::all();
        return Inertia::render('Admin/Paiements/Create', [
            'clients' => $clients,
            'produits' => $produits
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'reference' => 'required|string|unique:paiements',
            'montant' => 'required|numeric|min:0',
            'date_paiement' => 'required|date',
            'statut' => 'required|in:en_attente,paye,echec,rembourse',
            'user_id' => 'required|exists:users,id',
            'methode_paiement' => 'required|array',
            'methode_paiement.type' => 'required|string',
            'methode_paiement.details' => 'nullable|string',
            'produits' => 'required|array|min:1',
            'produits.*.id' => 'required|exists:produits,id',
            'produits.*.montant_alloue' => 'required|numeric|min:0',
        ]);

        $paiement = Paiement::create($request->only([
            'reference', 'montant', 'date_paiement', 'statut', 'user_id'
        ]));

        // Créer la méthode de paiement
        $paiement->methodesPaiement()->create([
            'type' => $request->methode_paiement['type'],
            'details' => $request->methode_paiement['details'],
        ]);

        // Attacher les produits avec les montants alloués
        $produitsData = [];
        foreach ($request->produits as $produit) {
            $produitsData[$produit['id']] = ['montant_alloue' => $produit['montant_alloue']];
        }
        $paiement->produits()->attach($produitsData);

        return redirect()->route('paiements.index')
                         ->with('success', 'Paiement créé avec succès.');
    }

    public function show(Paiement $paiement)
    {
        $paiement->load(['user', 'methodesPaiement', 'produits']);
        return Inertia::render('Admin/Paiements/Show', [
            'paiement' => $paiement
        ]);
    }

    public function edit(Paiement $paiement)
    {
        $paiement->load(['methodesPaiement', 'produits']);
        $clients = User::where('role', 'client')->get();
        $produits = Produit::all();
        
        return Inertia::render('Admin/Paiements/Edit', [
            'paiement' => $paiement,
            'clients' => $clients,
            'produits' => $produits
        ]);
    }

    public function update(Request $request, Paiement $paiement)
    {
        $request->validate([
            'reference' => 'required|string|unique:paiements,reference,' . $paiement->id,
            'montant' => 'required|numeric|min:0',
            'date_paiement' => 'required|date',
            'statut' => 'required|in:en_attente,paye,echec,rembourse',
            'user_id' => 'required|exists:users,id',
        ]);

        $paiement->update($request->only([
            'reference', 'montant', 'date_paiement', 'statut', 'user_id'
        ]));

        return redirect()->route('paiements.index')
                         ->with('success', 'Paiement modifié avec succès.');
    }

    public function destroy(Paiement $paiement)
    {
        $paiement->methodesPaiement()->delete();
        $paiement->produits()->detach();
        $paiement->delete();

        return redirect()->route('paiements.index')
                         ->with('success', 'Paiement supprimé avec succès.');
    }
}