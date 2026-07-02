<?php

namespace App\Http\Controllers\Admin\Fees;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use Illuminate\Support\Facades\DB;

class FeeCollectionController extends Controller
{
    public function index(Request $request)
    {
        // For POS view, we find invoices by student ID or invoice number
        $query = FeeInvoice::with(['student.studentProfile', 'academicClass', 'items.feeType', 'payments']);
        
        $search = $request->search;
        if ($search) {
            $query->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('student', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('studentProfile', function($sq) use ($search) {
                            $sq->where('student_id', 'like', "%{$search}%");
                        });
                  });
        } else {
            // Don't load all if no search to keep it clean, or load latest pending
            $query->where('status', '!=', 'paid')->latest()->limit(10);
        }
        
        $invoices = $query->get();
        
        return Inertia::render('Admin/Fees/Collections/Index', [
            'invoices' => $invoices,
            'filters' => $request->only('search')
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fee_invoice_id' => 'required|exists:fee_invoices,id',
            'amount_paid' => 'required|numeric|min:1',
            'fine_paid' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string',
            'transaction_id' => 'nullable|string',
            'payment_date' => 'required|date',
            'note' => 'nullable|string'
        ]);
        
        DB::beginTransaction();
        try {
            $invoice = FeeInvoice::lockForUpdate()->findOrFail($validated['fee_invoice_id']);
            
            // Check if amount exceeds pending amount
            $pendingAmount = $invoice->total_amount - $invoice->paid_amount - $invoice->discount_amount;
            
            // We allow overpaying? Usually no. Let's cap it or show error.
            if ($validated['amount_paid'] > $pendingAmount + 0.01) { // 0.01 for float margin
                return back()->withErrors(['amount_paid' => 'Amount exceeds the pending balance.']);
            }
            
            $payment = FeePayment::create([
                'fee_invoice_id' => $invoice->id,
                'collected_by' => auth()->id(),
                'payment_method' => $validated['payment_method'],
                'transaction_id' => $validated['transaction_id'] ?? null,
                'amount_paid' => $validated['amount_paid'],
                'fine_paid' => $validated['fine_paid'] ?? 0,
                'payment_date' => $validated['payment_date'],
                'note' => $validated['note']
            ]);
            
            $invoice->paid_amount += $validated['amount_paid'];
            $invoice->fine_amount += $validated['fine_paid'] ?? 0;
            
            $newPending = $invoice->total_amount - $invoice->paid_amount - $invoice->discount_amount;
            if ($newPending <= 0.01) {
                $invoice->status = 'paid';
            } else {
                $invoice->status = 'partial';
            }
            
            $invoice->save();
            
            DB::commit();
            return back()->with('success', 'Payment collected successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Payment failed: ' . $e->getMessage());
        }
    }
}
