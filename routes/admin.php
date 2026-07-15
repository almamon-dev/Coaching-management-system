<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


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

    // Notices & Events
    Route::middleware('permission:view-notices')->group(function () {
        Route::resource('notices', \App\Http\Controllers\Admin\NoticeController::class);
    });

    Route::middleware('permission:view-events')->group(function () {
        Route::resource('events', \App\Http\Controllers\Admin\EventController::class);
        Route::post('events/{event}/approve', [\App\Http\Controllers\Admin\EventController::class, 'approve'])->name('events.approve');
        Route::post('events/{event}/reject', [\App\Http\Controllers\Admin\EventController::class, 'reject'])->name('events.reject');
    });

    // Gallery / Campus Life Management
    Route::resource('galleries', \App\Http\Controllers\Admin\GalleryController::class);

    // Founders & Land Donors
    Route::resource('founders', \App\Http\Controllers\Admin\FounderController::class)->except(['create', 'show', 'edit']);

    // Important Links (Notice Board section)
    Route::resource('important-links', \App\Http\Controllers\Admin\ImportantLinkController::class)->except(['create', 'show', 'edit']);

    // Attendance Management
    Route::middleware('permission:view-attendance')->group(function () {
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
    });

    // Examination Management
    Route::middleware('permission:view-examinations')->group(function () {
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
    });

    // Academic Setup
    Route::middleware('permission:view-academic')->group(function () {
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
    });

    // Fees Management
    Route::middleware('permission:view-fees')->group(function () {
        Route::resource('fee-types', \App\Http\Controllers\Admin\Fees\FeeTypeController::class)->except(['create', 'edit', 'show']);
        Route::post('fee-groups/bulk-destroy', [\App\Http\Controllers\Admin\Fees\FeeGroupController::class, 'bulkDestroy'])->name('fee-groups.bulk-destroy');
        Route::resource('fee-groups', \App\Http\Controllers\Admin\Fees\FeeGroupController::class)->except(['create', 'edit', 'show']);
        
        // Invoices and Collections
        Route::get('fee-invoices/generate', [\App\Http\Controllers\Admin\Fees\FeeInvoiceController::class, 'generate'])->name('fee-invoices.generate');
        Route::post('fee-invoices/bulk-store', [\App\Http\Controllers\Admin\Fees\FeeInvoiceController::class, 'storeBulk'])->name('fee-invoices.bulk-store');
        Route::resource('fee-invoices', \App\Http\Controllers\Admin\Fees\FeeInvoiceController::class)->only(['index', 'show', 'destroy']);
        
        Route::get('fee-collections', [\App\Http\Controllers\Admin\Fees\FeeCollectionController::class, 'index'])->name('fee-collections.index');
        Route::post('fee-collections', [\App\Http\Controllers\Admin\Fees\FeeCollectionController::class, 'store'])->name('fee-collections.store');
    });

    // Student Management
    Route::middleware('permission:view-students')->group(function () {
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
    });

    // Teacher Management
    Route::middleware('permission:view-teachers')->group(function () {
        Route::post('teachers/bulk-delete', [\App\Http\Controllers\Admin\Staff\TeacherController::class, 'bulkDestroy'])->name('teachers.bulk-delete');
        Route::resource('teachers', \App\Http\Controllers\Admin\Staff\TeacherController::class);
        
        Route::get('teacher-promotions', [\App\Http\Controllers\Admin\Teachers\TeacherPromotionController::class, 'index'])->name('teacher-promotions.index');
        Route::post('teacher-promotions', [\App\Http\Controllers\Admin\Teachers\TeacherPromotionController::class, 'store'])->name('teacher-promotions.store');
    });

    // Reports
    Route::middleware('permission:view-reports')->group(function () {
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('promotions', [\App\Http\Controllers\Admin\Reports\PromotionReportController::class, 'index'])->name('promotions.index');
            Route::get('students', [\App\Http\Controllers\Admin\Reports\StudentReportController::class, 'index'])->name('students.index');
            Route::get('teachers', [\App\Http\Controllers\Admin\Reports\TeacherReportController::class, 'index'])->name('teachers.index');
            Route::get('attendance', [\App\Http\Controllers\Admin\Reports\AttendanceReportController::class, 'index'])->name('attendance.index');
            Route::get('exams', [\App\Http\Controllers\Admin\Reports\ExamReportController::class, 'index'])->name('exams.index');
        });
    });

    // Sexual Harassment Management
    Route::resource('harassment-complaints', \App\Http\Controllers\Admin\HarassmentComplaintController::class)->only(['index', 'show', 'destroy'])->middleware('permission:view-reports');
    Route::put('harassment-complaints/{complaint}/status', [\App\Http\Controllers\Admin\HarassmentComplaintController::class, 'updateStatus'])->name('harassment-complaints.update-status')->middleware('permission:view-reports');

    // Academic Resources Management
    Route::resource('academic-resources', \App\Http\Controllers\Admin\AcademicResourceController::class)->only(['index', 'store', 'destroy']);

    Route::get('/dashboard', [\App\Http\Controllers\Admin\Dashboard\DashboardController::class, 'index'])->name('dashboard');
    
    // Settings Routes
    Route::middleware('permission:view-settings')->group(function () {
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
