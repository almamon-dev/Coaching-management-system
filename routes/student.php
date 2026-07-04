<?php

use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [\App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
Route::get('/security', [\App\Http\Controllers\Student\DashboardController::class, 'security'])->name('security');
Route::get('/notifications', [\App\Http\Controllers\Student\DashboardController::class, 'notifications'])->name('notifications.index');
Route::post('/notifications/read-all', [\App\Http\Controllers\Student\DashboardController::class, 'markNotificationsAsRead'])->name('notifications.read-all');

// Attendance
Route::get('/attendance', [\App\Http\Controllers\Student\AttendanceController::class, 'myAttendance'])->name('attendance');

// Results
Route::get('/results', [\App\Http\Controllers\Student\ResultController::class, 'index'])->name('results.index');
Route::get('/results/{result}/report-card', [\App\Http\Controllers\Student\ResultController::class, 'reportCard'])->name('results.report-card');

// Routine
Route::get('/routine', [\App\Http\Controllers\Student\RoutineController::class, 'index'])->name('routine.index');

// Events
Route::resource('events', \App\Http\Controllers\Student\EventController::class)->only(['index', 'create', 'store']);
