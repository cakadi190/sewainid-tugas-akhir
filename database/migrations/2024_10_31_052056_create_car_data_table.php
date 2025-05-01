<?php

use App\Enums\CarConditionEnum;
use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;
use App\Enums\CarTransmissionEnum;
use App\Enums\FuelTypeEnum;
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
            $table->increments('id')->primary();
            $table->timestamps();

            $table->string('car_name', 50);
            $table->string('brand', 50)->comment('Misal: Toyota, Suzuki, Honda, Mercy')->index();
            $table->string('frame_number', 20)->unique()->index();
            $table->string('engine_number', 20)->unique()->index();
            $table->string('license_plate', 20)->unique()->index();
            $table->date('license_plate_expiration')->useCurrent()->useCurrentOnUpdate();
            $table->string('vehicle_registration_cert_number', 20)->unique()->index()->nullable();
            $table->string('vehicle_ownership_book_number', 10)->unique()->index()->nullable();
            $table->date('vehicle_registration_cert_expiration')->useCurrent()->useCurrentOnUpdate();
            $table->string('color', 20);
            $table->unsignedInteger('year_of_manufacture')->default(0);
            $table->enum('transmission', CarData::getAllCarTransmission()->toArray())->default(CarTransmissionEnum::MT->value);
            $table->enum('model', CarData::getAllCarModels()->toArray())->default(CarModelEnum::SUV->value);
            $table->enum('status', CarData::getAllCarStatuses()->toArray())->default(CarStatusEnum::READY->value);
            $table->enum('fuel_type', CarData::getAllCarFuelEnum()->toArray())->default(FuelTypeEnum::GASOLINE->value);
            $table->enum('condition', CarData::getAllCarCondition()->toArray())->default(CarConditionEnum::EXCELLENT->value);
            $table->text('description')->nullable();
            $table->unsignedInteger('doors')->default(0);
            $table->unsignedInteger('seats')->default(0);
            $table->unsignedInteger('max_speed')->default(0);
            $table->unsignedInteger('big_luggage')->default(0);
            $table->unsignedInteger('med_luggage')->default(0);
            $table->unsignedInteger('small_luggage')->default(0);
            $table->unsignedInteger('mileage')->default(0);
            $table->boolean('ac')->default(true);
            $table->boolean('audio')->default(true);
            $table->boolean('abs')->default(true);
            $table->boolean('child_lock')->default(true);
            $table->boolean('traction_control')->default(true);
            $table->boolean('baby_seat')->default(true);
            $table->integer('rent_price')->default(0);
            $table->string('gps_imei', 16)->nullable();
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

