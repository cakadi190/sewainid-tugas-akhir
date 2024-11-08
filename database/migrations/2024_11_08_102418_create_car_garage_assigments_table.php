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
        Schema::create('car_garage_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_data_id')->constrained('car_data')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('from_garage_id')->constrained('garage_data')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('to_garage_id')->constrained('garage_data')->onDelete('cascade')->onUpdate('cascade');
            $table->date('assignment_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_garage_assigments');
    }
};
