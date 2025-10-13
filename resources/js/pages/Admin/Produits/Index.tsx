import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Eye, Trash2, Euro } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Produits',
        href: '/produits',
    },
];

interface Categorie {
    id: number;
    nom: string;
}

interface SousCategorie {
    id: number;
    nom: string;
    categorie: Categorie;
}

interface Produit {
    id: number;
    nom: string;
    description?: string;
    prix: number;
    stock: number;
    image?: string;
    sous_categorie_id: number;
    created_at: string;
    updated_at: string;
    sous_categorie: SousCategorie;
}

interface ProduitsIndexProps {
    produits: Produit[];
}

export default function ProduitsIndex({ produits }: ProduitsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Produits" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
                        <p className="text-muted-foreground">
                            Gérez le catalogue de produits de votre boutique
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/produits/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau Produit
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {produits.map((produit) => (
                        <Card key={produit.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                                {produit.image ? (
                                    <img 
                                        src={produit.image_url}
                                        alt={produit.nom}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
                                        <Package className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">{produit.nom}</h3>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Badge variant="secondary">
                                                    {produit.sous_categorie.categorie.nom}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {produit.sous_categorie.nom}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Euro className="h-4 w-4 text-green-600" />
                                            <span className="font-bold text-lg">{produit.prix}</span>
                                        </div>
                                        <Badge variant={produit.stock > 0 ? 'default' : 'destructive'}>
                                            {produit.stock} en stock
                                        </Badge>
                                    </div>

                                    {produit.description && (
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {produit.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            Modifié le {new Date(produit.updated_at).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/produits/${produit.id}`}>
                                                    <Eye className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/produits/${produit.id}/edit`}>
                                                    <Edit className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/produits/${produit.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {produits.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Aucun produit</h3>
                            <p className="text-muted-foreground mb-4">
                                Commencez par créer votre premier produit.
                            </p>
                            <Button asChild>
                                <Link href="/produits/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Créer un produit
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}