<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\Web\Home\HomeController::class, 'index'])->name('home');
Route::get('checkout', [App\Http\Controllers\Web\Home\HomeController::class, 'checkout'])
    ->middleware(['auth', 'role:user'])
    ->name('checkout');
Route::get('wishlist', [App\Http\Controllers\Web\Home\HomeController::class, 'wishlist'])
    ->middleware(['auth', 'role:user'])
    ->name('wishlist');

Route::prefix('armada')->name('armada.')->group(function () {
    Route::get('/', [App\Http\Controllers\Web\Home\ArmadaController::class, 'index'])->name('index');
    Route::get('{car_data:slug}', [App\Http\Controllers\Web\Home\ArmadaController::class, 'show'])->name('show');
});
