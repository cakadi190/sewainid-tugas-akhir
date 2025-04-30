<?php

namespace Database\Seeders;

use App\Enums\RoleUser;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@sewain.id',
            'role' => RoleUser::ADMIN->value,
            'password' => bcrypt('@Sewain.iD2024'),
        ]);

        User::factory()->create([
            'name' => 'Amir Zuhdi Wibowo',
            'email' => 'cakadi190@gmail.com',
            'role' => RoleUser::USER->value,
            'password' => bcrypt('@Cakadi.iD2024'),
        ]);
    }
}
