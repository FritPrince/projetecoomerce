import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';

interface Commande {
    id: number;
    numero_commande: string;
    total: number;
    statut: string;
    date_commande: string;
    produits: Array<{
        id: number;
        nom: string;
        prix: number;
        pivot: {
            quantite: number;
            sous_total: number;
        };
    }>;
}

interface Props {
    commande: Commande;
    stripeKey: string;
    clientSecret: string;
    paymentIntentId: string;
}

// Stripe sera chargé dynamiquement

export default function StripePayment({ commande, stripeKey, clientSecret, paymentIntentId }: Props) {
    const [stripe, setStripe] = useState<any>(null);
    const [elements, setElements] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!clientSecret) {
            setError('Client Secret manquant. Veuillez réessayer.');
            return;
        }

        const loadStripe = async () => {
            try {
                const { loadStripe } = await import('@stripe/stripe-js');
                const stripeInstance = await loadStripe(stripeKey);
                
                if (!stripeInstance) {
                    throw new Error('Impossible de charger Stripe');
                }

                setStripe(stripeInstance);

                const elementsInstance = stripeInstance.elements({
                    clientSecret: clientSecret,
                    appearance: {
                        theme: 'stripe',
                    },
                });

                setElements(elementsInstance);

                const paymentElementInstance = elementsInstance.create('payment', {
                    layout: {
                        type: 'tabs',
                        defaultCollapsed: false,
                    }
                });

                paymentElementInstance.mount('#payment-element');

            } catch (err: any) {
                console.error('Erreur lors du chargement de Stripe:', err);
                if (err.message && err.message.includes('clientSecret should be a client secret')) {
                    setError('Format de clé de paiement invalide. Veuillez réessayer.');
                } else {
                    setError('Erreur lors du chargement du système de paiement');
                }
            }
        };

        loadStripe();
    }, [stripeKey, clientSecret]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe n\'est pas encore chargé');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const { error: confirmError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment/success/${commande.id}`,
                },
                redirect: 'if_required',
            });

            if (confirmError) {
                setError(confirmError.message || 'Une erreur est survenue lors du paiement');
                setIsProcessing(false);
                return;
            }

            const response = await fetch(`/payment/stripe/process/${commande.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    payment_intent_id: paymentIntentId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Merci, votre commande a bien été reçue ! Vous recevrez bientôt une confirmation.");
                setTimeout(() => router.visit('/'), 2000); // Petit délai pour voir le toast
            } else {
                setError(data.message || 'Erreur lors de l\'enregistrement du paiement');
            }

        } catch (err) {
            console.error('Erreur lors du traitement:', err);
            setError('Une erreur inattendue est survenue');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" theme="colored" />
            <Head title="Paiement par carte" />
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-6">
                    <Link 
                        href="/panier" 
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour au panier
                    </Link>
                    
                    <h1 className="text-3xl font-bold text-gray-900">Paiement par carte</h1>
                    <p className="text-gray-600 mt-1">
                        Finalisez votre commande #{commande.numero_commande}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Informations de paiement
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div id="payment-element" className="min-h-[200px]"></div>

                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={!stripe || isProcessing}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Traitement en cours...
                                            </>
                                        ) : (
                                            `Payer ${Number(commande.total).toFixed(2)} €`
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">Mode Test</h3>
                                <p className="text-sm text-blue-700 mb-2">
                                    Utilisez les cartes de test suivantes :
                                </p>
                                <ul className="text-xs text-blue-600 space-y-1">
                                    <li>💳 Carte réussie : <code>4242 4242 4242 4242</code></li>
                                    <li>📅 Date : n'importe quelle date future</li>
                                    <li>🔒 CVC : n'importe quel code à 3 chiffres</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Récapitulatif</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Commande</p>
                                <p className="font-medium">#{commande.numero_commande}</p>
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-600">Produits</p>
                                <div className="space-y-2 mt-2">
                                    {commande.produits && commande.produits.length > 0 ? (
                                        commande.produits.map((produit) => (
                                            <div key={produit.id} className="flex justify-between text-sm">
                                                <span>{produit.nom} x{produit.pivot.quantite}</span>
                                                <span>{Number(produit.pivot.sous_total).toFixed(2)} €</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Chargement des produits...</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {Number(commande.total).toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Votre paiement est sécurisé et crypté par Stripe
                    </p>
                </div>
            </div>
        </>
    );
}
