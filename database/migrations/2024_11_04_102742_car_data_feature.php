<?php

use App\Models\CarData;
use App\Models\CarFeatureData;
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
        Schema::create('car_data_feature', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId(generateForeignKeyString(CarData::class))->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId(generateForeignKeyString(CarFeatureData::class))->constrained()->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_data_feature');
    }
};
