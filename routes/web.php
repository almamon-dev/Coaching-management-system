<?php

use App\Http\Controllers\User\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\RollGenerationController;

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
        
        // Attendance Reports
        Route::get('attendance/daily-report', [\App\Http\Controllers\Admin\AttendanceReportController::class, 'dailyReport'])->name('attendance.daily_report');
        Route::get('attendance/monthly-report', [\App\Http\Controllers\Admin\AttendanceReportController::class, 'monthlyReport'])->name('attendance.monthly_report');
        Route::get('attendance/analytics', [\App\Http\Controllers\Admin\AttendanceReportController::class, 'analytics'])->name('attendance.analytics');
        Route::get('attendance/export-daily', [\App\Http\Controllers\Admin\AttendanceReportController::class, 'exportDaily'])->name('attendance.export_daily');
        Route::get('attendance/export-monthly', [\App\Http\Controllers\Admin\AttendanceReportController::class, 'exportMonthly'])->name('attendance.export_monthly');

        // Teacher Attendance
        Route::get('teacher-attendance', [\App\Http\Controllers\Admin\TeacherAttendanceController::class, 'index'])->name('teacher_attendance.index');
        Route::post('teacher-attendance', [\App\Http\Controllers\Admin\TeacherAttendanceController::class, 'store'])->name('teacher_attendance.store');

        // Examination Management
        Route::post('exams/bulk-destroy', [\App\Http\Controllers\Admin\ExamController::class, 'bulkDestroy'])->name('exams.bulk-destroy');
        Route::resource('exams', \App\Http\Controllers\Admin\ExamController::class);
        
        Route::resource('grades', \App\Http\Controllers\Admin\GradeController::class)->except(['create', 'edit', 'show']);
        
        Route::get('marks-entry', [\App\Http\Controllers\Admin\MarksEntryController::class, 'index'])->name('marks.entry');
        Route::post('marks-entry', [\App\Http\Controllers\Admin\MarksEntryController::class, 'store'])->name('marks.store');
        
        Route::get('results/generation', [\App\Http\Controllers\Admin\ResultController::class, 'generation'])->name('results.generation');
        Route::post('results/generate', [\App\Http\Controllers\Admin\ResultController::class, 'generate'])->name('results.generate');
        Route::get('results/publish', [\App\Http\Controllers\Admin\ResultController::class, 'publishIndex'])->name('results.publish');
        Route::post('results/publish', [\App\Http\Controllers\Admin\ResultController::class, 'publish'])->name('results.doPublish');

        // Academic Setup
        Route::post('classes/bulk-destroy', [\App\Http\Controllers\Admin\AcademicClassController::class, 'bulkDestroy'])->name('classes.bulk-destroy');
        Route::resource('classes', \App\Http\Controllers\Admin\AcademicClassController::class);
        
        Route::post('sections/bulk-destroy', [\App\Http\Controllers\Admin\SectionController::class, 'bulkDestroy'])->name('sections.bulk-destroy');
        Route::resource('sections', \App\Http\Controllers\Admin\SectionController::class);
        Route::resource('academic_sessions', \App\Http\Controllers\Admin\AcademicSessionController::class);
        Route::resource('departments', \App\Http\Controllers\Admin\DepartmentController::class)->except(['create', 'edit', 'show']);
        Route::resource('designations', \App\Http\Controllers\Admin\DesignationController::class)->except(['create', 'edit', 'show']);
        Route::resource('subjects', \App\Http\Controllers\Admin\SubjectController::class);
        Route::get('subject-allocation', [\App\Http\Controllers\Admin\SubjectAllocationController::class, 'index'])->name('subject-allocation.index');
        Route::post('subject-allocation', [\App\Http\Controllers\Admin\SubjectAllocationController::class, 'store'])->name('subject-allocation.store');
        Route::delete('subject-allocation/{id}', [\App\Http\Controllers\Admin\SubjectAllocationController::class, 'destroy'])->name('subject-allocation.destroy');
        Route::post('subject-allocation/bulk-delete', [\App\Http\Controllers\Admin\SubjectAllocationController::class, 'bulkDelete'])->name('subject-allocation.bulk-delete');
        Route::get('class_routines/print', [\App\Http\Controllers\Admin\ClassRoutinePrintController::class, 'index'])->name('class_routines.print');
        Route::resource('class_routines', \App\Http\Controllers\Admin\ClassRoutineController::class);

        // Student Management
        Route::post('students/bulk-delete', [\App\Http\Controllers\Admin\StudentController::class, 'bulkDestroy'])->name('students.bulk-delete');
        Route::resource('students', \App\Http\Controllers\Admin\StudentController::class);
        Route::get('student-promotion', [\App\Http\Controllers\Admin\StudentPromotionController::class, 'index'])->name('student-promotion.index');
        Route::post('student-promotion', [\App\Http\Controllers\Admin\StudentPromotionController::class, 'store'])->name('student-promotion.store');
        
        // Student Transfer
        Route::get('student-transfer', [\App\Http\Controllers\Admin\StudentTransferController::class, 'index'])->name('student-transfer.index');
        Route::post('student-transfer', [\App\Http\Controllers\Admin\StudentTransferController::class, 'store'])->name('student-transfer.store');
        
        Route::post('enrollments/bulk-delete', [\App\Http\Controllers\Admin\EnrollmentController::class, 'bulkDestroy'])->name('enrollments.bulk-delete');
        Route::get('enrollments', [\App\Http\Controllers\Admin\EnrollmentController::class, 'index'])->name('enrollments.index');
        
        Route::get('roll-generation', [RollGenerationController::class, 'index'])->name('roll-generation.index');
        Route::post('roll-generation', [RollGenerationController::class, 'store'])->name('roll-generation.store');

        // Teacher Management
        Route::post('teachers/bulk-delete', [\App\Http\Controllers\Admin\TeacherController::class, 'bulkDestroy'])->name('teachers.bulk-delete');
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
