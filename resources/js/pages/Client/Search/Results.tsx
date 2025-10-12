import { Head, Link } from '@inertiajs/react';
import ClientLayout from '@/layouts/ClientLayout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Produit } from '@/types';

interface SearchResultsProps {
    query: string;
    produits: Produit[];
    total: number;
}

export default function SearchResults({ query, produits, total }: SearchResultsProps) {
    return (
        <ClientLayout>
            <Head title={`Résultats pour "${query}"`} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Search className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                Résultats pour "{query}"
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            {total} produit(s) trouvé(s)
                        </p>
                    </div>

                    {/* Filtres et tri */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtres
                            </Button>
                            <Button variant="outline" size="sm">
                                <SortAsc className="h-4 w-4 mr-2" />
                                Trier par
                            </Button>
                        </div>
                        <div className="text-sm text-gray-500">
                            Affichage de {produits.length} sur {total} résultats
                        </div>
                    </div>

                    {/* Résultats */}
                    {produits.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Aucun résultat trouvé
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Essayez avec d'autres mots-clés ou explorez nos catégories.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button asChild>
                                        <Link href="/">
                                            Retour à l'accueil
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/categories">
                                            Voir les catégories
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {produits.map((produit) => (
                                <ProductCard
                                    key={produit.id}
                                    produit={produit}
                                    onAddToCart={() => {
                                        // Logique d'ajout au panier
                                    }}
                                    onAddToFavorites={() => {
                                        // Logique d'ajout aux favoris
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Suggestions de recherche */}
                    {produits.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Suggestions de recherche
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {['iPhone', 'Samsung', 'MacBook', 'AirPods', 'Ordinateur'].map((suggestion) => (
                                    <Button
                                        key={suggestion}
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link href={`/search?q=${encodeURIComponent(suggestion)}`}>
                                            {suggestion}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}

