<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('home');

Route::inertia('repair-shop-data', 'Admin/RepairShopData/Index')->name('repair-shop-data.index');
Route::inertia('car-data', 'Admin/CarData/Index')->name('car-data.index');
Route::inertia('garage-data', 'Admin/GarageData/Index')->name('garage-data.index');
Route::inertia('repair-data', 'Admin/RepairData/Index')->name('repair-data.index');
Route::inertia('car-assign', 'Admin/CarGarageAssignment/Index')->name('car-assign.index');
