import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Package, Euro, Calendar, BarChart3 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Statistiques',
        href: '/admin/statistiques',
    },
];

interface StatistiquesProps {
    stats: {
        total_ventes: number;
        total_clients: number;
        total_produits: number;
        revenus_mensuels: number;
    };
}

export default function StatistiquesIndex({ stats }: StatistiquesProps) {
    const statCards = [
        {
            title: 'Total des Ventes',
            value: stats.total_ventes,
            icon: TrendingUp,
            description: 'Commandes totales',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Clients',
            value: stats.total_clients,
            icon: Users,
            description: 'Utilisateurs inscrits',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Produits',
            value: stats.total_produits,
            icon: Package,
            description: 'Articles en catalogue',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Revenus Mensuels',
            value: `${stats.revenus_mensuels}€`,
            icon: Euro,
            description: 'Ce mois-ci',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Statistiques" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Statistiques</h1>
                        <p className="text-muted-foreground">
                            Vue d'ensemble des performances de votre boutique
                        </p>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date().toLocaleDateString('fr-FR')}
                    </Badge>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Graphiques et analyses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Ventes par Mois
                            </CardTitle>
                            <CardDescription>
                                Évolution des ventes sur les 12 derniers mois
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Graphique des ventes à venir</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Produits Populaires</CardTitle>
                            <CardDescription>
                                Top 5 des produits les plus vendus
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                                {item}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Produit {item}</p>
                                                <p className="text-xs text-muted-foreground">Catégorie</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">{Math.floor(Math.random() * 100)} ventes</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tableau de bord rapide */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activité Récente</CardTitle>
                        <CardDescription>
                            Dernières actions sur la plateforme
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { action: 'Nouvelle commande', user: 'Client #1234', time: 'Il y a 5 min' },
                                { action: 'Produit ajouté', user: 'Admin', time: 'Il y a 1h' },
                                { action: 'Paiement reçu', user: 'Client #5678', time: 'Il y a 2h' },
                                { action: 'Stock mis à jour', user: 'Admin', time: 'Il y a 3h' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">{activity.user}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

