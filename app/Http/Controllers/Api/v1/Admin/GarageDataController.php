<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGarageDataRequest;
use App\Http\Requests\Admin\UpdateGarageDataRequest;
use App\Interfaces\CrudHelper;
use App\Models\GarageData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class GarageDataController extends Controller
{
    public function __construct(
        protected GarageData $_garageData,
        protected CrudHelper $_crudHelper,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $this->_garageData->query();

        if ($request->boolean('withTrashed')) {
            $query = $this->_garageData->onlyTrashed();
        }

        return DataTables::of($query)
            ->addColumn('status', fn(GarageData $model): array => [
                'label' => $model->getAttribute('is_active') ? 'Aktif' : 'Tidak Aktif',
                'color' => $model->getAttribute('is_active') ? 'primary' : 'secondary',
            ])
            ->make(true); // Return JSON response
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGarageDataRequest $request)
    {
        return $this->_crudHelper->createData($request, $this->_garageData);
    }

    /**
     * Display the specified resource.
     */
    public function show(GarageData $garage_datum, Request $request): JsonResponse
    {
        return $this->_crudHelper->singleData($garage_datum, $request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGarageDataRequest $request, GarageData $garage_datum): RedirectResponse
    {
        return $this->_crudHelper->editData($request, $garage_datum);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GarageData $garage_datum, Request $request)
    {
        return $this->_crudHelper->destroyData($garage_datum, $request);
    }
}
