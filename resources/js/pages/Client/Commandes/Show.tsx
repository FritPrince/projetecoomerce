import ClientLayout from '@/layouts/ClientLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Calendar, Euro, Truck, CheckCircle, Clock, AlertCircle, X, MapPin, Phone } from 'lucide-react';

interface Produit {
    id: number;
    nom: string;
    prix: number;
    image_url?: string;
    sous_categorie: {
        nom: string;
        categorie: {
            nom: string;
        };
    };
}

interface LigneCommande {
    id: number;
    quantite: number;
    prix_unitaire: number;
    sous_total: number;
    produit: Produit;
}

interface Commande {
    id: number;
    numero_commande: string;
    date_commande: string;
    statut: string;
    total: number;
    ligne_commandes: LigneCommande[];
    created_at: string;
    updated_at: string;
}

interface CommandeShowProps {
    commande: Commande;
}

const getStatutBadge = (statut: string) => {
    const statutConfig = {
        'en_attente': { variant: 'secondary' as const, label: 'En attente', icon: Clock, color: 'text-yellow-600' },
        'confirmee': { variant: 'default' as const, label: 'Confirmée', icon: CheckCircle, color: 'text-blue-600' },
        'expediee': { variant: 'default' as const, label: 'Expédiée', icon: Truck, color: 'text-purple-600' },
        'livree': { variant: 'default' as const, label: 'Livrée', icon: CheckCircle, color: 'text-green-600' },
        'annulee': { variant: 'destructive' as const, label: 'Annulée', icon: X, color: 'text-red-600' },
    };
    
    const config = statutConfig[statut as keyof typeof statutConfig] || { 
        variant: 'secondary' as const, 
        label: statut, 
        icon: AlertCircle,
        color: 'text-gray-600'
    };
    
    return (
        <Badge variant={config.variant} className="flex items-center gap-1">
            <config.icon className="h-3 w-3" />
            {config.label}
        </Badge>
    );
};

const canCancel = (statut: string) => {
    return ['en_attente', 'confirmee'].includes(statut);
};

export default function CommandeShow({ commande }: CommandeShowProps) {
    const annulerCommande = () => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
                router.post(`/mes-commandes/${commande.id}/cancel`, {}, {
                    onSuccess: () => {
                        // Rediriger vers la liste des commandes
                        router.visit('/mes-commandes');
                    }
                });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatutDescription = (statut: string) => {
        const descriptions = {
            'en_attente': 'Votre commande est en cours de traitement. Nous vous confirmerons la commande sous peu.',
            'confirmee': 'Votre commande a été confirmée et est en préparation.',
            'expediee': 'Votre commande a été expédiée et est en cours de livraison.',
            'livree': 'Votre commande a été livrée avec succès.',
            'annulee': 'Cette commande a été annulée.',
        };
        
        return descriptions[statut as keyof typeof descriptions] || 'Statut inconnu';
    };

    return (
        <ClientLayout>
            <Head title={`Commande ${commande.numero_commande}`} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/mes-commandes" className="flex items-center text-gray-600 hover:text-primary mb-4">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Retour aux commandes
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Commande {commande.numero_commande}
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Passée le {formatDate(commande.date_commande)}
                                </p>
                            </div>
                            <div className="text-right">
                                {getStatutBadge(commande.statut)}
                                <div className="mt-2 text-lg font-semibold text-primary">
                                    {Number(commande.total).toFixed(2)} €
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Détails de la commande */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Statut de la commande */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Statut de la commande
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {getStatutBadge(commande.statut)}
                                            <span className="text-sm text-gray-600">
                                                {getStatutDescription(commande.statut)}
                                            </span>
                                        </div>
                                        
                                        {canCancel(commande.statut) && (
                                            <div className="pt-4 border-t">
                                                <Button 
                                                    variant="outline"
                                                    onClick={annulerCommande}
                                                    className="text-red-600 hover:text-red-700 hover:border-red-500"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Annuler la commande
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Produits de la commande */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Articles commandés</CardTitle>
                                    <CardDescription>
                                        {commande.ligne_commandes.length} article(s) dans cette commande
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {commande.ligne_commandes.map((ligne) => (
                                            <div key={ligne.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    {ligne.produit.image_url ? (
                                                        <img
                                                            src={ligne.produit.image_url}
                                                            alt={ligne.produit.nom}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">{ligne.produit.nom}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {ligne.produit.sous_categorie.categorie.nom} • {ligne.produit.sous_categorie.nom}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Quantité: {ligne.quantite}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">
                                                        {Number(ligne.prix_unitaire).toFixed(2)} € × {ligne.quantite}
                                                    </div>
                                                    <div className="font-medium text-gray-900">
                                                        {Number(ligne.sous_total).toFixed(2)} €
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Informations de livraison */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Adresse de livraison
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-600">
                                        <p>Adresse par défaut</p>
                                        <p className="mt-2 text-gray-500">
                                            Les détails d'adresse seront affichés ici
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5" />
                                        Contact
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-600">
                                        <p>Pour toute question concernant cette commande,</p>
                                        <p className="mt-2">contactez notre service client.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Euro className="h-5 w-5" />
                                        Résumé de la commande
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Sous-total</span>
                                            <span>{Number(commande.total).toFixed(2)} €</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Livraison</span>
                                            <span>Gratuite</span>
                                        </div>
                                        <div className="flex justify-between font-medium text-lg pt-2 border-t">
                                            <span>Total</span>
                                            <span>{Number(commande.total).toFixed(2)} €</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
