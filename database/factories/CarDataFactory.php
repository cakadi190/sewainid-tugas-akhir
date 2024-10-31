<?php

namespace Database\Factories;

use App\Helpers\IndonesianVinGenerator;
use App\Helpers\LicensePlateNumberGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CarData;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarData>
 */
class CarDataFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $carLicensePlateGenerator = new LicensePlateNumberGenerator();
        $frameNumber = IndonesianVinGenerator::generateVin();

        return [
            'name' => $this->faker->word,
            'brand' => $this->faker->word,
            'frame_number' => $frameNumber,
            'license_plate' => $carLicensePlateGenerator->generateLicensePlate('Jawa Timur'),
            'color' => $this->faker->colorName,
            'year_of_manufacture' => $this->faker->year,
            'model' => $this->faker->randomElement(CarData::getAllCarModels()->toArray()),
            'status' => $this->faker->randomElement(CarData::getAllCarStatuses()->toArray()),
            'description' => $this->faker->sentence,
        ];
    }
}
