import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowLeft, Edit, Euro, Calendar, Folder, Users } from 'lucide-react';

interface Commande {
    id: number;
    reference: string;
    total: number;
}

interface Favori {
    id: number;
    user_id: number;
}

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
    commandes: Commande[];
    favoris: Favori[];
}

interface ProduitsShowProps {
    produit: Produit;
}

export default function ProduitsShow({ produit }: ProduitsShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Produits',
            href: '/produits',
        },
        {
            title: produit.nom,
            href: `/produits/${produit.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Produit ${produit.nom}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/produits">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Détails du Produit</h1>
                            <p className="text-muted-foreground">
                                Informations complètes de {produit.nom}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/produits/${produit.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations du Produit</CardTitle>
                                <CardDescription>
                                    Détails du produit
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start space-x-6">
                                    {produit.image ? (
                                        <img 
                                            src={`/storage/${produit.image}`}
                                            alt={produit.nom}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 bg-muted flex items-center justify-center rounded-lg">
                                            <Package className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-2">{produit.nom}</h2>
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Euro className="h-5 w-5 text-green-600" />
                                                <span className="text-2xl font-bold">{produit.prix}</span>
                                            </div>
                                            <Badge variant={produit.stock > 0 ? 'default' : 'destructive'}>
                                                {produit.stock} en stock
                                            </Badge>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary">
                                                {produit.sous_categorie.categorie.nom}
                                            </Badge>
                                            <Badge variant="outline">
                                                {produit.sous_categorie.nom}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {produit.description && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Description</h3>
                                        <p className="text-muted-foreground p-3 bg-muted rounded-lg">
                                            {produit.description}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistiques</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>Commandes</span>
                                    </div>
                                    <Badge>{produit.commandes.length}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>Favoris</span>
                                    </div>
                                    <Badge>{produit.favoris.length}</Badge>
                                </div>
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
                                            {new Date(produit.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Dernière modification</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(produit.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Commandes associées</CardTitle>
                        <CardDescription>
                            Liste des commandes contenant ce produit
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {produit.commandes.length > 0 ? (
                            <div className="space-y-3">
                                {produit.commandes.map((commande) => (
                                    <div key={commande.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Folder className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Commande #{commande.reference}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Total: {commande.total} €
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/commandes/${commande.id}`}>
                                                Voir
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">Aucune commande</h3>
                                <p className="text-muted-foreground">
                                    Ce produit n'a pas encore été commandé.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}