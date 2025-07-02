<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Enums\RentalStatusEnum;
use App\Enums\TransactionStatusEnum;
use App\Http\Controllers\Controller;
use App\Interfaces\CrudHelper;
use App\Models\Transaction;
use DataTables;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

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
        $query = $this->_transaction->with([
            'transactionConfirmation' => fn($query) => $query->select(['id', 'transaction_id', 'created_at', 'transaction_receipt']),
            'carData' => fn($query) => $query->select(['id', 'brand', 'car_name']),
            'driver' => fn($query) => $query->select(['id', 'name', 'phone']),
            'conductor' => fn($query) => $query->select(['id', 'name', 'phone']),
        ]);

        if ($request->boolean('withTrashed')) {
            $query = $this->_transaction->onlyTrashed();
        }

        return DataTables::of($query)
            ->orderColumn('name', '-name $1')
            ->setRowId(fn(Transaction $model): string => $model->id)
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
        try {
            DB::transaction(function () use ($request, $transaction) {
                $action = $request->input('action');
                Log::info('Booking Update Action:', ['action' => $action]);
                switch ($action) {
                    case 'updateTransactionStatus':
                        if ($request->hasFile('payment_proof')) {
                            $uploadPath = $request->file('payment_proof')->store('payment_proof', 'public');
                            Log::info("Payment Proof Upload:", [
                                'transaction_receipt' => $uploadPath,
                                'user_id' => auth()->id(),
                                'transaction_id' => $transaction->id,
                            ]);
                            $transaction->transactionConfirmation()->create([
                                'transaction_receipt' => $uploadPath,
                                'user_id' => auth()->id(),
                                'transaction_id' => $transaction->id,
                            ]);
                            $transaction->update([
                                'rental_status' => RentalStatusEnum::PENDING,
                                'confirmed_at' => now(),
                            ]);
                        }
                        if ($request->filled('status')) {
                            $transaction->update([
                                'status' => TransactionStatusEnum::from($request->status),
                            ]);
                        }
                        break;
                    case 'updateRentStatus':
                        $newStatus = $request->input('rental_status');
                        Log::info('Rental Status Update:', [
                            'current' => $transaction->rental_status,
                            'new' => $newStatus,
                        ]);
                        $transaction->update([
                            'rental_status' => RentalStatusEnum::from($newStatus),
                        ]);
                        break;
                    case 'assignDriverConductor':
                        $driverId = $request->input('driver_id');
                        $conductorId = $request->input('conductor_id');

                        Log::info('Assign Driver & Conductor:', [
                            'transaction_id' => $transaction->id,
                            'driver_id' => $driverId,
                            'conductor_id' => $conductorId,
                        ]);

                        $updateData = [
                            'driver_id' => $driverId ?? null,
                            'conductor_id' => $conductorId ?? null,
                        ];

                        $transaction->update($updateData);
                        break;
                    default:
                        Log::warning('Unknown action type for booking update', [
                            'action' => $action,
                        ]);
                        break;
                }
            });
            return back()->with('success', 'Berhasil memperbarui data pemesanan');
        } catch (Throwable $e) {
            Log::error('Booking update error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data pemesanan');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction, Request $request)
    {
        try {
            return $this->_crudHelper->destroyData($transaction, $request);
        } catch (Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }
}
