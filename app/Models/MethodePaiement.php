<?php
// app/Models/MethodePaiement.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MethodePaiement extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'details', 'paiement_id'];

    public function paiement()
    {
        return $this->belongsTo(Paiement::class);
    }
}