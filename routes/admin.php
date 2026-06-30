<?php

use Illuminate\Support\Facades\Route;

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
    Route::get('attendance', [\App\Http\Controllers\Admin\Attendance\AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('attendance', [\App\Http\Controllers\Admin\Attendance\AttendanceController::class, 'store'])->name('attendance.store');
    
    // Attendance Reports
    Route::get('attendance/daily-report', [\App\Http\Controllers\Admin\Attendance\AttendanceReportController::class, 'dailyReport'])->name('attendance.daily_report');
    Route::get('attendance/monthly-report', [\App\Http\Controllers\Admin\Attendance\AttendanceReportController::class, 'monthlyReport'])->name('attendance.monthly_report');
    Route::get('attendance/analytics', [\App\Http\Controllers\Admin\Attendance\AttendanceReportController::class, 'analytics'])->name('attendance.analytics');
    Route::get('attendance/export-daily', [\App\Http\Controllers\Admin\Attendance\AttendanceReportController::class, 'exportDaily'])->name('attendance.export_daily');
    Route::get('attendance/export-monthly', [\App\Http\Controllers\Admin\Attendance\AttendanceReportController::class, 'exportMonthly'])->name('attendance.export_monthly');

    // Teacher Attendance
    Route::get('teacher-attendance', [\App\Http\Controllers\Admin\Attendance\TeacherAttendanceController::class, 'index'])->name('teacher_attendance.index');
    Route::post('teacher-attendance', [\App\Http\Controllers\Admin\Attendance\TeacherAttendanceController::class, 'store'])->name('teacher_attendance.store');

    // Examination Management
    Route::post('exams/bulk-destroy', [\App\Http\Controllers\Admin\Examinations\ExamController::class, 'bulkDestroy'])->name('exams.bulk-destroy');
    Route::resource('exams', \App\Http\Controllers\Admin\Examinations\ExamController::class);
    Route::post('grades/bulk-destroy', [\App\Http\Controllers\Admin\Examinations\GradeController::class, 'bulkDestroy'])->name('grades.bulk-destroy');
    Route::resource('grades', \App\Http\Controllers\Admin\Examinations\GradeController::class)->except(['create', 'edit', 'show']);
    
    Route::get('marks-entry', [\App\Http\Controllers\Admin\Examinations\MarksEntryController::class, 'index'])->name('marks.entry');
    Route::post('marks-entry', [\App\Http\Controllers\Admin\Examinations\MarksEntryController::class, 'store'])->name('marks.store');
    
    Route::get('results/generation', [\App\Http\Controllers\Admin\Examinations\ResultController::class, 'generation'])->name('results.generation');
    Route::post('results/generate', [\App\Http\Controllers\Admin\Examinations\ResultController::class, 'generate'])->name('results.generate');
    Route::get('results/publish', [\App\Http\Controllers\Admin\Examinations\ResultController::class, 'publishIndex'])->name('results.publish');
    Route::post('results/publish', [\App\Http\Controllers\Admin\Examinations\ResultController::class, 'publish'])->name('results.doPublish');
    Route::get('results/{result}/report-card', [\App\Http\Controllers\Admin\Examinations\ResultController::class, 'reportCard'])->name('results.report-card');

    // Academic Setup
    Route::post('classes/bulk-destroy', [\App\Http\Controllers\Admin\Academics\AcademicClassController::class, 'bulkDestroy'])->name('classes.bulk-destroy');
    Route::resource('classes', \App\Http\Controllers\Admin\Academics\AcademicClassController::class);
    
    Route::post('sections/bulk-destroy', [\App\Http\Controllers\Admin\Academics\SectionController::class, 'bulkDestroy'])->name('sections.bulk-destroy');
    Route::resource('sections', \App\Http\Controllers\Admin\Academics\SectionController::class);
    Route::resource('academic_sessions', \App\Http\Controllers\Admin\Academics\AcademicSessionController::class);
    Route::resource('departments', \App\Http\Controllers\Admin\Staff\DepartmentController::class)->except(['create', 'edit', 'show']);
    Route::resource('designations', \App\Http\Controllers\Admin\Staff\DesignationController::class)->except(['create', 'edit', 'show']);
    Route::resource('subjects', \App\Http\Controllers\Admin\Academics\SubjectController::class);
    Route::get('subject-allocation', [\App\Http\Controllers\Admin\Academics\SubjectAllocationController::class, 'index'])->name('subject-allocation.index');
    Route::post('subject-allocation', [\App\Http\Controllers\Admin\Academics\SubjectAllocationController::class, 'store'])->name('subject-allocation.store');
    Route::delete('subject-allocation/{id}', [\App\Http\Controllers\Admin\Academics\SubjectAllocationController::class, 'destroy'])->name('subject-allocation.destroy');
    Route::post('subject-allocation/bulk-delete', [\App\Http\Controllers\Admin\Academics\SubjectAllocationController::class, 'bulkDelete'])->name('subject-allocation.bulk-delete');
    Route::get('class_routines/print', [\App\Http\Controllers\Admin\Academics\ClassRoutinePrintController::class, 'index'])->name('class_routines.print');
    Route::resource('class_routines', \App\Http\Controllers\Admin\Academics\ClassRoutineController::class);

    // Student Management
    Route::post('students/bulk-delete', [\App\Http\Controllers\Admin\Students\StudentController::class, 'bulkDestroy'])->name('students.bulk-delete');
    Route::resource('students', \App\Http\Controllers\Admin\Students\StudentController::class);
    Route::get('student-promotion', [\App\Http\Controllers\Admin\Students\StudentPromotionController::class, 'index'])->name('student-promotion.index');
    Route::post('student-promotion', [\App\Http\Controllers\Admin\Students\StudentPromotionController::class, 'store'])->name('student-promotion.store');
    
    // Student Transfer
    Route::get('student-transfer', [\App\Http\Controllers\Admin\Students\StudentTransferController::class, 'index'])->name('student-transfer.index');
    Route::post('student-transfer', [\App\Http\Controllers\Admin\Students\StudentTransferController::class, 'store'])->name('student-transfer.store');
    
    Route::post('enrollments/bulk-delete', [\App\Http\Controllers\Admin\Students\EnrollmentController::class, 'bulkDestroy'])->name('enrollments.bulk-delete');
    Route::get('enrollments', [\App\Http\Controllers\Admin\Students\EnrollmentController::class, 'index'])->name('enrollments.index');
    
    Route::get('roll-generation', [\App\Http\Controllers\Admin\Examinations\RollGenerationController::class, 'index'])->name('roll-generation.index');
    Route::post('roll-generation', [\App\Http\Controllers\Admin\Examinations\RollGenerationController::class, 'store'])->name('roll-generation.store');

    // Teacher Management
    Route::post('teachers/bulk-delete', [\App\Http\Controllers\Admin\Staff\TeacherController::class, 'bulkDestroy'])->name('teachers.bulk-delete');
    Route::resource('teachers', \App\Http\Controllers\Admin\Staff\TeacherController::class);

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
