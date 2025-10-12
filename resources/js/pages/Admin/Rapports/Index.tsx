import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Rapports',
        href: '/admin/rapports',
    },
];

interface RapportsProps {
    reports: any[];
}

export default function RapportsIndex({ reports }: RapportsProps) {
    const reportTypes = [
        {
            id: 'ventes',
            title: 'Rapport des Ventes',
            description: 'Analyse détaillée des ventes par période',
            icon: BarChart3,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            id: 'clients',
            title: 'Rapport Clients',
            description: 'Comportement et données des clients',
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            id: 'produits',
            title: 'Rapport Produits',
            description: 'Performance des produits en stock',
            icon: FileText,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            id: 'financier',
            title: 'Rapport Financier',
            description: 'Analyse des revenus et coûts',
            icon: FileText,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    const recentReports = [
        {
            id: 1,
            name: 'Rapport Ventes - Janvier 2024',
            type: 'Ventes',
            generated: '2024-01-31',
            status: 'completed',
        },
        {
            id: 2,
            name: 'Analyse Clients - Q4 2023',
            type: 'Clients',
            generated: '2023-12-31',
            status: 'completed',
        },
        {
            id: 3,
            name: 'Performance Produits - Décembre',
            type: 'Produits',
            generated: '2023-12-15',
            status: 'completed',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rapports" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Rapports</h1>
                        <p className="text-muted-foreground">
                            Générez et consultez vos rapports d'analyse
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filtrer
                        </Button>
                        <Button>
                            <FileText className="h-4 w-4 mr-2" />
                            Nouveau Rapport
                        </Button>
                    </div>
                </div>

                {/* Types de rapports */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reportTypes.map((report) => (
                        <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${report.bgColor}`}>
                                        <report.icon className={`h-5 w-5 ${report.color}`} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{report.title}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {report.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Générer
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Rapports récents */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rapports Récents</CardTitle>
                        <CardDescription>
                            Derniers rapports générés et en cours
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentReports.map((report) => (
                                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{report.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Type: {report.type} • Généré le {new Date(report.generated).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                                            {report.status === 'completed' ? 'Terminé' : 'En cours'}
                                        </Badge>
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Télécharger
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Paramètres de génération */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Génération Rapide</CardTitle>
                            <CardDescription>
                                Créez un rapport avec des paramètres prédéfinis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Période</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option>Dernier mois</option>
                                    <option>Derniers 3 mois</option>
                                    <option>Dernière année</option>
                                    <option>Personnalisé</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Format</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option>PDF</option>
                                    <option>Excel</option>
                                    <option>CSV</option>
                                </select>
                            </div>
                            <Button className="w-full">
                                <FileText className="h-4 w-4 mr-2" />
                                Générer le Rapport
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Planification</CardTitle>
                            <CardDescription>
                                Programmez des rapports automatiques
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-medium mb-2">Planification à venir</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Programmez des rapports récurrents
                                </p>
                                <Button variant="outline">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Configurer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

