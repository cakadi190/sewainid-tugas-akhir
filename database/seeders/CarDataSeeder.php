<?php

namespace Database\Seeders;

use App\Enums\CarModelEnum;
use Illuminate\Database\Seeder;
use App\Models\CarData;

class CarDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carDataEntries = [
            [
                'name' => 'Hilux',
                'brand' => 'Toyota',
                'color' => 'White Rose',
                'year_of_manufacture' => 2019,
                'model' => CarModelEnum::PICKUP,
                'description' => 'Toyota Hilux 2019 model, White Rose color.',
            ],
            [
                'name' => 'Avanza',
                'brand' => 'Toyota',
                'color' => 'Crimson',
                'year_of_manufacture' => 2015,
                'model' => CarModelEnum::MPV,
                'description' => 'Toyota Avanza 2015 model, Crimson color.',
            ],
            [
                'name' => 'Innova V2.0',
                'brand' => 'Toyota',
                'color' => 'Red Rose',
                'year_of_manufacture' => 2022,
                'model' => CarModelEnum::MPV,
                'description' => 'Toyota Innova Reborn V2.0 2022 model, Red Rose color.',
            ],
            [
                'name' => 'Civic',
                'brand' => 'Honda',
                'color' => 'Silver',
                'year_of_manufacture' => 2020,
                'model' => CarModelEnum::SEDAN,
                'description' => 'Honda Civic 2020 model, Silver color.',
            ],
            [
                'name' => 'Accord',
                'brand' => 'Honda',
                'color' => 'Black',
                'year_of_manufacture' => 2021,
                'model' => CarModelEnum::SEDAN,
                'description' => 'Honda Accord 2021 model, Black color.',
            ],
            [
                'name' => 'Fortuner',
                'brand' => 'Toyota',
                'color' => 'Dark Grey',
                'year_of_manufacture' => 2018,
                'model' => CarModelEnum::SUV,
                'description' => 'Toyota Fortuner 2018 model, Dark Grey color.',
            ],
            [
                'name' => 'Pajero',
                'brand' => 'Mitsubishi',
                'color' => 'White',
                'year_of_manufacture' => 2020,
                'model' => CarModelEnum::SUV,
                'description' => 'Mitsubishi Pajero 2020 model, White color.',
            ],
            [
                'name' => 'Xpander',
                'brand' => 'Mitsubishi',
                'color' => 'Blue',
                'year_of_manufacture' => 2019,
                'model' => CarModelEnum::MPV,
                'description' => 'Mitsubishi Xpander 2019 model, Blue color.',
            ],
            [
                'name' => 'Kijang Innova',
                'brand' => 'Toyota',
                'color' => 'Champagne',
                'year_of_manufacture' => 2017,
                'model' => CarModelEnum::MPV,
                'description' => 'Toyota Kijang Innova 2017 model, Champagne color.',
            ],
            [
                'name' => 'Terios',
                'brand' => 'Daihatsu',
                'color' => 'Green',
                'year_of_manufacture' => 2022,
                'model' => CarModelEnum::SUV,
                'description' => 'Daihatsu Terios 2022 model, Green color.',
            ],
            [
                'name' => 'Calya',
                'brand' => 'Daihatsu',
                'color' => 'Orange',
                'year_of_manufacture' => 2020,
                'model' => CarModelEnum::MPV,
                'description' => 'Daihatsu Calya 2020 model, Orange color.',
            ],
            [
                'name' => 'Raize',
                'brand' => 'Toyota',
                'color' => 'Red',
                'year_of_manufacture' => 2023,
                'model' => CarModelEnum::SUV,
                'description' => 'Toyota Raize 2023 model, Red color.',
            ],
            [
                'name' => 'Swift',
                'brand' => 'Suzuki',
                'color' => 'Pink',
                'year_of_manufacture' => 2021,
                'model' => CarModelEnum::HATCHBACK,
                'description' => 'Suzuki Swift 2021 model, Pink color.',
            ],
            [
                'name' => 'Ertiga',
                'brand' => 'Suzuki',
                'color' => 'Grey',
                'year_of_manufacture' => 2020,
                'model' => CarModelEnum::MPV,
                'description' => 'Suzuki Ertiga 2020 model, Grey color.',
            ],
            [
                'name' => 'Sienta',
                'brand' => 'Toyota',
                'color' => 'Yellow',
                'year_of_manufacture' => 2019,
                'model' => CarModelEnum::MPV,
                'description' => 'Toyota Sienta 2019 model, Yellow color.',
            ],
            [
                'name' => 'Brio',
                'brand' => 'Honda',
                'color' => 'Light Blue',
                'year_of_manufacture' => 2022,
                'model' => CarModelEnum::HATCHBACK,
                'description' => 'Honda Brio 2022 model, Light Blue color.',
            ],
            [
                'name' => 'Camry',
                'brand' => 'Toyota',
                'color' => 'Dark Blue',
                'year_of_manufacture' => 2021,
                'model' => CarModelEnum::SEDAN,
                'description' => 'Toyota Camry 2021 model, Dark Blue color.',
            ],
            [
                'name' => 'Grand Livina',
                'brand' => 'Nissan',
                'color' => 'Silver',
                'year_of_manufacture' => 2019,
                'model' => CarModelEnum::MPV,
                'description' => 'Nissan Grand Livina 2019 model, Silver color.',
            ],
            [
                'name' => 'Livina',
                'brand' => 'Nissan',
                'color' => 'White',
                'year_of_manufacture' => 2020,
                'model' => CarModelEnum::MPV,
                'description' => 'Nissan Livina 2020 model, White color.',
            ],
            [
                'name' => 'All New Sienta',
                'brand' => 'Toyota',
                'color' => 'Red',
                'year_of_manufacture' => 2022,
                'model' => CarModelEnum::MPV,
                'description' => 'Toyota All New Sienta 2022 model, Red color.',
            ],
            [
                'name' => 'B3000',
                'brand' => 'Mazda',
                'color' => 'Blue',
                'year_of_manufacture' => 2020,
                'model' => CarModelEnum::PICKUP,
                'description' => 'Mazda B3000 2020 model, Blue color.',
            ],
            [
                'name' => 'L300',
                'brand' => 'Mitsubishi',
                'color' => 'Black',
                'year_of_manufacture' => 2005,
                'model' => CarModelEnum::PICKUP,
                'description' => 'Mitsubishi L300 2005 model, Black color.',
            ],
            [
                'name' => 'Carry 1.5',
                'brand' => 'Suzuki',
                'color' => 'White',
                'year_of_manufacture' => 2021,
                'model' => CarModelEnum::PICKUP,
                'description' => 'Suzuki Carry 1.5 2021 model, White color.',
            ],
            [
                'name' => 'Pajero Sport',
                'brand' => 'Mitsubishi',
                'color' => 'Grey',
                'year_of_manufacture' => 2023,
                'model' => CarModelEnum::SUV,
                'description' => 'Mitsubishi Pajero Sport 2023 model, Grey color.',
            ],
            [
                'name' => 'DFSK Glory 560',
                'brand' => 'DFSK',
                'color' => 'Black',
                'year_of_manufacture' => 2022,
                'model' => CarModelEnum::SUV,
                'description' => 'DFSK Glory 560 2022 model, Black color.',
            ],
            [
                'name' => 'DFSK Gelora',
                'brand' => 'DFSK',
                'color' => 'White',
                'year_of_manufacture' => 2024,
                'model' => CarModelEnum::VAN,
                'description' => 'DFSK Glory 560 2024 model, White color.',
            ],
            [
                'name' => 'DFSK Gelora E',
                'brand' => 'DFSK',
                'color' => 'Gelora Electric',
                'year_of_manufacture' => 2024,
                'model' => CarModelEnum::VAN,
                'description' => 'DFSK Glory 560 2024 model, White Gelora Electric color.',
            ],
            [
                'name' => 'Wuling Cortez',
                'brand' => 'Wuling',
                'color' => 'Silver',
                'year_of_manufacture' => 2021,
                'model' => CarModelEnum::MPV,
                'description' => 'Wuling Cortez 2021 model, Silver color.',
            ],
            [
                'name' => 'Wuling Almaz',
                'brand' => 'Wuling',
                'color' => 'Red',
                'year_of_manufacture' => 2022,
                'model' => CarModelEnum::SUV,
                'description' => 'Wuling Almaz 2022 model, Red color.',
            ],
            [
                'name' => 'Nissan Juke',
                'brand' => 'Nissan',
                'color' => 'Yellow',
                'year_of_manufacture' => 2023,
                'model' => CarModelEnum::SUV,
                'description' => 'Nissan Juke 2023 model, Yellow color.',
            ],
            [
                'name' => 'Kia Seltos',
                'brand' => 'Kia',
                'color' => 'Green',
                'year_of_manufacture' => 2021,
                'model' => CarModelEnum::SUV,
                'description' => 'Kia Seltos 2021 model, Green color.',
            ],
            [
                'name' => 'Mitsubishi Outlander',
                'brand' => 'Mitsubishi',
                'color' => 'Brown',
                'year_of_manufacture' => 2020,
                'model' => CarModelEnum::SUV,
                'description' => 'Mitsubishi Outlander 2020 model, Brown color.',
            ],
            [
                'name' => 'Honda HR-V',
                'brand' => 'Honda',
                'color' => 'Grey',
                'year_of_manufacture' => 2021,
                'model' => CarModelEnum::SUV,
                'description' => 'Honda HR-V 2021 model, Grey color.',
            ],
            [
                'name' => 'Mazda CX-5',
                'brand' => 'Mazda',
                'color' => 'White',
                'year_of_manufacture' => 2022,
                'model' => CarModelEnum::SUV,
                'description' => 'Mazda CX-5 2022 model, White color.',
            ],
        ];

        # Use collect and each to iterate over the car data entries
        collect($carDataEntries)->each(function ($carData) {
            CarData::factory()->create($carData);
        });
    }
}
