<?php

use Illuminate\Support\Facades\Route;

Route::apiResource('car-data', \App\Http\Controllers\Api\v1\Admin\CarDataController::class);
Route::apiResource('car-repair-note-data', \App\Http\Controllers\Api\v1\Admin\CarRepairNoteDataController::class);

Route::controller(\App\Http\Controllers\Api\v1\Admin\MediaLibraryController::class)
    ->prefix('medialibrary')->name('medialibary-handler.')->group(function () {
        Route::get('{media}', 'show')->name('show');
        Route::delete('{media}', 'delete')->name('delete');
    });
