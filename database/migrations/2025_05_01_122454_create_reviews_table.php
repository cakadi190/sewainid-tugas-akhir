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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedInteger('user_id')->nullable()->index();
            $table->unsignedInteger('car_data_id')->nullable()->index();

            $table->unsignedTinyInteger('rating', false)->default(0)->comment('Rating antara angka 1 s/d 10');
            $table->text('description')->nullable();

            $table->foreign('car_data_id')->references('id')->on('car_data')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
