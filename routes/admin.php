<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\AdmissionController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\BatchController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\FeeCollectionController;
use App\Http\Controllers\Admin\ReceiptController;
use App\Http\Controllers\Admin\OperationalFinancialController;
use App\Http\Controllers\Admin\ExamResultController;
use App\Http\Controllers\Admin\AssignmentController;
use App\Http\Controllers\Admin\StudyMaterialController;
use App\Http\Controllers\Admin\NoticeController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\BackupController;

// Dashboard
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

// Student Management
Route::resource('students', StudentController::class);

// Admission Management
Route::get('/admissions/create', [AdmissionController::class, 'create'])->name('admissions.create');
Route::post('/admissions', [AdmissionController::class, 'store'])->name('admissions.store');

// Subject & Batch Management
Route::resource('courses', SubjectController::class);
Route::resource('batches', BatchController::class);

// Attendance Management
Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');

// Fees & Payments
Route::get('/fees', [FeeCollectionController::class, 'index'])->name('fees.index');
Route::post('/fees/invoices', [FeeCollectionController::class, 'storeInvoice'])->name('fees.invoices.store');
Route::post('/fees/collect', [FeeCollectionController::class, 'collectPayment'])->name('fees.collect');
Route::get('/fees/receipt/{id}', [ReceiptController::class, 'show'])->name('fees.receipt');

// Operational Accounts (No HR/Salary)
Route::get('/operational-accounts', [OperationalFinancialController::class, 'index'])->name('operational-accounts.index');
Route::post('/operational-accounts/expenses', [OperationalFinancialController::class, 'storeExpense'])->name('operational-accounts.expenses.store');
Route::post('/operational-accounts/incomes', [OperationalFinancialController::class, 'storeIncome'])->name('operational-accounts.incomes.store');

// Exam & Results
Route::get('/exams', [ExamResultController::class, 'index'])->name('exams.index');
Route::post('/exams', [ExamResultController::class, 'storeExam'])->name('exams.store');
Route::get('/exams/{id}/marks', [ExamResultController::class, 'marksEntry'])->name('exams.marks');
Route::post('/exams/{id}/marks', [ExamResultController::class, 'saveMarks'])->name('exams.marks.store');
Route::get('/exams/{id}/results', [ExamResultController::class, 'showResults'])->name('exams.results');

// Assignments & Materials
Route::get('/assignments', [AssignmentController::class, 'index'])->name('assignments.index');
Route::post('/assignments', [AssignmentController::class, 'store'])->name('assignments.store');
Route::get('/assignments/{id}/submissions', [AssignmentController::class, 'submissions'])->name('assignments.submissions');
Route::post('/assignments/submissions/{id}/grade', [AssignmentController::class, 'gradeSubmission'])->name('assignments.submissions.grade');

Route::get('/study-materials', [StudyMaterialController::class, 'index'])->name('study-materials.index');
Route::post('/study-materials', [StudyMaterialController::class, 'store'])->name('study-materials.store');
Route::delete('/study-materials/{id}', [StudyMaterialController::class, 'destroy'])->name('study-materials.destroy');

// Notices
Route::resource('notices', NoticeController::class);

// Reports
Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

// Permissions & Logs
Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

// Settings & Backup
Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

Route::get('/backup', [BackupController::class, 'index'])->name('backup.index');
Route::post('/backup/run', [BackupController::class, 'run'])->name('backup.run');
