import { Link, usePage } from '@inertiajs/react';
import { GitCompare, Heart, Package, Search, ShoppingCart, Ticket, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import SearchBar from '@/components/SearchBar';
import { route } from '@/lib/route';
import OnboardingModal from '@/components/OnboardingModal';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        // Check if onboarding should be shown
        if (auth.user && !auth.user.has_seen_onboarding) {
            setIsOnboardingOpen(true);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [auth.user]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
            <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
            <header 
                className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-primary">
                                ShopStyle
                            </Link>
                        </div>

                        <div className="hidden lg:flex flex-1 justify-center px-8">
                            <div className="w-full max-w-md">
                                <SearchBar />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/favoris">
                                    <Heart className="h-5 w-5" />
                                </Link>
                            </Button>
                            
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={route('compare.index')}>
                                    <GitCompare className="h-5 w-5" />
                                </Link>
                            </Button>

                            <Button variant="ghost" size="icon" asChild>
                                <Link href={route('client.coupons.index')}>
                                    <Ticket className="h-5 w-5" />
                                </Link>
                            </Button>

                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/mes-commandes">
                                    <Package className="h-5 w-5" />
                                </Link>
                            </Button>
                            
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/panier">
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={auth.user ? route('profil.index') : route('login')}>
                                    <User className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <footer className="bg-white border-t">
                <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div className="md:col-span-1">
                            <h3 className="text-2xl font-bold text-primary">ShopStyle</h3>
                            <p className="mt-2 text-muted-foreground">
                                La mode à portée de clic.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Navigation</h4>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-muted-foreground hover:text-primary">Accueil</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-primary">Nouveautés</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-primary">Promotions</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Aide</h4>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-primary">Livraison & Retours</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
                            <p className="text-muted-foreground mb-2">Recevez nos offres exclusives.</p>
                            <div className="flex">
                                <Input type="email" placeholder="Votre email" />
                                <Button className="ml-2">S'inscrire</Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} ShopStyle. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
