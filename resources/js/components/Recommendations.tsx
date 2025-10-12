import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Heart, ShoppingCart } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Produit } from '@/types';

interface RecommendationsProps {
    type?: 'popular' | 'personalized' | 'trending';
    title?: string;
    limit?: number;
    showTitle?: boolean;
}

interface RecommendationData {
    recommendations: Produit[];
    type: string;
}

export default function Recommendations({ 
    type = 'popular', 
    title, 
    limit = 8,
    showTitle = true 
}: RecommendationsProps) {
    const [recommendations, setRecommendations] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRecommendations();
    }, [type, limit]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/recommendations?type=${type}&limit=${limit}`);
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des recommandations');
            }
            
            const data: RecommendationData = await response.json();
            setRecommendations(data.recommendations || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (title) return title;
        
        switch (type) {
            case 'popular':
                return 'Produits populaires';
            case 'personalized':
                return 'Recommandés pour vous';
            case 'trending':
                return 'Tendances';
            default:
                return 'Recommandations';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'popular':
                return <Star className="h-5 w-5" />;
            case 'personalized':
                return <Heart className="h-5 w-5" />;
            case 'trending':
                return <TrendingUp className="h-5 w-5" />;
            default:
                return <Star className="h-5 w-5" />;
        }
    };

    const addToCart = (produitId: number) => {
        // Logique d'ajout au panier
        console.log('Ajouter au panier:', produitId);
    };

    const addToFavorites = (produitId: number) => {
        // Logique d'ajout aux favoris
        console.log('Ajouter aux favoris:', produitId);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {showTitle && (
                    <div className="flex items-center gap-2">
                        {getIcon()}
                        <h2 className="text-xl font-semibold">{getTitle()}</h2>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchRecommendations} variant="outline">
                    Réessayer
                </Button>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {showTitle && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {getIcon()}
                        <h2 className="text-xl font-semibold">{getTitle()}</h2>
                    </div>
                    <Badge variant="secondary">
                        {recommendations.length} produit(s)
                    </Badge>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.map((produit) => (
                    <Card key={produit.id} className="group hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                                {produit.image ? (
                                    <img
                                        src={`/storage/${produit.image}`}
                                        alt={produit.nom}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ShoppingCart className="h-12 w-12" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="font-medium text-sm line-clamp-2">
                                    {produit.nom}
                                </h3>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-primary">
                                        {Number(produit.prix).toFixed(2)} €
                                    </span>
                                    <Badge 
                                        variant={produit.stock > 0 ? "default" : "destructive"}
                                        className="text-xs"
                                    >
                                        {produit.stock > 0 ? 'En stock' : 'Rupture'}
                                    </Badge>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => addToCart(produit.id)}
                                        disabled={produit.stock === 0}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-1" />
                                        Panier
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addToFavorites(produit.id)}
                                    >
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}