<?php

namespace Database\Factories;

use App\Models\CarData;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarRepairNoteData>
 */
class CarRepairNoteDataFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'repair_date' => $this->faker->date(),
            'description' => $this->faker->sentence(),
            'cost' => $this->faker->numberBetween(1000, 10000),
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'completed']),
            'notes' => $this->faker->optional()->paragraph(),
            'car_data_id' => CarData::factory(),
        ];
    }
}

