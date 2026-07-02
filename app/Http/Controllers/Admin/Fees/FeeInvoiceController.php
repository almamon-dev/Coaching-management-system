<?php

namespace App\Http\Controllers\Admin\Fees;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FeeInvoice;
use App\Models\FeeInvoiceItem;
use App\Models\AcademicClass;
use App\Models\FeeGroup;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class FeeInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = FeeInvoice::with(['student.studentProfile', 'academicClass', 'feeGroup']);
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('student', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('studentProfile', function($sq) use ($search) {
                            $sq->where('student_id', 'like', "%{$search}%");
                        });
                  });
        }
        
        if ($request->filled('class_id') && $request->class_id !== 'all') {
            $query->where('academic_class_id', $request->class_id);
        }
        
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        // Define allowed sort fields to prevent SQL injection
        $allowedSortFields = ['invoice_number', 'total_amount', 'paid_amount', 'due_date', 'status', 'created_at'];
        
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }
        
        $invoices = $query->paginate($request->get('per_page', 10))->withQueryString();
        
        $classes = AcademicClass::orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Admin/Fees/Invoices/Index', [
            'invoices' => $invoices,
            'classes' => $classes,
            'filters' => $request->only(['search', 'class_id', 'status', 'per_page'])
        ]);
    }
    
    public function generate()
    {
        $classes = AcademicClass::orderBy('name')->get(['id', 'name']);
        $feeGroups = FeeGroup::with('academicClass')->where('is_active', true)->orderBy('name')->get();
        
        return Inertia::render('Admin/Fees/Invoices/Generate', [
            'classes' => $classes,
            'feeGroups' => $feeGroups
        ]);
    }
    
    public function storeBulk(Request $request)
    {
        $validated = $request->validate([
            'academic_class_id' => 'required|exists:academic_classes,id',
            'fee_group_id' => 'required|exists:fee_groups,id',
            'title' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:invoice_date',
            'note' => 'nullable|string'
        ]);
        
        $group = FeeGroup::with('items.feeType')->findOrFail($validated['fee_group_id']);
        if($group->items->isEmpty()) {
            return back()->withErrors(['fee_group_id' => 'Selected fee group has no items.']);
        }
        
        $totalAmount = $group->items->sum('amount');
        
        // Find students in this class
        $students = User::where('user_type', 'student')
            ->whereHas('studentProfile', function($q) use ($validated) {
                $q->where('academic_class_id', $validated['academic_class_id']);
            })
            ->get();
            
        if($students->isEmpty()) {
            return back()->withErrors(['academic_class_id' => 'No students found in this class.']);
        }
        
        DB::beginTransaction();
        try {
            $count = 0;
            foreach($students as $student) {
                $invoiceNumber = 'INV-' . date('Ym') . '-' . strtoupper(Str::random(6));
                
                $invoice = FeeInvoice::create([
                    'user_id' => $student->id,
                    'academic_class_id' => $validated['academic_class_id'],
                    'fee_group_id' => $validated['fee_group_id'],
                    'invoice_number' => $invoiceNumber,
                    'title' => $validated['title'],
                    'invoice_date' => $validated['invoice_date'],
                    'due_date' => $validated['due_date'],
                    'total_amount' => $totalAmount,
                    'status' => 'unpaid',
                    'note' => $validated['note']
                ]);
                
                $itemsData = [];
                foreach($group->items as $item) {
                    $itemsData[] = [
                        'fee_invoice_id' => $invoice->id,
                        'fee_type_id' => $item->fee_type_id,
                        'amount' => $item->amount,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                FeeInvoiceItem::insert($itemsData);
                $count++;
            }
            DB::commit();
            return redirect()->route('admin.fee-invoices.index')->with('success', "Successfully generated {$count} invoices.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to generate invoices: ' . $e->getMessage());
        }
    }
    
    public function show(FeeInvoice $feeInvoice)
    {
        $feeInvoice->load(['student.studentProfile', 'academicClass', 'items.feeType', 'payments.collectedBy']);
        return Inertia::render('Admin/Fees/Invoices/Show', [
            'invoice' => $feeInvoice
        ]);
    }
    
    public function destroy(FeeInvoice $feeInvoice)
    {
        if ($feeInvoice->paid_amount > 0) {
            return back()->with('error', 'Cannot delete an invoice that has payments.');
        }
        $feeInvoice->delete();
        return back()->with('success', 'Invoice deleted successfully.');
    }
}
