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
        Schema::create('transaction_confirmations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('transaction_receipt', 48);

            $table->string('transaction_id', 48);
            $table->foreign('transaction_id')->references('id')->on('transactions')->cascadeOnDelete()->cascadeOnUpdate();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_confirmations');
    }
};
