import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Mail, Shield, Globe, CreditCard, Bell } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Paramètres',
        href: '/admin/parametres',
    },
];

interface ParametresProps {
    settings: any[];
}

export default function ParametresIndex({ settings }: ParametresProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Paramètres" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Paramètres</h1>
                        <p className="text-muted-foreground">
                            Configurez les paramètres de votre boutique
                        </p>
                    </div>
                    <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Navigation des paramètres */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Catégories
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[
                                { id: 'general', label: 'Général', icon: Settings },
                                { id: 'email', label: 'Email', icon: Mail },
                                { id: 'security', label: 'Sécurité', icon: Shield },
                                { id: 'website', label: 'Site Web', icon: Globe },
                                { id: 'payment', label: 'Paiements', icon: CreditCard },
                                { id: 'notifications', label: 'Notifications', icon: Bell },
                            ].map((item) => (
                                <Button
                                    key={item.id}
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Contenu des paramètres */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Paramètres généraux */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Paramètres Généraux</CardTitle>
                                <CardDescription>
                                    Configuration de base de votre boutique
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shop_name">Nom de la boutique</Label>
                                        <Input id="shop_name" placeholder="Ma Boutique" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shop_email">Email de contact</Label>
                                        <Input id="shop_email" type="email" placeholder="contact@maboutique.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shop_description">Description</Label>
                                    <textarea
                                        id="shop_description"
                                        className="w-full p-2 border rounded-md"
                                        rows={3}
                                        placeholder="Description de votre boutique"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shop_address">Adresse</Label>
                                    <Input id="shop_address" placeholder="123 Rue de la Paix, 75001 Paris" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paramètres de paiement */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Paramètres de Paiement</CardTitle>
                                <CardDescription>
                                    Configuration des méthodes de paiement
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Stripe</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Paiements par carte bancaire
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>PayPal</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Paiements via PayPal
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Virement bancaire</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Paiements par virement
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paramètres de notification */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Configuration des notifications automatiques
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Nouvelles commandes</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Notifier les nouvelles commandes
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Paiements reçus</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Notifier les paiements confirmés
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Stock faible</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Alerter quand le stock est faible
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paramètres de sécurité */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sécurité</CardTitle>
                                <CardDescription>
                                    Configuration de la sécurité de votre boutique
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="session_timeout">Durée de session (minutes)</Label>
                                        <Input id="session_timeout" type="number" placeholder="120" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max_login_attempts">Tentatives de connexion max</Label>
                                        <Input id="max_login_attempts" type="number" placeholder="5" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Authentification à deux facteurs</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Exiger 2FA pour les administrateurs
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

