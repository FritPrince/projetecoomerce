import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

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
        title: 'Nouvelle Méthode',
        href: '/methodes-paiement/create',
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

interface MethodesPaiementCreateProps {
    paiements: Paiement[];
}

export default function MethodesPaiementCreate({ paiements }: MethodesPaiementCreateProps) {
    const { data, setData, errors, post, processing } = useForm({
        type: 'carte',
        details: '',
        paiement_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/methodes-paiement');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer une Méthode de Paiement" />
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
                            <h1 className="text-2xl font-bold">Créer une Méthode de Paiement</h1>
                            <p className="text-muted-foreground">
                                Ajouter une nouvelle méthode de paiement
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations de la Méthode de Paiement</CardTitle>
                        <CardDescription>
                            Remplissez les informations pour créer une nouvelle méthode de paiement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type de paiement *</Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(value) => setData('type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="carte">Carte bancaire</SelectItem>
                                            <SelectItem value="virement">Virement</SelectItem>
                                            <SelectItem value="paypal">PayPal</SelectItem>
                                            <SelectItem value="especes">Espèces</SelectItem>
                                            <SelectItem value="stripe">Stripe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && (
                                        <p className="text-sm text-red-600">{errors.type}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paiement_id">Paiement associé *</Label>
                                    <Select
                                        value={data.paiement_id}
                                        onValueChange={(value) => setData('paiement_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un paiement" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paiements.map((paiement) => (
                                                <SelectItem key={paiement.id} value={paiement.id.toString()}>
                                                    {paiement.reference} - {paiement.user.name} - {paiement.montant}€
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.paiement_id && (
                                        <p className="text-sm text-red-600">{errors.paiement_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="details">Détails supplémentaires</Label>
                                <Input
                                    id="details"
                                    value={data.details}
                                    onChange={(e) => setData('details', e.target.value)}
                                    placeholder="Détails sur la méthode de paiement (numéro de carte, référence de virement, etc.)"
                                />
                                {errors.details && (
                                    <p className="text-sm text-red-600">{errors.details}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" asChild>
                                    <Link href="/methodes-paiement">Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Création...' : 'Créer la méthode'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}