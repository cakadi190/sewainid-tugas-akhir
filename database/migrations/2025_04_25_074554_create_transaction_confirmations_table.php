<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_confirmations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('transaction_receipt', 128);
            $table->string('transaction_id', 48);
            $table->foreign('transaction_id')->references('id')->on('transactions')->cascadeOnDelete()->cascadeOnUpdate();

            // User yang melakukan transaksi
            $table->unsignedInteger('user_id')->nullable()->index();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();

            // Data sopir (opsional)
            $table->unsignedInteger('driver_id')->nullable()->index();
            $table->foreign('driver_id')->references('id')->on('users')->nullOnDelete();

            // Data kernet (opsional)
            $table->unsignedInteger('conductor_id')->nullable()->index();
            $table->foreign('conductor_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_confirmations');
    }
};
