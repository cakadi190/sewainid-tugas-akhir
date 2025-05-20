<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Dashboard/Home')->name('dashboard');

Route::controller(\App\Http\Controllers\Web\Dashboard\TransactionController::class)->group(function () {
    Route::get('transaction', 'index')->name('dashboard.transaction.index');
    Route::get('transaction/{transaction}', 'show')->name('dashboard.transaction.show');
});
