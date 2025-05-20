<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->name('v1.')->group(function () {
    Route::prefix('global')->name('global.')->group(__DIR__ . '/api/v1/global.php');
    Route::prefix('dashboard')->middleware(['auth', 'role:user'])->name('dashboard.')->group(__DIR__ . '/api/v1/dashboard.php');
    Route::prefix('home')->name('home.')->group(__DIR__ . '/api/v1/home.php');
    Route::prefix('admin')->name('admin.')->group(__DIR__ . '/api/v1/admin.php');
});
