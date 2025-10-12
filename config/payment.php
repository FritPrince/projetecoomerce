<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Payment Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for payment gateways including Stripe and PayPal
    |
    */

    'stripe' => [
        'public_key' => env('STRIPE_KEY'),
        'secret_key' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'currency' => 'eur',
    ],

    'paypal' => [
        'client_id' => env('PAYPAL_CLIENT_ID', 'your_paypal_client_id_here'),
        'client_secret' => env('PAYPAL_CLIENT_SECRET', 'your_paypal_client_secret_here'),
        'mode' => env('PAYPAL_MODE', 'sandbox'), // sandbox or live
        'currency' => 'EUR',
    ],

    'default_currency' => 'EUR',

];

