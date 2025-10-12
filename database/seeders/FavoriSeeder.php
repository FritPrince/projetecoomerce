<?php
// database/seeders/FavoriSeeder.php
namespace Database\Seeders;

use App\Models\Favori;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\Seeder;

class FavoriSeeder extends Seeder
{
    public function run(): void
    {
        $clients = User::where('role', 'client')->get();
        $produits = Produit::all();

        if ($clients->isEmpty() || $produits->isEmpty()) {
            return;
        }

        foreach ($clients as $client) {
            // Chaque client a 3-8 produits favoris
            $nombreFavoris = rand(3, 8);
            $produitsFavoris = $produits->random($nombreFavoris);

            foreach ($produitsFavoris as $produit) {
                Favori::create([
                    'user_id' => $client->id,
                    'produit_id' => $produit->id
                ]);
            }
        }
    }
}