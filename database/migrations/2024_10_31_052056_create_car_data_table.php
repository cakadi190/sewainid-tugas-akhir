<?php

use App\Models\CarData;
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
        Schema::create('car_data', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('name');
            $table->string('brand')->comment('Misal: Toyota, Suzuki, Honda, Mercy');
            $table->string('frame_number')->unique();
            $table->string('license_plate')->unique();
            $table->string('color');
            $table->unsignedInteger('year_of_manufacture');
            $table->enum('model', CarData::getAllCarModels()->toArray());
            $table->enum('status', CarData::getAllCarStatuses()->toArray());
            $table->text('description')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_data');
    }
};
