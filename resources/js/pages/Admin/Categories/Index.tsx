import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, Plus, Edit, Eye, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Catégories',
        href: '/categories',
    },
];

interface SousCategorie {
    id: number;
    nom: string;
}

interface Categorie {
    id: number;
    nom: string;
    description?: string;
    created_at: string;
    updated_at: string;
    sous_categories_count: number;
    sous_categories: SousCategorie[];
}

interface CategoriesIndexProps {
    categories: Categorie[];
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Catégories" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
                        <p className="text-muted-foreground">
                            Gérez les catégories principales de votre catalogue
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/categories/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle Catégorie
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((categorie) => (
                        <Card key={categorie.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                            <Folder className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{categorie.nom}</CardTitle>
                                            <Badge variant="secondary" className="mt-1">
                                                {categorie.sous_categories_count} sous-catégorie(s)
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {categorie.description && (
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {categorie.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        Modifié le {new Date(categorie.updated_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/categories/${categorie.id}`}>
                                                <Eye className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/categories/${categorie.id}/edit`}>
                                                <Edit className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link
                                                href={`/categories/${categorie.id}`}
                                                method="delete"
                                                as="button"
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {categories.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Aucune catégorie</h3>
                            <p className="text-muted-foreground mb-4">
                                Commencez par créer votre première catégorie.
                            </p>
                            <Button asChild>
                                <Link href="/categories/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Créer une catégorie
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}