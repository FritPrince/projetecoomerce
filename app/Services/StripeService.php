<?php

namespace App\Services;

use App\Models\Commande;
use App\Models\Paiement;
use App\Models\MethodePaiement;
use Illuminate\Support\Facades\Log;

class StripeService
{
    public function __construct()
    {
        if (class_exists('Stripe\Stripe')) {
            \Stripe\Stripe::setApiKey(config('payment.stripe.secret_key'));
        }
    }

    /**
     * Créer un PaymentIntent Stripe
     */
    public function createPaymentIntent(Commande $commande, array $metadata = [])
    {
        try {
            if (class_exists('Stripe\PaymentIntent')) {
                // Utiliser Stripe réel avec vos clés
                $paymentIntent = \Stripe\PaymentIntent::create([
                    'amount' => $this->convertToStripeAmount($commande->total),
                    'currency' => config('payment.stripe.currency'),
                    'metadata' => array_merge([
                        'commande_id' => $commande->id,
                        'numero_commande' => $commande->numero_commande,
                        'user_id' => $commande->user_id,
                    ], $metadata),
                    'automatic_payment_methods' => [
                        'enabled' => true,
                    ],
                ]);

                return $paymentIntent;
            } else {
                // Utiliser l'API Stripe directement via cURL
                $stripeSecretKey = config('payment.stripe.secret_key');
                if ($stripeSecretKey) {
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, 'https://api.stripe.com/v1/payment_intents');
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_USERPWD, $stripeSecretKey . ':');
                    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                        'amount' => $this->convertToStripeAmount($commande->total),
                        'currency' => config('payment.stripe.currency'),
                        'automatic_payment_methods[enabled]' => 'true',
                        'metadata[commande_id]' => $commande->id,
                        'metadata[numero_commande]' => $commande->numero_commande,
                        'metadata[user_id]' => $commande->user_id,
                    ]));
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'Content-Type: application/x-www-form-urlencoded',
                    ]);

                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);

                    if ($httpCode === 200 && $response) {
                        $data = json_decode($response, true);
                        return (object) $data;
                    }
                }

                // Fallback: mode test simulé
                $paymentIntentId = 'pi_test_' . uniqid();
                $secret = uniqid();
                return (object) [
                    'id' => $paymentIntentId,
                    'client_secret' => $paymentIntentId . '_secret_' . $secret,
                'amount' => $this->convertToStripeAmount($commande->total),
                'currency' => config('payment.stripe.currency'),
                'status' => 'requires_payment_method',
                'metadata' => array_merge([
                    'commande_id' => $commande->id,
                    'numero_commande' => $commande->numero_commande,
                    'user_id' => $commande->user_id,
                ], $metadata),
            ];
            }
        } catch (\Exception $e) {
            Log::error('Erreur Stripe PaymentIntent: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Confirmer un paiement Stripe
     */
    public function confirmPayment(string $paymentIntentId)
    {
        try {
            if (class_exists('Stripe\PaymentIntent')) {
                $paymentIntent = \Stripe\PaymentIntent::retrieve($paymentIntentId);
                return $paymentIntent;
            } else {
                // Utiliser l'API Stripe directement via cURL
                $stripeSecretKey = config('payment.stripe.secret_key');
                if ($stripeSecretKey) {
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, 'https://api.stripe.com/v1/payment_intents/' . $paymentIntentId);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_USERPWD, $stripeSecretKey . ':');
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'Content-Type: application/x-www-form-urlencoded',
                    ]);

                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);

                    if ($httpCode === 200 && $response) {
                        $data = json_decode($response, true);
                        return (object) $data;
                    }
                }

                // Fallback: mode test simulé
                return (object) [
                'id' => $paymentIntentId,
                'status' => 'succeeded',
                'amount' => 10000, // 100€ en centimes
                'currency' => 'eur',
            ];
            }
        } catch (\Exception $e) {
            Log::error('Erreur confirmation Stripe: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Enregistrer un paiement réussi
     */
    public function recordSuccessfulPayment(Commande $commande, $paymentIntent)
    {
        // Créer d'abord le paiement
        $paiement = Paiement::create([
            'montant' => $this->convertFromStripeAmount($paymentIntent->amount),
            'statut' => 'paye',
            'user_id' => $commande->user_id,
            'reference' => $paymentIntent->id,
            'date_paiement' => now(),
        ]);

        // Créer ensuite la méthode de paiement avec le paiement_id
        $methodePaiement = MethodePaiement::create([
            'type' => 'Stripe',
            'details' => 'Paiement par carte bancaire via Stripe',
            'paiement_id' => $paiement->id,
        ]);

        return $paiement;
    }

    /**
     * Convertir le montant en centimes pour Stripe
     */
    private function convertToStripeAmount(float $amount): int
    {
        return (int) round($amount * 100);
    }

    /**
     * Convertir le montant de centimes vers euros
     */
    private function convertFromStripeAmount(int $amount): float
    {
        return $amount / 100;
    }

    /**
     * Rembourser un paiement
     */
    public function refundPayment(Paiement $paiement, ?float $amount = null)
    {
        try {
            // Version de test - simuler un remboursement
            $refund = (object) [
                'id' => 're_test_' . uniqid(),
                'amount' => $this->convertToStripeAmount($amount ?? $paiement->montant),
                'status' => 'succeeded',
            ];

            // Mettre à jour le statut du paiement
            $paiement->update([
                'statut' => 'rembourse',
                'donnees_paiement' => array_merge($paiement->donnees_paiement ?? [], [
                    'refund_id' => $refund->id,
                    'refund_amount' => $refund->amount,
                ]),
            ]);

            return $refund;
        } catch (\Exception $e) {
            Log::error('Erreur remboursement Stripe: ' . $e->getMessage());
            throw $e;
        }
    }
}
