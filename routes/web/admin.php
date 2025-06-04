<?php

use App\Http\Controllers\Web\Admin\CarDataController;
use App\Http\Controllers\Web\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::controller(CarDataController::class)->prefix('car-datas')->name('car-data.')->group(function() {
    Route::get('/', 'index')->name('index');
    Route::get('{car_data}', 'show')->name('show');
});

Route::inertia('car-repairs', 'Admin/CarRepairNoteData/Index')->name('car-repair.index');
Route::inertia('bookings', 'Admin/Booking/Index')->name('booking.index');
