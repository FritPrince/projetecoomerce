<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = ['numero_commande', 'date_commande', 'statut', 'total', 'user_id'];

    protected $casts = [
        'date_commande' => 'date',
        'total' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function produits()
    {
        return $this->belongsToMany(Produit::class, 'ligne_commandes')
                    ->withPivot('quantite', 'prix_unitaire', 'sous_total')
                    ->withTimestamps();
    }

    public function ligneCommandes()
    {
        return $this->hasMany(LigneCommande::class);
    }

    // Scope pour les commandes en attente
    public function scopePending($query)
    {
        return $query->where('statut', 'en_attente');
    }

    // Scope pour les commandes confirmées
    public function scopeConfirmed($query)
    {
        return $query->where('statut', 'confirmee');
    }

    // Scope pour les commandes expédiées
    public function scopeShipped($query)
    {
        return $query->where('statut', 'expediee');
    }

    // Scope pour les commandes livrées
    public function scopeDelivered($query)
    {
        return $query->where('statut', 'livree');
    }

    // Scope pour les commandes annulées
    public function scopeCancelled($query)
    {
        return $query->where('statut', 'annulee');
    }

    // Méthode pour vérifier si la commande peut être annulée
    public function canBeCancelled()
    {
        return in_array($this->statut, ['en_attente', 'confirmee']);
    }

    // Méthode pour vérifier si la commande peut être expédiée
    public function canBeShipped()
    {
        return $this->statut === 'confirmee';
    }

    // Méthode pour vérifier si la commande peut être livrée
    public function canBeDelivered()
    {
        return $this->statut === 'expediee';
    }

    // Méthode pour calculer le total des taxes
    public function getTaxAmount($taxRate = 0.20)
    {
        return $this->total * $taxRate;
    }

    // Méthode pour calculer le total HT
    public function getSubtotal()
    {
        return $this->total / (1 + 0.20); // Supposons 20% de TVA
    }

    // Méthode pour formater le total
    public function getFormattedTotal()
    {
        return number_format($this->total, 2, ',', ' ') . ' €';
    }

    // Méthode pour obtenir le statut formaté
    public function getFormattedStatus()
    {
        $statuses = [
            'en_attente' => 'En attente',
            'confirmee' => 'Confirmée',
            'expediee' => 'Expédiée',
            'livree' => 'Livrée',
            'annulee' => 'Annulée'
        ];

        return $statuses[$this->statut] ?? 'Inconnu';
    }
}