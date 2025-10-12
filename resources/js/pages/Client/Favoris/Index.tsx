import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from 'lucide-react';
import { toast } from 'react-toastify';

interface ProduitFavori {
    id: number;
    nom: string;
    description: string;
    prix: number;
    image?: string;
    stock: number;
    note_moyenne?: number; // Rendre optionnel
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
    // S'assurer que favorisList est toujours un tableau
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

    // Fonction pour obtenir la note moyenne en sécurité
    const getNoteMoyenne = (note: number | undefined): number => {
        return note || 0; // Retourne 0 si undefined
    };

    // Fonction pour formater la note
    const formatNote = (note: number | undefined): string => {
        return getNoteMoyenne(note).toFixed(1);
    };

    return (
        <>
            <Head title="Mes Favoris" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center text-gray-600 hover:text-primary">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Retour à l'accueil
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Mes Favoris</h1>
                        <div className="text-sm text-gray-500">
                            {favorisList.length} produit(s)
                        </div>
                    </div>

                    {favorisList.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucun favori</h2>
                            <p className="text-gray-500 mb-6">
                                Ajoutez des produits à vos favoris pour les retrouver facilement.
                            </p>
                            <Link 
                                href="/"
                                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-semibold"
                            >
                                Découvrir les produits
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.isArray(favorisList) && favorisList.map((favori) => {
                                const noteMoyenne = getNoteMoyenne(favori.produit.note_moyenne);
                                const noteFormatee = formatNote(favori.produit.note_moyenne);
                                
                                return (
                                    <div key={favori.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <Link href={`/produits/${favori.produit.id}`}>
                                            <div className="aspect-square overflow-hidden rounded-t-lg">
                                                {favori.produit.image ? (
                                                    <img 
                                                        src={`/storage/${favori.produit.image}`}
                                                        alt={favori.produit.nom}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400">Image non disponible</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        
                                        <div className="p-4">
                                            <Link href={`/produits/${favori.produit.id}`}>
                                                <h3 className="font-semibold text-gray-900 hover:text-primary mb-2 line-clamp-2">
                                                    {favori.produit.nom}
                                                </h3>
                                            </Link>
                                            
                                            {/* Évaluation - Afficher seulement si une note existe */}
                                            {noteMoyenne > 0 && (
                                                <div className="flex items-center mb-2">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < Math.floor(noteMoyenne) 
                                                                    ? 'fill-current' 
                                                                    : 'fill-none'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500 ml-1">
                                                        ({noteFormatee})
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-2xl font-bold text-primary">
                                                    {favori.produit.prix} €
                                                </span>
                                                <span className={`text-sm ${
                                                    (favori.produit.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {(favori.produit.stock || 0) > 0 ? 'En stock' : 'Rupture'}
                                                </span>
                                            </div>
                                            
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => ajouterAuPanier(favori.produit.id)}
                                                    disabled={(favori.produit.stock || 0) === 0}
                                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <ShoppingCart className="h-4 w-4 inline mr-1" />
                                                    Panier
                                                </button>
                                                <button
                                                    onClick={() => supprimerDesFavoris(favori.id)}
                                                    className="p-2 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}