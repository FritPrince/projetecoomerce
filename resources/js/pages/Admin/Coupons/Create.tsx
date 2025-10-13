import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Coupons',
        href: '/coupons',
    },
    {
        title: 'Nouveau Coupon',
        href: '/coupons/create',
    },
];

export default function CouponsCreate() {
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
        description: '',
        type: 'fixed',
        value: '',
        minimum_amount: '',
        starts_at: new Date().toISOString().split('T')[0],
        expires_at: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/coupons');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un Coupon" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/coupons">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Créer un Coupon</h1>
                            <p className="text-muted-foreground">
                                Ajouter un nouveau code de réduction
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du Coupon</CardTitle>
                        <CardDescription>
                            Remplissez les informations pour créer un nouveau coupon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom du coupon *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ex: Réduction estivale"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">Code *</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="SUMMER2024"
                                        required
                                    />
                                    {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Type de réduction *</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Montant fixe</SelectItem>
                                            <SelectItem value="percentage">Pourcentage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="value">Valeur *</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.value}
                                        onChange={(e) => setData('value', e.target.value)}
                                        placeholder={data.type === 'fixed' ? '10.00' : '15'}
                                        required
                                    />
                                    {errors.value && <p className="text-sm text-red-600">{errors.value}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minimum_amount">Montant minimum d'achat (€)</Label>
                                    <Input
                                        id="minimum_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.minimum_amount}
                                        onChange={(e) => setData('minimum_amount', e.target.value)}
                                        placeholder="50.00"
                                    />
                                    {errors.minimum_amount && <p className="text-sm text-red-600">{errors.minimum_amount}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="starts_at">Date de début</Label>
                                    <Input
                                        id="starts_at"
                                        type="date"
                                        value={data.starts_at}
                                        onChange={(e) => setData('starts_at', e.target.value)}
                                    />
                                    {errors.starts_at && <p className="text-sm text-red-600">{errors.starts_at}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expires_at">Date de fin</Label>
                                    <Input
                                        id="expires_at"
                                        type="date"
                                        value={data.expires_at}
                                        onChange={(e) => setData('expires_at', e.target.value)}
                                    />
                                    {errors.expires_at && <p className="text-sm text-red-600">{errors.expires_at}</p>}
                                </div>

                                <div className="space-y-2 flex items-center pt-4">
                                    <Label htmlFor="is_active" className="mr-4">Activer le coupon</Label>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    {errors.is_active && <p className="text-sm text-red-600">{errors.is_active}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description du coupon..."
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" asChild>
                                    <Link href="/coupons">Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Création...' : 'Créer le coupon'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
