import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Edit, Eye, Trash2, User, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Méthodes de Paiement',
        href: '/methodes-paiement',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface Paiement {
    id: number;
    reference: string;
    montant: number;
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

interface MethodesPaiementIndexProps {
    methodesPaiement: MethodePaiement[];
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

export default function MethodesPaiementIndex({ methodesPaiement }: MethodesPaiementIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Méthodes de Paiement" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Méthodes de Paiement</h1>
                        <p className="text-muted-foreground">
                            Gérez les méthodes de paiement utilisées dans votre système
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/methodes-paiement/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle Méthode
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Méthodes de Paiement</CardTitle>
                        <CardDescription>
                            {methodesPaiement.length} méthode(s) de paiement trouvée(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {methodesPaiement.map((methode) => (
                                <div key={methode.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                {getTypeBadge(methode.type)}
                                                <span className="text-sm text-muted-foreground">
                                                    Paiement: {methode.paiement.reference}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-3 w-3" />
                                                    <span>{methode.paiement.user.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(methode.created_at).toLocaleDateString()}</span>
                                                </div>
                                                {methode.details && (
                                                    <div>
                                                        <span className="truncate max-w-xs">{methode.details}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/methodes-paiement/${methode.id}`}>
                                                <Eye className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/methodes-paiement/${methode.id}/edit`}>
                                                <Edit className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link
                                                href={`/methodes-paiement/${methode.id}`}
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
                            
                            {methodesPaiement.length === 0 && (
                                <div className="text-center py-8">
                                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Aucune méthode de paiement</h3>
                                    <p className="text-muted-foreground">
                                        Commencez par créer votre première méthode de paiement.
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