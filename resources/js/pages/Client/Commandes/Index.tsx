import { Head, Link } from '@inertiajs/react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface ArticlePanier {
    id: number;
    produit_id: number;
    quantite: number;
    produit: {
        id: number;
        nom: string;
        prix: number;
        image?: string;
        stock: number;
    };
}

interface CommandesIndexProps {
    panier: ArticlePanier[];
}

export default function CommandesIndex({ panier }: CommandesIndexProps) {
    const sousTotal = panier.reduce((total, article) => total + (article.produit.prix * article.quantite), 0);
    const fraisLivraison = sousTotal > 50 ? 0 : 4.99;
    const total = sousTotal + fraisLivraison;

    const mettreAJourQuantite = (articleId: number, nouvelleQuantite: number) => {
        // Logique de mise à jour de la quantité
        console.log('Mettre à jour quantité:', articleId, nouvelleQuantite);
    };

    const supprimerArticle = (articleId: number) => {
        // Logique de suppression d'article
        console.log('Supprimer article:', articleId);
    };

    const procederAuPaiement = () => {
        // Logique de redirection vers le paiement
        console.log('Procéder au paiement');
    };

    return (
        <>
            <Head title="Mon Panier" />
            
            {/* Header identique */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                {/* Même header que les autres pages */}
            </header>

            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

                    {panier.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Articles du panier */}
                            <div className="lg:col-span-2 space-y-4">
                                {panier.map((article) => (
                                    <div key={article.id} className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center space-x-4">
                                            {article.produit.image && (
                                                <img 
                                                    src={`/storage/${article.produit.image}`}
                                                    alt={article.produit.nom}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {article.produit.nom}
                                                </h3>
                                                <p className="text-lg font-bold text-primary mb-2">
                                                    {article.produit.prix} €
                                                </p>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            onClick={() => mettreAJourQuantite(article.id, article.quantite - 1)}
                                                            disabled={article.quantite <= 1}
                                                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <span className="px-4 py-2">{article.quantite}</span>
                                                        <button
                                                            onClick={() => mettreAJourQuantite(article.id, article.quantite + 1)}
                                                            disabled={article.quantite >= article.produit.stock}
                                                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => supprimerArticle(article.id)}
                                                        className="text-red-600 hover:text-red-800 p-2"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold">
                                                    {(article.produit.prix * article.quantite).toFixed(2)} €
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Récapitulatif */}
                            <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span>Sous-total</span>
                                        <span>{sousTotal.toFixed(2)} €</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Livraison</span>
                                        <span>{fraisLivraison === 0 ? 'Gratuite' : `${fraisLivraison} €`}</span>
                                    </div>
                                    {fraisLivraison > 0 && sousTotal < 50 && (
                                        <p className="text-sm text-green-600">
                                            Plus que {(50 - sousTotal).toFixed(2)} € pour la livraison gratuite !
                                        </p>
                                    )}
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>{total.toFixed(2)} €</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={procederAuPaiement}
                                    className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                                >
                                    Procéder au paiement
                                </button>

                                <div className="mt-4 text-center">
                                    <Link href="/" className="text-primary hover:underline">
                                        Continuer mes achats
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
                            <p className="text-gray-600 mb-6">
                                Découvrez nos produits et ajoutez-les à votre panier.
                            </p>
                            <Link 
                                href="/"
                                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Découvrir les produits
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer identique */}
            <footer className="bg-gray-900 text-white py-12">
                {/* Même footer */}
            </footer>
        </>
    );
}