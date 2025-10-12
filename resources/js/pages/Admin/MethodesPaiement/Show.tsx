import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowLeft, Edit, User, Calendar, Euro } from 'lucide-react';

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
    user: User;
}

interface MethodePaiement {
    id: number;
    type: string;
    details?: string;
    paiement_id: number;
    created_at: string;
    updated_at: string;
    paiement: Paiement;
}

interface MethodesPaiementShowProps {
    methodePaiement: MethodePaiement;
}

const getTypeBadge = (type: string) => {
    const typeConfig = {
        carte: { variant: 'default' as const, label: 'Carte bancaire' },
        virement: { variant: 'secondary' as const, label: 'Virement' },
        paypal: { variant: 'default' as const, label: 'PayPal' },
        especes: { variant: 'outline' as const, label: 'Espèces' },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || { variant: 'secondary', label: type };
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function MethodesPaiementShow({ methodePaiement }: MethodesPaiementShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Méthodes de Paiement',
            href: '/methodes-paiement',
        },
        {
            title: `Méthode ${methodePaiement.type}`,
            href: `/methodes-paiement/${methodePaiement.id}`,
        },
    ];

    if (!methodePaiement) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Méthode de paiement non trouvée" />
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    <div className="text-center py-12">
                        <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Méthode de paiement non trouvée</h3>
                        <p className="text-muted-foreground mb-4">
                            La méthode de paiement que vous recherchez n'existe pas ou n'est pas accessible.
                        </p>
                        <Button asChild>
                            <Link href="/methodes-paiement">
                                Retour aux méthodes de paiement
                            </Link>
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Méthode de Paiement ${methodePaiement.type}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/methodes-paiement">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Détails de la Méthode de Paiement</h1>
                            <p className="text-muted-foreground">
                                Méthode: {methodePaiement.type}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/methodes-paiement/${methodePaiement.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de la Méthode de Paiement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {getTypeBadge(methodePaiement.type)}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Méthode de paiement utilisée
                                        </p>
                                    </div>
                                </div>

                                {methodePaiement.details && (
                                    <div>
                                        <p className="text-sm font-medium mb-2">Détails</p>
                                        <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                            {methodePaiement.details}
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Date de création</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(methodePaiement.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Dernière modification</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(methodePaiement.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Paiement Associé</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Référence: {methodePaiement.paiement.reference}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Statut: {methodePaiement.paiement.statut}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Euro className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Montant</p>
                                        <p className="text-sm text-muted-foreground">
                                            {methodePaiement.paiement.montant} €
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Date de paiement</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(methodePaiement.paiement.date_paiement).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informations du Client</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{methodePaiement.paiement.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{methodePaiement.paiement.user.email}</p>
                                    </div>
                                </div>
                                {methodePaiement.paiement.user.telephone && (
                                    <div>
                                        <p className="text-sm font-medium">Téléphone</p>
                                        <p className="text-sm text-muted-foreground">{methodePaiement.paiement.user.telephone}</p>
                                    </div>
                                )}
                                {methodePaiement.paiement.user.adresse && (
                                    <div>
                                        <p className="text-sm font-medium">Adresse</p>
                                        <p className="text-sm text-muted-foreground">{methodePaiement.paiement.user.adresse}</p>
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