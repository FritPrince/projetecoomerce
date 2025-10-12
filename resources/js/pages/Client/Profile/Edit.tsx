import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData, type User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { route } from '@/lib/route';

export default function EditProfile() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Profile" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du Profil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Votre nom"
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Votre email"
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone</Label>
                                <Input
                                    id="telephone"
                                    value={data.telephone || ''}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                    placeholder="Votre téléphone"
                                />
                                {errors.telephone && <p className="text-sm text-red-600">{errors.telephone}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adresse">Adresse</Label>
                                <Input
                                    id="adresse"
                                    value={data.adresse || ''}
                                    onChange={(e) => setData('adresse', e.target.value)}
                                    placeholder="Votre adresse"
                                />
                                {errors.adresse && <p className="text-sm text-red-600">{errors.adresse}</p>}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}