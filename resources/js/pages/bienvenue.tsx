// resources/js/Pages/Welcome.tsx
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Star, Shield, Truck, Zap, Heart } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: <ShoppingCart className="w-6 h-6" />,
            title: "Shopping Facile",
            description: "Parcourez notre catalogue et achetez en quelques clics"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Paiement Sécurisé",
            description: "Transactions cryptées et méthodes de paiement multiples"
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: "Livraison Rapide",
            description: "Recevez vos commandes en 24-48 heures"
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Produits Qualité",
            description: "Des articles soigneusement sélectionnés pour vous"
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Favoris Personnalisés",
            description: "Gardez vos produits préférés à portée de main"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Service Client",
            description: "Une équipe dédiée pour vous accompagner"
        }
    ];

    return (
        <>
            <Head title="Bienvenue - Votre Boutique en Ligne">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
                {/* Navigation */}
                <nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    EliteShop
                                </span>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Tableau de Bord
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={login()}
                                            className="text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            S'inscrire
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                        <div className="text-center">
                            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                    L'Excellence
                                </span>
                                <br />
                                <span className="text-slate-900 dark:text-white">
                                    du Shopping en Ligne
                                </span>
                            </h1>
                            
                            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Découvrez une expérience d'achat exceptionnelle avec des produits de qualité, 
                                un service client dévoué et une livraison rapide.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-2"
                                    >
                                        <span>Accéder au Tableau de Bord</span>
                                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-2"
                                        >
                                            <span>Commencer Maintenant</span>
                                            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="group border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 transform hover:-translate-y-1"
                                        >
                                            Se Connecter
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                                {[
                                    { number: "10K+", label: "Clients Satisfaits" },
                                    { number: "500+", label: "Produits" },
                                    { number: "24h", label: "Livraison" },
                                    { number: "98%", label: "Satisfaction" }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                            {stat.number}
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white dark:bg-slate-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                                Pourquoi Nous Choisir ?
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                                Une expérience de shopping complète conçue pour votre confort et satisfaction
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group p-8 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            Prêt à Commencer ?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Rejoignez des milliers de clients satisfaits et découvrez une nouvelle façon de shopper en ligne.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center space-x-2"
                                >
                                    <span>Explorer la Boutique</span>
                                    <ShoppingCart className="w-5 h-5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={register()}
                                        className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                                    >
                                        Créer un Compte Gratuit
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        Se Connecter
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-900 text-slate-400 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">EliteShop</span>
                            </div>
                            <p className="mb-6 max-w-md mx-auto">
                                Votre destination de confiance pour des achats en ligne exceptionnels.
                            </p>
                            <div className="flex justify-center space-x-6 text-sm">
                                <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
                                <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                                <a href="#" className="hover:text-white transition-colors">Contact</a>
                                <a href="#" className="hover:text-white transition-colors">Support</a>
                            </div>
                            <div className="mt-6 text-sm">
                                © 2024 EliteShop. Tous droits réservés.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}