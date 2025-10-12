<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ParametresController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:admin');
    }

    public function index()
    {
        // Paramètres actuels (simulés)
        $settings = [
            'general' => [
                'shop_name' => 'Ma Boutique E-commerce',
                'shop_email' => 'contact@maboutique.com',
                'shop_description' => 'Votre boutique en ligne de confiance',
                'shop_address' => '123 Rue de la Paix, 75001 Paris',
                'shop_phone' => '+33 1 23 45 67 89',
            ],
            'payment' => [
                'stripe_enabled' => true,
                'paypal_enabled' => true,
                'bank_transfer_enabled' => false,
                'stripe_public_key' => 'pk_test_...',
                'stripe_secret_key' => 'sk_test_...',
            ],
            'notifications' => [
                'new_orders' => true,
                'payments_received' => true,
                'low_stock' => true,
                'email_notifications' => true,
                'sms_notifications' => false,
            ],
            'security' => [
                'session_timeout' => 120,
                'max_login_attempts' => 5,
                'two_factor_required' => false,
                'password_min_length' => 8,
                'require_strong_passwords' => true,
            ],
            'appearance' => [
                'theme' => 'light',
                'primary_color' => '#3b82f6',
                'logo_url' => null,
                'favicon_url' => null,
            ],
        ];

        return Inertia::render('Admin/Parametres/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'section' => 'required|string|in:general,payment,notifications,security,appearance',
            'settings' => 'required|array',
        ]);

        $section = $request->section;
        $settings = $request->settings;

        // Ici, vous pourriez sauvegarder les paramètres en base de données
        // Pour l'instant, on simule juste la sauvegarde

        return response()->json([
            'success' => true,
            'message' => 'Paramètres mis à jour avec succès',
            'section' => $section,
            'updated_settings' => $settings,
        ]);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            
            return response()->json([
                'success' => true,
                'message' => 'Logo uploadé avec succès',
                'logo_url' => Storage::url($path),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'upload du logo',
        ], 400);
    }

    public function testEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Ici, vous pourriez envoyer un email de test
        // Pour l'instant, on simule juste l'envoi

        return response()->json([
            'success' => true,
            'message' => 'Email de test envoyé avec succès',
        ]);
    }
}
