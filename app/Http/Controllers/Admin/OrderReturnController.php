<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrderReturn;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderReturnController extends Controller
{
    public function index(Request $request)
    {
        $query = OrderReturn::query()
            ->with([
                'user:id,name,email,phone',
                'order:id,order_number,total_amount,status,created_at',
                'item:id,order_id,product_id,product_name,quantity,price,total',
                'product:id,name,sku',
                'product.primaryImage',
            ])
            ->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('reason') && $request->reason !== 'all') {
            $query->where('reason', $request->reason);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reason', 'like', "%{$search}%")
                    ->orWhereHas('order', fn ($order) => $order->where('order_number', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($user) => $user->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                    ->orWhereHas('item', fn ($item) => $item->where('product_name', 'like', "%{$search}%"));
            });
        }

        return Inertia::render('Admin/Returns/ReturnListPage', [
            'returns' => $query->paginate($request->integer('per_page', 15))->withQueryString(),
            'filters' => $request->only(['search', 'status', 'reason', 'per_page']),
            'stats' => [
                'total' => OrderReturn::count(),
                'pending' => OrderReturn::where('status', 'pending')->count(),
                'approved' => OrderReturn::where('status', 'approved')->count(),
                'rejected' => OrderReturn::where('status', 'rejected')->count(),
                'received' => OrderReturn::where('status', 'received')->count(),
                'refunded' => OrderReturn::where('status', 'refunded')->count(),
                'exchanged' => OrderReturn::where('status', 'exchanged')->count(),
            ],
        ]);
    }

    public function update(Request $request, OrderReturn $return)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,approved,rejected,received,refunded,exchanged'],
            'admin_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $return->update([
            'status' => $validated['status'],
            'admin_note' => $validated['admin_note'] ?? $return->admin_note,
            'resolved_at' => in_array($validated['status'], ['rejected', 'refunded', 'exchanged'], true) ? now() : $return->resolved_at,
        ]);

        // Send database and email notification to the user
        $return->user->notify(new \App\Notifications\ReturnRequestUpdatedNotification($return));

        // Clear user notifications cache
        \Illuminate\Support\Facades\Cache::forget("user_notifications_" . $return->user_id);
        \Illuminate\Support\Facades\Cache::forget("user_notifications_count_" . $return->user_id);

        return back()->with('success', 'Return request updated successfully.');
    }
}
