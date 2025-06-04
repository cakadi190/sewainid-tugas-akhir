<?php

use Illuminate\Support\Facades\Route;

Route::get('image-optimize', \App\Http\Controllers\Api\v1\Global\ImageOptimizerController::class)->name('image-optimize');

Route::prefix('geolocation')->group(function () {
    Route::any('gmaps', \App\Http\Controllers\Api\v1\Global\GmapPlaceController::class)->name('gmaps-api');
    Route::any('mapbox', \App\Http\Controllers\Api\v1\Global\MapboxPlaceController::class)->name('mapbox-api');
});

Route::prefix('transaction')->name('transaction.')->group(function () {
    Route::get('get-channels', [\App\Http\Controllers\Api\v1\Global\TripayController::class, 'getChannels'])->name('get-channels');
    Route::get('callback', [\App\Http\Controllers\Api\v1\Global\TripayController::class, 'callback'])->name('callback');
});
