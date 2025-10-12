import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

interface ProduitPanier {
    id: number;
    nom: string;
    prix: number;
    image?: string;
    stock: number;
    pivot: {
        quantite: number;
        prix_unitaire: number;
        sous_total: number;
    };
}

interface PanierProps {
    panier?: {
        id: number;
        total: number;
        produits: ProduitPanier[];
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Panier({ panier, flash }: PanierProps) {
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setMessage({ type: 'error', text: flash.error });
        }
        
        const timer = setTimeout(() => setMessage(null), 5000);
        return () => clearTimeout(timer);
    }, [flash]);

    const mettreAJourQuantite = (produitId: number, nouvelleQuantite: number) => {
        if (nouvelleQuantite === 0) {
            supprimerDuPanier(produitId);
            return;
        }

        router.put(`/panier/${panier?.id}/mettre-a-jour`, {
            produit_id: produitId,
            quantite: nouvelleQuantite
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Quantité mise à jour' });
            }
        });
    };

    const supprimerDuPanier = (produitId: number) => {
        if (!panier) return;

        router.delete(`/panier/${panier.id}/produit/${produitId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Produit retiré du panier' });
            }
        });
    };

    const procederPaiement = () => {
        if (!panier) return;

        router.post(`/panier/${panier.id}/paiement`);
    };

    if (!panier || panier.produits.length === 0) {
        return (
            <>
                <Head title="Mon Panier - ShopStyle" />
                
                {/* Message flash */}
                {message && (
                    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                        message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                        {message.text}
                    </div>
                )}

                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="flex items-center mb-8">
                            <Link href="/" className="flex items-center text-gray-600 hover:text-primary">
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Retour à l'accueil
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
                            <p className="text-gray-500 mb-6">
                                Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats.
                            </p>
                            <Link 
                                href="/"
                                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-semibold"
                            >
                                Découvrir les produits
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Mon Panier - ShopStyle" />
            
            {/* Message flash */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                    message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center text-gray-600 hover:text-primary">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Retour à l'accueil
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Mon Panier</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Liste des produits */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm">
                                {panier.produits.map((produit) => (
                                    <div key={produit.id} className="p-6 border-b border-gray-200 last:border-b-0">
                                        <div className="flex items-center space-x-4">
                                            {/* Image */}
                                            <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                                {produit.image ? (
                                                    <img 
                                                        src={`/storage/${produit.image}`}
                                                        alt={produit.nom}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-gray-400 text-xs">Image</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Détails */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {produit.nom}
                                                </h3>
                                                <p className="text-2xl font-bold text-primary mb-2">
                                                    {produit.pivot.prix_unitaire} €
                                                </p>
                                                
                                                {/* Contrôles quantité */}
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => mettreAJourQuantite(produit.id, produit.pivot.quantite - 1)}
                                                            disabled={produit.pivot.quantite <= 1}
                                                            className="p-1 rounded-full border border-gray-300 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-semibold">
                                                            {produit.pivot.quantite}
                                                        </span>
                                                        <button
                                                            onClick={() => mettreAJourQuantite(produit.id, produit.pivot.quantite + 1)}
                                                            disabled={produit.pivot.quantite >= produit.stock}
                                                            className="p-1 rounded-full border border-gray-300 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    
                                                    <span className="text-sm text-gray-500">
                                                        Stock: {produit.stock}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Sous-total et suppression */}
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900 mb-2">
                                                    {produit.pivot.sous_total} €
                                                </p>
                                                <button
                                                    onClick={() => supprimerDuPanier(produit.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Résumé */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sous-total</span>
                                        <span className="font-semibold">{panier.total} €</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Livraison</span>
                                        <span className="font-semibold">Gratuite</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">{panier.total} €</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={procederPaiement}
                                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 font-semibold transition-colors"
                                >
                                    Procéder au paiement
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Livraison offerte à partir de 50€ d'achat
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}