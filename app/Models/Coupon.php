<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'minimum_amount',
        'usage_limit',
        'used_count',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Scope pour les coupons actifs
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where(function ($q) {
                        $q->whereNull('starts_at')
                          ->orWhere('starts_at', '<=', now());
                    })
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>=', now());
                    });
    }

    // Scope pour les coupons disponibles (pas de limite d'usage atteinte)
    public function scopeAvailable($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('usage_limit')
              ->orWhereRaw('used_count < usage_limit');
        });
    }

    // Vérifier si le coupon est valide
    public function isValid()
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    // Vérifier si le coupon peut être appliqué à un montant
    public function canBeAppliedTo($amount)
    {
        if (!$this->isValid()) {
            return false;
        }

        if ($this->minimum_amount && $amount < $this->minimum_amount) {
            return false;
        }

        return true;
    }

    // Calculer la réduction pour un montant donné
    public function calculateDiscount($amount)
    {
        if (!$this->canBeAppliedTo($amount)) {
            return 0;
        }

        if ($this->type === 'percentage') {
            return ($amount * $this->value) / 100;
        }

        return min($this->value, $amount); // Ne pas dépasser le montant de la commande
    }

    // Incrémenter le compteur d'utilisation
    public function incrementUsage()
    {
        $this->increment('used_count');
    }

    // Décrémenter le compteur d'utilisation
    public function decrementUsage()
    {
        if ($this->used_count > 0) {
            $this->decrement('used_count');
        }
    }

    // Obtenir le statut du coupon
    public function getStatusAttribute()
    {
        if (!$this->is_active) {
            return 'inactive';
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return 'scheduled';
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return 'expired';
        }

        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return 'limit_reached';
        }

        return 'active';
    }

    // Obtenir le statut formaté
    public function getFormattedStatusAttribute()
    {
        $statuses = [
            'inactive' => 'Inactif',
            'scheduled' => 'Programmé',
            'expired' => 'Expiré',
            'limit_reached' => 'Limite atteinte',
            'active' => 'Actif',
        ];

        return $statuses[$this->status] ?? 'Inconnu';
    }

    // Obtenir la description de la réduction
    public function getDiscountDescriptionAttribute()
    {
        if ($this->type === 'percentage') {
            return "{$this->value}% de réduction";
        }

        return "{$this->value}€ de réduction";
    }
}