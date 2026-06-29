<?php

use Illuminate\Support\Facades\Route;

// Teacher specific routes
Route::get('/mark-attendance', [\App\Http\Controllers\Teacher\AttendanceController::class, 'index'])->name('mark-attendance');
Route::post('/attendance/store', [\App\Http\Controllers\Teacher\AttendanceController::class, 'store'])->name('attendance.store');
