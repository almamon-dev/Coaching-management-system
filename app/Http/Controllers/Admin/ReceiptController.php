<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\FeePayment;
use App\Models\FeeInvoice;
use App\Models\Setting;

class ReceiptController extends Controller
{
    public function show($id)
    {
        $payment = FeePayment::with(['student.course', 'student.batch', 'invoice.feeType', 'collector'])->find($id);

        if (!$payment) {
            // Fallback check if it was passed an invoice ID directly
            $invoice = FeeInvoice::with(['student.course', 'student.batch', 'feeType'])->findOrFail($id);
            $payment = FeePayment::where('invoice_id', $invoice->id)->latest()->first();

            if (!$payment) {
                // Temporary mock object for unpaid invoice receipt preview
                $payment = (object)[
                    'id' => $invoice->id,
                    'receipt_no' => 'REC-PENDING',
                    'student' => $invoice->student,
                    'invoice' => $invoice,
                    'paid_amount' => $invoice->paid_amount,
                    'discount_amount' => $invoice->discount,
                    'payment_method' => 'N/A',
                    'previous_due' => $invoice->net_amount,
                    'remaining_due' => $invoice->due_amount,
                    'payment_date' => date('Y-m-d'),
                    'collector' => auth()->user(),
                    'remarks' => 'Invoice Created',
                ];
            }
        }

        $centerSettings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Fees/Receipt', [
            'payment' => $payment,
            'settings' => array_merge([
                'center_name' => 'Apex Coaching & Learning Center',
                'currency_symbol' => '৳',
                'phone' => '+880 1711-000000',
                'email' => 'info@apexcoaching.bd',
                'address' => 'House 42, Road 11, Block E, Banani, Dhaka',
            ], $centerSettings),
        ]);
    }
}
