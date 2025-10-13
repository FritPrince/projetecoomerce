import ClientLayout from '@/layouts/ClientLayout';
import { type Coupon } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from 'lucide-react';

interface ClientCouponsProps {
    coupons: Coupon[];
}

export default function ClientCouponsIndex({ coupons }: ClientCouponsProps) {
    return (
        <ClientLayout>
            <Head title="Mes Coupons" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Coupons Disponibles</h1>
                        <p className="text-muted-foreground mt-2">
                            Voici les réductions que vous pouvez utiliser lors de vos prochains achats.
                        </p>
                    </div>
                </div>

                {coupons.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {coupons.map((coupon) => (
                            <Card key={coupon.id} className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-2xl font-bold text-primary tracking-wider">{coupon.code}</CardTitle>
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Ticket className="h-6 w-6 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">{coupon.description}</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Réduction:</span>
                                            <span className="font-semibold">
                                                {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}€`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Achat minimum:</span>
                                            <span className="font-semibold">{coupon.minimum_amount}€</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Expire le:</span>
                                            <span className="font-semibold">
                                                {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('fr-FR') : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-dashed border-2 rounded-lg">
                        <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Aucun coupon disponible</h3>
                        <p className="text-muted-foreground">
                            Revenez bientôt pour découvrir de nouvelles offres.
                        </p>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
