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
        title: 'Modifier Méthode',
        href: '/methodes-paiement/edit',
    },
];

interface Paiement {
    id: number;
    reference: string;
    montant: number;
}

interface MethodePaiement {
    id: number;
    type: string;
    details?: string;
    paiement_id: number;
    paiement: Paiement;
}

interface MethodesPaiementEditProps {
    methodePaiement: MethodePaiement;
    paiements: Paiement[];
}

export default function MethodesPaiementEdit({ methodePaiement, paiements }: MethodesPaiementEditProps) {
    const { data, setData, errors, put, processing } = useForm({
        type: methodePaiement.type,
        details: methodePaiement.details || '',
        paiement_id: methodePaiement.paiement_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/methodes-paiement/${methodePaiement.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier Méthode de Paiement`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/methodes-paiement/${methodePaiement.id}`}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Modifier la Méthode de Paiement</h1>
                            <p className="text-muted-foreground">
                                Modifier les informations de la méthode {methodePaiement.type}
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations de la Méthode de Paiement</CardTitle>
                        <CardDescription>
                            Modifiez les informations de la méthode de paiement
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
                                                    {paiement.reference} - {paiement.montant}€
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
                                    <Link href={`/methodes-paiement/${methodePaiement.id}`}>Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Modification...' : 'Modifier la méthode'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}