<?php
// app/Models/Produit.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description', 'prix', 'stock', 'image', 'sous_categorie_id'];

    protected $appends = ['image_url'];

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
            // Check if the image is already a full URL
            if (filter_var($this->image, FILTER_VALIDATE_URL)) {
                return $this->image;
            }

            // If it's a relative path that starts with 'produits/', assume it's a local file.
            // This handles cases where the 'image' column might contain 'produits/image.jpg'
            // without the 'storage/' prefix.
            if (str_starts_with($this->image, 'produits/')) {
                return asset('storage/' . $this->image);
            }

            // If it's a path that already contains 'storage/', it means it was incorrectly saved with the prefix.
            // In this case, we should remove the 'storage/' prefix before passing it to asset().
            if (str_starts_with($this->image, 'storage/')) {
                return asset(str_replace('storage/', '', $this->image));
            }

            // As a fallback, assume it's a local file path that needs 'storage/' prepended.
            // This covers cases like 'image.jpg' directly in the public storage.
            return asset('storage/' . $this->image);
        }
        return 'https://placehold.co/600x400?text=produit';
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