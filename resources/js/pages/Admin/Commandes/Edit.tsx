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
        title: 'Commandes',
        href: '/commandes',
    },
    {
        title: 'Modifier Commande',
        href: '/commandes/edit',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface Produit {
    id: number;
    nom: string;
    prix: number;
}

interface Commande {
    id: number;
    numero_commande: string;
    date_commande: string;
    statut: string;
    total: number;
    user_id: number;
    produits: Produit[];
}

interface CommandesEditProps {
    commande: Commande;
    clients: User[];
    produits: Produit[];
}

export default function CommandesEdit({ commande, clients, produits }: CommandesEditProps) {
    const { data, setData, errors, put, processing } = useForm({
        numero_commande: commande.numero_commande,
        date_commande: commande.date_commande.split('T')[0],
        statut: commande.statut,
        user_id: commande.user_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/commandes/${commande.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier Commande #${commande.numero_commande}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/commandes/${commande.id}`}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Modifier la Commande</h1>
                            <p className="text-muted-foreground">
                                Modifier les informations de la commande #{commande.numero_commande}
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations de la Commande</CardTitle>
                        <CardDescription>
                            Modifiez les informations de la commande
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="numero_commande">Numéro de commande *</Label>
                                    <Input
                                        id="numero_commande"
                                        value={data.numero_commande}
                                        onChange={(e) => setData('numero_commande', e.target.value)}
                                        required
                                    />
                                    {errors.numero_commande && (
                                        <p className="text-sm text-red-600">{errors.numero_commande}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_commande">Date de commande *</Label>
                                    <Input
                                        id="date_commande"
                                        type="date"
                                        value={data.date_commande}
                                        onChange={(e) => setData('date_commande', e.target.value)}
                                        required
                                    />
                                    {errors.date_commande && (
                                        <p className="text-sm text-red-600">{errors.date_commande}</p>
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
                                            <SelectItem value="confirmee">Confirmée</SelectItem>
                                            <SelectItem value="expediee">Expédiée</SelectItem>
                                            <SelectItem value="livree">Livrée</SelectItem>
                                            <SelectItem value="annulee">Annulée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.statut && (
                                        <p className="text-sm text-red-600">{errors.statut}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" asChild>
                                    <Link href={`/commandes/${commande.id}`}>Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Modification...' : 'Modifier la commande'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}