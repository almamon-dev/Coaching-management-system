<?php

use Illuminate\Support\Facades\Route;

// Teacher specific routes
Route::get('/dashboard', [\App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
Route::get('/mark-attendance', [\App\Http\Controllers\Teacher\AttendanceController::class, 'index'])->name('mark-attendance');
Route::get('/mark-attendance', [\App\Http\Controllers\Teacher\AttendanceController::class, 'index'])->name('mark-attendance');
Route::post('/attendance/store', [\App\Http\Controllers\Teacher\AttendanceController::class, 'store'])->name('attendance.store');

Route::get('marks-entry', [\App\Http\Controllers\Teacher\Examinations\MarksEntryController::class, 'index'])->name('marks.entry');
Route::post('marks-entry', [\App\Http\Controllers\Teacher\Examinations\MarksEntryController::class, 'store'])->name('marks.store');

Route::get('routine', [\App\Http\Controllers\Teacher\RoutineController::class, 'index'])->name('routine.index');

Route::get('assignments', [\App\Http\Controllers\Teacher\AssignmentController::class, 'index'])->name('assignments.index');
Route::post('assignments', [\App\Http\Controllers\Teacher\AssignmentController::class, 'store'])->name('assignments.store');
Route::delete('assignments/{assignment}', [\App\Http\Controllers\Teacher\AssignmentController::class, 'destroy'])->name('assignments.destroy');

Route::get('results/generation', [\App\Http\Controllers\Teacher\Examinations\ResultController::class, 'generation'])->name('results.generation');
Route::post('results/generate', [\App\Http\Controllers\Teacher\Examinations\ResultController::class, 'generate'])->name('results.generate');
Route::get('results/publish', [\App\Http\Controllers\Teacher\Examinations\ResultController::class, 'publishIndex'])->name('results.publishIndex');
Route::post('results/publish', [\App\Http\Controllers\Teacher\Examinations\ResultController::class, 'publish'])->name('results.publish');
Route::get('results/{result}/report-card', [\App\Http\Controllers\Teacher\Examinations\ResultController::class, 'reportCard'])->name('results.report-card');

// Events
Route::resource('events', \App\Http\Controllers\Teacher\EventController::class)->only(['index', 'create', 'store']);
