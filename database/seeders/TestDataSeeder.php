<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Categorie;
use App\Models\SousCategorie;
use App\Models\Produit;
use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Paiement;
use App\Models\Favori;
use App\Models\Notification;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Créer des utilisateurs de test
        $admin = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'telephone' => '0123456789',
            'adresse' => '123 Rue Admin, 75001 Paris',
        ]);

        $client1 = User::create([
            'name' => 'Client Test 1',
            'email' => 'client1@test.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'telephone' => '0987654321',
            'adresse' => '456 Rue Client, 75002 Paris',
        ]);

        $client2 = User::create([
            'name' => 'Client Test 2',
            'email' => 'client2@test.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'telephone' => '0555666777',
            'adresse' => '789 Rue Client 2, 75003 Paris',
        ]);

        // Créer des catégories
        $categorie1 = Categorie::create([
            'nom' => 'Électronique',
            'description' => 'Appareils électroniques et gadgets',
        ]);

        $categorie2 = Categorie::create([
            'nom' => 'Mode',
            'description' => 'Vêtements et accessoires',
        ]);

        $categorie3 = Categorie::create([
            'nom' => 'Maison',
            'description' => 'Décoration et mobilier',
        ]);

        // Créer des sous-catégories
        $sousCategorie1 = SousCategorie::create([
            'nom' => 'Smartphones',
            'categorie_id' => $categorie1->id,
        ]);

        $sousCategorie2 = SousCategorie::create([
            'nom' => 'Ordinateurs',
            'categorie_id' => $categorie1->id,
        ]);

        $sousCategorie3 = SousCategorie::create([
            'nom' => 'Vêtements Homme',
            'categorie_id' => $categorie2->id,
        ]);

        $sousCategorie4 = SousCategorie::create([
            'nom' => 'Décoration',
            'categorie_id' => $categorie3->id,
        ]);

        // Créer des produits
        $produits = [
            [
                'nom' => 'iPhone 15 Pro',
                'description' => 'Le dernier smartphone d\'Apple avec caméra professionnelle',
                'prix' => 1199.99,
                'stock' => 50,
                'sous_categorie_id' => $sousCategorie1->id,
                'image' => 'https://placehold.co/600x400?text=produit',
            ],
            [
                'nom' => 'MacBook Air M2',
                'description' => 'Ordinateur portable ultra-fin et puissant',
                'prix' => 1299.99,
                'stock' => 25,
                'sous_categorie_id' => $sousCategorie2->id,
                'image' => 'https://via.placeholder.com/300x300?text=MacBook+Air',
            ],
            [
                'nom' => 'T-shirt Premium',
                'description' => 'T-shirt en coton bio de qualité supérieure',
                'prix' => 29.99,
                'stock' => 100,
                'sous_categorie_id' => $sousCategorie3->id,
                'image' => 'https://via.placeholder.com/300x300?text=T-shirt',
            ],
            [
                'nom' => 'Lampadaire Design',
                'description' => 'Lampadaire moderne pour salon',
                'prix' => 199.99,
                'stock' => 15,
                'sous_categorie_id' => $sousCategorie4->id,
                'image' => 'https://via.placeholder.com/300x300?text=Lampadaire',
            ],
            [
                'nom' => 'Samsung Galaxy S24',
                'description' => 'Smartphone Android haut de gamme',
                'prix' => 999.99,
                'stock' => 30,
                'sous_categorie_id' => $sousCategorie1->id,
                'image' => 'https://via.placeholder.com/300x300?text=Galaxy+S24',
            ],
        ];

        foreach ($produits as $produitData) {
            Produit::create($produitData);
        }

        // Créer des commandes
        $commande1 = Commande::create([
            'numero_commande' => 'CMD-' . str_pad(1, 6, '0', STR_PAD_LEFT),
            'date_commande' => now()->subDays(5),
            'statut' => 'livree',
            'total' => 1229.98,
            'user_id' => $client1->id,
        ]);

        $commande2 = Commande::create([
            'numero_commande' => 'CMD-' . str_pad(2, 6, '0', STR_PAD_LEFT),
            'date_commande' => now()->subDays(3),
            'statut' => 'confirmee',
            'total' => 229.98,
            'user_id' => $client2->id,
        ]);

        // Créer des lignes de commande
        LigneCommande::create([
            'commande_id' => $commande1->id,
            'produit_id' => 1, // iPhone 15 Pro
            'quantite' => 1,
            'prix_unitaire' => 1199.99,
            'sous_total' => 1199.99,
        ]);

        LigneCommande::create([
            'commande_id' => $commande1->id,
            'produit_id' => 3, // T-shirt
            'quantite' => 1,
            'prix_unitaire' => 29.99,
            'sous_total' => 29.99,
        ]);

        LigneCommande::create([
            'commande_id' => $commande2->id,
            'produit_id' => 3, // T-shirt
            'quantite' => 2,
            'prix_unitaire' => 29.99,
            'sous_total' => 59.98,
        ]);

        LigneCommande::create([
            'commande_id' => $commande2->id,
            'produit_id' => 4, // Lampadaire
            'quantite' => 1,
            'prix_unitaire' => 199.99,
            'sous_total' => 199.99,
        ]);

        // Créer des paiements
        Paiement::create([
            'reference' => 'PAY-' . str_pad(1, 6, '0', STR_PAD_LEFT),
            'montant' => 1229.98,
            'date_paiement' => now()->subDays(5),
            'statut' => 'paye',
            'user_id' => $client1->id,
        ]);

        Paiement::create([
            'reference' => 'PAY-' . str_pad(2, 6, '0', STR_PAD_LEFT),
            'montant' => 229.98,
            'date_paiement' => now()->subDays(3),
            'statut' => 'en_attente',
            'user_id' => $client2->id,
        ]);

        // Créer des favoris
        Favori::create([
            'user_id' => $client1->id,
            'produit_id' => 1, // iPhone 15 Pro
        ]);

        Favori::create([
            'user_id' => $client1->id,
            'produit_id' => 2, // MacBook Air
        ]);

        Favori::create([
            'user_id' => $client2->id,
            'produit_id' => 5, // Samsung Galaxy S24
        ]);

        // Créer des notifications
        Notification::create([
            'title' => 'Nouvelle commande reçue',
            'message' => 'Commande CMD-000001 reçue de Client Test 1',
            'type' => 'commande',
            'user_id' => $admin->id,
            'read' => false,
        ]);

        Notification::create([
            'title' => 'Paiement confirmé',
            'message' => 'Paiement PAY-000001 confirmé pour 1229.98€',
            'type' => 'paiement',
            'user_id' => $admin->id,
            'read' => true,
        ]);

        Notification::create([
            'title' => 'Commande expédiée',
            'message' => 'Votre commande CMD-000001 a été expédiée',
            'type' => 'commande',
            'user_id' => $client1->id,
            'read' => false,
        ]);

        $this->command->info('Données de test créées avec succès !');
        $this->command->info('Comptes de test :');
        $this->command->info('- Admin: admin@test.com / password');
        $this->command->info('- Client 1: client1@test.com / password');
        $this->command->info('- Client 2: client2@test.com / password');
    }
}
