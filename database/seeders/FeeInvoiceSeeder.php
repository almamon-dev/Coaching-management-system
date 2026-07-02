<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StudentProfile;
use App\Models\FeeGroup;
use App\Models\FeeType;
use App\Models\FeeInvoice;
use App\Models\FeeInvoiceItem;
use App\Models\FeePayment;
use Illuminate\Support\Str;
use Carbon\Carbon;

class FeeInvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = StudentProfile::take(10)->get();
        $feeGroup = FeeGroup::first();
        $feeTypes = FeeType::take(3)->get();

        if (!$feeGroup || $feeTypes->isEmpty()) {
            $this->command->error('No fee groups or fee types found. Run those seeders first.');
            return;
        }

        foreach ($students as $student) {
            // Delete old invoices for this student to prevent duplicates
            FeeInvoice::where('user_id', $student->user_id)->delete();

            // Generate 3 invoices per student (Paid, Partial, Unpaid)
            $statuses = ['paid', 'partial', 'unpaid'];
            
            foreach ($statuses as $index => $status) {
                $month = Carbon::now()->subMonths($index);
                
                $invoice = FeeInvoice::create([
                    'user_id' => $student->user_id,
                    'academic_class_id' => $student->latestEnrollment->academic_class_id ?? 1,
                    'fee_group_id' => $feeGroup->id,
                    'invoice_number' => 'INV-' . strtoupper(Str::random(6)),
                    'title' => 'Monthly Fee - ' . $month->format('F Y'),
                    'invoice_date' => $month->startOfMonth()->format('Y-m-d'),
                    'due_date' => $month->copy()->addDays(10)->format('Y-m-d'),
                    'total_amount' => 0, // Will update below
                    'paid_amount' => 0,
                    'status' => $status
                ]);

                $totalAmount = 0;
                foreach ($feeTypes as $type) {
                    $amount = rand(500, 1500);
                    FeeInvoiceItem::create([
                        'fee_invoice_id' => $invoice->id,
                        'fee_type_id' => $type->id,
                        'amount' => $amount
                    ]);
                    $totalAmount += $amount;
                }

                $paidAmount = 0;
                if ($status === 'paid') {
                    $paidAmount = $totalAmount;
                } elseif ($status === 'partial') {
                    $paidAmount = $totalAmount / 2;
                }

                $invoice->update([
                    'total_amount' => $totalAmount,
                    'paid_amount' => $paidAmount
                ]);

                if ($paidAmount > 0) {
                    FeePayment::create([
                        'fee_invoice_id' => $invoice->id,
                        'collected_by' => 1,
                        'payment_method' => 'Cash',
                        'transaction_id' => 'TXN-' . strtoupper(Str::random(8)),
                        'amount_paid' => $paidAmount,
                        'payment_date' => Carbon::now()->subDays(rand(1, 10))->format('Y-m-d')
                    ]);
                }
            }
        }
        
        $this->command->info('Seeded fee invoices and payments for the first 10 students.');
    }
}
