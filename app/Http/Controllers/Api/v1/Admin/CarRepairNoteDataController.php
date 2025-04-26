<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCarRepairNoteDataRequest;
use App\Http\Requests\Admin\UpdateCarRepairNoteDataRequest;
use App\Interfaces\CrudHelper;
use App\Models\CarRepairNoteData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class CarRepairNoteDataController extends Controller
{
    public function __construct(
        protected CarRepairNoteData $_carRepairNoteData,
        protected CrudHelper $_crudHelper,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $this->_carRepairNoteData->query();

        if ($request->boolean('withTrashed')) {
            $query = $this->_carRepairNoteData->onlyTrashed();
        }

        return DataTables::of($query)
            ->addColumn('model', function (CarRepairNoteData $model) {
                return [
                    'label' => $model->getAttribute('model')->label(),
                    'color' => $model->getAttribute('model')->color(),
                ];
            })
            ->addColumn('status', function (CarRepairNoteData $model) {
                return [
                    'label' => $model->getAttribute('status')->label(),
                    'color' => $model->getAttribute('status')->color(),
                ];
            })
            ->orderColumn('name', '-name $1')
            ->setRowId(function (CarRepairNoteData $model) {
                return $model->id;
            })
            ->make(true);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCarRepairNoteDataRequest $request)
    {
        return $this->_crudHelper->createData($request, $this->_carRepairNoteData, [], ['gallery']);
    }

    /**
     * Display the specified resource.
     */
    public function show(CarRepairNoteData $car_repair, Request $request): JsonResponse
    {
        return $this->_crudHelper->singleData($car_repair, $request, [], ['gallery']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCarRepairNoteDataRequest $request, CarRepairNoteData $car_repair): RedirectResponse
    {
        return $this->_crudHelper->editData($request, $car_repair, [], ['gallery']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, CarRepairNoteData $car_repair)
    {
        return $this->_crudHelper->destroyData($car_repair, $request);
    }
}
