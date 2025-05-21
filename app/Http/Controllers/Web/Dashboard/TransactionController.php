<?php

namespace App\Http\Controllers\Web\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\TripayServices;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Class TransactionController
 *
 * @package App\Http\Controllers\Web\Dashboard
 */
class TransactionController extends Controller
{
    public function __construct(
        protected readonly TripayServices $tripay
    ) {
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        return inertia('Dashboard/Transaction/Index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Transaction  $transaction
     * @return \Inertia\Response
     */
    public function show(Transaction $transaction)
    {
        $transaction->load('carData', 'carData.media', 'user');

        $transactionDetail = $this->tripay->getPayment($transaction->payment_references)?->json()['data'];

        return inertia('Dashboard/Transaction/Show', compact('transaction', 'transactionDetail'));
    }
}

