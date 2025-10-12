<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_commandes_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->string('numero_commande')->unique();
            $table->date('date_commande');
            $table->enum('statut', ['en_attente', 'confirmee', 'expediee', 'livree', 'annulee', 'panier'])->default('en_attente');
            $table->decimal('total', 10, 2);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('commandes');
    }
};