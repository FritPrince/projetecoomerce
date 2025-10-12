import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Edit, Eye, Trash2, User, Calendar, Euro } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Paiements',
        href: '/paiements',
    },
];

interface MethodePaiement {
    id: number;
    type: string;
    details?: string;
}

interface Produit {
    id: number;
    nom: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Paiement {
    id: number;
    reference: string;
    montant: number;
    date_paiement: string;
    statut: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: User;
    methodes_paiement: MethodePaiement[];
    produits: Produit[];
}

interface PaiementsIndexProps {
    paiements: Paiement[];
}

const getStatusBadge = (statut: string) => {
    const statusConfig = {
        en_attente: { variant: 'secondary' as const, label: 'En attente' },
        paye: { variant: 'default' as const, label: 'Payé' },
        echec: { variant: 'destructive' as const, label: 'Échec' },
        rembourse: { variant: 'outline' as const, label: 'Remboursé' },
    };
    
    const config = statusConfig[statut as keyof typeof statusConfig] || { variant: 'secondary', label: statut };
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getMethodeBadge = (type: string) => {
    const methodConfig = {
        carte: { variant: 'default' as const, label: 'Carte' },
        virement: { variant: 'secondary' as const, label: 'Virement' },
        paypal: { variant: 'default' as const, label: 'PayPal' },
        especes: { variant: 'outline' as const, label: 'Espèces' },
    };
    
    const config = methodConfig[type as keyof typeof methodConfig] || { variant: 'secondary', label: type };
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function PaiementsIndex({ paiements }: PaiementsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Paiements" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
                        <p className="text-muted-foreground">
                            Gérez les transactions de paiement de votre boutique
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/paiements/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau Paiement
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Paiements</CardTitle>
                        <CardDescription>
                            {paiements.length} paiement(s) trouvé(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {paiements.map((paiement) => (
                                <div key={paiement.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold">Réf: {paiement.reference}</h3>
                                                {getStatusBadge(paiement.statut)}
                                                {paiement.methodes_paiement?.[0] && getMethodeBadge(paiement.methodes_paiement[0].type)}
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-3 w-3" />
                                                    <span>{paiement.user.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(paiement.date_paiement).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Euro className="h-3 w-3" />
                                                    <span className="font-medium">{paiement.montant} €</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">{paiement.produits.length}</span> produit(s)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/paiements/${paiement.id}`}>
                                                <Eye className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/paiements/${paiement.id}/edit`}>
                                                <Edit className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link
                                                href={`/paiements/${paiement.id}`}
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
                            
                            {paiements.length === 0 && (
                                <div className="text-center py-8">
                                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Aucun paiement</h3>
                                    <p className="text-muted-foreground">
                                        Commencez par créer votre premier paiement.
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