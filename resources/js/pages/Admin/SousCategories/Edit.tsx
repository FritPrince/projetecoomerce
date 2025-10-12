import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface Categorie {
    id: number;
    nom: string;
}

interface SousCategorie {
    id: number;
    nom: string;
    description?: string;
    categorie_id: number;
    categorie: Categorie;
}

interface SousCategoriesEditProps {
    sousCategorie: SousCategorie;
    categories: Categorie[];
}

export default function SousCategoriesEdit({ sousCategorie, categories }: SousCategoriesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Sous-catégories',
            href: '/sous-categories',
        },
        {
            title: sousCategorie.nom,
            href: `/sous-categories/${sousCategorie.id}`,
        },
        {
            title: 'Modifier',
            href: `/sous-categories/${sousCategorie.id}/edit`,
        },
    ];

    const { data, setData, errors, put, processing } = useForm({
        nom: sousCategorie.nom,
        description: sousCategorie.description || '',
        categorie_id: sousCategorie.categorie_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/sous-categories/${sousCategorie.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${sousCategorie.nom}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/sous-categories/${sousCategorie.id}`}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Modifier la Sous-catégorie</h1>
                            <p className="text-muted-foreground">
                                Modifier les informations de {sousCategorie.nom}
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations de la Sous-catégorie</CardTitle>
                        <CardDescription>
                            Modifiez les informations de la sous-catégorie
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom de la sous-catégorie *</Label>
                                    <Input
                                        id="nom"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        placeholder="Smartphones, T-shirts, etc."
                                        required
                                    />
                                    {errors.nom && (
                                        <p className="text-sm text-red-600">{errors.nom}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categorie_id">Catégorie parente *</Label>
                                    <Select
                                        value={data.categorie_id}
                                        onValueChange={(value) => setData('categorie_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((categorie) => (
                                                <SelectItem key={categorie.id} value={categorie.id.toString()}>
                                                    {categorie.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categorie_id && (
                                        <p className="text-sm text-red-600">{errors.categorie_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description de la sous-catégorie..."
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" asChild>
                                    <Link href={`/sous-categories/${sousCategorie.id}`}>Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Modification...' : 'Modifier la sous-catégorie'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}