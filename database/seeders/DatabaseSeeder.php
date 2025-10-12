<?php
// database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un admin
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Créer quelques clients
        User::factory(10)->create([
            'role' => 'client'
        ]);

        // Exécuter les autres seeders
        $this->call([
            MethodePaiementSeeder::class,
            CategorieSeeder::class,
            ProduitSeeder::class,
            CommandeSeeder::class,
            FavoriSeeder::class,
            PaiementSeeder::class,
        ]);
    }
}