<?php

use Illuminate\Support\Facades\Route;

Route::get('/', \App\Http\Controllers\Web\Admin\DashboardController::class)->name('home');
Route::get('bookings', \App\Http\Controllers\Web\Admin\BookingController::class)->name('booking');

Route::controller(\App\Http\Controllers\Web\Admin\CarDataController::class)->prefix('car-datas')->name('car-data.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('{car_data}', 'show')->name('show');
});

Route::controller(\App\Http\Controllers\Web\Admin\TransactionController::class)->prefix('transactions')->name('transaction.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('{transaction}', 'show')->name('show');
});

Route::get('car-repairs', \App\Http\Controllers\Web\Admin\CarRepairController::class)->name('car-repair.index');
