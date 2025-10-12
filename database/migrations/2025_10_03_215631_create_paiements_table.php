<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_paiements_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->decimal('montant', 10, 2);
            $table->date('date_paiement');
            $table->enum('statut', ['en_attente', 'paye', 'echec', 'rembourse'])->default('en_attente');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('paiements');
    }
};