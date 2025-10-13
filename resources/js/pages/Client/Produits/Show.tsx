import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Star, Heart, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { route } from '@/lib/route';

interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    image?: string;
    stock: number;
    note_moyenne: number;
    nombre_avis: number;
    caracteristiques: string;
}

interface Avis {
    id: number;
    user_name: string;
    note: number;
    commentaire: string;
    created_at: string;
}

interface ProduitShowProps {
    produit: Produit;
    avis: Avis[];
}

export default function ProduitShow({ produit, avis }: ProduitShowProps) {
    const [quantite, setQuantite] = useState(1);
    const [imageActive, setImageActive] = useState(0);

    const { post, processing } = useForm({
        produit_id: produit.id,
        quantite: quantite,
    });

    const ajouterAuPanier = () => {
        post(route('panier.ajouter'), {
            onSuccess: () => {
                // No need for toast here, it's handled by app.tsx
            },
            onError: (errors) => {
                console.error('Erreur lors de l\'ajout au panier:', errors);
            },
        });
    };

    const ajouterAuxFavoris = () => {
        // Logique d'ajout aux favoris
        console.log('Ajouter aux favoris:', produit.id);
    };

    const images = produit.image_url ? [produit.image_url] : [];

    return (
        <>
            <Head title={produit.nom} />
            
            {/* Header identique à la page d'accueil */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            ShopStyle
                        </Link>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-primary font-medium">
                                Accueil
                            </Link>
                            <Link href="/commandes" className="text-gray-700 hover:text-primary font-medium">
                                Mes Commandes
                            </Link>
                            <Link href="/favoris" className="text-gray-700 hover:text-primary font-medium">
                                Mes Favoris
                            </Link>
                            <Link href={route('profil.index')} className="text-gray-700 hover:text-primary font-medium">
                                Mon Profil
                            </Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <Link href="/favoris" className="p-2 text-gray-600 hover:text-primary">
                                <Heart className="h-5 w-5" />
                            </Link>
                            <Link href="/commandes" className="p-2 text-gray-600 hover:text-primary">
                                <ShoppingCart className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Navigation */}
                    <div className="mb-6">
                        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour à l'accueil
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                            {/* Galerie d'images */}
                            <div>
                                <div className="aspect-square overflow-hidden rounded-lg mb-4">
                                    {images[imageActive] ? (
                                        <img 
                                            src={`/storage/${images[imageActive]}`}
                                            alt={produit.nom}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">Image non disponible</span>
                                        </div>
                                    )}
                                </div>
                                
                                {images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setImageActive(index)}
                                                className={`aspect-square overflow-hidden rounded border-2 ${
                                                    imageActive === index 
                                                    ? 'border-primary' 
                                                    : 'border-gray-200'
                                                }`}
                                            >
                                                <img 
                                                    src={`/storage/${image}`}
                                                    alt={`${produit.nom} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Informations du produit */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{produit.nom}</h1>
                                
                                <div className="flex items-center mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i}
                                                className={`h-5 w-5 ${
                                                    i < Math.floor(produit.note_moyenne) 
                                                    ? 'fill-current' 
                                                    : 'fill-none'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-600 ml-2">
                                        {produit.note_moyenne.toFixed(1)} ({produit.nombre_avis} avis)
                                    </span>
                                </div>

                                <div className="text-4xl font-bold text-primary mb-6">
                                    {produit.prix} €
                                </div>

                                <div className="mb-6">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        produit.stock > 0 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                        <Check className="h-4 w-4 mr-1" />
                                        {produit.stock > 0 ? 'En stock' : 'Rupture de stock'}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {produit.description}
                                </p>

                                {produit.caracteristiques && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-2">Caractéristiques :</h3>
                                        <p className="text-gray-600">{produit.caracteristiques}</p>
                                    </div>
                                )}

                                {/* Sélection de quantité et actions */}
                                <div className="space-y-4">
                                    {produit.stock > 0 && (
                                        <div className="flex items-center space-x-4">
                                            <label className="font-medium">Quantité :</label>
                                            <select 
                                                value={quantite}
                                                onChange={(e) => setQuantite(Number(e.target.value))}
                                                className="border border-gray-300 rounded-lg px-3 py-2"
                                            >
                                                {[...Array(Math.min(produit.stock, 10))].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="text-sm text-gray-500">
                                                {produit.stock} disponibles
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={ajouterAuPanier}
                                            disabled={produit.stock === 0 || processing}
                                            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            {processing ? 'Ajout en cours...' : 'Ajouter au panier'}
                                        </button>
                                        <button
                                            onClick={ajouterAuxFavoris}
                                            className="p-3 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                                        >
                                            <Heart className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section des avis */}
                    <div className="bg-white rounded-lg shadow-sm mt-8 p-8">
                        <h2 className="text-2xl font-bold mb-6">Avis clients ({produit.nombre_avis})</h2>
                        
                        {avis.length > 0 ? (
                            <div className="space-y-6">
                                {avis.map((avis) => (
                                    <div key={avis.id} className="border-b border-gray-200 pb-6 last:border-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">{avis.user_name}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(avis.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex text-yellow-400 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < avis.note ? 'fill-current' : 'fill-none'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-700">{avis.commentaire}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                Aucun avis pour ce produit pour le moment.
                            </p>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer identique */}
            <footer className="bg-gray-900 text-white py-12">
                {/* Même footer que la page d'accueil */}
            </footer>
        </>
    );
}