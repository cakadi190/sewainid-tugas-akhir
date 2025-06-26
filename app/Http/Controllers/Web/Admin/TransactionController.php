<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\TripayServices;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        protected readonly TripayServices $tripay
    ) {
    }

    /**
     * Show the admin booking index page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        seo()->title('Data Transaksi')->generate();

        return inertia('Admin/Transaction/Index');
    }

    /**
     * Display the specified booking details.
     *
     * @param \App\Models\Transaction $booking
     * @return \Inertia\Response
     */
    public function show(Transaction $transaction)
    {
        seo()->title("Transaksi #{$transaction->id}")->generate();

        $transaction->load(['carData', 'carData.media', 'user', 'carData.transaction', 'carData.transaction.user', 'transactionConfirmation']);

        $transactionDetail = $this->tripay->getPayment($transaction->payment_references)?->json()['data'];

        return inertia('Admin/Transaction/Show', compact('transaction', 'transactionDetail'));
    }
}
