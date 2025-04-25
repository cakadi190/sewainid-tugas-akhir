<?php

namespace Database\Seeders;

use App\Enums\RoleUser;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@sewamobil.com',
            'role' => RoleUser::ADMIN->value,
            'password' => bcrypt('@Sewain.iD2024'),
        ]);

        User::factory()->create([
            'name' => 'Amir Zuhdi Wibowo',
            'email' => 'cakadi190@mail.com',
            'role' => RoleUser::USER->value,
            'password' => bcrypt('@Cakadi.iD2024'),
        ]);
    }
}
