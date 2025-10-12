import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Produits',
        href: '/produits',
    },
    {
        title: 'Nouveau Produit',
        href: '/produits/create',
    },
];

interface Categorie {
    id: number;
    nom: string;
}

interface SousCategorie {
    id: number;
    nom: string;
    categorie: Categorie;
}

interface ProduitsCreateProps {
    sousCategories: SousCategorie[];
}

export default function ProduitsCreate({ sousCategories }: ProduitsCreateProps) {
    const { data, setData, errors, post, processing } = useForm({
        nom: '',
        description: '',
        prix: '',
        stock: '',
        image: null as File | null,
        sous_categorie_id: '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/produits', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un Produit" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/produits">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Créer un Produit</h1>
                            <p className="text-muted-foreground">
                                Ajouter un nouveau produit au catalogue
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du Produit</CardTitle>
                        <CardDescription>
                            Remplissez les informations pour créer un nouveau produit
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom du produit *</Label>
                                    <Input
                                        id="nom"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        placeholder="Nom du produit"
                                        required
                                    />
                                    {errors.nom && (
                                        <p className="text-sm text-red-600">{errors.nom}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sous_categorie_id">Sous-catégorie *</Label>
                                    <Select
                                        value={data.sous_categorie_id}
                                        onValueChange={(value) => setData('sous_categorie_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sousCategories.map((sousCategorie) => (
                                                <SelectItem key={sousCategorie.id} value={sousCategorie.id.toString()}>
                                                    {sousCategorie.categorie.nom} - {sousCategorie.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.sous_categorie_id && (
                                        <p className="text-sm text-red-600">{errors.sous_categorie_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="prix">Prix (€) *</Label>
                                    <Input
                                        id="prix"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.prix}
                                        onChange={(e) => setData('prix', e.target.value)}
                                        placeholder="19.99"
                                        required
                                    />
                                    {errors.prix && (
                                        <p className="text-sm text-red-600">{errors.prix}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock *</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        placeholder="100"
                                        required
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-red-600">{errors.stock}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description du produit..."
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image du produit</Label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {errors.image && (
                                            <p className="text-sm text-red-600">{errors.image}</p>
                                        )}
                                    </div>
                                    {imagePreview && (
                                        <div className="w-20 h-20 border rounded-lg overflow-hidden">
                                            <img 
                                                src={imagePreview} 
                                                alt="Aperçu" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" asChild>
                                    <Link href="/produits">Annuler</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Création...' : 'Créer le produit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}