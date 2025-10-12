import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Categorie {
    id: number;
    nom: string;
    sous_categories: SousCategorie[];
}

interface SousCategorie {
    id: number;
    nom: string;
}

interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    image?: string;
    stock: number;
    note_moyenne: number;
    sous_categorie_id: number;
}

interface AccueilProps {
    categories?: Categorie[];
    produits?: Produit[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Accueil({ categories = [], produits = [], flash }: AccueilProps) {
    const [categorieActive, setCategorieActive] = useState<number | null>(null);
    const [produitsFiltres, setProduitsFiltres] = useState<Produit[]>(produits);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    // Afficher les messages flash
    useEffect(() => {
        if (flash?.success) {
            setMessage({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setMessage({ type: 'error', text: flash.error });
        }
        
        const timer = setTimeout(() => setMessage(null), 5000);
        return () => clearTimeout(timer);
    }, [flash]);

    // Filtrage des produits par catégorie
    useEffect(() => {
        if (categorieActive === null) {
            setProduitsFiltres(produits);
        } else {
            const filtered = produits.filter(produit => {
                if (!categories || categories.length === 0) return false;
                
                const sousCategorie = categories
                    .flatMap(c => c.sous_categories || [])
                    .find(sc => sc.id === produit.sous_categorie_id);
                    
                return sousCategorie && categories
                    .find(c => (c.sous_categories || []).some(sc => sc.id === sousCategorie.id))?.id === categorieActive;
            });
            setProduitsFiltres(filtered);
        }
    }, [categorieActive, produits, categories]);

    // Carrousel automatique
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 3);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 3) % 3);

    const ajouterAuPanier = (produitId: number) => {
        router.post('/panier/ajouter', {
            produit_id: produitId,
            quantite: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Produit ajouté au panier' });
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: errors.produit_id || 'Erreur lors de l\'ajout au panier' });
            }
        });
    };

    const ajouterAuxFavoris = (produitId: number) => {
        router.post('/favoris/ajouter', {
            produit_id: produitId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Produit ajouté aux favoris' });
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: errors.produit_id || 'Erreur lors de l\'ajout aux favoris' });
            }
        });
    };

    // Vérification que les données sont disponibles
    if (!categories || !produits) {
        return (
            <>
                <Head title="Boutique en ligne - Découvrez nos produits" />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des produits...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Boutique en ligne - Découvrez nos produits" />
            
            {/* Message flash */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                    message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {message.text}
                </div>
            )}
            
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-bold text-primary">
                            ShopStyle
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-primary font-medium">
                                Accueil
                            </Link>
                            <Link href="/panier" className="text-gray-700 hover:text-primary font-medium">
                                Mon Panier
                            </Link>
                            <Link href="/favoris" className="text-gray-700 hover:text-primary font-medium">
                                Mes Favoris
                            </Link>
                            <Link href="/profil" className="text-gray-700 hover:text-primary font-medium">
                                Mon Profil
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            <Link href="/rechercher" className="p-2 text-gray-600 hover:text-primary">
                                <Search className="h-5 w-5" />
                            </Link>
                            <Link href="/favoris" className="p-2 text-gray-600 hover:text-primary relative">
                                <Heart className="h-5 w-5" />
                            </Link>
                            <Link href="/panier" className="p-2 text-gray-600 hover:text-primary relative">
                                <ShoppingCart className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="min-h-screen bg-gray-50">
                {/* Carrousel Hero */}
                <section className="relative h-96 overflow-hidden">
                    <div className="absolute inset-0 flex transition-transform duration-500"
                         style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {/* Slide 1 */}
                        <div className="w-full flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center text-white">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-4">Nouvelle Collection</h2>
                                <p className="text-xl mb-6">Découvrez nos derniers produits</p>
                                <button 
                                    onClick={() => setCategorieActive(null)}
                                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
                                >
                                    Voir la collection
                                </button>
                            </div>
                        </div>
                        
                        {/* Slide 2 */}
                        <div className="w-full flex-shrink-0 bg-gradient-to-r from-green-600 to-teal-700 flex items-center justify-center text-white">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-4">Soldes d'Été</h2>
                                <p className="text-xl mb-6">Jusqu'à -50% sur une sélection</p>
                                <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                                    Profiter des soldes
                                </button>
                            </div>
                        </div>
                        
                        {/* Slide 3 */}
                        <div className="w-full flex-shrink-0 bg-gradient-to-r from-orange-600 to-red-700 flex items-center justify-center text-white">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-4">Livraison Gratuite</h2>
                                <p className="text-xl mb-6">À partir de 50€ d'achat</p>
                                <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                                    En savoir plus
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contrôles du carrousel */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Indicateurs */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {[0, 1, 2].map((index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full ${
                                    currentSlide === index ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </section>

                {/* Filtres par catégorie */}
                <section className="py-8 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories</h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setCategorieActive(null)}
                                className={`px-4 py-2 rounded-full border ${
                                    categorieActive === null 
                                    ? 'bg-primary text-white border-primary' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                                }`}
                            >
                                Tous
                            </button>
                            {categories && categories.length > 0 ? (
                                categories.map((categorie) => (
                                    <button
                                        key={categorie.id}
                                        onClick={() => setCategorieActive(categorie.id)}
                                        className={`px-4 py-2 rounded-full border ${
                                            categorieActive === categorie.id 
                                            ? 'bg-primary text-white border-primary' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                                        }`}
                                    >
                                        {categorie.nom}
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-500">Aucune catégorie disponible</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Grille des produits */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {produitsFiltres && produitsFiltres.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {produitsFiltres.map((produit) => (
                                        <div key={produit.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <Link href={`/produits/${produit.id}`}>
                                                <div className="aspect-square overflow-hidden rounded-t-lg">
                                                    {produit.image ? (
                                                        <img 
                                                            src={`/storage/${produit.image}`}
                                                            alt={produit.nom}
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
                                                <Link href={`/produits/${produit.id}`}>
                                                    <h3 className="font-semibold text-gray-900 hover:text-primary mb-2 line-clamp-2">
                                                        {produit.nom}
                                                    </h3>
                                                </Link>
                                                
                                                <div className="flex items-center mb-2">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < Math.floor(produit.note_moyenne || 0) 
                                                                    ? 'fill-current' 
                                                                    : 'fill-none'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500 ml-1">
                                                        ({(produit.note_moyenne || 0).toFixed(1)})
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-2xl font-bold text-primary">
                                                        {produit.prix} €
                                                    </span>
                                                    <span className={`text-sm ${
                                                        (produit.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {(produit.stock || 0) > 0 ? 'En stock' : 'Rupture'}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => ajouterAuPanier(produit.id)}
                                                        disabled={(produit.stock || 0) === 0}
                                                        className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <ShoppingCart className="h-4 w-4 inline mr-1" />
                                                        Panier
                                                    </button>
                                                    <button
                                                        onClick={() => ajouterAuxFavoris(produit.id)}
                                                        className="p-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                                                    >
                                                        <Heart className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Indicateur de filtrage */}
                                {categorieActive !== null && (
                                    <div className="mt-6 text-center">
                                        <p className="text-gray-600">
                                            {produitsFiltres.length} produit(s) trouvé(s) dans cette catégorie
                                        </p>
                                        <button
                                            onClick={() => setCategorieActive(null)}
                                            className="mt-2 text-primary hover:underline"
                                        >
                                            Voir tous les produits
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-white rounded-lg shadow-sm p-12">
                                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {categorieActive !== null ? 'Aucun produit dans cette catégorie' : 'Aucun produit disponible'}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {categorieActive !== null 
                                            ? 'Aucun produit ne correspond à cette catégorie pour le moment.'
                                            : 'Revenez bientôt pour découvrir nos nouveaux produits.'
                                        }
                                    </p>
                                    {categorieActive !== null && (
                                        <button
                                            onClick={() => setCategorieActive(null)}
                                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                                        >
                                            Voir tous les produits
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">ShopStyle</h3>
                            <p className="text-gray-400">
                                Votre boutique en ligne préférée pour des produits de qualité.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Liens rapides</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/" className="hover:text-white">Accueil</Link></li>
                                <li><Link href="/panier" className="hover:text-white">Mon Panier</Link></li>
                                <li><Link href="/favoris" className="hover:text-white">Mes Favoris</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Service client</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                                <li><a href="#" className="hover:text-white">Livraison</a></li>
                                <li><a href="#" className="hover:text-white">Retours</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Newsletter</h4>
                            <p className="text-gray-400 mb-2">Restez informé de nos nouveautés</p>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="Votre email"
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-primary"
                                />
                                <button className="bg-primary px-4 py-2 rounded-r-lg hover:bg-primary/90">
                                    S'abonner
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 ShopStyle. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}