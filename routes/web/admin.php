<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('home');

Route::inertia('car-data', 'Admin/CarData/Index')->name('car-data.index');
Route::inertia('driver-data', 'Admin/DriverData/Index')->name('driver-data.index');
