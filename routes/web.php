<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Guardian\GuardianPortalController;
use App\Http\Controllers\Frontend\HomeController;

// Home / Landing Page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Guest Frontend Navigation Routes (Required for Header, Footer & Notice board links)
Route::get('/admissions', [HomeController::class, 'admissions'])->name('admissions');

Route::get('/staff-faculty-portal', function () {
    return Inertia::render('Frontend/Portals');
})->name('portals.index');

Route::get('/coming-soon', function () {
    return Inertia::render('Errors/ComingSoon');
})->name('coming.soon');

Route::get('/class-details/{id}', function ($id) {
    return Inertia::render('Frontend/ClassDetails', ['classId' => $id]);
})->name('class.details');

Route::get('/academics/resources', function () {
    return Inertia::render('Frontend/Academics/Resources');
})->name('academics.resources');

Route::get('/faculties', function () {
    return Inertia::render('Frontend/Faculties/Index');
})->name('faculties.index');

Route::get('/faculties/{id}', function ($id) {
    return Inertia::render('Frontend/Faculties/Show', ['id' => $id]);
})->name('faculties.show');

Route::get('/school-offices', function () {
    return Inertia::render('Frontend/SchoolOffices');
})->name('school-offices');

Route::get('/school-offices/{id}', function ($id) {
    return Inertia::render('Frontend/SchoolOfficeDetails', ['id' => $id]);
})->name('school-offices.show');

Route::get('/batches', [HomeController::class, 'batchIndex'])->name('batches.index');
Route::get('/batches/{id}', [HomeController::class, 'batchShow'])->name('batches.show');
Route::get('/events', [HomeController::class, 'events'])->name('events');
Route::get('/gallery', [HomeController::class, 'gallery'])->name('gallery');
Route::get('/notices-board', [HomeController::class, 'notices'])->name('notices.index');
Route::get('/notices-board/{id}', [HomeController::class, 'noticeShow'])->name('notices.show');
Route::get('/success-stories', [HomeController::class, 'successStories'])->name('success-stories');
Route::get('/about-us', [HomeController::class, 'aboutUs'])->name('about-us');
Route::get('/about', function () {
    return redirect()->route('about-us');
});

Route::get('/complaints/create', function () {
    return Inertia::render('Errors/ComingSoon');
})->name('complaints.create');

Route::post('/complaints/store', function () {
    return redirect()->back();
})->name('complaints.store');

Route::get('/teacher/login', function () {
    return redirect()->route('login');
})->name('teacher.login');

// Role-Based Central Dashboard Redirector
Route::get('/dashboard', function () {
    $user = auth()->user();
    if (!$user) return redirect()->route('login');

    if (in_array($user->user_type, ['super_admin', 'admin', 'manager', 'accountant', 'staff'])) {
        return redirect()->route('admin.dashboard');
    }

    if ($user->user_type === 'teacher') {
        return redirect()->route('admin.dashboard');
    }

    if ($user->user_type === 'guardian') {
        return redirect()->route('guardian.dashboard');
    }

    return redirect()->route('user.dashboard');
})->middleware(['auth'])->name('dashboard');

// User / Student Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [\App\Http\Controllers\Student\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\Student\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [\App\Http\Controllers\Student\ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Guardian Portal Routes
Route::middleware(['auth'])->prefix('guardian')->name('guardian.')->group(function () {
    Route::get('/dashboard', [GuardianPortalController::class, 'dashboard'])->name('dashboard');
});

require __DIR__.'/auth.php';
