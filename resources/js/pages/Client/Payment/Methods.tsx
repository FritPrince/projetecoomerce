import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, ArrowLeft, Check } from 'lucide-react';

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
}

export default function PaymentMethods({ commande, stripeKey }: Props) {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const paymentMethods = [
        {
            id: 'stripe',
            name: 'Carte bancaire',
            description: 'Visa, Mastercard, American Express',
            icon: CreditCard,
            color: 'bg-blue-50 border-blue-200',
            iconColor: 'text-blue-600',
        },
        {
            id: 'paypal',
            name: 'PayPal',
            description: 'Paiement sécurisé via PayPal',
            icon: Smartphone,
            color: 'bg-yellow-50 border-yellow-200',
            iconColor: 'text-yellow-600',
        },
    ];

    const handleMethodSelect = (methodId: string) => {
        setSelectedMethod(methodId);
        setError(null);
    };

    const handlePayment = async () => {
        if (!selectedMethod) {
            setError('Veuillez sélectionner une méthode de paiement');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            if (selectedMethod === 'stripe') {
                // Rediriger vers la page de paiement Stripe
                window.location.href = `/payment/stripe/${commande.id}`;
            } else if (selectedMethod === 'paypal') {
                // Créer une commande PayPal
                const response = await fetch(`/payment/paypal/create-order/${commande.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                const data = await response.json();

                if (data.success) {
                    // Rediriger vers PayPal
                    window.location.href = data.approval_url;
                } else {
                    setError(data.message || 'Erreur lors de la création de la commande PayPal');
                }
            }
        } catch (err) {
            setError('Une erreur est survenue lors du traitement du paiement');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Head title="Méthodes de paiement" />
            
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link 
                        href="/panier" 
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour au panier
                    </Link>
                    
                    <h1 className="text-3xl font-bold text-gray-900">Méthodes de paiement</h1>
                    <p className="text-gray-600 mt-1">
                        Choisissez votre méthode de paiement pour finaliser votre commande
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Récapitulatif de la commande */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Récapitulatif</CardTitle>
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
                                                    <span>{parseFloat(produit.pivot.sous_total).toFixed(2)} €</span>
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

                    {/* Méthodes de paiement */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Choisir une méthode de paiement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {paymentMethods.map((method) => {
                                        const Icon = method.icon;
                                        const isSelected = selectedMethod === method.id;
                                        
                                        return (
                                            <div
                                                key={method.id}
                                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                    isSelected 
                                                        ? `${method.color} ring-2 ring-blue-500` 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handleMethodSelect(method.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-lg ${method.color}`}>
                                                            <Icon className={`h-6 w-6 ${method.iconColor}`} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">
                                                                {method.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {method.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {isSelected && (
                                                        <div className="flex items-center text-blue-600">
                                                            <Check className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <Button
                                        onClick={handlePayment}
                                        disabled={!selectedMethod || isProcessing}
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
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500">
                                        Votre paiement est sécurisé et crypté
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
