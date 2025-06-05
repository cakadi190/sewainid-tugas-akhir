<?php

use Illuminate\Support\Facades\Route;

Route::apiResource('car-data', \App\Http\Controllers\Api\v1\Admin\CarDataController::class);
Route::apiResource('car-repair', \App\Http\Controllers\Api\v1\Admin\CarRepairNoteDataController::class);
Route::apiResource('booking', \App\Http\Controllers\Api\v1\Admin\BookingController::class);

Route::prefix('options')->name('options.')->group(function () {
    Route::any('car-data', \App\Http\Controllers\Api\v1\Admin\CarDataOptionsController::class)->name('car-data');
});

Route::controller(\App\Http\Controllers\Api\v1\Admin\MediaLibraryController::class)
    ->prefix('medialibrary')->name('medialibary-handler.')->group(function () {
        Route::get('{media}', 'show')->name('show');
        Route::delete('{media}', 'delete')->name('delete');
    });
