<?php

use App\Http\Controllers\Student\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\Examinations\RollGenerationController;

Route::get('/', [\App\Http\Controllers\Frontend\HomeController::class, 'index'])->name('home');

// Language Switcher
Route::get('/language/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'bn'])) {
        session()->put('locale', $locale);
    }
    return redirect()->back();
})->name('language.switch');

// Staff Invitation acceptance routes
Route::get('invitations/accept/{user}', [\App\Http\Controllers\Admin\Users\UserController::class, 'showAcceptInvitation'])
    ->name('admin.invitations.accept');

Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->user_type === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    
    if (in_array($user->user_type, ['staff', 'teacher'])) {
        return redirect()->route('teacher.dashboard');
    }

    return redirect()->route('user.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [\App\Http\Controllers\Student\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\Student\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [\App\Http\Controllers\Student\ProfileController::class, 'destroy'])->name('profile.destroy');
});
// Portals Route
Route::get('/staff-faculty-portal', function () {
    return Inertia::render('Frontend/Portals');
})->name('portals.index');

Route::get('/school-offices', function () {
    return Inertia::render('Frontend/SchoolOffices');
})->name('school-offices');

Route::get('/school-offices/{id}', function ($id) {
    return Inertia::render('Frontend/SchoolOfficeDetails', [
        'id' => $id
    ]);
})->name('school-offices.show');

// Faculties Routes
Route::get('/faculties', [\App\Http\Controllers\Frontend\FacultyController::class, 'index'])->name('faculties.index');
Route::get('/faculties/{id}', [\App\Http\Controllers\Frontend\FacultyController::class, 'show'])->name('faculties.show');

// Gallery & Events Routes
Route::get('/gallery', function () {
    return Inertia::render('Frontend/Gallery');
})->name('gallery');

// Academics Route
Route::get('/academics/resources', [\App\Http\Controllers\Frontend\AcademicResourceController::class, 'index'])->name('academics.resources');

Route::get('/admissions', function () {
    return Inertia::render('Frontend/Admissions');
})->name('admissions');

Route::get('/events', function () {
    return Inertia::render('Frontend/Events');
})->name('events');

Route::get('/notices', [\App\Http\Controllers\Frontend\NoticeController::class, 'index'])->name('notices.index');
Route::get('/notices/{id}', [\App\Http\Controllers\Frontend\NoticeController::class, 'show'])->name('notices.show');

Route::get('/coming-soon', function () {
    return Inertia::render('Errors/ComingSoon');
})->name('coming.soon');

require __DIR__.'/auth.php';

// Sexual Harassment Complaint Routes
Route::get('/sexual-harassment-report', [\App\Http\Controllers\Frontend\HarassmentComplaintController::class, 'create'])->name('complaints.create');
Route::post('/sexual-harassment-report', [\App\Http\Controllers\Frontend\HarassmentComplaintController::class, 'store'])->name('complaints.store');

Route::get('/info/{slug}', [\App\Http\Controllers\Frontend\PageController::class, 'show'])->name('frontend.pages.show');
