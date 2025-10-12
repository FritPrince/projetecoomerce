import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, ArrowLeft, Edit, Folder, Package, Calendar } from 'lucide-react';

interface Produit {
    id: number;
    nom: string;
    prix: number;
}

interface Categorie {
    id: number;
    nom: string;
}

interface SousCategorie {
    id: number;
    nom: string;
    description?: string;
    categorie_id: number;
    created_at: string;
    updated_at: string;
    categorie: Categorie;
    produits: Produit[];
}

interface SousCategoriesShowProps {
    sousCategorie: SousCategorie;
}

export default function SousCategoriesShow({ sousCategorie }: SousCategoriesShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Sous-catégories',
            href: '/sous-categories',
        },
        {
            title: sousCategorie.nom,
            href: `/sous-categories/${sousCategorie.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sous-catégorie ${sousCategorie.nom}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/sous-categories">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Détails de la Sous-catégorie</h1>
                            <p className="text-muted-foreground">
                                Informations complètes de {sousCategorie.nom}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/sous-categories/${sousCategorie.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Informations de la Sous-catégorie</CardTitle>
                            <CardDescription>
                                Détails de la sous-catégorie
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                    <FolderOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{sousCategorie.nom}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="secondary">
                                            Sous-catégorie de
                                        </Badge>
                                        <Badge>
                                            {sousCategorie.categorie.nom}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {sousCategorie.description && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Description</p>
                                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                        {sousCategorie.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Techniques</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Date de création</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(sousCategorie.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Dernière modification</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(sousCategorie.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Produits associés</CardTitle>
                        <CardDescription>
                            Liste des produits appartenant à cette sous-catégorie
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sousCategorie.produits.length > 0 ? (
                            <div className="grid gap-3">
                                {sousCategorie.produits.map((produit) => (
                                    <div key={produit.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{produit.nom}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {produit.prix} €
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/produits/${produit.id}`}>
                                                Voir
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">Aucun produit</h3>
                                <p className="text-muted-foreground">
                                    Cette sous-catégorie ne contient pas encore de produits.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}