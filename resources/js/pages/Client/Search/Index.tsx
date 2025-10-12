import { Head, Link, router } from '@inertiajs/react';
import ClientLayout from '@/layouts/ClientLayout';
import { Categorie, Produit } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';

interface SearchProps {
    produits: {
        data: Produit[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    categories: Categorie[];
    filters: {
        query: string;
        category: string | null;
        min_price: number | null;
        max_price: number | null;
        sort: string;
        in_stock: boolean;
    };
    stats: {
        total_results: number;
        current_page: number;
        last_page: number;
        per_page: number;
    };
}

export default function SearchIndex({ produits, categories, filters, stats }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState(filters.query);
    const [selectedCategory, setSelectedCategory] = useState(filters.category);
    const [minPrice, setMinPrice] = useState(filters.min_price?.toString() || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price?.toString() || '');
    const [sortBy, setSortBy] = useState(filters.sort);
    const [inStockOnly, setInStockOnly] = useState(filters.in_stock);
    const [showFilters, setShowFilters] = useState(false);

    const onAddToCart = (produitId: number) => {
        router.post('/panier/ajouter', {
            produit_id: produitId,
            quantite: 1
        }, {
            preserveScroll: true,
        });
    };

    const onAddToFavorites = (produitId: number) => {
        router.post('/favoris/ajouter', {
            produit_id: produitId
        }, {
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        const searchParams = new URLSearchParams();
        
        if (searchQuery) searchParams.set('q', searchQuery);
        if (selectedCategory) searchParams.set('category', selectedCategory);
        if (minPrice) searchParams.set('min_price', minPrice);
        if (maxPrice) searchParams.set('max_price', maxPrice);
        if (sortBy !== 'relevance') searchParams.set('sort', sortBy);
        if (inStockOnly) searchParams.set('in_stock', '1');

        router.get(`/rechercher?${searchParams.toString()}`, {}, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('relevance');
        setInStockOnly(false);
        
        router.get('/rechercher', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const hasActiveFilters = useMemo(() => {
        return searchQuery || selectedCategory || minPrice || maxPrice || sortBy !== 'relevance' || inStockOnly;
    }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy, inStockOnly]);

    const sortOptions = [
        { value: 'relevance', label: 'Pertinence' },
        { value: 'price_asc', label: 'Prix croissant' },
        { value: 'price_desc', label: 'Prix décroissant' },
        { value: 'name_asc', label: 'Nom A-Z' },
        { value: 'name_desc', label: 'Nom Z-A' },
        { value: 'newest', label: 'Plus récents' },
    ];

    return (
        <ClientLayout>
            <Head title={`Recherche${filters.query ? ` - ${filters.query}` : ''}`} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête de recherche */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">
                        {filters.query ? `Résultats pour "${filters.query}"` : 'Recherche de produits'}
                    </h1>
                    
                    {/* Barre de recherche */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un produit..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={handleSearch} className="px-8">
                            Rechercher
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden"
                        >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filtres
                        </Button>
                    </div>

                    {/* Statistiques */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{stats.total_results} résultat{stats.total_results > 1 ? 's' : ''}</span>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                <X className="h-4 w-4 mr-1" />
                                Effacer les filtres
                            </Button>
                        )}
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Sidebar des filtres */}
                    <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-lg border p-6 space-y-6">
                            <h3 className="font-semibold flex items-center">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtres
                            </h3>

                            {/* Filtre par catégorie */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Catégorie</label>
                                <Select value={selectedCategory || ''} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Toutes les catégories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Toutes les catégories</SelectItem>
                                        {categories.map((categorie) => (
                                            <SelectItem key={categorie.id} value={categorie.id.toString()}>
                                                {categorie.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filtre par prix */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Prix</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Filtre en stock */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="in_stock"
                                    checked={inStockOnly}
                                    onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                                />
                                <label htmlFor="in_stock" className="text-sm">
                                    En stock uniquement
                                </label>
                            </div>

                            <Button onClick={handleSearch} className="w-full">
                                Appliquer les filtres
                            </Button>
                        </div>
                    </aside>

                    {/* Contenu principal */}
                    <main className="lg:col-span-3">
                        {/* Tri */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Trier par:</span>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Résultats */}
                        {produits.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {produits.data.map((produit) => (
                                        <ProductCard
                                            key={produit.id}
                                            produit={produit}
                                            onAddToCart={onAddToCart}
                                            onAddToFavorites={onAddToFavorites}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {produits.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex gap-2">
                                            {produits.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => {
                                                        if (link.url) {
                                                            router.get(link.url, {}, { preserveState: true });
                                                        }
                                                    }}
                                                    disabled={!link.url}
                                                >
                                                    {link.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
                                <p className="text-muted-foreground mb-4">
                                    Essayez de modifier vos critères de recherche
                                </p>
                                <Button onClick={clearFilters}>
                                    Effacer les filtres
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </ClientLayout>
    );
}

