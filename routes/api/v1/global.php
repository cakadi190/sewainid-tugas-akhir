<?php

use Illuminate\Support\Facades\Route;

Route::get('image-optimize', [\App\Http\Controllers\Api\v1\Global\ImageOptimizerController::class, 'optimize'])->name('image-optimize');
