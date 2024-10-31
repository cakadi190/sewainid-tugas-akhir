<?php

use Illuminate\Support\Facades\Route;

Route::apiResource('car-data', \App\Http\Controllers\Api\v1\Admin\CarDataController::class);
