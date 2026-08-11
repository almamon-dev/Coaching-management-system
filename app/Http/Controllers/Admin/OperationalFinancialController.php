<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\OperationalExpense;
use App\Models\OperationalIncome;
use App\Models\FeePayment;
use App\Models\ActivityLog;

class OperationalFinancialController extends Controller
{
    public function index(Request $request)
    {
        $expenses = OperationalExpense::with('creator')->latest()->paginate(10, ['*'], 'expenses_page');
        $incomes = OperationalIncome::with('creator')->latest()->paginate(10, ['*'], 'incomes_page');

        $totalFeeIncome = FeePayment::sum('paid_amount');
        $totalOtherIncome = OperationalIncome::sum('amount');
        $grandTotalIncome = $totalFeeIncome + $totalOtherIncome;

        $grandTotalExpense = OperationalExpense::sum('amount');
        $netBalance = $grandTotalIncome - $grandTotalExpense;

        $expenseCategories = ['Rent', 'Electricity', 'Internet', 'Stationery', 'Marketing', 'Equipment', 'Maintenance', 'Other'];
        $incomeCategories = ['Admission Fee', 'Monthly Fee', 'Course Fee', 'Exam Fee', 'Other Income'];

        return Inertia::render('Admin/OperationalAccounts/Index', [
            'expenses' => $expenses,
            'incomes' => $incomes,
            'summary' => [
                'fee_income' => (float)$totalFeeIncome,
                'other_income' => (float)$totalOtherIncome,
                'total_income' => (float)$grandTotalIncome,
                'total_expense' => (float)$grandTotalExpense,
                'net_balance' => (float)$netBalance,
            ],
            'expenseCategories' => $expenseCategories,
            'incomeCategories' => $incomeCategories,
        ]);
    }

    public function storeExpense(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'expense_date' => 'required|date',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
            'receipt_ref' => 'nullable|string',
        ]);

        $expense = OperationalExpense::create([
            'expense_no' => 'EXP-' . date('Ymd') . '-' . rand(1000, 9999),
            'category' => $validated['category'],
            'title' => $validated['title'],
            'amount' => $validated['amount'],
            'expense_date' => $validated['expense_date'],
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'],
            'receipt_ref' => $validated['receipt_ref'],
            'created_by' => auth()->id(),
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Expense Recorded',
            'module' => 'Accounts',
            'description' => "Recorded operational expense: {$expense->title} (৳{$expense->amount})",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Operational expense recorded successfully.');
    }

    public function storeIncome(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'income_date' => 'required|date',
            'payment_method' => 'required|string',
            'source' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $income = OperationalIncome::create([
            'income_no' => 'INC-' . date('Ymd') . '-' . rand(1000, 9999),
            'category' => $validated['category'],
            'title' => $validated['title'],
            'amount' => $validated['amount'],
            'income_date' => $validated['income_date'],
            'payment_method' => $validated['payment_method'],
            'source' => $validated['source'],
            'notes' => $validated['notes'],
            'created_by' => auth()->id(),
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Income Recorded',
            'module' => 'Accounts',
            'description' => "Recorded operational income: {$income->title} (৳{$income->amount})",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Operational income recorded successfully.');
    }
}
