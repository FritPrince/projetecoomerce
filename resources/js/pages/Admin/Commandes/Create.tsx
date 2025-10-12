import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Trash2, Euro } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Commandes',
        href: '/commandes',
    },
    {
        title: 'Nouvelle Commande',
        href: '/commandes/create',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface Produit {
    id: number;
    nom: string;
    prix: number;
    stock: number;
}

interface ProduitSelectionne {
    id: number;
    quantite: number;
    nom: string;
    prix: number;
    sousTotal: number;
}

interface CommandesCreateProps {
    clients: User[];
    produits: Produit[];
}

export default function CommandesCreate({ clients, produits }: CommandesCreateProps) {
    const [produitsSelectionnes, setProduitsSelectionnes] = useState<ProduitSelectionne[]>([]);

    const { data, setData, errors, post, processing } = useForm({
        numero_commande: `CMD-${Date.now()}`,
        date_commande: new Date().toISOString().split('T')[0],
        statut: 'en_attente',
        user_id: '',
        produits: [] as Array<{ id: number; quantite: number }>,
    });

    const ajouterProduit = () => {
        setProduitsSelectionnes([...produitsSelectionnes, {
            id: 0,
            quantite: 1,
            nom: '',
            prix: 0,
            sousTotal: 0
        }]);
    };

    const supprimerProduit = (index: number) => {
        const nouveauxProduits = produitsSelectionnes.filter((_, i) => i !== index);
        setProduitsSelectionnes(nouveauxProduits);
        setData('produits', nouveauxProduits.map(p => ({ id: p.id, quantite: p.quantite })));
    };

    const mettreAJourProduit = (index: number, produitId: number, quantite: number) => {
        const produit = produits.find(p => p.id === produitId);
        const nouveauxProduits = [...produitsSelectionnes];
        
        if (produit) {
            nouveauxProduits[index] = {
                id: produitId,
                quantite,
                nom: produit.nom,
                prix: produit.prix,
                sousTotal: produit.prix * quantite
            };
        } else {
            nouveauxProduits[index] = {
                id: produitId,
                quantite,
                nom: '',
                prix: 0,
                sousTotal: 0
            };
        }

        setProduitsSelectionnes(nouveauxProduits);
        setData('produits', nouveauxProduits.map(p => ({ id: p.id, quantite: p.quantite })));
    };

    const total = produitsSelectionnes.reduce((sum, produit) => sum + produit.sousTotal, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/commandes');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer une Commande" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/commandes">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Créer une Commande</h1>
                            <p className="text-muted-foreground">
                                Créer une nouvelle commande pour un client
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations de la Commande</CardTitle>
                        <CardDescription>
                            Remplissez les informations pour créer une nouvelle commande
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="numero_commande">Numéro de commande *</Label>
                                    <Input
                                        id="numero_commande"
                                        value={data.numero_commande}
                                        onChange={(e) => setData('numero_commande', e.target.value)}
                                        required
                                    />
                                    {errors.numero_commande && (
                                        <p className="text-sm text-red-600">{errors.numero_commande}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_commande">Date de commande *</Label>
                                    <Input
                                        id="date_commande"
                                        type="date"
                                        value={data.date_commande}
                                        onChange={(e) => setData('date_commande', e.target.value)}
                                        required
                                    />
                                    {errors.date_commande && (
                                        <p className="text-sm text-red-600">{errors.date_commande}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user_id">Client *</Label>
                                    <Select
                                        value={data.user_id}
                                        onValueChange={(value) => setData('user_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.name} - {client.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && (
                                        <p className="text-sm text-red-600">{errors.user_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="statut">Statut *</Label>
                                    <Select
                                        value={data.statut}
                                        onValueChange={(value) => setData('statut', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en_attente">En attente</SelectItem>
                                            <SelectItem value="confirmee">Confirmée</SelectItem>
                                            <SelectItem value="expediee">Expédiée</SelectItem>
                                            <SelectItem value="livree">Livrée</SelectItem>
                                            <SelectItem value="annulee">Annulée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.statut && (
                                        <p className="text-sm text-red-600">{errors.statut}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Produits de la commande</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={ajouterProduit}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Ajouter un produit
                                    </Button>
                                </div>

                                {produitsSelectionnes.map((produit, index) => (
                                    <div key={index} className="flex items-end space-x-4 p-4 border rounded-lg">
                                        <div className="flex-1 space-y-2">
                                            <Label>Produit</Label>
                                            <Select
                                                value={produit.id.toString()}
                                                onValueChange={(value) => mettreAJourProduit(index, parseInt(value), produit.quantite)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez un produit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {produits.map((p) => (
                                                        <SelectItem key={p.id} value={p.id.toString()}>
                                                            {p.nom} - {p.prix} € (Stock: {p.stock})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Quantité</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={produit.quantite}
                                                onChange={(e) => mettreAJourProduit(index, produit.id, parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Sous-total</Label>
                                            <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                                                <Euro className="h-4 w-4 text-muted-foreground" />
                                                <span>{produit.sousTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => supprimerProduit(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                {errors.produits && (
                                    <p className="text-sm text-red-600">{errors.produits}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="text-lg font-semibold">
                                    Total: {total.toFixed(2)} €
                                </div>
                                <div className="flex space-x-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/commandes">Annuler</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing || produitsSelectionnes.length === 0}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? 'Création...' : 'Créer la commande'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}