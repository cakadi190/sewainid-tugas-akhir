<?php

use Illuminate\Support\Facades\Route;

Route::apiResource('car-data', \App\Http\Controllers\Api\v1\Admin\CarDataController::class);
Route::apiResource('garage-data', \App\Http\Controllers\Api\v1\Admin\GarageDataController::class);
Route::apiResource('repair-shop-data', \App\Http\Controllers\Api\v1\Admin\RepairShopDataController::class);
Route::apiResource('car-garage-assignment', \App\Http\Controllers\Api\v1\Admin\CarGarageAssignmentController::class);

Route::controller(\App\Http\Controllers\Api\v1\Admin\MediaLibraryController::class)
    ->prefix('medialibrary')->name('medialibary-handler.')->group(function () {
        Route::get('{media}', 'show')->name('show');
        Route::delete('{media}', 'delete')->name('delete');
    });
