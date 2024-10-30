<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome');

Route::prefix('/')->group(__DIR__.'/web/auth.php');
Route::prefix('/')->group(__DIR__.'/web/profile.php');

Route::prefix('administrator')->middleware(['auth', 'role:admin,monetary,driver'])->group(__DIR__.'/web/admin.php');
Route::prefix('dashboard')->middleware(['auth', 'verified', 'role:user'])->group(__DIR__.'/web/dashboard.php');
