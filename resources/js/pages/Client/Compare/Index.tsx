import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientLayout from '@/layouts/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, ShoppingCart, Heart, Star, Package } from 'lucide-react';
import { Produit } from '@/types';

interface CompareProps {
    produits: Produit[];
    productIds: number[];
    message?: string;
}

export default function Compare({ produits, productIds, message }: CompareProps) {
    const addToCart = (produitId: number) => {
        // Logique d'ajout au panier
        console.log('Ajouter au panier:', produitId);
    };

    const addToFavorites = (produitId: number) => {
        // Logique d'ajout aux favoris
        console.log('Ajouter aux favoris:', produitId);
    };

    const removeFromCompare = (produitId: number) => {
        // Logique de suppression de la comparaison
        console.log('Retirer de la comparaison:', produitId);
    };

    if (produits.length === 0) {
        return (
            <ClientLayout>
                <Head title="Comparaison de produits" />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <Link href="/" className="flex items-center text-gray-600 hover:text-primary mb-4">
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Retour à l'accueil
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">Comparaison de produits</h1>
                        </div>

                        <Card>
                            <CardContent className="text-center py-12">
                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Aucun produit à comparer
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {message || 'Ajoutez des produits à votre liste de comparaison pour les comparer.'}
                                </p>
                                <Button asChild>
                                    <Link href="/">
                                        Découvrir nos produits
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout>
            <Head title="Comparaison de produits" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/" className="flex items-center text-gray-600 hover:text-primary mb-4">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Retour à l'accueil
                        </Link>
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Comparaison de produits
                            </h1>
                            <Badge variant="secondary">
                                {produits.length} produit(s)
                            </Badge>
                        </div>
                    </div>

                    {/* Tableau de comparaison */}
                    <div className="overflow-x-auto">
                        <div className="min-w-full bg-white rounded-lg shadow-sm border">
                            {/* En-têtes des produits */}
                            <div className="grid grid-cols-5 gap-4 p-6 border-b">
                                <div className="font-semibold text-gray-900">Caractéristiques</div>
                                {produits.map((produit) => (
                                    <div key={produit.id} className="text-center">
                                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                                            {produit.image_url ? (
                                                    src={produit.image_url}
                                                    alt={produit.nom}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Package className="h-12 w-12" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-sm mb-2 line-clamp-2">
                                            {produit.nom}
                                        </h3>
                                        <div className="flex justify-center mb-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeFromCompare(produit.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Prix */}
                            <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50">
                                <div className="font-medium text-gray-900">Prix</div>
                                {produits.map((produit) => (
                                    <div key={produit.id} className="text-center">
                                        <span className="text-lg font-bold text-primary">
                                            {Number(produit.prix).toFixed(2)} €
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Stock */}
                            <div className="grid grid-cols-5 gap-4 p-4 border-b">
                                <div className="font-medium text-gray-900">Disponibilité</div>
                                {produits.map((produit) => (
                                    <div key={produit.id} className="text-center">
                                        <Badge 
                                            variant={produit.stock > 0 ? "default" : "destructive"}
                                        >
                                            {produit.stock > 0 ? 'En stock' : 'Rupture'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>

                            {/* Catégorie */}
                            <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50">
                                <div className="font-medium text-gray-900">Catégorie</div>
                                {produits.map((produit) => (
                                    <div key={produit.id} className="text-center">
                                        <span className="text-sm text-gray-600">
                                            {produit.sous_categorie?.categorie?.nom || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Sous-catégorie */}
                            <div className="grid grid-cols-5 gap-4 p-4 border-b">
                                <div className="font-medium text-gray-900">Sous-catégorie</div>
                                {produits.map((produit) => (
                                    <div key={produit.id} className="text-center">
                                        <span className="text-sm text-gray-600">
                                            {produit.sous_categorie?.nom || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50">
                                <div className="font-medium text-gray-900">Description</div>
                                {produits.map((produit) => (
                                    <div key={produit.id} className="text-center">
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {produit.description || 'Aucune description'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-5 gap-4 p-6">
                                <div className="font-medium text-gray-900">Actions</div>
                                {produits.map((produit) => (
                                    <div key={produit.id} className="text-center space-y-2">
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={() => addToCart(produit.id)}
                                            disabled={produit.stock === 0}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-1" />
                                            Panier
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => addToFavorites(produit.id)}
                                        >
                                            <Heart className="h-4 w-4 mr-1" />
                                            Favoris
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions globales */}
                    <div className="mt-8 flex justify-center gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/">
                                Continuer mes achats
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={() => console.log('Vider la comparaison')}>
                            Vider la comparaison
                        </Button>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}