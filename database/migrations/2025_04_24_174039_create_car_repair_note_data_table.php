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
        Schema::create('car_repair_note_data', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->date('repair_date');
            $table->text('description');
            $table->decimal('cost', 10, 2);
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->longText('notes')->nullable();
            $table->foreignId('car_data_id')->constrained('car_data')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_repair_note_data');
    }
};
