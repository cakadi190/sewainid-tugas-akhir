<?php

use Illuminate\Support\Facades\Route;

Route::prefix('car-listing')->name('car-listing.')->group(function () {
    Route::get('popular', [\App\Http\Controllers\Api\v1\Home\CarListController::class, 'popularCars'])->name('popular-cars');
    Route::get('all', [\App\Http\Controllers\Api\v1\Home\CarListController::class, 'allCars'])->name('all-cars');
});

Route::prefix('checkout')->name('checkout.')->group(function () {
    Route::post('create-update', [\App\Http\Controllers\Api\v1\Home\CheckoutController::class, 'addOrUpdate'])->name('addOrUpdate');
    Route::post('checkout', [\App\Http\Controllers\Api\v1\Home\CheckoutController::class, 'checkout'])->name('checkout');
    Route::post('cancel', [\App\Http\Controllers\Api\v1\Home\CheckoutController::class, 'cancel'])->name('cancel');
});

Route::apiResource('wishlist', \App\Http\Controllers\Api\v1\Home\WishlistController::class)->only(['index', 'store', 'destroy']);
