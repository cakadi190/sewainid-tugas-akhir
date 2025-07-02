<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Enums\RentalStatusEnum;
use App\Enums\RoleUser;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserAssignController extends Controller
{
    public function driver()
    {
        $drivers = User::driverIsFree()
            ->pluck('name', 'id'); // id => name

        return response()->json([
            'data' => $drivers,
        ]);
    }

    public function conductor()
    {
        $conductors = User::conductorIsFree()
            ->pluck('name', 'id'); // id => name

        return response()->json([
            'data' => $conductors,
        ]);
    }
}
