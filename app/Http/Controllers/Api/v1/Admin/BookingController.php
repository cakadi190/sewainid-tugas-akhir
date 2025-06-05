<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Interfaces\CrudHelper;
use App\Models\Transaction;
use DataTables;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        protected Transaction $_transaction,
        protected CrudHelper $_crudHelper,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $this->_transaction->query();

        if ($request->boolean('withTrashed')) {
            $query = $this->_transaction->onlyTrashed();
        }

        return DataTables::of($query)
            ->orderColumn('name', '-name $1')
            ->setRowId(function (Transaction $model) {
                return $model->id;
            })
            ->make(true);
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
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
