import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { StatsCard } from '@/components/stats-card';
import { RecentOrders } from '@/components/recent-orders';
import { PopularProducts } from '@/components/popular-products';
import { 
    Users, 
    Package, 
    ShoppingCart, 
    CreditCard 
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: 'Admin/Dashboard',
    },
];

interface DashboardProps {
    stats: {
        totalClients: number;
        totalProduits: number;
        totalCommandes: number;
        totalPaiements: number;
        commandesRecentes: any[];
        produitsPopulaires: any[];
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Clients"
                        value={stats.totalClients}
                        description="Clients inscrits"
                        icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StatsCard
                        title="Total Produits"
                        value={stats.totalProduits}
                        description="Produits en catalogue"
                        icon={<Package className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StatsCard
                        title="Total Commandes"
                        value={stats.totalCommandes}
                        description="Commandes passées"
                        icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StatsCard
                        title="Total Paiements"
                        value={stats.totalPaiements}
                        description="Transactions effectuées"
                        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                    />
                </div>

                {/* Grille des tableaux */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">
                        <RecentOrders orders={stats.commandesRecentes} />
                    </div>
                    <div className="col-span-3">
                        <PopularProducts products={stats.produitsPopulaires} />
                    </div>
                </div>

                {/* Section graphiques (placeholder pour l'instant) */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-muted-foreground">Graphique des ventes (à implémenter)</span>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-muted-foreground">Graphique des produits (à implémenter)</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}