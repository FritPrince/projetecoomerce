<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_methode_paiements_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('methode_paiements', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->text('details')->nullable();
            $table->foreignId('paiement_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('methode_paiements');
    }
};