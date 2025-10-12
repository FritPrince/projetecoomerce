import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface Flash {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash?: Flash;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    telephone?: string;
    adresse?: string;
    role?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface SousCategorie {
    id: number;
    nom: string;
    categorie_id: number;
    created_at: string;
    updated_at: string;
}

export interface Categorie {
    id: number;
    nom: string;
    created_at: string;
    updated_at: string;
    sous_categories: SousCategorie[];
}

export interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    image?: string;
    stock: number;
    quantite_stock: number; // Alias pour compatibilité
    sous_categorie_id: number;
    sous_categorie?: SousCategorie;
    created_at: string;
    updated_at: string;
}
