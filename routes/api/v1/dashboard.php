<?php

use Illuminate\Support\Facades\Route;

Route::get('transaction', \App\Http\Controllers\Api\v1\Dashboard\TransactionController::class)->name('transaction');
