<?php

use App\Enums\UsageNoteTypeEnum;
use App\Models\UsageNoteData;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usage_note_data', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('car_data_id')->nullable()->index();
            $table->unsignedBigInteger('transaction_id')->nullable()->index();
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('mileage')->nullable();
            $table->enum('type', UsageNoteData::getAllType()->toArray())->default(UsageNoteTypeEnum::NORMAL);

            $table->foreign('car_data_id')->references('id')->on('car_data')->nullOnDelete();
            $table->foreign('transaction_id')->references('id')->on('transactions')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usage_note_data');
    }
};

