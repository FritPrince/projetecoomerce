<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Paiement;
use App\Services\StripeService;
use App\Services\PayPalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $stripeService;
    protected $paypalService;

    public function __construct(StripeService $stripeService, PayPalService $paypalService)
    {
        $this->stripeService = $stripeService;
        $this->paypalService = $paypalService;
    }

    /**
     * Afficher la page de sélection de méthode de paiement
     */
    public function showPaymentMethods(Commande $commande)
    {
        // Vérifier que la commande appartient à l'utilisateur connecté
        if ($commande->user_id !== Auth::id()) {
            abort(403);
        }

        // Vérifier que la commande est en attente de paiement
        if ($commande->statut !== 'en_attente') {
            return redirect()->route('panier.index')
                ->with('error', 'Cette commande ne peut pas être payée.');
        }

        $commande->load(['produits' => function($query) {
            $query->withPivot('quantite', 'prix_unitaire', 'sous_total');
        }]);

        return Inertia::render('Client/Payment/Methods', [
            'commande' => $commande,
            'stripeKey' => config('payment.stripe.public_key'),
        ]);
    }

    /**
     * Traiter un paiement Stripe
     */
    public function processStripePayment(Request $request, Commande $commande)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        try {
            // Confirmer le paiement Stripe
            $paymentIntent = $this->stripeService->confirmPayment($request->payment_intent_id);

            if ($paymentIntent->status === 'succeeded') {
                // Enregistrer le paiement
                $paiement = $this->stripeService->recordSuccessfulPayment($commande, $paymentIntent);

                // Mettre à jour le statut de la commande
                $commande->update(['statut' => 'confirmee']);

                return response()->json([
                    'success' => true,
                    'message' => 'Paiement réussi !',
                    'paiement_id' => $paiement->id,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Le paiement n\'a pas réussi.',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement du paiement: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Créer une commande PayPal
     */
    public function createPayPalOrder(Commande $commande)
    {
        try {
            $order = $this->paypalService->createOrder($commande);

            // Stocker l'ID de la commande en session pour le retrouver au retour
            session(['paypal_commande_id' => $commande->id]);

            return response()->json([
                'success' => true,
                'order_id' => $order['id'],
                'approval_url' => collect($order['links'])->firstWhere('rel', 'approve')['href'],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la commande PayPal: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Capturer un paiement PayPal
     */
    public function capturePayPalOrder(Request $request, Commande $commande)
    {
        $request->validate([
            'order_id' => 'required|string',
        ]);

        try {
            $order = $this->paypalService->captureOrder($request->order_id);

            if ($order['status'] === 'COMPLETED') {
                // Enregistrer le paiement
                $paiement = $this->paypalService->recordSuccessfulPayment($commande, $order);

                // Mettre à jour le statut de la commande
                $commande->update(['statut' => 'confirmee']);

                return response()->json([
                    'success' => true,
                    'message' => 'Paiement PayPal réussi !',
                    'paiement_id' => $paiement->id,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Le paiement PayPal n\'a pas réussi.',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement du paiement PayPal: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Page de succès PayPal
     */
    public function paypalSuccess(Request $request)
    {
        $orderId = $request->get('token');
        $commandeId = session('paypal_commande_id');
        
        if (!$orderId || !$commandeId) {
            return redirect()->route('panier.index')
                ->with('error', 'Erreur lors du retour de PayPal, session invalide.');
        }

        return Inertia::render('Client/Payment/Success', [
            'order_id' => $orderId,
            'commande_id' => $commandeId,
        ]);
    }

    /**
     * Page d'annulation PayPal
     */
    public function paypalCancel()
    {
        return redirect()->route('panier.index')
            ->with('error', 'Paiement PayPal annulé.');
    }

    /**
     * Afficher la page de paiement Stripe
     */
    // Dans votre contrôleur
public function showStripePayment(Commande $commande)
{
    try {
        $stripeService = new StripeService();
        $paymentIntent = $stripeService->createPaymentIntent($commande);

        return Inertia::render('Client/Payment/Stripe', [
            'commande' => $commande,
            'stripeKey' => config('payment.stripe.public_key'),
            'clientSecret' => $paymentIntent->client_secret, // ← Utilisez directement client_secret
            'paymentIntentId' => $paymentIntent->id,
        ]);
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Erreur lors de l\'initialisation du paiement: ' . $e->getMessage());
    }
}

    /**
     * Créer un PaymentIntent Stripe
     */
    public function createStripePaymentIntent(Commande $commande)
    {
        try {
            $paymentIntent = $this->stripeService->createPaymentIntent($commande);

            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du PaymentIntent: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Rembourser un paiement (admin)
     */
    public function refundPayment(Request $request, Paiement $paiement)
    {
        $request->validate([
            'amount' => 'nullable|numeric|min:0.01|max:' . $paiement->montant,
        ]);

        try {
            $amount = $request->amount ?? $paiement->montant;

            if ($paiement->methodePaiement->nom === 'Stripe') {
                $this->stripeService->refundPayment($paiement, $amount);
            } elseif ($paiement->methodePaiement->nom === 'PayPal') {
                $this->paypalService->refundPayment($paiement, $amount);
            }

            return response()->json([
                'success' => true,
                'message' => 'Remboursement effectué avec succès.',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du remboursement: ' . $e->getMessage(),
            ], 500);
        }
    }
}