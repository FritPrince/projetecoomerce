import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

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
    report_types: any;
}

export default function RapportsIndex({ reports, report_types }: RapportsProps) {
    const [type, setType] = useState('ventes');
    const [period, setPeriod] = useState('month');
    const [format, setFormat] = useState('csv');

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
                </div>

                {/* Types de rapports */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(report_types).map(([key, report]) => (
                        <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setType(key)}>
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${report.bgColor}`}>
                                        {/* Icon mapping might be needed here */}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{report.title}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {report.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Paramètres de génération */}
                <Card>
                    <CardHeader>
                        <CardTitle>Génération de Rapport</CardTitle>
                        <CardDescription>
                            Créez un rapport avec les paramètres ci-dessous.
                        </CardDescription>
                    </CardHeader>
                    <form action="/admin/rapports/generate" method="POST">
                        <CardContent className="space-y-4">
                            <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type de rapport</label>
                                    <select name="type" value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded-md">
                                        {Object.entries(report_types).map(([key, report]) => (
                                            <option key={key} value={key}>{report.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Période</label>
                                    <select name="period" value={period} onChange={e => setPeriod(e.target.value)} className="w-full p-2 border rounded-md">
                                        <option value="month">Dernier mois</option>
                                        <option value="quarter">Derniers 3 mois</option>
                                        <option value="year">Dernière année</option>
                                        <option value="custom">Personnalisé</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Format</label>
                                    <select name="format" value={format} onChange={e => setFormat(e.target.value)} className="w-full p-2 border rounded-md">
                                        <option value="csv">CSV</option>
                                        <option value="pdf">PDF (bientôt)</option>
                                        <option value="excel">Excel (bientôt)</option>
                                    </select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full">
                                <Download className="h-4 w-4 mr-2" />
                                Générer et Télécharger
                            </Button>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

