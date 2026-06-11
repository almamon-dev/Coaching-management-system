<?php

use App\Http\Controllers\User\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    if (auth()->user()->user_type === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('user.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'user'])->group(function () {
    Route::get('/user/dashboard', [\App\Http\Controllers\User\DashboardController::class, 'index'])->name('user.dashboard');
    Route::get('/user/security', [\App\Http\Controllers\User\DashboardController::class, 'security'])->name('user.security');
    Route::get('/user/notifications', [\App\Http\Controllers\User\DashboardController::class, 'notifications'])->name('user.notifications.index');
    Route::post('/user/notifications/read-all', [\App\Http\Controllers\User\DashboardController::class, 'markNotificationsAsRead'])->name('user.notifications.read-all');

    // Attendance
    Route::get('/user/attendance', [\App\Http\Controllers\AttendanceController::class, 'myAttendance'])->name('user.attendance');
    Route::get('/user/mark-attendance', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('user.mark-attendance');

    // Customer Support Tickets
    Route::prefix('user/tickets')->name('dashboard.tickets.')->group(function () {
        Route::get('/', [\App\Http\Controllers\User\TicketController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\User\TicketController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\User\TicketController::class, 'store'])->name('store');
        Route::get('/{ticket}', [\App\Http\Controllers\User\TicketController::class, 'show'])->name('show');
        Route::post('/{ticket}/reply', [\App\Http\Controllers\User\TicketController::class, 'reply'])->name('reply');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::prefix('admin')->middleware('admin')->name('admin.')->group(function () {
        // Blog Management
        Route::post('blogs/bulk-update-status', [\App\Http\Controllers\Admin\Blog\BlogController::class, 'bulkUpdateStatus'])->name('blogs.bulk-update-status');
        Route::delete('blogs/bulk-destroy', [\App\Http\Controllers\Admin\Blog\BlogController::class, 'bulkDestroy'])->name('blogs.bulk-destroy');
        Route::patch('blogs/{blog}/status', [\App\Http\Controllers\Admin\Blog\BlogController::class, 'updateStatus'])->name('blogs.status');
        Route::resource('blogs', \App\Http\Controllers\Admin\Blog\BlogController::class);

        // Page Management
        Route::post('pages/bulk-update-status', [\App\Http\Controllers\Admin\Page\PageController::class, 'bulkUpdateStatus'])->name('pages.bulk-update-status');
        Route::delete('pages/bulk-destroy', [\App\Http\Controllers\Admin\Page\PageController::class, 'bulkDestroy'])->name('pages.bulk-destroy');
        Route::patch('pages/{page}/status', [\App\Http\Controllers\Admin\Page\PageController::class, 'updateStatus'])->name('pages.status');
        Route::resource('pages', \App\Http\Controllers\Admin\Page\PageController::class);

        // Attendance Management
        Route::get('attendance', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('attendance', [\App\Http\Controllers\AttendanceController::class, 'store'])->name('attendance.store');

        // Academic Setup
        Route::post('classes/bulk-destroy', [\App\Http\Controllers\Admin\AcademicClassController::class, 'bulkDestroy'])->name('classes.bulk-destroy');
        Route::resource('classes', \App\Http\Controllers\Admin\AcademicClassController::class);
        
        Route::post('sections/bulk-destroy', [\App\Http\Controllers\Admin\SectionController::class, 'bulkDestroy'])->name('sections.bulk-destroy');
        Route::resource('sections', \App\Http\Controllers\Admin\SectionController::class);
        Route::resource('academic_sessions', \App\Http\Controllers\Admin\AcademicSessionController::class);
        Route::resource('subjects', \App\Http\Controllers\Admin\SubjectController::class);
        Route::resource('class_routines', \App\Http\Controllers\Admin\ClassRoutineController::class);

        // Student Management
        Route::resource('students', \App\Http\Controllers\Admin\StudentController::class);

        // Teacher Management
        Route::resource('teachers', \App\Http\Controllers\Admin\TeacherController::class);

        Route::get('/dashboard', [\App\Http\Controllers\Admin\Dashboard\DashboardController::class, 'index'])->name('dashboard');
        
        // Settings Routes
        Route::prefix('settings')->name('settings.')->group(function () {
            // General Settings
            Route::prefix('general')->name('general.')->group(function () {
                Route::get('profile', [\App\Http\Controllers\Admin\Settings\ProfileController::class, 'index'])->name('profile');
                Route::post('profile/update', [\App\Http\Controllers\Admin\Settings\ProfileController::class, 'update'])->name('profile.update');
                Route::post('profile/remove-picture', [\App\Http\Controllers\Admin\Settings\ProfileController::class, 'removePicture'])->name('profile.remove-picture');
                Route::get('security', function () {
                    return Inertia::render('Admin/Settings/General/SecurityPage');
                })->name('security');
                Route::get('notifications', function () {
                    return Inertia::render('Admin/Settings/General/NotificationsPage');
                })->name('notifications');
            });

            // Website Settings
            Route::prefix('website')->name('website.')->group(function () {
                Route::get('system', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'websiteSystem'])->name('system');
                Route::get('company', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'companySettings'])->name('company');
                Route::get('localization', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'localizationSettings'])->name('localization');
                Route::post('localization', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'updateLocalizationSettings'])->name('localization.update');
                Route::get('prefixes', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'prefixesSettings'])->name('prefixes');
                Route::get('preference', function () {
                    return Inertia::render('Admin/Settings/Website/PreferencePage');
                })->name('preference');
                Route::get('appearance', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'appearanceSettings'])->name('appearance');
                Route::get('social-auth', function () {
                    return Inertia::render('Admin/Settings/Website/SocialAuthenticationPage');
                })->name('social-auth');
            });

            // System Settings
            Route::prefix('system')->name('system.')->group(function () {
                Route::get('email', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'emailSettings'])->name('email');
                Route::post('email/update', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'updateEmail'])->name('email.update');
                Route::get('storage', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'storageSettings'])->name('storage');
                Route::post('storage/update', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'updateStorage'])->name('storage.update');
                Route::get('sms', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'SMS Settings']);
                })->name('sms');
                Route::get('otp', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'OTP Settings']);
                })->name('otp');
                Route::get('gdpr', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'GDPR Settings']);
                })->name('gdpr');
            });

            // Generic Update Route
            Route::post('update', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'update'])->name('update');

            // Other Settings
            Route::prefix('other')->name('other.')->group(function () {
                Route::get('storage', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'Storage Settings']);
                })->name('storage');
                Route::get('ban-ip', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'Ban IP Address']);
                })->name('ban-ip');
            });
        });

        // Access Control (Protected: Super Admin Only)
        Route::middleware('role:Super Admin')->group(function () {
            // Users Management
            Route::post('users/bulk-destroy', [\App\Http\Controllers\Admin\Users\UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
            Route::post('users/bulk-update-status', [\App\Http\Controllers\Admin\Users\UserController::class, 'bulkUpdateStatus'])->name('users.bulk-update-status');
            Route::resource('users', \App\Http\Controllers\Admin\Users\UserController::class)->except(['show']);

            // Roles & Permissions Management
            Route::post('roles/bulk-destroy', [\App\Http\Controllers\Admin\Roles\RoleController::class, 'bulkDestroy'])->name('roles.bulk-destroy');
            Route::resource('roles', \App\Http\Controllers\Admin\Roles\RoleController::class);
            Route::post('permissions', [\App\Http\Controllers\Admin\Roles\RoleController::class, 'storePermission'])->name('permissions.store');
        });

        // Administrative Support Tickets (Accessible by Super Admin and Customer Support roles)
        Route::middleware('role_or_permission:Super Admin|Customer Support')->group(function () {
            Route::post('tickets/{ticket}/reply', [\App\Http\Controllers\Admin\Tickets\TicketController::class, 'reply'])->name('tickets.reply');
            Route::patch('tickets/{ticket}/assign', [\App\Http\Controllers\Admin\Tickets\TicketController::class, 'assign'])->name('tickets.assign');
            Route::patch('tickets/{ticket}/status', [\App\Http\Controllers\Admin\Tickets\TicketController::class, 'updateStatus'])->name('tickets.status');
            Route::patch('tickets/{ticket}/priority', [\App\Http\Controllers\Admin\Tickets\TicketController::class, 'updatePriority'])->name('tickets.priority');
            Route::resource('tickets', \App\Http\Controllers\Admin\Tickets\TicketController::class)->only(['index', 'show']);
        });

        // Notifications
        Route::get('notifications', [\App\Http\Controllers\Admin\Notification\NotificationController::class, 'index'])->name('notifications.index');
        Route::post('notifications/read-all', [\App\Http\Controllers\Admin\Notification\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    });

});

