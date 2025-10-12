import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, ArrowLeft, Edit, FolderOpen, Calendar } from 'lucide-react';

interface SousCategorie {
    id: number;
    nom: string;
    description?: string;
    created_at: string;
}

interface Categorie {
    id: number;
    nom: string;
    description?: string;
    created_at: string;
    updated_at: string;
    sous_categories: SousCategorie[];
}

interface CategoriesShowProps {
    categorie: Categorie;
}

export default function CategoriesShow({ categorie }: CategoriesShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Catégories',
            href: '/categories',
        },
        {
            title: categorie.nom,
            href: `/categories/${categorie.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Catégorie ${categorie.nom}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/categories">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Détails de la Catégorie</h1>
                            <p className="text-muted-foreground">
                                Informations complètes de {categorie.nom}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/categories/${categorie.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Informations de la Catégorie</CardTitle>
                            <CardDescription>
                                Détails de la catégorie principale
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                                    <Folder className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{categorie.nom}</h3>
                                    <Badge variant="secondary">
                                        {categorie.sous_categories.length} sous-catégorie(s)
                                    </Badge>
                                </div>
                            </div>

                            {categorie.description && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Description</p>
                                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                        {categorie.description}
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
                                        {new Date(categorie.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Dernière modification</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(categorie.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sous-catégories</CardTitle>
                        <CardDescription>
                            Liste des sous-catégories associées à cette catégorie
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categorie.sous_categories.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2">
                                {categorie.sous_categories.map((sousCategorie) => (
                                    <div key={sousCategorie.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{sousCategorie.nom}</p>
                                            {sousCategorie.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {sousCategorie.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">Aucune sous-catégorie</h3>
                                <p className="text-muted-foreground">
                                    Cette catégorie ne contient pas encore de sous-catégories.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}