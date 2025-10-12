import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowLeft, Edit, User, Calendar, Package, Euro } from 'lucide-react';

interface MethodePaiement {
    id: number;
    type: string;
    details?: string;
}

interface Produit {
    id: number;
    nom: string;
    pivot: {
        montant_alloue: number;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    telephone?: string;
    adresse?: string;
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

interface PaiementsShowProps {
    paiement: Paiement;
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

export default function PaiementsShow({ paiement }: PaiementsShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Paiements',
            href: '/paiements',
        },
        {
            title: `Paiement ${paiement.reference}`,
            href: `/paiements/${paiement.id}`,
        },
    ];

    if (!paiement) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Paiement non trouvé" />
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    <div className="text-center py-12">
                        <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Paiement non trouvé</h3>
                        <p className="text-muted-foreground mb-4">
                            Le paiement que vous recherchez n'existe pas ou n'est pas accessible.
                        </p>
                        <Button asChild>
                            <Link href="/paiements">
                                Retour aux paiements
                            </Link>
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Paiement ${paiement.reference}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/paiements">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Détails du Paiement</h1>
                            <p className="text-muted-foreground">
                                Paiement {paiement.reference}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/paiements/${paiement.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations du Paiement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Paiement {paiement.reference}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            {getStatusBadge(paiement.statut)}
                                            {paiement.methodes_paiement?.[0] && getMethodeBadge(paiement.methodes_paiement[0].type)}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Date de paiement</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(paiement.date_paiement).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Date de création</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(paiement.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {paiement.methodes_paiement?.[0]?.details && (
                                    <div>
                                        <p className="text-sm font-medium mb-2">Détails de la méthode de paiement</p>
                                        <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                            {paiement.methodes_paiement[0].details}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Produits associés</CardTitle>
                                <CardDescription>
                                    Détail des produits financés par ce paiement
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {paiement.produits && paiement.produits.length > 0 ? (
                                        <>
                                            {paiement.produits.map((produit) => (
                                                <div key={produit.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <Package className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium">{produit.nom}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">{produit.pivot.montant_alloue} €</p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className="flex items-center justify-between border-t pt-4">
                                                <span className="text-lg font-semibold">Total</span>
                                                <div className="flex items-center space-x-2">
                                                    <Euro className="h-5 w-5 text-green-600" />
                                                    <span className="text-2xl font-bold">{paiement.montant} €</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold">Aucun produit</h3>
                                            <p className="text-muted-foreground">
                                                Ce paiement n'est associé à aucun produit.
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
                                {paiement.user ? (
                                    <>
                                        <div className="flex items-center space-x-3">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{paiement.user.name}</p>
                                                <p className="text-sm text-muted-foreground">{paiement.user.email}</p>
                                            </div>
                                        </div>
                                        {paiement.user.telephone && (
                                            <div>
                                                <p className="text-sm font-medium">Téléphone</p>
                                                <p className="text-sm text-muted-foreground">{paiement.user.telephone}</p>
                                            </div>
                                        )}
                                        {paiement.user.adresse && (
                                            <div>
                                                <p className="text-sm font-medium">Adresse</p>
                                                <p className="text-sm text-muted-foreground">{paiement.user.adresse}</p>
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