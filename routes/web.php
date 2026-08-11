<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Guardian\GuardianPortalController;
use App\Http\Controllers\Frontend\HomeController;

// Home / Landing Page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Guest Frontend Navigation Routes (Required for Header, Footer & Notice board links)
Route::get('/admissions', function () {
    return Inertia::render('Frontend/Admissions');
})->name('admissions');

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

Route::get('/events', function () {
    return Inertia::render('Frontend/Events');
})->name('events');

Route::get('/gallery', function () {
    return Inertia::render('Frontend/Gallery');
})->name('gallery');

Route::get('/notices-board', function () {
    $notices = \App\Models\Notice::latest()->paginate(10);
    return Inertia::render('Frontend/Notices/Index', ['notices' => $notices]);
})->name('notices.index');

Route::get('/notices-board/{id}', function ($id) {
    $notice = \App\Models\Notice::find($id);
    return Inertia::render('Frontend/Notices/Show', ['notice' => $notice]);
})->name('notices.show');

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

// Guardian Portal Routes
Route::middleware(['auth'])->prefix('guardian')->name('guardian.')->group(function () {
    Route::get('/dashboard', [GuardianPortalController::class, 'dashboard'])->name('dashboard');
});

require __DIR__.'/auth.php';
