<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\StudentPortalController;

Route::get('/dashboard', [StudentPortalController::class, 'dashboard'])->name('dashboard');
