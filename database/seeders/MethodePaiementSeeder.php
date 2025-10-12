<?php

namespace Database\Seeders;

use App\Models\MethodePaiement;
use Illuminate\Database\Seeder;

class MethodePaiementSeeder extends Seeder
{
    public function run(): void
    {
        $methodesPaiement = [
            [
                'nom' => 'Stripe',
                'description' => 'Paiement par carte bancaire via Stripe (Visa, Mastercard, American Express)',
                'actif' => true,
                'config' => [
                    'public_key' => config('payment.stripe.public_key'),
                    'currency' => config('payment.stripe.currency'),
                ],
            ],
            [
                'nom' => 'PayPal',
                'description' => 'Paiement sécurisé via PayPal',
                'actif' => true,
                'config' => [
                    'client_id' => config('payment.paypal.client_id'),
                    'mode' => config('payment.paypal.mode'),
                    'currency' => config('payment.paypal.currency'),
                ],
            ],
            [
                'nom' => 'Virement bancaire',
                'description' => 'Paiement par virement bancaire',
                'actif' => false,
                'config' => [
                    'iban' => 'FR76 1234 5678 9012 3456 7890 123',
                    'bic' => 'ABCDEFGH',
                ],
            ],
        ];

        foreach ($methodesPaiement as $methodeData) {
            MethodePaiement::updateOrCreate(
                ['type' => $methodeData['nom']], // Utiliser 'type' pour la correspondance
                [
                    'type' => $methodeData['nom'], // Définir explicitement la colonne 'type'
                    'details' => $methodeData['description'], // Utiliser 'details' au lieu de 'description'
                    // 'actif' => $methodeData['actif'], // Supprimer la colonne 'actif'
                    // 'config' => $methodeData['config'], // Supprimer la colonne 'config'
                ]
            );
        }
    }
}

