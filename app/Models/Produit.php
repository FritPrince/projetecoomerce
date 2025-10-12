<?php
// app/Models/Produit.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description', 'prix', 'stock', 'image', 'sous_categorie_id'];

    protected $casts = [
        'prix' => 'decimal:2',
        'note_moyenne' => 'float',
        'stock' => 'integer',
    ];

    public function sousCategorie()
    {
        return $this->belongsTo(SousCategorie::class);
    }

    public function commandes()
    {
        return $this->belongsToMany(Commande::class, 'ligne_commandes')
                    ->withPivot('quantite', 'prix_unitaire', 'sous_total')
                    ->withTimestamps();
    }

    public function paiements()
    {
        return $this->belongsToMany(Paiement::class, 'paiement_produit')
                    ->withPivot('montant_alloue')
                    ->withTimestamps();
    }

    public function favoris()
    {
        return $this->hasMany(Favori::class);
    }

    public function ligneCommandes()
    {
        return $this->hasMany(LigneCommande::class);
    }

    // Accessor pour compatibilité avec le frontend
    public function getQuantiteStockAttribute()
    {
        return $this->stock;
    }

    // Accessor pour l'URL de l'image
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return 'https://via.placeholder.com/300x400?text=Produit';
    }

    // Scope pour les produits en stock
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    // Scope pour les produits avec stock faible
    public function scopeLowStock($query, $threshold = 5)
    {
        return $query->where('stock', '<=', $threshold)->where('stock', '>', 0);
    }

    // Scope pour les produits en rupture de stock
    public function scopeOutOfStock($query)
    {
        return $query->where('stock', '<=', 0);
    }

    // Méthode pour vérifier si le produit est en stock
    public function isInStock()
    {
        return $this->stock > 0;
    }

    // Méthode pour vérifier si le stock est faible
    public function isLowStock($threshold = 5)
    {
        return $this->stock <= $threshold && $this->stock > 0;
    }

    // Méthode pour vérifier si le produit est en rupture
    public function isOutOfStock()
    {
        return $this->stock <= 0;
    }

    // Méthode pour calculer le prix avec TVA
    public function getPriceWithTax($taxRate = 0.20)
    {
        return $this->prix * (1 + $taxRate);
    }

    // Méthode pour formater le prix
    public function getFormattedPrice()
    {
        return number_format($this->prix, 2, ',', ' ') . ' €';
    }
}