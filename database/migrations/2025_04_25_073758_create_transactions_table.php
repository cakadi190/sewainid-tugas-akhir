<?php

use App\Enums\TransactionStatusEnum;
use App\Models\Transaction;
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
        Schema::create('transactions', function (Blueprint $table) {
            $table->string('id', 48)->primary();

            $table->enum('status', Transaction::getAllStatus()->toArray())->default(TransactionStatusEnum::UNPAID);

            $table->timestamp('confirmed_at')->nullable();
            $table->string('payment_channel', 8)->nullable();
            $table->string('payment_references', 128)->nullable();

            $table->integer('total_price')->default(0);
            $table->integer('total_pay')->default(0);

            $table->timestamp('pickup_date')->nullable();
            $table->timestamp('return_date')->nullable();
            $table->timestamp('expired_at')->nullable();

            $table->timestamps();

            $table->foreignId('car_data_id')->constrained('car_data')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
