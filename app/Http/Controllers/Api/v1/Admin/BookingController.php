<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Enums\RentalStatusEnum;
use App\Http\Controllers\Controller;
use App\Interfaces\CrudHelper;
use App\Models\Transaction;
use App\Models\TransactionConfirmation;
use DataTables;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Log;

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
    public function show(Transaction $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $booking)
    {
        try {
            DB::transaction(function () use ($request, $booking) {
                if ($request->has('action') && $request->action === 'updateTransactionStatus') {
                    if ($request->payment_proof) {
                        $uploadPath = $request->payment_proof->store('payment_proof', 'public');

                        $booking->confirmations()->create([
                            'transaction_receipt' => $uploadPath,
                            'user_id' => auth()->id(),
                        ]);

                        $booking->update(['rental_status' => RentalStatusEnum::PENDING, 'confirmed_at' => now()]);
                    }

                    $booking->update(['status' => $request->status]);
                }
            });

            return back()->with('success', 'Berhasil memperbarui data pemesanan');
        } catch (\Exception $e) {
            Log::error($e);
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data pemesanan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $booking, Request $request)
    {
        try {
            return $this->_crudHelper->destroyData($booking, $request);
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }
}
