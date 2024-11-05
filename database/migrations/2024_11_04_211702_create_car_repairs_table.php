<?php

use App\Models\CarData;
use App\Models\RepairShopData;
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
        Schema::create('car_repairs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId(generateForeignKeyString(CarData::class))->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId(generateForeignKeyString(RepairShopData::class))->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->text('repair_detail')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_repairs');
    }
};
