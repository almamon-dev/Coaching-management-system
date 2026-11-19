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
use App\Models\AcademicInquiry;

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

        // Subject-wise Summary (Latest 2 active subjects)
        $subjectSummary = Course::withCount(['batches', 'students'])
            ->with(['batches' => function ($q) {
                $q->where('status', 'active')->withCount('students')->latest('id');
            }])
            ->where('status', 'active')
            ->latest('id')
            ->take(2)
            ->get()
            ->map(function ($c) {
                $firstBatchWithImage = $c->batches->first(fn($b) => !empty($b->image));
                $image = $firstBatchWithImage ? $firstBatchWithImage->image : null;

                if (!$image) {
                    $t = strtolower($c->title);
                    if (str_contains($t, 'physics')) {
                        $image = '/images/batches/batch_physics.jpg';
                    } elseif (str_contains($t, 'higher math') || str_contains($t, 'math')) {
                        $image = '/images/batches/batch_higher_math.jpg';
                    } elseif (str_contains($t, 'chemistry')) {
                        $image = '/images/batches/batch_chemistry.jpg';
                    } elseif (str_contains($t, 'ict')) {
                        $image = '/images/batches/batch_ict.jpg';
                    } elseif (str_contains($t, 'class 9')) {
                        $image = '/images/batches/batch_class9.jpg';
                    } elseif (str_contains($t, 'class 10') || str_contains($t, 'ssc')) {
                        $image = '/images/batches/batch_class10.jpg';
                    } else {
                        $image = '/images/batches/batch_revision.jpg';
                    }
                }

                return [
                    'id' => $c->id,
                    'title' => $c->title,
                    'code' => $c->code,
                    'category' => $c->category,
                    'fee' => (float)$c->fee,
                    'image' => $image,
                    'batches_count' => $c->batches_count,
                    'students_count' => $c->students_count,
                    'batches' => $c->batches->map(fn($b) => [
                        'id' => $b->id,
                        'name' => $b->name,
                        'image' => $b->image,
                        'class_days' => $b->class_days,
                        'class_time' => $b->class_time,
                        'students_count' => (int)$b->students_count,
                    ])->values()->toArray(),
                ];
            });

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

        // Recent Academic Inquiries from Website
        $recentInquiries = AcademicInquiry::latest()->take(5)->get();
        $pendingInquiriesCount = AcademicInquiry::where('status', 'pending')->count();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'total_students' => $totalStudents,
                'active_students' => $activeStudents,
                'teachers_count' => $teachersCount,
                'batches_count' => $batchesCount,
                'todays_classes' => $todaysClassesCount,
                'todays_attendance' => $todaysAttendanceCount,
                'todays_collection' => (float)$todaysCollection,
                'total_due' => (float)$totalDue,
                'monthly_income' => (float)$monthlyIncome,
                'monthly_expense' => (float)$monthlyExpense,
                'current_balance' => (float)$currentBalance,
                'pending_inquiries' => $pendingInquiriesCount,
            ],
            'recentInquiries' => $recentInquiries,
            'todaysClasses' => $todaysClasses,
            'subjectSummary' => $subjectSummary,
            'batchDistribution' => $batchDistribution,
            'financialTrend' => $financialTrend,
        ]);
    }
}
