<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->name('v1.')->group(function() {
    Route::prefix('admin')->name('admin.')->group(__DIR__ . '/api/v1/admin.php');
});
