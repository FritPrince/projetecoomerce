<?php
// app/Models/Produit.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description', 'prix', 'stock', 'image', 'sous_categorie_id'];

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
}