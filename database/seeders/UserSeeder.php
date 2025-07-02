<?php

namespace Database\Seeders;

use App\Enums\RoleUser;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User::factory()->create([
        //     'name' => 'Administrator',
        //     'email' => 'admin@sewain.id',
        //     'role' => RoleUser::ADMIN->value,
        //     'password' => bcrypt('@Sewain.iD2024'),
        // ]);

        // User::factory()->create([
        //     'name' => 'Amir Zuhdi Wibowo',
        //     'email' => 'cakadi190@gmail.com',
        //     'phone' => '081234771365',
        //     'dbirth' => '2003-02-21',
        //     'pbirth' => 'Klaten',
        //     'role' => RoleUser::USER->value,
        //     'address' => 'Jl. Brigjend Katamso, RT 003/02, Nomor 03, Munggut, Padas, Kabupaten Ngawi, Jawa Timur',
        //     'password' => bcrypt('@Cakadi.iD2024'),
        // ]);

        User::factory()->count(10)->create([
            'role' => RoleUser::CONDUCTOR->value,
        ]);
        User::factory()->count(10)->create([
            'role' => RoleUser::DRIVER->value,
        ]);
    }
}
