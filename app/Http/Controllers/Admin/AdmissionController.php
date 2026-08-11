<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\Course;
use App\Models\Batch;
use App\Models\FeeType;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\User;
use App\Models\GuardianProfile;
use App\Models\OperationalIncome;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Hash;

class AdmissionController extends Controller
{
    public function create()
    {
        $courses = Course::with('subjects')->where('status', 'active')->get();
        $batches = Batch::with(['course', 'subject', 'teacher'])->where('status', 'active')->get();
        $feeTypes = FeeType::all();

        return Inertia::render('Admin/Admissions/Create', [
            'courses' => $courses,
            'batches' => $batches,
            'feeTypes' => $feeTypes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'required|in:male,female,other',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'guardian_name' => 'required|string|max:255',
            'guardian_phone' => 'required|string|max:20',
            'school_college' => 'nullable|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'batch_id' => 'required|exists:batches,id',
            
            // Payment Fields
            'admission_fee' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string', // Cash, bKash, Nagad, Bank, Online
            'remarks' => 'nullable|string',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        $batch = Batch::findOrFail($validated['batch_id']);

        // Auto Generate Student ID
        $studentCount = StudentProfile::count() + 1;
        $studentIdStr = 'CSM-' . date('Y') . '-' . str_pad($studentCount, 4, '0', STR_PAD_LEFT);

        // Auto Generate User
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? strtolower($studentIdStr) . '@student.local',
            'phone' => $validated['phone'],
            'user_type' => 'student',
            'password' => Hash::make('12345678'),
        ]);

        // Find/Create Guardian Profile
        $guardian = GuardianProfile::firstOrCreate(
            ['phone' => $validated['guardian_phone']],
            [
                'guardian_id' => 'GRD-' . rand(100, 999),
                'name' => $validated['guardian_name'],
            ]
        );

        // Student Profile
        $student = StudentProfile::create([
            'user_id' => $user->id,
            'student_id' => $studentIdStr,
            'name' => $validated['name'],
            'dob' => $validated['dob'],
            'gender' => $validated['gender'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'address' => $validated['address'],
            'guardian_name' => $validated['guardian_name'],
            'guardian_phone' => $validated['guardian_phone'],
            'guardian_id' => $guardian->id,
            'school_college' => $validated['school_college'],
            'course_id' => $course->id,
            'batch_id' => $batch->id,
            'admission_date' => date('Y-m-d'),
            'status' => 'active',
            'notes' => $validated['remarks'],
        ]);

        // Create Admission Fee Invoice
        $feeAmount = (float)$validated['admission_fee'];
        $discount = (float)($validated['discount'] ?? 0);
        $netAmount = max(0, $feeAmount - $discount);
        $paidAmount = (float)$validated['paid_amount'];
        $dueAmount = max(0, $netAmount - $paidAmount);

        $invoice = FeeInvoice::create([
            'invoice_no' => 'INV-' . date('Ymd') . '-' . rand(1000, 9999),
            'student_id' => $student->id,
            'title' => 'Admission & Registration Fee (' . $course->title . ')',
            'amount' => $feeAmount,
            'discount' => $discount,
            'net_amount' => $netAmount,
            'paid_amount' => $paidAmount,
            'due_amount' => $dueAmount,
            'due_date' => date('Y-m-d'),
            'status' => $dueAmount == 0 ? 'paid' : ($paidAmount > 0 ? 'partial' : 'unpaid'),
        ]);

        // Record Fee Payment & Generate Receipt
        $receipt = null;
        if ($paidAmount > 0) {
            $receipt = FeePayment::create([
                'receipt_no' => 'RCP-' . date('Ymd') . '-' . rand(1000, 9999),
                'student_id' => $student->id,
                'invoice_id' => $invoice->id,
                'paid_amount' => $paidAmount,
                'discount_amount' => $discount,
                'payment_method' => $validated['payment_method'],
                'previous_due' => $netAmount,
                'remaining_due' => $dueAmount,
                'payment_date' => date('Y-m-d'),
                'collected_by' => auth()->id(),
                'remarks' => $validated['remarks'] ?? 'Admission Fee Collection',
            ]);

            // Operational Income Record
            OperationalIncome::create([
                'income_no' => 'INC-' . date('Ymd') . '-' . rand(1000, 9999),
                'category' => 'Admission Fee',
                'title' => 'Admission Fee - ' . $student->name,
                'amount' => $paidAmount,
                'income_date' => date('Y-m-d'),
                'payment_method' => $validated['payment_method'],
                'source' => 'Receipt ' . $receipt->receipt_no,
                'notes' => 'Admission collection',
                'created_by' => auth()->id(),
            ]);
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'New Student Admission',
            'module' => 'Admissions',
            'description' => "Completed admission for {$student->name} ({$student->student_id}) in course {$course->title}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->route('admin.fees.receipt', $receipt ? $receipt->id : $invoice->id)
            ->with('success', "Admission completed successfully! Student ID: {$student->student_id}");
    }
}
