<?php

use App\Enums\RentalStatusEnum;
use App\Enums\TransactionStatusEnum;
use App\Models\Transaction;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->string('id', 48)->primary();

            $table->enum('status', Transaction::getAllStatus()->toArray())->default(TransactionStatusEnum::UNPAID);
            $table->enum('rental_status', Transaction::getAllRentalStatus()->toArray())->default(RentalStatusEnum::DRAFT);

            $table->timestamp('confirmed_at')->nullable();
            $table->string('payment_channel', 8)->nullable();
            $table->string('payment_references', 128)->nullable();
            $table->timestamp('expired_at')->nullable();

            $table->integer('total_price')->default(0);
            $table->integer('total_pay')->default(0);

            $table->timestamp('pickup_date')->nullable();
            $table->timestamp('return_date')->nullable();

            $table->string('place_name');
            $table->boolean('with_driver')->default(false);

            $table->decimal('longitude', 15, 13)->default(0.0000000000000);
            $table->decimal('latitude', 15, 13)->default(0.0000000000000);

            $table->timestamps();

            $table->unsignedInteger('user_id')->nullable()->index();
            $table->unsignedInteger('car_data_id')->nullable()->index();

            $table->foreign('car_data_id')->references('id')->on('car_data')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
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
