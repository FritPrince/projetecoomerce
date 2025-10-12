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
        title: 'Paiements',
        href: '/paiements',
    },
    {
        title: 'Modifier Paiement',
        href: '/paiements/edit',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface MethodePaiement {
    id: number;
    type: string;
    details?: string;
}

interface Paiement {
    id: number;
    reference: string;
    montant: number;
    date_paiement: string;
    statut: string;
    user_id: number;
    methodes_paiement: MethodePaiement[];
}

interface PaiementsEditProps {
    paiement: Paiement;
    clients: User[];
}

export default function PaiementsEdit({ paiement, clients }: PaiementsEditProps) {
    const { data, setData, errors, put, processing } = useForm({
        reference: paiement.reference,
        montant: paiement.montant.toString(),
        date_paiement: paiement.date_paiement.split('T')[0],
        statut: paiement.statut,
        user_id: paiement.user_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/paiements/${paiement.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier Paiement ${paiement.reference}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/paiements/${paiement.id}`}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Modifier le Paiement</h1>
                            <p className="text-muted-foreground">
                                Modifier les informations du paiement {paiement.reference}
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du Paiement</CardTitle>
                        <CardDescription>
                            Modifiez les informations du paiement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="reference">Référence *</Label>
                                    <Input
                                        id="reference"
                                        value={data.reference}
                                        onChange={(e) => setData('reference', e.target.value)}
                                        required
                                    />
                                    {errors.reference && (
                                        <p className="text-sm text-red-600">{errors.reference}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_paiement">Date de paiement *</Label>
                                    <Input
                                        id="date_paiement"
                                        type="date"
                                        value={data.date_paiement}
                                        onChange={(e) => setData('date_paiement', e.target.value)}
                                        required
                                    />
                                    {errors.date_paiement && (
                                        <p className="text-sm text-red-600">{errors.date_paiement}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user_id">Client *</Label>
                                    <Select
                                        value={data.user_id}
                                        onValueChange={(value) => setData('user_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.name} - {client.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && (
                                        <p className="text-sm text-red-600">{errors.user_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="statut">Statut *</Label>
                                    <Select
                                        value={data.statut}
                                        onValueChange={(value) => setData('statut', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en_attente">En attente</SelectItem>
                                            <SelectItem value="paye">Payé</SelectItem>
                                            <SelectItem value="echec">Échec</SelectItem>
                                            <SelectItem value="rembourse">Remboursé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.statut && (
                                        <p className="text-sm text-red-600">{errors.statut}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="montant">Montant total *</Label>
                                    <Input
                                        id="montant"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.montant}
                                        onChange={(e) => setData('montant', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.montant && (
                                        <p className="text-sm text-red-600">{errors.montant}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" asChild>
                                    <Link href={`/paiements/${paiement.id}`}>Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Modification...' : 'Modifier le paiement'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}