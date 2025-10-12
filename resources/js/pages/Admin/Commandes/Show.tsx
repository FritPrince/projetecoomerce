import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Edit, User, Calendar, Package, Euro } from 'lucide-react';

interface LigneCommande {
    id: number;
    quantite: number;
    prix_unitaire: number;
    sous_total: number;
    produit?: {
        id: number;
        nom: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    telephone?: string;
    adresse?: string;
}

interface Commande {
    id: number;
    numero_commande: string;
    date_commande: string;
    statut: string;
    total: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: User;
    ligne_commandes: LigneCommande[];
}

interface CommandesShowProps {
    commande: Commande;
}

const getStatusBadge = (statut: string) => {
    const statusConfig = {
        en_attente: { variant: 'secondary' as const, label: 'En attente' },
        confirmee: { variant: 'default' as const, label: 'Confirmée' },
        expediee: { variant: 'default' as const, label: 'Expédiée' },
        livree: { variant: 'default' as const, label: 'Livrée' },
        annulee: { variant: 'destructive' as const, label: 'Annulée' },
    };
    
    const config = statusConfig[statut as keyof typeof statusConfig] || { variant: 'secondary', label: statut };
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function CommandesShow({ commande }: CommandesShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Commandes',
            href: '/admin/commandes',
        },
        {
            title: `Commande #${commande.numero_commande}`,
            href: `/admin/commandes/${commande.id}`,
        },
    ];

    // Vérification que les données nécessaires sont présentes
    if (!commande || !commande.ligne_commandes) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Commande non trouvée" />
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Commande non trouvée</h3>
                        <p className="text-muted-foreground mb-4">
                            La commande que vous recherchez n'existe pas ou n'est pas accessible.
                        </p>
                        <Button asChild>
                            <Link href="/admin/commandes">
                                Retour aux commandes
                            </Link>
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Commande #${commande.numero_commande}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/commandes">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Détails de la Commande</h1>
                            <p className="text-muted-foreground">
                                Commande #{commande.numero_commande}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/commandes/${commande.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de la Commande</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                                        <ShoppingCart className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Commande #{commande.numero_commande}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            {getStatusBadge(commande.statut)}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Date de commande</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(commande.date_commande).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Date de création</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(commande.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Produits commandés</CardTitle>
                                <CardDescription>
                                    Détail des articles de la commande
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {commande.ligne_commandes && commande.ligne_commandes.length > 0 ? (
                                        <>
                                            {commande.ligne_commandes.map((ligne) => (
                                                <div key={ligne.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <Package className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium">
                                                                {ligne.produit?.nom || 'Produit non trouvé'}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {ligne.prix_unitaire} € x {ligne.quantite}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">{ligne.sous_total} €</p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className="flex items-center justify-between border-t pt-4">
                                                <span className="text-lg font-semibold">Total</span>
                                                <div className="flex items-center space-x-2">
                                                    <Euro className="h-5 w-5 text-green-600" />
                                                    <span className="text-2xl font-bold">{commande.total} €</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold">Aucun produit</h3>
                                            <p className="text-muted-foreground">
                                                Cette commande ne contient aucun produit.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations du Client</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {commande.user ? (
                                    <>
                                        <div className="flex items-center space-x-3">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{commande.user.name}</p>
                                                <p className="text-sm text-muted-foreground">{commande.user.email}</p>
                                            </div>
                                        </div>
                                        {commande.user.telephone && (
                                            <div>
                                                <p className="text-sm font-medium">Téléphone</p>
                                                <p className="text-sm text-muted-foreground">{commande.user.telephone}</p>
                                            </div>
                                        )}
                                        {commande.user.adresse && (
                                            <div>
                                                <p className="text-sm font-medium">Adresse</p>
                                                <p className="text-sm text-muted-foreground">{commande.user.adresse}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-muted-foreground">Client non trouvé</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}