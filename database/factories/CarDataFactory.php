<?php

namespace Database\Factories;

use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;
use App\Enums\CarTransmissionEnum;
use App\Helpers\IndonesianVinGenerator;
use App\Helpers\LicensePlateNumberGenerator;
use App\Models\CarData;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarData>
 */
class CarDataFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CarData::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $carLicensePlateGenerator = new LicensePlateNumberGenerator;
        $frameNumber = IndonesianVinGenerator::generateVin();
        $engineNumber = IndonesianVinGenerator::generateVin();

        return [
            'car_name' => $this->faker->word,
            'brand' => $this->faker->word,
            'frame_number' => $frameNumber,
            'engine_number' => $engineNumber,
            'license_plate' => $carLicensePlateGenerator->generateLicensePlate('Jawa Timur'),
            'license_plate_expiration' => $this->faker->date(),
            'vehicle_registration_cert_number' => Str::random(20),
            'vehicle_registration_cert_expiration' => $this->faker->date(),
            'color' => $this->faker->colorName,
            'year_of_manufacture' => $this->faker->year,
            'transmission' => $this->faker->randomElement(CarTransmissionEnum::cases()),
            'model' => $this->faker->randomElement(CarModelEnum::cases()),
            'status' => $this->faker->randomElement(CarStatusEnum::cases()),
            'description' => $this->faker->sentence,
            'doors' => $this->faker->numberBetween(2, 5),
            'seats' => $this->faker->numberBetween(2, 8),
            'max_speed' => $this->faker->numberBetween(100, 200),
            'big_luggage' => $this->faker->numberBetween(1, 5),
            'med_luggage' => $this->faker->numberBetween(1, 5),
            'small_luggage' => $this->faker->numberBetween(1, 5),
            'ac' => $this->faker->boolean(),
            'audio' => $this->faker->boolean(),
            'abs' => $this->faker->boolean(),
            'child_lock' => $this->faker->boolean(),
            'traction_control' => $this->faker->boolean(),
            'baby_seat' => $this->faker->boolean(),
        ];
    }
}
