<?php

namespace Database\Seeders;

use App\Models\CarData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CarSlugSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CarData::all()->each(function ($car) {
            $slug = Str::slug($car->brand . ' ' . $car->car_name);

            $car->slug = $car->id === $car->fresh()->id
                ? $slug
                : Str::uuid() . '-' . $slug;

            $car->saveQuietly();

            $this->command->info("Updated car ID {$car->id} with slug: {$car->slug}");
        });
    }
}
