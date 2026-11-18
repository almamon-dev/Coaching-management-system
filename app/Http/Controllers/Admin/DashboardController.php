<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\Course;
use App\Models\Batch;
use App\Models\ClassRoutine;
use App\Models\Attendance;
use App\Models\FeePayment;
use App\Models\FeeInvoice;
use App\Models\OperationalExpense;
use App\Models\OperationalIncome;

class DashboardController extends Controller
{
    public function index()
    {
        $today = date('Y-m-d');
        $currentMonth = date('Y-m');

        $totalStudents = StudentProfile::count();
        $activeStudents = StudentProfile::where('status', 'active')->count();
        $teachersCount = TeacherProfile::where('status', 'active')->count();
        $batchesCount = Course::where('status', 'active')->count();
        $batchesCount = Batch::where('status', 'active')->count();

        $todaysClassesCount = ClassRoutine::whereDate('class_date', $today)->count();
        $todaysAttendanceCount = Attendance::whereDate('date', $today)->where('status', 'present')->count();
        $todaysCollection = FeePayment::whereDate('payment_date', $today)->sum('paid_amount');

        $totalDue = FeeInvoice::sum('due_amount');

        $monthlyFeeIncome = FeePayment::where('payment_date', 'like', "$currentMonth%")->sum('paid_amount');
        $monthlyOtherIncome = OperationalIncome::where('income_date', 'like', "$currentMonth%")->sum('amount');
        $monthlyIncome = $monthlyFeeIncome + $monthlyOtherIncome;

        $monthlyExpense = OperationalExpense::where('expense_date', 'like', "$currentMonth%")->sum('amount');
        $currentBalance = (FeePayment::sum('paid_amount') + OperationalIncome::sum('amount')) - OperationalExpense::sum('amount');

        // Today's classes list
        $todaysClasses = ClassRoutine::with(['batch.course', 'batch.teacher', 'subject', 'teacher'])
            ->whereDate('class_date', $today)
            ->orderBy('start_time', 'asc')
            ->get();

        // Subject-wise Summary (for Single Teacher / Multi-Subject view)
        $subjectSummary = Course::withCount(['batches', 'students'])
            ->where('status', 'active')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'code' => $c->code,
                'category' => $c->category,
                'fee' => (float)$c->fee,
                'batches_count' => $c->batches_count,
                'students_count' => $c->students_count,
            ]);

        // Chart Data
        $batchDistribution = Batch::withCount('students')
            ->where('status', 'active')
            ->get()
            ->map(function ($b) {
                $shortName = $b->name;
                if (preg_match('/^([A-Za-z]+-\d+)/i', $b->name, $m)) {
                    $shortName = $m[1];
                } elseif (strlen($b->name) > 14) {
                    $shortName = substr($b->name, 0, 12) . '...';
                }
                return [
                    'name' => $shortName,
                    'fullName' => $b->name,
                    'students' => (int)$b->students_count,
                ];
            });

        // Monthly Financial Trend (Last 6 Months)
        $financialTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = date('Y-m', strtotime("-$i months"));
            $mLabel = date('M Y', strtotime("-$i months"));
            $inc = FeePayment::where('payment_date', 'like', "$m%")->sum('paid_amount') + OperationalIncome::where('income_date', 'like', "$m%")->sum('amount');
            $exp = OperationalExpense::where('expense_date', 'like', "$m%")->sum('amount');
            $financialTrend[] = [
                'month' => $mLabel,
                'income' => (float)$inc,
                'expense' => (float)$exp,
            ];
        }

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'total_students' => $totalStudents,
                'active_students' => $activeStudents,
                'teachers_count' => $teachersCount,
                'batches_count' => $batchesCount,
                'batches_count' => $batchesCount,
                'todays_classes' => $todaysClassesCount,
                'todays_attendance' => $todaysAttendanceCount,
                'todays_collection' => (float)$todaysCollection,
                'total_due' => (float)$totalDue,
                'monthly_income' => (float)$monthlyIncome,
                'monthly_expense' => (float)$monthlyExpense,
                'current_balance' => (float)$currentBalance,
            ],
            'todaysClasses' => $todaysClasses,
            'subjectSummary' => $subjectSummary,
            'batchDistribution' => $batchDistribution,
            'financialTrend' => $financialTrend,
        ]);
    }
}
