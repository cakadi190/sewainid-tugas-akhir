<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRepairShopDataRequest;
use App\Http\Requests\Admin\UpdateRepairShopDataRequest;
use App\Interfaces\CrudHelper;
use App\Models\RepairShopData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class RepairShopDataController extends Controller
{
    public function __construct(
        protected RepairShopData $_repairShopData,
        protected CrudHelper $_crudHelper,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $this->_repairShopData->query();

        if ($request->boolean('withTrashed')) {
            $query = $this->_repairShopData->onlyTrashed();
        }

        return DataTables::of($query)
            ->addColumn('status', function (RepairShopData $model) {
                return [
                    'label' => $model->is_active ? 'Aktif' : 'Tidak Aktif',
                    'color' => $model->is_active ? 'primary' : 'secondary',
                ];
            })
            ->setRowId(function (RepairShopData $model) {
                return $model->id;
            })
            ->make(true);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRepairShopDataRequest $request): RedirectResponse
    {
        return $this->_crudHelper->createData($request, $this->_repairShopData);
    }

    /**
     * Display the specified resource.
     */
    public function show(RepairShopData $repairShopDatum, Request $request): JsonResponse
    {
        $repairShopDatum->setAttribute('status', function (RepairShopData $model) {
            return [
                'label' => $model->is_active ? 'Aktif' : 'Tidak Aktif',
                'color' => $model->is_active ? 'primary' : 'secondary',
            ];
        });
        $repairShopDatum->setAttribute('operation_hours', function (RepairShopData $model) {
            return [
                'opening' => $model->opening_time,
                'closing' => $model->closing_time,
            ];
        });

        return $this->_crudHelper->singleData($repairShopDatum, $request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRepairShopDataRequest $request, RepairShopData $repairShopDatum): RedirectResponse
    {
        return $this->_crudHelper->editData($request, $repairShopDatum);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, RepairShopData $repairShopDatum)
    {
        return $this->_crudHelper->destroyData($repairShopDatum, $request);
    }
}
