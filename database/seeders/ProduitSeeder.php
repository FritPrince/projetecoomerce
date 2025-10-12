<?php
// database/seeders/ProduitSeeder.php
namespace Database\Seeders;

use App\Models\Produit;
use App\Models\SousCategorie;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class ProduitSeeder extends Seeder
{
    public function run(): void
    {
        // Supprimer les produits existants pour éviter les doublons
        // Désactiver les vérifications de clés étrangères\n        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();\n        Produit::truncate();\n        // Réactiver les vérifications de clés étrangères\n        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // Récupérer toutes les sous-catégories pour l'attribution
        $sousCategoriesIds = SousCategorie::pluck('id')->toArray();

        // Récupérer les produits depuis Fake Store API
        $response = Http::get('https://fakestoreapi.com/products');
        $fakeStoreProducts = $response->json();

        foreach ($fakeStoreProducts as $fakeProduct) {
            // Attribuer une sous-catégorie aléatoire si aucune correspondance exacte n'est trouvée
            $randomSousCategorieId = !empty($sousCategoriesIds) ? $sousCategoriesIds[array_rand($sousCategoriesIds)] : null;

            if ($randomSousCategorieId) {
                Produit::create([
                    'nom' => $fakeProduct['title'],
                    'description' => $fakeProduct['description'],
                    'prix' => $fakeProduct['price'],
                    'stock' => rand(10, 100), // Stock aléatoire
                    'image' => $fakeProduct['image'],
                    'note_moyenne' => $fakeProduct['rating']['rate'], // Réactivé
                    'sous_categorie_id' => $randomSousCategorieId,
                ]);
            }
        }
    }
}
