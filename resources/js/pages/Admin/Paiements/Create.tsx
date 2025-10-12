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
        title: 'Paiements',
        href: '/paiements',
    },
    {
        title: 'Nouveau Paiement',
        href: '/paiements/create',
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
}

interface ProduitSelectionne {
    id: number;
    montant_alloue: number;
    nom: string;
}

interface PaiementsCreateProps {
    clients: User[];
    produits: Produit[];
}

export default function PaiementsCreate({ clients, produits }: PaiementsCreateProps) {
    const [produitsSelectionnes, setProduitsSelectionnes] = useState<ProduitSelectionne[]>([]);

    const { data, setData, errors, post, processing } = useForm({
        reference: `PAY-${Date.now()}`,
        montant: '',
        date_paiement: new Date().toISOString().split('T')[0],
        statut: 'en_attente',
        user_id: '',
        methode_paiement: {
            type: 'carte',
            details: ''
        },
        produits: [] as Array<{ id: number; montant_alloue: number }>,
    });

    const ajouterProduit = () => {
        setProduitsSelectionnes([...produitsSelectionnes, {
            id: 0,
            montant_alloue: 0,
            nom: ''
        }]);
    };

    const supprimerProduit = (index: number) => {
        const nouveauxProduits = produitsSelectionnes.filter((_, i) => i !== index);
        setProduitsSelectionnes(nouveauxProduits);
        setData('produits', nouveauxProduits.map(p => ({ id: p.id, montant_alloue: p.montant_alloue })));
    };

    const mettreAJourProduit = (index: number, produitId: number, montantAlloue: number) => {
        const produit = produits.find(p => p.id === produitId);
        const nouveauxProduits = [...produitsSelectionnes];
        
        if (produit) {
            nouveauxProduits[index] = {
                id: produitId,
                montant_alloue: montantAlloue,
                nom: produit.nom
            };
        } else {
            nouveauxProduits[index] = {
                id: produitId,
                montant_alloue: montantAlloue,
                nom: ''
            };
        }

        setProduitsSelectionnes(nouveauxProduits);
        setData('produits', nouveauxProduits.map(p => ({ id: p.id, montant_alloue: p.montant_alloue })));

        // Recalculer le montant total
        const total = nouveauxProduits.reduce((sum, produit) => sum + produit.montant_alloue, 0);
        setData('montant', total.toString());
    };

    const total = produitsSelectionnes.reduce((sum, produit) => sum + produit.montant_alloue, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/paiements');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un Paiement" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/paiements">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Créer un Paiement</h1>
                            <p className="text-muted-foreground">
                                Enregistrer un nouveau paiement pour un client
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du Paiement</CardTitle>
                        <CardDescription>
                            Remplissez les informations pour créer un nouveau paiement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="reference">Référence *</Label>
                                    <Input
                                        id="reference"
                                        value={data.reference}
                                        onChange={(e) => setData('reference', e.target.value)}
                                        required
                                    />
                                    {errors.reference && (
                                        <p className="text-sm text-red-600">{errors.reference}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_paiement">Date de paiement *</Label>
                                    <Input
                                        id="date_paiement"
                                        type="date"
                                        value={data.date_paiement}
                                        onChange={(e) => setData('date_paiement', e.target.value)}
                                        required
                                    />
                                    {errors.date_paiement && (
                                        <p className="text-sm text-red-600">{errors.date_paiement}</p>
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
                                            <SelectItem value="paye">Payé</SelectItem>
                                            <SelectItem value="echec">Échec</SelectItem>
                                            <SelectItem value="rembourse">Remboursé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.statut && (
                                        <p className="text-sm text-red-600">{errors.statut}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="methode_type">Méthode de paiement *</Label>
                                    <Select
                                        value={data.methode_paiement.type}
                                        onValueChange={(value) => setData('methode_paiement', { ...data.methode_paiement, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une méthode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="carte">Carte bancaire</SelectItem>
                                            <SelectItem value="virement">Virement</SelectItem>
                                            <SelectItem value="paypal">PayPal</SelectItem>
                                            <SelectItem value="especes">Espèces</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors['methode_paiement.type'] && (
                                        <p className="text-sm text-red-600">{errors['methode_paiement.type']}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="montant">Montant total *</Label>
                                    <Input
                                        id="montant"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.montant}
                                        onChange={(e) => setData('montant', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.montant && (
                                        <p className="text-sm text-red-600">{errors.montant}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="methode_details">Détails de la méthode de paiement</Label>
                                <Input
                                    id="methode_details"
                                    value={data.methode_paiement.details}
                                    onChange={(e) => setData('methode_paiement', { ...data.methode_paiement, details: e.target.value })}
                                    placeholder="Détails supplémentaires sur la méthode de paiement..."
                                />
                                {errors['methode_paiement.details'] && (
                                    <p className="text-sm text-red-600">{errors['methode_paiement.details']}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Produits associés</Label>
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
                                                onValueChange={(value) => mettreAJourProduit(index, parseInt(value), produit.montant_alloue)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez un produit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {produits.map((p) => (
                                                        <SelectItem key={p.id} value={p.id.toString()}>
                                                            {p.nom} - {p.prix} €
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Montant alloué (€)</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={produit.montant_alloue}
                                                onChange={(e) => mettreAJourProduit(index, produit.id, parseFloat(e.target.value) || 0)}
                                            />
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
                                        <Link href="/paiements">Annuler</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing || produitsSelectionnes.length === 0}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? 'Création...' : 'Créer le paiement'}
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