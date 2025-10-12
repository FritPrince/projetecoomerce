import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Edit, Eye, Trash2, User, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Commandes',
        href: '/commandes',
    },
];

interface Produit {
    id: number;
    nom: string;
    prix: number;
}

interface User {
    id: number;
    name: string;
    email: string;
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
    produits: Produit[];
}

interface CommandesIndexProps {
    commandes: Commande[];
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

export default function CommandesIndex({ commandes }: CommandesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Commandes" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestion des Commandes</h1>
                        <p className="text-muted-foreground">
                            Gérez les commandes de votre boutique
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/commandes/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle Commande
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Commandes</CardTitle>
                        <CardDescription>
                            {commandes.length} commande(s) trouvée(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {commandes.map((commande) => (
                                <div key={commande.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                            <ShoppingCart className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold">Commande #{commande.numero_commande}</h3>
                                                {getStatusBadge(commande.statut)}
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-3 w-3" />
                                                    <span>{commande.user.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(commande.date_commande).toLocaleDateString()}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">{commande.produits.length}</span> produit(s)
                                                </div>
                                                <div>
                                                    <span className="font-medium">{commande.total} €</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/commandes/${commande.id}`}>
                                                <Eye className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/commandes/${commande.id}/edit`}>
                                                <Edit className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link
                                                href={`/commandes/${commande.id}`}
                                                method="delete"
                                                as="button"
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            
                            {commandes.length === 0 && (
                                <div className="text-center py-8">
                                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Aucune commande</h3>
                                    <p className="text-muted-foreground">
                                        Commencez par créer votre première commande.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}