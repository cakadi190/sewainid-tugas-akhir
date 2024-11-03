<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('home');

Route::controller(\App\Http\Controllers\Web\Admin\CarDataController::class)
    ->name('car-data.')
    ->group(function () {
        Route::get('car-data', 'index')->name('index');
        Route::get('car-data/{car_datum}', 'show')->name('show');
    });

Route::inertia('driver-data', 'Admin/DriverData/Index')->name('driver-data.index');
