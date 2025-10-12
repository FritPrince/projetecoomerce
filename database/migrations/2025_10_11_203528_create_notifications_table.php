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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Type de notification (nouvelle_commande, stock_faible, etc.)
            $table->string('title'); // Titre de la notification
            $table->text('message'); // Message de la notification
            $table->json('data')->nullable(); // Données supplémentaires (JSON)
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Utilisateur destinataire
            $table->boolean('read')->default(false); // Statut de lecture
            $table->timestamp('read_at')->nullable(); // Date de lecture
            $table->timestamps();
            
            // Index pour optimiser les requêtes
            $table->index(['user_id', 'read']);
            $table->index(['type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
