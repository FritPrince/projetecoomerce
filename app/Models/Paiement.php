<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = ['reference', 'montant', 'date_paiement', 'statut', 'user_id'];

    protected $casts = [
        'date_paiement' => 'date',
    ];

    // Changement: belongsTo User au lieu de Client
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function methodesPaiement()
    {
        return $this->hasMany(MethodePaiement::class);
    }

    public function produits()
    {
        return $this->belongsToMany(Produit::class, 'paiement_produit')
                    ->withPivot('montant_alloue')
                    ->withTimestamps();
    }
}