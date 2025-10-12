<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME10',
                'name' => 'Bienvenue - 10% de réduction',
                'description' => 'Réduction de 10% pour les nouveaux clients',
                'type' => 'percentage',
                'value' => 10,
                'minimum_amount' => 50,
                'usage_limit' => 1000,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'code' => 'SAVE20',
                'name' => 'Économisez 20€',
                'description' => 'Réduction de 20€ sur votre commande',
                'type' => 'fixed',
                'value' => 20,
                'minimum_amount' => 100,
                'usage_limit' => 500,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(2),
                'is_active' => true,
            ],
            [
                'code' => 'SUMMER15',
                'name' => 'Collection été - 15% de réduction',
                'description' => 'Réduction de 15% sur la collection été',
                'type' => 'percentage',
                'value' => 15,
                'minimum_amount' => 75,
                'usage_limit' => 200,
                'starts_at' => now(),
                'expires_at' => now()->addMonth(),
                'is_active' => true,
            ],
            [
                'code' => 'FIRST50',
                'name' => 'Première commande - 50€ de réduction',
                'description' => 'Réduction de 50€ sur votre première commande',
                'type' => 'fixed',
                'value' => 50,
                'minimum_amount' => 200,
                'usage_limit' => 100,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(6),
                'is_active' => true,
            ],
            [
                'code' => 'VIP25',
                'name' => 'Client VIP - 25% de réduction',
                'description' => 'Réduction de 25% pour les clients VIP',
                'type' => 'percentage',
                'value' => 25,
                'minimum_amount' => 150,
                'usage_limit' => 50,
                'starts_at' => now(),
                'expires_at' => now()->addYear(),
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $couponData) {
            Coupon::create($couponData);
        }
    }
}