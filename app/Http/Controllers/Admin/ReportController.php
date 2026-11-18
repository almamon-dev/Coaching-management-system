<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\Attendance;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\OperationalExpense;
use App\Models\OperationalIncome;
use App\Models\Result;
use App\Models\Course;
use App\Models\Batch;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'students');
        $courseId = $request->input('course_id');
        $batchId = $request->input('batch_id');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $batches = Course::where('status', 'active')->get();
        $batches = Batch::where('status', 'active')->get();

        $data = [];

        if ($type === 'students') {
            $query = StudentProfile::with(['course', 'batch']);
            if ($courseId) $query->where('course_id', $courseId);
            if ($batchId) $query->where('batch_id', $batchId);
            $data = $query->latest()->get();
        } elseif ($type === 'attendance') {
            $query = Attendance::with(['student', 'batch']);
            if ($batchId) $query->where('batch_id', $batchId);
            if ($startDate && $endDate) $query->whereBetween('date', [$startDate, $endDate]);
            $data = $query->latest()->get();
        } elseif ($type === 'fees') {
            $query = FeePayment::with(['student.course', 'student.batch']);
            if ($startDate && $endDate) $query->whereBetween('payment_date', [$startDate, $endDate]);
            $data = $query->latest()->get();
        } elseif ($type === 'financial') {
            $expenses = OperationalExpense::latest();
            $incomes = OperationalIncome::latest();
            if ($startDate && $endDate) {
                $expenses->whereBetween('expense_date', [$startDate, $endDate]);
                $incomes->whereBetween('income_date', [$startDate, $endDate]);
            }
            $data = [
                'expenses' => $expenses->get(),
                'incomes' => $incomes->get(),
                'total_income' => (float)($incomes->sum('amount') + FeePayment::sum('paid_amount')),
                'total_expense' => (float)$expenses->sum('amount'),
            ];
        } elseif ($type === 'academic') {
            $query = Result::with(['student', 'exam']);
            $data = $query->latest()->get();
        }

        return Inertia::render('Admin/Reports/Index', [
            'type' => $type,
            'batches' => $batches,
            'batches' => $batches,
            'data' => $data,
            'filters' => $request->only(['type', 'course_id', 'batch_id', 'start_date', 'end_date']),
        ]);
    }
}
