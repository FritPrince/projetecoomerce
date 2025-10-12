<?php
// database/seeders/CategorieSeeder.php
namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\SousCategorie;
use Illuminate\Database\Seeder;

class CategorieSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'nom' => 'Électronique',
                'description' => 'Appareils électroniques et gadgets',
                'sous_categories' => [
                    ['nom' => 'Smartphones', 'description' => 'Téléphones intelligents'],
                    ['nom' => 'Ordinateurs', 'description' => 'PC portables et de bureau'],
                    ['nom' => 'Accessoires', 'description' => 'Accessoires électroniques'],
                ]
            ],
            [
                'nom' => 'Mode',
                'description' => 'Vêtements et accessoires de mode',
                'sous_categories' => [
                    ['nom' => 'Vêtements Hommes', 'description' => 'Vêtements pour hommes'],
                    ['nom' => 'Vêtements Femmes', 'description' => 'Vêtements pour femmes'],
                    ['nom' => 'Chaussures', 'description' => 'Chaussures pour tous'],
                ]
            ],
            [
                'nom' => 'Maison',
                'description' => 'Articles pour la maison',
                'sous_categories' => [
                    ['nom' => 'Décoration', 'description' => 'Articles de décoration'],
                    ['nom' => 'Cuisine', 'description' => 'Ustensiles de cuisine'],
                    ['nom' => 'Jardin', 'description' => 'Articles de jardinage'],
                ]
            ],
            [
                'nom' => 'Sport',
                'description' => 'Équipements sportifs',
                'sous_categories' => [
                    ['nom' => 'Fitness', 'description' => 'Équipement de fitness'],
                    ['nom' => 'Sports collectifs', 'description' => 'Sports d\'équipe'],
                    ['nom' => 'Randonnée', 'description' => 'Équipement de randonnée'],
                ]
            ],
            [
                'nom' => 'Loisirs',
                'description' => 'Articles de loisirs et divertissement',
                'sous_categories' => [
                    ['nom' => 'Livres', 'description' => 'Livres et romans'],
                    ['nom' => 'Jeux vidéo', 'description' => 'Jeux et consoles'],
                    ['nom' => 'Instruments de musique', 'description' => 'Instruments musicaux'],
                ]
            ]
        ];

        foreach ($categories as $categorieData) {
            $categorie = Categorie::create([
                'nom' => $categorieData['nom'],
                'description' => $categorieData['description']
            ]);

            foreach ($categorieData['sous_categories'] as $sousCategorieData) {
                SousCategorie::create([
                    'nom' => $sousCategorieData['nom'],
                    'description' => $sousCategorieData['description'],
                    'categorie_id' => $categorie->id
                ]);
            }
        }
    }
}