<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Interfaces\CrudHelper;
use App\Models\CarData;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class CarDataController extends Controller
{
    public function __construct(
        protected CarData $_carData,
        protected CrudHelper $_crudHelper,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->_crudHelper
            ->searchColumn(['name', 'brand', 'frame_number', 'license_plate', 'color', 'year_of_manufactur'])
            ->formatColumn('model', fn(CarData $model) => [
                'label' => $model->getAttribute('model')->label(),
                'color' => $model->getAttribute('model')->color(),
            ])
            ->formatColumn('status', callback: fn(CarData $model) => [
                'label' => $model->getAttribute('status')->label(),
                'color' => $model->getAttribute('status')->color(),
            ])
            ->allData($this->_carData);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CarData $carData)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CarData $carData)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CarData $carData)
    {
        //
    }
}
