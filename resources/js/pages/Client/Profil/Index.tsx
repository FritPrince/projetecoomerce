import { Head, Link } from '@inertiajs/react';
import { User, Mail, Phone, MapPin, Lock, LogOut } from 'lucide-react';
import { route } from '@/lib/route';

interface User {
    id: number;
    name: string;
    email: string;
    telephone?: string;
    adresse?: string;
    created_at: string;
}

interface ProfilIndexProps {
    user: User;
}

export default function ProfilIndex({ user }: ProfilIndexProps) {
    return (
        <>
            <Head title="Mon Profil" />
            
            {/* Header identique */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                {/* Même header */}
            </header>

            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Informations personnelles */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Informations personnelles
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom complet
                                        </label>
                                        <p className="text-gray-900">{user.name}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <Mail className="h-4 w-4 mr-1" />
                                            Email
                                        </label>
                                        <p className="text-gray-900">{user.email}</p>
                                    </div>
                                    
                                    {user.telephone && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                                <Phone className="h-4 w-4 mr-1" />
                                                Téléphone
                                            </label>
                                            <p className="text-gray-900">{user.telephone}</p>
                                        </div>
                                    )}
                                    
                                    {user.adresse && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                Adresse
                                            </label>
                                            <p className="text-gray-900">{user.adresse}</p>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Membre depuis
                                        </label>
                                        <p className="text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <Link 
                                        href={route('profile.edit')}
                                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Modifier mes informations
                                    </Link>
                                </div>
                            </div>

                            {/* Changer le mot de passe */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center">
                                    <Lock className="h-5 w-5 mr-2" />
                                    Sécurité
                                </h2>
                                
                                <p className="text-gray-600 mb-4">
                                    Changez votre mot de passe pour renforcer la sécurité de votre compte.
                                </p>
                                
                                <Link 
                                    href={route('password.edit')}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Changer mon mot de passe
                                </Link>
                            </div>
                        </div>

                        {/* Actions rapides */}
                        <div className="space-y-6">
                            {/* Statistiques */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold mb-4">Mon activité</h3>
                                <div className="space-y-3">
                                    <Link href="/commandes" className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                                        <span>Mes commandes</span>
                                        <span className="bg-primary text-white px-2 py-1 rounded-full text-sm">0</span>
                                    </Link>
                                    <Link href="/favoris" className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                                        <span>Mes favoris</span>
                                        <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-sm">0</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Déconnexion */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center justify-center text-red-600 hover:text-red-800 p-3 border border-red-200 rounded-lg hover:border-red-300 transition-colors"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Se déconnecter
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer identique */}
            <footer className="bg-gray-900 text-white py-12">
                {/* Même footer */}
            </footer>
        </>
    );
}