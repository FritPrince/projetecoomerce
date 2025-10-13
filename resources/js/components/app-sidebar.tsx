import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Folder, 
    LayoutGrid,
    Users,
    Package,
    ShoppingCart,
    CreditCard,
    Layers,
    Tags,
    CreditCardIcon,
    Bell,
    Settings,
    BarChart3,
    FileText,
    Ticket,
    GitCompare
} from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Statistiques',
        href: '/admin/statistiques',
        icon: BarChart3,
    },
    {
        title: 'Utilisateurs',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Catégories',
        href: '/categories',
        icon: Layers,
    },
    {
        title: 'Sous-catégories',
        href: '/sous-categories',
        icon: Tags,
    },
    {
        title: 'Produits',
        href: '/produits',
        icon: Package,
    },
    {
        title: 'Coupons',
        href: '/coupons',
        icon: Ticket,
    },
    {
        title: 'Commandes',
        href: '/commandes',
        icon: ShoppingCart,
    },
    {
        title: 'Paiements',
        href: '/paiements',
        icon: CreditCard,
    },
    {
        title: 'Méthodes de paiement',
        href: '/methodes-paiement',
        icon: CreditCardIcon,
    },
    {
        title: 'Rapports',
        href: '/admin/rapports',
        icon: FileText,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
    {
        title: 'Paramètres',
        href: '/admin/parametres',
        icon: Settings,
    },
];

// Navigation pour les utilisateurs normaux
const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

interface AppSidebarProps {
    userRole?: string;
}

export function AppSidebar({ userRole = 'user' }: AppSidebarProps) {
    // Choisir la navigation selon le rôle
    const navItems = userRole === 'admin' ? adminNavItems : userNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}