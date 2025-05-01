<?php

use App\Http\Controllers\Web\Admin\CarDataController;
use App\Http\Controllers\Web\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::inertia('repair-shop-data', 'Admin/RepairShopData/Index')->name('repair-shop-data.index');

Route::controller(CarDataController::class)->prefix('car-data')->name('car-data.')->group(function() {
    Route::get('/', 'index')->name('index');
    Route::get('{car_data}', 'show')->name('show');
});

Route::inertia('car-repair', 'Admin/CarRepairNoteData/Index')->name('car-repair.index');
