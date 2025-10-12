import ClientLayout from '@/layouts/ClientLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Edit, Key, ShoppingBag, Heart, CreditCard } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    telephone?: string;
    adresse?: string;
    role: string;
    created_at: string;
}

interface ProfileShowProps {
    user: User;
}

export default function ProfileShow({ user }: ProfileShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <ClientLayout>
            <Head title="Mon Profil" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
                        <p className="mt-2 text-gray-600">
                            Gérez vos informations personnelles et vos préférences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Informations personnelles */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Informations personnelles
                                    </CardTitle>
                                    <CardDescription>
                                        Vos informations de compte
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Nom complet</label>
                                            <p className="text-lg text-gray-900">{user.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Email</label>
                                            <p className="text-lg text-gray-900">{user.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Téléphone</label>
                                            <p className="text-lg text-gray-900">{user.telephone || 'Non renseigné'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Rôle</label>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                {user.role === 'admin' ? 'Administrateur' : 'Client'}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    {user.adresse && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Adresse</label>
                                            <p className="text-lg text-gray-900">{user.adresse}</p>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Membre depuis</label>
                                        <p className="text-lg text-gray-900">{formatDate(user.created_at)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Actions rapides */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions rapides</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button asChild className="w-full justify-start">
                                        <Link href="/profile/edit">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Modifier le profil
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full justify-start">
                                        <Link href="/profile/password">
                                            <Key className="h-4 w-4 mr-2" />
                                            Changer le mot de passe
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Mes activités</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button asChild variant="outline" className="w-full justify-start">
                                        <Link href="/mes-commandes">
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            Mes commandes
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full justify-start">
                                        <Link href="/favoris">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Mes favoris
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full justify-start">
                                        <Link href="/paiements">
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Mes paiements
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
