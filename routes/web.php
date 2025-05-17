<?php

use Illuminate\Support\Facades\Route;

Route::prefix('/')->group(__DIR__ . '/web/home.php');
Route::prefix('/')->group(__DIR__ . '/web/auth.php');
Route::prefix('/')->group(__DIR__ . '/web/profile.php');

Route::prefix('administrator')->name('administrator.')->middleware(['auth', 'role:admin,monetary,driver'])->group(__DIR__ . '/web/admin.php');
Route::prefix('dashboard')->middleware(['auth', 'verified', 'role:user'])->group(__DIR__ . '/web/dashboard.php');


Route::prefix('debug')->group(function () {
    Route::get('session', function () {
        dd(session()->all());
    });
    Route::get('order', function () {
        dd(session()->get('order'));
    });
});
