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
            $table->string('engine_number')->unique();
            $table->string('license_plate')->unique();
            $table->date('license_plate_expiration')->useCurrent()->useCurrentOnUpdate();
            $table->string('vehicle_registration_cert_number')->unique();
            $table->date('vehicle_registration_cert_expiration')->useCurrent()->useCurrentOnUpdate();
            $table->string('color');
            $table->unsignedInteger('year_of_manufacture');
            $table->enum('transmission', CarData::getAllCarTransmission()->toArray());
            $table->enum('model', CarData::getAllCarModels()->toArray());
            $table->enum('status', CarData::getAllCarStatuses()->toArray());
            $table->text('description')->nullable();
            $table->unsignedInteger('doors')->default(0);
            $table->unsignedInteger('seats')->default(0);
            $table->unsignedInteger('max_speed')->default(0);
            $table->unsignedInteger('big_luggage')->default(0);
            $table->unsignedInteger('med_luggage')->default(0);
            $table->unsignedInteger('small_luggage')->default(0);
            $table->boolean('ac')->default(true);
            $table->boolean('audio')->default(true);
            $table->boolean('abs')->default(true);
            $table->boolean('child_lock')->default(true);
            $table->boolean('traction_control')->default(true);
            $table->boolean('baby_seat')->default(true);
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
