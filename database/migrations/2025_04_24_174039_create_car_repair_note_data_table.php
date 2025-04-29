<?php

use App\Enums\CarRepairNoteStatusEnum;
use App\Models\CarRepairNoteData;
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
            $table->increments('id')->primary();
            $table->timestamps();

            $table->date('repair_date');
            $table->text('description');
            $table->unsignedBigInteger('last_mileage')->nullable();
            $table->unsignedBigInteger('current_mileage')->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table->enum('status', CarRepairNoteData::getAllRepairStatus()->toArray())->default(CarRepairNoteStatusEnum::PENDING);
            $table->longText('notes')->nullable();
            $table->unsignedInteger('car_data_id')->nullable()->index();

            $table->foreign('car_data_id')->references('id')->on('car_data')->cascadeOnDelete()->cascadeOnUpdate();
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
