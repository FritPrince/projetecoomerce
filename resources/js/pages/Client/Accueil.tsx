import { Head, router } from '@inertiajs/react';
import ClientLayout from '@/layouts/ClientLayout';
import { Categorie, Produit } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import Recommendations from '@/components/Recommendations';
import { Button } from '@/components/ui/button';
import FilterSidebar from '@/components/FilterSidebar';
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';

interface AccueilProps {
    categories?: Categorie[];
    produits?: Produit[];
}

export default function Accueil({ categories = [], produits = [] }: AccueilProps) {
    const [activeCategoryIds, setActiveCategoryIds] = useState<number[]>([]);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedSubCategories, setExpandedSubCategories] = useState<number[]>([]);

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

    const handleFilterChange = (filters: { categoryIds: number[] | undefined; minPrice: number; maxPrice: number }) => {
        setActiveCategoryIds(filters.categoryIds || []);
        setMinPrice(filters.minPrice);
        setMaxPrice(filters.maxPrice);
    };

    const openProductModal = (produit: Produit) => {
        setSelectedProduit(produit);
        setIsModalOpen(true);
    };

    const closeProductModal = () => {
        setIsModalOpen(false);
    };

    const toggleSubCategory = (subCategoryId: number) => {
        setExpandedSubCategories(prev => 
            prev.includes(subCategoryId) 
                ? prev.filter(id => id !== subCategoryId) 
                : [...prev, subCategoryId]
        );
    };

    const filteredProducts = useMemo(() => {
        return produits.filter(produit => {
            // Si aucune catégorie n'est sélectionnée, afficher tous les produits (filtrage par prix uniquement)
            if (!activeCategoryIds || activeCategoryIds.length === 0) {
                return produit.prix >= minPrice && produit.prix <= maxPrice;
            }
            
            // Vérifier si la catégorie parente du produit est sélectionnée
            const parentCategorySelected = categories.some(cat => 
                activeCategoryIds.includes(cat.id) && 
                cat.sous_categories.some(subCat => subCat.id === produit.sous_categorie_id)
            );
            
            // Vérifier si la sous-catégorie du produit est sélectionnée
            const subCategorySelected = categories.flatMap(cat => cat.sous_categories).some(subCat => 
                activeCategoryIds.includes(subCat.id) && subCat.id === produit.sous_categorie_id
            );
            
            const matchesCategory = parentCategorySelected || subCategorySelected;
            const matchesPrice = produit.prix >= minPrice && produit.prix <= maxPrice;

            return matchesCategory && matchesPrice;
        });
    }, [produits, activeCategoryIds, minPrice, maxPrice, categories]);

    // Regrouper les produits par sous-catégorie
    const productsBySubCategory = useMemo(() => {
        const result: Record<number, Produit[]> = {};
        
        filteredProducts.forEach(produit => {
            if (!result[produit.sous_categorie_id]) {
                result[produit.sous_categorie_id] = [];
            }
            result[produit.sous_categorie_id].push(produit);
        });
        
        return result;
    }, [filteredProducts]);

    // Obtenir les noms des sous-catégories
    const getSubCategoryName = (subCategoryId: number) => {
        for (const category of categories) {
            for (const subCategory of category.sous_categories) {
                if (subCategory.id === subCategoryId) {
                    return subCategory.nom;
                }
            }
        }
        return 'Sous-catégorie';
    };

    return (
        <ClientLayout>
            <Head title="Boutique en ligne - Découvrez nos produits" />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] w-full bg-cover bg-center bg-no-repeat"
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">Collection Été 2024</h1>
                    <p className="mt-4 max-w-2xl text-lg md:text-xl">Découvrez les dernières tendances et trouvez votre style parfait.</p>
                    <Button size="lg" className="mt-8">
                        Explorer la collection
                    </Button>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Sidebar de filtres */}
                    <aside className="lg:col-span-1">
                        <FilterSidebar categories={categories} onFilterChange={handleFilterChange} />
                    </aside>

                    {/* Grille des produits */}
                    <section className="lg:col-span-3 mt-8 lg:mt-0">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight">Nos Produits</h2>
                        
                        {Object.keys(productsBySubCategory).length > 0 ? (
                            <div className="space-y-12">
                                {/* Afficher toutes les sous-catégories */}
                                {Object.entries(productsBySubCategory).map(([subCategoryId, products]) => {
                                    const isExpanded = expandedSubCategories.includes(Number(subCategoryId));
                                    const displayProducts = isExpanded ? products : products.slice(0, 5);
                                    
                                    return (
                                        <div key={subCategoryId} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-semibold">{getSubCategoryName(Number(subCategoryId))}</h3>
                                                {products.length > 5 && (
                                                    <Button 
                                                        variant="ghost" 
                                                        onClick={() => toggleSubCategory(Number(subCategoryId))}
                                                        className="flex items-center gap-1 text-primary hover:text-primary/80"
                                                    >
                                                        {isExpanded ? 'Voir moins' : 'Voir plus'}
                                                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                                {displayProducts.map((produit) => (
                                                    <ProductCard 
                                                        key={produit.id} 
                                                        produit={produit} 
                                                        onAddToCart={onAddToCart}
                                                        onAddToFavorites={onAddToFavorites}
                                                        onViewDetails={openProductModal}
                                                    />
                                                ))}
                                            </div>
                                            
                                            {products.length > 5 && !isExpanded && (
                                                <div className="flex justify-center">
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => toggleSubCategory(Number(subCategoryId))}
                                                        className="mt-2"
                                                    >
                                                        Voir tous les produits ({products.length})
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                

                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-lg text-muted-foreground">Aucun produit ne correspond à vos critères de recherche.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Section Recommandations */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Recommendations type="popular" limit={8} />
                </div>
            </div>

            {/* Modal de détails du produit */}
            <ProductModal 
                produit={selectedProduit}
                isOpen={isModalOpen}
                onClose={closeProductModal}
                onAddToCart={onAddToCart}
                onAddToFavorites={onAddToFavorites}
            />
        </ClientLayout>
    );
}