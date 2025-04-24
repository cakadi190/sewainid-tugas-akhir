<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('home');

Route::inertia('repair-shop-data', 'Admin/RepairShopData/Index')->name('repair-shop-data.index');
Route::inertia('car-data', 'Admin/CarData/Index')->name('car-data.index');
