import ClientLayout from '@/layouts/ClientLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { route } from '@/lib/route';

export default function PasswordChange() {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.password.update'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <ClientLayout>
            <Head title="Changer le mot de passe" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={route('profile.show')} className="flex items-center text-gray-600 hover:text-primary mb-4">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Retour au profil
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Changer le mot de passe</h1>
                        <p className="mt-2 text-gray-600">
                            Mettez à jour votre mot de passe pour sécuriser votre compte
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Nouveau mot de passe
                            </CardTitle>
                            <CardDescription>
                                Votre mot de passe doit contenir au moins 8 caractères
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <Label htmlFor="current_password">Mot de passe actuel</Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                    {errors.current_password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">Nouveau mot de passe</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">Confirmer le nouveau mot de passe</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('profile.show')}>Annuler</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ClientLayout>
    );
}

