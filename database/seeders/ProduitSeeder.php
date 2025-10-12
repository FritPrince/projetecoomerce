<?php
// database/seeders/ProduitSeeder.php
namespace Database\Seeders;

use App\Models\Produit;
use App\Models\SousCategorie;
use Illuminate\Database\Seeder;

class ProduitSeeder extends Seeder
{
    public function run(): void
    {
        $produits = [
            // Électronique - Smartphones
            [
                'nom' => 'iPhone 15 Pro',
                'description' => 'Dernier smartphone Apple avec écran Super Retina XDR',
                'prix' => 1299.99,
                'stock' => 50,
                'sous_categorie_id' => 1
            ],
            [
                'nom' => 'Samsung Galaxy S24',
                'description' => 'Smartphone Android avec appareil photo avancé',
                'prix' => 899.99,
                'stock' => 75,
                'sous_categorie_id' => 1
            ],
            [
                'nom' => 'Google Pixel 8',
                'description' => 'Phone intelligent avec intelligence artificielle intégrée',
                'prix' => 799.99,
                'stock' => 40,
                'sous_categorie_id' => 1
            ],

            // Électronique - Ordinateurs
            [
                'nom' => 'MacBook Pro 16"',
                'description' => 'Ordinateur portable professionnel Apple M3',
                'prix' => 2499.99,
                'stock' => 25,
                'sous_categorie_id' => 2
            ],
            [
                'nom' => 'Dell XPS 15',
                'description' => 'PC portable ultra-performance écran 4K',
                'prix' => 1799.99,
                'stock' => 30,
                'sous_categorie_id' => 2
            ],
            [
                'nom' => 'Asus ROG Gaming',
                'description' => 'Ordinateur portable gaming RTX 4070',
                'prix' => 1999.99,
                'stock' => 20,
                'sous_categorie_id' => 2
            ],

            // Mode - Vêtements Hommes
            [
                'nom' => 'Chemise en coton',
                'description' => 'Chemise classique 100% coton égyptien',
                'prix' => 49.99,
                'stock' => 100,
                'sous_categorie_id' => 4
            ],
            [
                'nom' => 'Jean slim fit',
                'description' => 'Jean délavé coupe slim',
                'prix' => 79.99,
                'stock' => 80,
                'sous_categorie_id' => 4
            ],

            // Mode - Vêtements Femmes
            [
                'nom' => 'Robe d\'été',
                'description' => 'Robe légère imprimée florale',
                'prix' => 59.99,
                'stock' => 60,
                'sous_categorie_id' => 5
            ],
            [
                'nom' => 'Pull en laine',
                'description' => 'Pull chaud en laine mérinos',
                'prix' => 89.99,
                'stock' => 45,
                'sous_categorie_id' => 5
            ],

            // Maison - Décoration
            [
                'nom' => 'Vase céramique',
                'description' => 'Vase design en céramique artisanale',
                'prix' => 34.99,
                'stock' => 30,
                'sous_categorie_id' => 7
            ],
            [
                'nom' => 'Cadre photo bois',
                'description' => 'Cadre photo en bois naturel format A4',
                'prix' => 24.99,
                'stock' => 50,
                'sous_categorie_id' => 7
            ],

            // Sport - Fitness
            [
                'nom' => 'Dumbbells 10kg',
                'description' => 'Haltères réglables en caoutchouc',
                'prix' => 39.99,
                'stock' => 40,
                'sous_categorie_id' => 10
            ],
            [
                'nom' => 'Tapis de yoga',
                'description' => 'Tapis antidérapant écologique',
                'prix' => 29.99,
                'stock' => 60,
                'sous_categorie_id' => 10
            ],

            // Loisirs - Livres
            [
                'nom' => 'Roman best-seller',
                'description' => 'Dernier roman à succès',
                'prix' => 19.99,
                'stock' => 120,
                'sous_categorie_id' => 13
            ],
            [
                'nom' => 'Livre de cuisine',
                'description' => 'Recettes gastronomiques illustrées',
                'prix' => 34.99,
                'stock' => 35,
                'sous_categorie_id' => 13
            ]
        ];

        foreach ($produits as $produitData) {
            Produit::create($produitData);
        }
    }
}