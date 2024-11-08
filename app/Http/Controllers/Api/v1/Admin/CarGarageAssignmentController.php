<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarGarageAssignment;
use App\Http\Requests\Admin\StoreCarGarageAssignmentRequest;
use App\Http\Requests\Admin\UpdateCarGarageAssignmentRequest;
use App\Interfaces\CrudHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class CarGarageAssignmentController extends Controller
{
    public function __construct(
        protected CarGarageAssignment $_carGarageAssignment,
        protected CrudHelper $_crudHelper,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $this->_carGarageAssignment->query();

        if ($request->boolean('withTrashed')) {
            $query = $this->_carGarageAssignment->onlyTrashed();
        }

        return DataTables::of($query)
            ->make(true); // Return JSON response
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCarGarageAssignmentRequest $request)
    {
        return $this->_crudHelper->createData($request, $this->_carGarageAssignment, [], []);
    }

    /**
     * Display the specified resource.
     */
    public function show(CarGarageAssignment $carGarageAssignment, Request $request): JsonResponse
    {
        return $this->_crudHelper->singleData($carGarageAssignment, $request, [], []);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCarGarageAssignmentRequest $request, CarGarageAssignment $carGarageAssignment): RedirectResponse
    {
        return $this->_crudHelper->editData($request, $carGarageAssignment, [], []);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, CarGarageAssignment $carGarageAssignment)
    {
        return $this->_crudHelper->destroyData($carGarageAssignment, $request);
    }
}
