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

            $table->longText('description')->nullable();
            $table->unsignedBigInteger('mileage')->nullable();
            $table->enum('type', UsageNoteData::getAllType()->toArray())->default(UsageNoteTypeEnum::NORMAL);

            $table->unsignedInteger('user_id')->nullable()->index();
            $table->unsignedInteger('car_data_id')->nullable()->index();

            $table->string('transaction_id', 48)->nullable()->index();

            $table->foreign('car_data_id')->references('id')->on('car_data')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
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
