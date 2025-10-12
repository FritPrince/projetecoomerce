<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // Créer quelques notifications de test pour les admins
        $admins = User::where('role', 'admin')->get();
        $clients = User::where('role', 'client')->take(3)->get();

        if ($admins->count() > 0 && $clients->count() > 0) {
            $admin = $admins->first();
            $client = $clients->first();

            // Notification de nouvelle commande
            Notification::create([
                'type' => 'nouvelle_commande',
                'title' => 'Nouvelle commande reçue',
                'message' => 'Commande #CMD-20241011-0001 de ' . $client->name,
                'data' => [
                    'commande_id' => 1,
                    'numero_commande' => 'CMD-20241011-0001',
                    'total' => 150.00,
                    'user_name' => $client->name,
                    'user_email' => $client->email,
                ],
                'user_id' => $admin->id,
                'read' => false,
            ]);

            // Notification de stock faible
            Notification::create([
                'type' => 'stock_faible',
                'title' => 'Stock faible détecté',
                'message' => 'Le produit "iPhone 15" a un stock faible (5 unités)',
                'data' => [
                    'produit_id' => 1,
                    'produit_nom' => 'iPhone 15',
                    'stock_actuel' => 5,
                    'prix' => 999.99,
                ],
                'user_id' => $admin->id,
                'read' => false,
            ]);

            // Notification lue
            Notification::create([
                'type' => 'nouvelle_commande',
                'title' => 'Nouvelle commande reçue',
                'message' => 'Commande #CMD-20241010-0001 de ' . $client->name,
                'data' => [
                    'commande_id' => 2,
                    'numero_commande' => 'CMD-20241010-0001',
                    'total' => 75.50,
                    'user_name' => $client->name,
                    'user_email' => $client->email,
                ],
                'user_id' => $admin->id,
                'read' => true,
                'read_at' => now()->subHours(2),
            ]);

            // Notification pour un client
            Notification::create([
                'type' => 'statut_commande_modifie',
                'title' => 'Statut de commande mis à jour',
                'message' => 'Votre commande #CMD-20241009-0001 est maintenant Expédiée',
                'data' => [
                    'commande_id' => 3,
                    'numero_commande' => 'CMD-20241009-0001',
                    'ancien_statut' => 'confirmee',
                    'nouveau_statut' => 'expediee',
                ],
                'user_id' => $client->id,
                'read' => false,
            ]);
        }
    }
}