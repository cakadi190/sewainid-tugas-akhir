<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarData;
use Illuminate\Http\Request;

class CarDataController extends Controller
{
    /**
     * Display the car data index page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        seo()->title('Data Armada')->generate();

        return inertia('Admin/CarData/Index');
    }

    /**
     * Display the specified resource.
     *
     * @return \Inertia\Response
     */
    public function show(CarData $car_data, Request $request)
    {
        seo()->title("Detail Armada {$car_data->brand} {$car_data->car_name}")->generate();

        $car_data->load(['transaction' => function ($query) {
            $query->latest();
        }, 'transaction.user']);
        $car_data->getMedia('gallery');

        return inertia('Admin/CarData/Show', compact('car_data'));
    }
}
