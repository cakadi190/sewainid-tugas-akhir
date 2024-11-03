<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCarDataRequest;
use App\Http\Requests\UpdateCarDataRequest;
use App\Interfaces\CrudHelper;
use App\Models\CarData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class CarDataController extends Controller
{
    public function __construct(
        protected CarData $_carData,
        protected CrudHelper $_crudHelper,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $this->_carData->query();

        if ($request->boolean('withTrashed')) {
            $query = $this->_carData->onlyTrashed();
        }

        // dd($query, $request->boolean('withTrashed'));

        return DataTables::of($query)
            ->addColumn('model', function (CarData $model) {
                return [
                    'label' => $model->getAttribute('model')->label(),
                    'color' => $model->getAttribute('model')->color(),
                ];
            })
            ->addColumn('status', function (CarData $model) {
                return [
                    'label' => $model->getAttribute('status')->label(),
                    'color' => $model->getAttribute('status')->color(),
                ];
            })
            ->orderColumn('name', '-name $1') // Order by name, descending
            ->setRowId(function (CarData $model) {
                return $model->id; // Set a unique row ID if needed
            })
            ->make(true); // Return JSON response
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCarDataRequest $request)
    {
        return $this->_crudHelper->createData($request, $this->_carData, null, ['gallery']);
    }

    /**
     * Display the specified resource.
     */
    public function show(CarData $car_datum, Request $request): JsonResponse
    {
        return $this->_crudHelper->singleData($car_datum, $request, [], ['gallery']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCarDataRequest $request, CarData $car_datum): RedirectResponse
    {
        return $this->_crudHelper->editData($request, $car_datum, [], ['gallery']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, CarData $car_datum)
    {
        return $this->_crudHelper->destroyData($car_datum, $request);
    }
}
