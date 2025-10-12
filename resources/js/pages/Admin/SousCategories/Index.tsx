import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, Plus, Edit, Eye, Trash2, FolderOpen } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Sous-catégories',
        href: '/sous-categories',
    },
];

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
}

interface SousCategoriesIndexProps {
    sousCategories: SousCategorie[];
}

export default function SousCategoriesIndex({ sousCategories }: SousCategoriesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Sous-catégories" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestion des Sous-catégories</h1>
                        <p className="text-muted-foreground">
                            Gérez les sous-catégories de votre catalogue
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/sous-categories/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle Sous-catégorie
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6">
                    {sousCategories.map((sousCategorie) => (
                        <Card key={sousCategorie.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                            <FolderOpen className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="text-lg font-semibold">{sousCategorie.nom}</h3>
                                                <Badge variant="outline">
                                                    {sousCategorie.categorie.nom}
                                                </Badge>
                                            </div>
                                            {sousCategorie.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {sousCategorie.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Modifié le {new Date(sousCategorie.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/sous-categories/${sousCategorie.id}`}>
                                                <Eye className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/sous-categories/${sousCategorie.id}/edit`}>
                                                <Edit className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link
                                                href={`/sous-categories/${sousCategorie.id}`}
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
                    
                    {sousCategories.length === 0 && (
                        <div className="text-center py-12">
                            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Aucune sous-catégorie</h3>
                            <p className="text-muted-foreground mb-4">
                                Commencez par créer votre première sous-catégorie.
                            </p>
                            <Button asChild>
                                <Link href="/sous-categories/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Créer une sous-catégorie
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}