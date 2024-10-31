<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('home');

Route::resource('car-data', \App\Http\Controllers\Admin\CarDataController::class);
Route::resource('driver-data', \App\Http\Controllers\Admin\DriverDataController::class);
