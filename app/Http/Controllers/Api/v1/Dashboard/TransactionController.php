<?php

namespace App\Http\Controllers\Api\v1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class TransactionController extends Controller
{
    public function __invoke(Request $request)
    {
        return DataTables::of(auth()->user()->transactions()->with('carData')->latest())
            ->addColumn('firstMediaUrl', fn(Transaction $transaction) => $transaction->carData?->getFirstMediaUrl('gallery') ?? '')
            ->make();
    }
}

