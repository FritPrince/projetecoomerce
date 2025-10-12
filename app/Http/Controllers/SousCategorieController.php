<?php
// app/Http/Controllers/SousCategorieController.php
namespace App\Http\Controllers;

use App\Models\SousCategorie;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SousCategorieController extends Controller
{
    public function index()
    {
        $sousCategories = SousCategorie::with('categorie')->get();
        return Inertia::render('Admin/SousCategories/Index', [
            'sousCategories' => $sousCategories
        ]);
    }

    public function create()
    {
        $categories = Categorie::all();
        return Inertia::render('Admin/SousCategories/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categorie_id' => 'required|exists:categories,id',
        ]);

        SousCategorie::create($request->all());

        return redirect()->route('sous-categories.index')
                         ->with('success', 'Sous-catégorie créée avec succès.');
    }

    public function show(SousCategorie $sousCategorie)
    {
        $sousCategorie->load(['categorie', 'produits']);
        return Inertia::render('Admin/SousCategories/Show', [
            'sousCategorie' => $sousCategorie
        ]);
    }

    public function edit(SousCategorie $sousCategorie)
    {
        $categories = Categorie::all();
        return Inertia::render('Admin/SousCategories/Edit', [
            'sousCategorie' => $sousCategorie,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, SousCategorie $sousCategorie)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categorie_id' => 'required|exists:categories,id',
        ]);

        $sousCategorie->update($request->all());

        return redirect()->route('sous-categories.index')
                         ->with('success', 'Sous-catégorie modifiée avec succès.');
    }

    public function destroy(SousCategorie $sousCategorie)
    {
        $sousCategorie->delete();

        return redirect()->route('sous-categories.index')
                         ->with('success', 'Sous-catégorie supprimée avec succès.');
    }
}