// Portals Route
Route::get('/staff-faculty-portal', function () {
    return \Inertia\Inertia::render('Frontend/Portals');
})->name('portals.index');

Route::get('/school-offices', function () {
    return \Inertia\Inertia::render('Frontend/SchoolOffices');
})->name('school-offices');

Route::get('/school-offices/{id}', function ($id) {
    return \Inertia\Inertia::render('Frontend/SchoolOfficeDetails', [
        'id' => $id
    ]);
})->name('school-offices.show');

// Faculties Routes
Route::get('/faculties', [\App\Http\Controllers\Frontend\FacultyController::class, 'index'])->name('faculties.index');
Route::get('/faculties/{id}', [\App\Http\Controllers\Frontend\FacultyController::class, 'show'])->name('faculties.show');

// Gallery & Events Routes
Route::get('/gallery', function () {
    return \Inertia\Inertia::render('Frontend/Gallery');
})->name('gallery');

Route::get('/admissions', function () {
    return \Inertia\Inertia::render('Frontend/Admissions');
})->name('admissions');

Route::get('/events', function () {
    return \Inertia\Inertia::render('Frontend/Events');
})->name('events');

Route::get('/notices/{id}', [\App\Http\Controllers\Frontend\NoticeController::class, 'show'])->name('notices.show');

Route::get('/coming-soon', function () {
    return \Inertia\Inertia::render('Errors/ComingSoon');
})->name('coming.soon');

require __DIR__.'/auth.php';

Route::get('/info/{slug}', [\App\Http\Controllers\Frontend\PageController::class, 'show'])->name('frontend.pages.show');
