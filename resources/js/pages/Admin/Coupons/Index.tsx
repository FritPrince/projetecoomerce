import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, Plus, Edit, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Coupons',
        href: '/coupons',
    },
];

interface Coupon {
    id: number;
    name: string;
    code: string;
    description?: string;
    type: 'fixed' | 'percentage';
    value: number;
    minimum_amount: number;
    starts_at: string;
    expires_at: string;
    is_active: boolean;
}

interface CouponsIndexProps {
    coupons: {
        data: Coupon[];
    };
}

export default function CouponsIndex({ coupons }: CouponsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Coupons" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestion des Coupons</h1>
                        <p className="text-muted-foreground">
                            Gérez les codes de réduction de votre boutique.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/coupons/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau Coupon
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {coupons.data.map((coupon) => (
                        <Card key={coupon.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold text-primary">{coupon.name}</CardTitle>
                                    <Badge variant={coupon.is_active ? 'default' : 'destructive'}>
                                        {coupon.is_active ? 'Actif' : 'Inactif'}
                                    </Badge>
                                </div>
                                <CardDescription>{coupon.code} - {coupon.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Réduction</span>
                                    <span className="font-semibold">
                                        {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}€`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Montant minimum</span>
                                    <span className="font-semibold">{coupon.minimum_amount}€</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Début</span>
                                    <span>{new Date(coupon.starts_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Fin</span>
                                    <span>{new Date(coupon.expires_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-end space-x-2 mt-4">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/coupons/${coupon.id}/edit`}>
                                            <Edit className="h-3 w-3" />
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" size="sm" asChild>
                                        <Link
                                            href={`/coupons/${coupon.id}`}
                                            method="delete"
                                            as="button"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {coupons.data.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Aucun coupon</h3>
                            <p className="text-muted-foreground mb-4">
                                Commencez par créer votre premier coupon.
                            </p>
                            <Button asChild>
                                <Link href="/coupons/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Créer un coupon
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
