<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['order.user']);

        // Stats calculation
        $stats = [
            'total' => Payment::count(),
            'completed' => Payment::where('status', 'completed')->count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'failed' => Payment::where('status', 'failed')->count(),
            'refunded' => Payment::where('status', 'refunded')->count(),
        ];

        // Filtering
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $transactions = $query
            ->when($request->search, function ($query, $search) {
                $query->where('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('order', function ($q) use ($search) {
                        $q->where('order_number', 'like', "%{$search}%")
                            ->orWhereHas('user', function ($uq) use ($search) {
                                $uq->where('name', 'like', "%{$search}%");
                            });
                    });
            })
            ->latest()
            ->cursorPaginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Transactions/List/TransactionListPage', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Remove the specified transaction from storage.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();
        
        return redirect()->back()->with('success', 'Transaction deleted successfully.');
    }
}
