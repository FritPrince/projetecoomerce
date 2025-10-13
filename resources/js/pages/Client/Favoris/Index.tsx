import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star, Package } from 'lucide-react';
import { toast } from 'react-toastify';

interface ProduitFavori {
    id: number;
    nom: string;
    description: string;
    prix: number;
    image_url?: string;
    stock: number;
    note_moyenne?: number;
}

interface Favori {
    id: number;
    produit: ProduitFavori;
}

interface FavorisProps {
    favoris?: Favori[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Favoris({ favoris, flash }: FavorisProps) {
    const favorisList = Array.isArray(favoris) ? favoris : [];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const ajouterAuPanier = (produitId: number) => {
        router.post('/panier/ajouter', {
            produit_id: produitId,
            quantite: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produit ajouté au panier');
            },
            onError: () => {
                toast.error('Erreur lors de l\'ajout au panier');
            }
        });
    };

    const supprimerDesFavoris = (favoriId: number) => {
        router.delete(`/favoris/${favoriId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produit retiré des favoris');
            },
            onError: () => {
                toast.error('Erreur lors de la suppression');
            }
        });
    };

    const getNoteMoyenne = (note: number | undefined): number => {
        return note || 0;
    };

    const formatNote = (note: number | undefined): string => {
        return getNoteMoyenne(note).toFixed(1);
    };

    return (
        <>
            <Head title="Mes Favoris" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header amélioré */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <Link 
                                href="/" 
                                className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour à l'accueil
                            </Link>
                        </div>
                        
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Mes Favoris
                            </h1>
                            <div className="flex items-center justify-center mt-2">
                                <Heart className="h-5 w-5 text-pink-500 mr-2" />
                                <span className="text-sm text-gray-500 font-medium">
                                    {favorisList.length} produit(s) aimé(s)
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-0">
                            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                                💖 Collection personnelle
                            </div>
                        </div>
                    </div>

                    {favorisList.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="h-12 w-12 text-pink-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Aucun favori pour le moment
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                                Commencez à collectionner vos produits préférés pour les retrouver facilement plus tard.
                            </p>
                            <Link 
                                href="/"
                                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                            >
                                Explorer la boutique
                                <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorisList.map((favori) => {
                                const noteMoyenne = getNoteMoyenne(favori.produit.note_moyenne);
                                const noteFormatee = formatNote(favori.produit.note_moyenne);
                                const enStock = (favori.produit.stock || 0) > 0;
                                
                                return (
                                    <div 
                                        key={favori.id} 
                                        className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/20"
                                    >
                                        {/* Badge favori */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <div className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                                <Heart className="h-3 w-3 mr-1 fill-current" />
                                                Favori
                                            </div>
                                        </div>

                                        <Link href={`/produits/${favori.produit.id}`}>
                                            <div className="aspect-square overflow-hidden relative">
                                                {favori.produit.image_url ? (
                                                    <img
                                                        src={favori.produit.image_url}
                                                        alt={favori.produit.nom}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                                        <Package className="h-16 w-16 text-gray-300" />
                                                    </div>
                                                )}
                                                {/* Overlay au survol */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                            </div>
                                        </Link>
                                        
                                        <div className="p-5">
                                            <Link href={`/produits/${favori.produit.id}`}>
                                                <h3 className="font-semibold text-gray-900 hover:text-primary mb-2 line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors duration-200">
                                                    {favori.produit.nom}
                                                </h3>
                                            </Link>
                                            
                                            {/* Évaluation */}
                                            {noteMoyenne > 0 && (
                                                <div className="flex items-center mb-3">
                                                    <div className="flex text-amber-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < Math.floor(noteMoyenne) 
                                                                    ? 'fill-current' 
                                                                    : 'fill-none'
                                                                } ${i < noteMoyenne ? 'text-amber-400' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500 ml-2 font-medium">
                                                        {noteFormatee}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                                                    {favori.produit.prix} €
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    enStock 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {enStock ? '✓ En stock' : 'Rupture'}
                                                </span>
                                            </div>
                                            
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => ajouterAuPanier(favori.produit.id)}
                                                    disabled={!enStock}
                                                    className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white py-3 px-4 rounded-xl hover:from-primary/90 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
                                                >
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    Ajouter
                                                </button>
                                                <button
                                                    onClick={() => supprimerDesFavoris(favori.id)}
                                                    className="p-3 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group/delete"
                                                    title="Retirer des favoris"
                                                >
                                                    <Trash2 className="h-4 w-4 group-hover/delete:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Section d'appel à l'action si des favoris existent */}
                    {favorisList.length > 0 && (
                        <div className="mt-12 text-center">
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Vous avez trouvé vos favoris ?
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Passez à l'action et complétez votre collection
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link 
                                        href="/"
                                        className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors duration-200 font-semibold"
                                    >
                                        Continuer mes achats
                                    </Link>
                                    <Link 
                                        href="/panier"
                                        className="border border-primary text-primary px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-all duration-200 font-semibold"
                                    >
                                        Voir mon panier
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}