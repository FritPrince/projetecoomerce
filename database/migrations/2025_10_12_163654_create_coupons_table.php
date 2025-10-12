<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed']); // Pourcentage ou montant fixe
            $table->decimal('value', 10, 2); // Valeur de la réduction
            $table->decimal('minimum_amount', 10, 2)->nullable(); // Montant minimum de commande
            $table->integer('usage_limit')->nullable(); // Limite d'utilisation
            $table->integer('used_count')->default(0); // Nombre d'utilisations
            $table->datetime('starts_at')->nullable(); // Date de début
            $table->datetime('expires_at')->nullable(); // Date d'expiration
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
