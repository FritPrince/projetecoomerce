import ClientLayout from '@/layouts/ClientLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, X, Calendar, Euro, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Produit {
    id: number;
    nom: string;
    prix: number;
    image?: string;
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

interface CommandesProps {
    commandes: {
        data: Commande[];
        links: any[];
        meta: any;
    };
}

const getStatutBadge = (statut: string) => {
    const statutConfig = {
        'en_attente': { variant: 'secondary' as const, label: 'En attente', icon: Clock },
        'confirmee': { variant: 'default' as const, label: 'Confirmée', icon: CheckCircle },
        'expediee': { variant: 'default' as const, label: 'Expédiée', icon: Truck },
        'livree': { variant: 'default' as const, label: 'Livrée', icon: CheckCircle },
        'annulee': { variant: 'destructive' as const, label: 'Annulée', icon: X },
    };
    
    const config = statutConfig[statut as keyof typeof statutConfig] || { 
        variant: 'secondary' as const, 
        label: statut, 
        icon: AlertCircle 
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

export default function CommandesIndex({ commandes }: CommandesProps) {
    const annulerCommande = (commandeId: number) => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            router.post(`/mes-commandes/${commandeId}/cancel`, {}, {
                onSuccess: () => {
                    // La page sera rechargée automatiquement
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

    return (
        <ClientLayout>
            <Head title="Mes Commandes" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
                        <p className="mt-2 text-gray-600">
                            Consultez l'historique de vos commandes et suivez leur statut
                        </p>
                    </div>

                    {commandes.data.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande</h3>
                                <p className="text-gray-500 mb-6">
                                    Vous n'avez encore passé aucune commande.
                                </p>
                                <Button asChild>
                                    <Link href="/">
                                        Découvrir nos produits
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {commandes.data.map((commande) => (
                                <Card key={commande.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Package className="h-5 w-5" />
                                                    Commande {commande.numero_commande}
                                                </CardTitle>
                                                <CardDescription>
                                                    Passée le {formatDate(commande.date_commande)}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {getStatutBadge(commande.statut)}
                                                <div className="text-right">
                                                <div className="text-lg font-semibold text-primary">
                                                    {Number(commande.total).toFixed(2)} €
                                                </div>
                                                    <div className="text-sm text-gray-500">
                                                        {commande.ligne_commandes.length} article(s)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Produits de la commande */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {commande.ligne_commandes.map((ligne) => (
                                                    <div key={ligne.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            {ligne.produit.image_url ? (
                                                                    <img
                                                                        src={ligne.produit.image_url}
                                                                        alt={ligne.produit.nom}
                                                                        className="w-16 h-16 object-cover rounded"
                                                                    />
                                                            ) : (
                                                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                        <Package className="h-8 w-8 text-gray-400" />
                                                                    </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {ligne.produit.nom}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {ligne.produit.sous_categorie.categorie.nom} • {ligne.produit.sous_categorie.nom}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {ligne.quantite} × {Number(ligne.prix_unitaire).toFixed(2)} €
                                                            </p>
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {Number(ligne.sous_total).toFixed(2)} €
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Commande passée le {formatDate(commande.created_at)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/mes-commandes/${commande.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Voir les détails
                                                        </Link>
                                                    </Button>
                                                    {canCancel(commande.statut) && (
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => annulerCommande(commande.id)}
                                                            className="text-red-600 hover:text-red-700 hover:border-red-500"
                                                        >
                                                            <X className="h-4 w-4 mr-2" />
                                                            Annuler
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}