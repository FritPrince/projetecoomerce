<?php
// database/seeders/CommandeSeeder.php
namespace Database\Seeders;

use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommandeSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les clients
        $clients = User::where('role', 'client')->get();
        $produits = Produit::all();

        if ($clients->isEmpty() || $produits->isEmpty()) {
            return;
        }

        $statuts = ['en_attente', 'confirmee', 'expediee', 'livree'];

        foreach ($clients as $client) {
            // Créer 2-4 commandes par client
            $nombreCommandes = rand(2, 4);

            for ($i = 0; $i < $nombreCommandes; $i++) {
                $commande = Commande::create([
                    'numero_commande' => 'CMD-' . $client->id . '-' . time() . '-' . $i,
                    'date_commande' => now()->subDays(rand(1, 90)),
                    'statut' => $statuts[array_rand($statuts)],
                    'total' => 0,
                    'user_id' => $client->id
                ]);

                // Ajouter 1-4 produits par commande
                $nombreProduits = rand(1, 4);
                $produitsSelectionnes = $produits->random($nombreProduits);

                $totalCommande = 0;

                foreach ($produitsSelectionnes as $produit) {
                    $quantite = rand(1, 3);
                    $sousTotal = $produit->prix * $quantite;
                    $totalCommande += $sousTotal;

                    LigneCommande::create([
                        'commande_id' => $commande->id,
                        'produit_id' => $produit->id,
                        'quantite' => $quantite,
                        'prix_unitaire' => $produit->prix,
                        'sous_total' => $sousTotal
                    ]);
                }

                // Mettre à jour le total de la commande
                $commande->update(['total' => $totalCommande]);
            }
        }
    }
}