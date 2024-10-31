<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarData;
use App\Http\Requests\StoreCarDataRequest;
use App\Http\Requests\UpdateCarDataRequest;

class CarDataController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Admin/CarData/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCarDataRequest $request)
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
     * Show the form for editing the specified resource.
     */
    public function edit(CarData $carData)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCarDataRequest $request, CarData $carData)
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
