<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\FeeType;
use App\Models\StudentProfile;
use App\Models\OperationalIncome;
use App\Models\ActivityLog;

class FeeCollectionController extends Controller
{
    public function index(Request $request)
    {
        $query = FeeInvoice::with(['student.course', 'student.batch', 'feeType', 'payments']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('invoice_no', 'like', "%{$search}%")
                  ->orWhereHas('student', function($st) use ($search) {
                      $st->where('name', 'like', "%{$search}%")
                         ->orWhere('student_id', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $invoices = $query->latest()->paginate(15)->withQueryString();
        $feeTypes = FeeType::all();
        $students = StudentProfile::where('status', 'active')->get(['id', 'student_id', 'name', 'phone']);

        return Inertia::render('Admin/Fees/Index', [
            'invoices' => $invoices,
            'feeTypes' => $feeTypes,
            'students' => $students,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function storeInvoice(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:student_profiles,id',
            'fee_type_id' => 'nullable|exists:fee_types,id',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
        ]);

        $discount = (float)($validated['discount'] ?? 0);
        $amount = (float)$validated['amount'];
        $netAmount = max(0, $amount - $discount);

        $invoice = FeeInvoice::create([
            'invoice_no' => 'INV-' . date('Ymd') . '-' . rand(1000, 9999),
            'student_id' => $validated['student_id'],
            'fee_type_id' => $validated['fee_type_id'],
            'title' => $validated['title'],
            'amount' => $amount,
            'discount' => $discount,
            'net_amount' => $netAmount,
            'paid_amount' => 0,
            'due_amount' => $netAmount,
            'due_date' => $validated['due_date'] ?? date('Y-m-d'),
            'status' => 'unpaid',
        ]);

        return redirect()->back()->with('success', 'Fee invoice created successfully.');
    }

    public function collectPayment(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:fee_invoices,id',
            'paid_amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string', // Cash, bKash, Nagad, Bank, Online
            'remarks' => 'nullable|string',
        ]);

        $invoice = FeeInvoice::with('student')->findOrFail($validated['invoice_id']);

        $paidAmount = (float)$validated['paid_amount'];
        $previousDue = (float)$invoice->due_amount;
        $remainingDue = max(0, $previousDue - $paidAmount);

        $newPaidTotal = $invoice->paid_amount + $paidAmount;
        $newStatus = $remainingDue == 0 ? 'paid' : 'partial';

        $invoice->update([
            'paid_amount' => $newPaidTotal,
            'due_amount' => $remainingDue,
            'status' => $newStatus,
        ]);

        $payment = FeePayment::create([
            'receipt_no' => 'RCP-' . date('Ymd') . '-' . rand(1000, 9999),
            'student_id' => $invoice->student_id,
            'invoice_id' => $invoice->id,
            'paid_amount' => $paidAmount,
            'discount_amount' => 0,
            'payment_method' => $validated['payment_method'],
            'previous_due' => $previousDue,
            'remaining_due' => $remainingDue,
            'payment_date' => date('Y-m-d'),
            'collected_by' => auth()->id(),
            'remarks' => $validated['remarks'],
        ]);

        // Record Operational Income
        OperationalIncome::create([
            'income_no' => 'INC-' . date('Ymd') . '-' . rand(1000, 9999),
            'category' => 'Fee Collection',
            'title' => $invoice->title . ' - ' . $invoice->student->name,
            'amount' => $paidAmount,
            'income_date' => date('Y-m-d'),
            'payment_method' => $validated['payment_method'],
            'source' => 'Receipt ' . $payment->receipt_no,
            'notes' => $validated['remarks'],
            'created_by' => auth()->id(),
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Fee Collected',
            'module' => 'Fees',
            'description' => "Collected ৳{$paidAmount} for Invoice #{$invoice->invoice_no} (Receipt #{$payment->receipt_no})",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->route('admin.fees.receipt', $payment->id)
            ->with('success', "Payment collected successfully! Receipt #{$payment->receipt_no}");
    }
}
