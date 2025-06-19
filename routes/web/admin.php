<?php

use Illuminate\Support\Facades\Route;

Route::get('/', \App\Http\Controllers\Web\Admin\DashboardController::class)->name('home');

Route::controller(\App\Http\Controllers\Web\Admin\CarDataController::class)->prefix('car-datas')->name('car-data.')->group(function() {
    Route::get('/', 'index')->name('index');
    Route::get('{car_data}', 'show')->name('show');
});

Route::controller(\App\Http\Controllers\Web\Admin\BookingController::class)->prefix('bookings')->name('booking.')->group(function() {
    Route::get('/', 'index')->name('index');
    Route::get('{booking}', 'show')->name('show');
});

Route::get('car-repairs', \App\Http\Controllers\Web\Admin\CarRepairController::class)->name('car-repair.index');
