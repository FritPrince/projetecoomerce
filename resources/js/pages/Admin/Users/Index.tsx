import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Utilisateurs',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    telephone?: string;
    adresse?: string;
    created_at: string;
}

interface UsersIndexProps {
    users: User[];
}

export default function UsersIndex({ users }: UsersIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Utilisateurs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
                        <p className="text-muted-foreground">
                            Gérez les comptes clients de votre plateforme
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/users/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvel Utilisateur
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Utilisateurs</CardTitle>
                        <CardDescription>
                            {users.length} utilisateur(s) trouvé(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Inscrit le {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/users/${user.id}`}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                Voir
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/users/${user.id}/edit`}>
                                                <Edit className="h-4 w-4 mr-1" />
                                                Modifier
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            
                            {users.length === 0 && (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Aucun utilisateur</h3>
                                    <p className="text-muted-foreground">
                                        Commencez par créer un nouvel utilisateur.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}