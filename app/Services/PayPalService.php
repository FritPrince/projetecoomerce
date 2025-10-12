<?php

namespace App\Services;

use App\Models\Commande;
use App\Models\Paiement;
use App\Models\MethodePaiement;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayPalService
{
    private $clientId;
    private $clientSecret;
    private $mode;
    private $baseUrl;

    public function __construct()
    {
        $this->clientId = config('payment.paypal.client_id');
        $this->clientSecret = config('payment.paypal.client_secret');
        $this->mode = config('payment.paypal.mode');
        $this->baseUrl = $this->mode === 'live' 
            ? 'https://api-m.paypal.com' 
            : 'https://api-m.sandbox.paypal.com';
    }

    /**
     * Obtenir un token d'accès PayPal
     */
    public function getAccessToken()
    {
        try {
            $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
                ->asForm()
                ->post($this->baseUrl . '/v1/oauth2/token', [
                    'grant_type' => 'client_credentials'
                ]);

            if ($response->successful()) {
                return $response->json()['access_token'];
            }

            throw new \Exception('Impossible d\'obtenir le token PayPal');
        } catch (\Exception $e) {
            Log::error('Erreur token PayPal: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Créer une commande PayPal
     */
    public function createOrder(Commande $commande)
    {
        try {
            $accessToken = $this->getAccessToken();

            $orderData = [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => $commande->numero_commande,
                        'amount' => [
                            'currency_code' => config('payment.paypal.currency'),
                            'value' => number_format($commande->total, 2, '.', ''),
                        ],
                        'description' => 'Commande #' . $commande->numero_commande,
                        'custom_id' => $commande->id,
                    ]
                ],
                'application_context' => [
                    'return_url' => route('paypal.success'),
                    'cancel_url' => route('paypal.cancel'),
                    'brand_name' => config('app.name'),
                    'landing_page' => 'BILLING',
                    'user_action' => 'PAY_NOW',
                ]
            ];

            $response = Http::withToken($accessToken)
                ->post($this->baseUrl . '/v2/checkout/orders', $orderData);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Impossible de créer la commande PayPal');
        } catch (\Exception $e) {
            Log::error('Erreur création commande PayPal: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Capturer un paiement PayPal
     */
    public function captureOrder(string $orderId)
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = Http::withToken($accessToken)
                ->post($this->baseUrl . '/v2/checkout/orders/' . $orderId . '/capture');

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Impossible de capturer le paiement PayPal');
        } catch (\Exception $e) {
            Log::error('Erreur capture PayPal: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Enregistrer un paiement PayPal réussi
     */
    public function recordSuccessfulPayment(Commande $commande, array $paypalOrder)
    {
        $methodePaiement = MethodePaiement::where('nom', 'PayPal')->first();
        
        if (!$methodePaiement) {
            $methodePaiement = MethodePaiement::create([
                'nom' => 'PayPal',
                'description' => 'Paiement via PayPal',
                'actif' => true,
            ]);
        }

        $purchaseUnit = $paypalOrder['purchase_units'][0];
        $capture = $purchaseUnit['payments']['captures'][0];

        $paiement = Paiement::create([
            'montant' => (float) $purchaseUnit['amount']['value'],
            'statut' => 'reussi',
            'methode_paiement_id' => $methodePaiement->id,
            'user_id' => $commande->user_id,
            'commande_id' => $commande->id,
            'reference' => $paypalOrder['id'],
            'donnees_paiement' => [
                'order_id' => $paypalOrder['id'],
                'capture_id' => $capture['id'],
                'status' => $paypalOrder['status'],
                'currency' => $purchaseUnit['amount']['currency_code'],
                'amount' => $purchaseUnit['amount']['value'],
            ],
        ]);

        return $paiement;
    }

    /**
     * Rembourser un paiement PayPal
     */
    public function refundPayment(Paiement $paiement, ?float $amount = null)
    {
        try {
            $accessToken = $this->getAccessToken();
            $captureId = $paiement->donnees_paiement['capture_id'] ?? null;

            if (!$captureId) {
                throw new \Exception('ID de capture PayPal non trouvé');
            }

            $refundData = [
                'amount' => [
                    'value' => $amount ? number_format($amount, 2, '.', '') : $paiement->montant,
                    'currency_code' => $paiement->donnees_paiement['currency'] ?? 'EUR',
                ],
                'note_to_payer' => 'Remboursement pour la commande #' . $paiement->commande->numero_commande,
            ];

            $response = Http::withToken($accessToken)
                ->post($this->baseUrl . '/v2/payments/captures/' . $captureId . '/refund', $refundData);

            if ($response->successful()) {
                $refund = $response->json();

                // Mettre à jour le statut du paiement
                $paiement->update([
                    'statut' => 'rembourse',
                    'donnees_paiement' => array_merge($paiement->donnees_paiement ?? [], [
                        'refund_id' => $refund['id'],
                        'refund_amount' => $refund['amount']['value'],
                    ]),
                ]);

                return $refund;
            }

            throw new \Exception('Impossible de rembourser le paiement PayPal');
        } catch (\Exception $e) {
            Log::error('Erreur remboursement PayPal: ' . $e->getMessage());
            throw $e;
        }
    }
}

