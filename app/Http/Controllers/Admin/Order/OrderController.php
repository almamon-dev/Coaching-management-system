<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Notifications\OrderCompletedNotification;
use App\Notifications\OrderPaidNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'payment'])->withCount('items')->latest();

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->payment_status && $request->payment_status !== 'all') {
            $query->whereHas('payment', function ($q) use ($request) {
                $q->where('status', $request->payment_status);
            });
        }

        if ($request->payment_method && $request->payment_method !== 'all') {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', '%'.$request->search.'%')
                    ->orWhereHas('user', function ($u) use ($request) {
                        $u->where('name', 'like', '%'.$request->search.'%')
                            ->orWhere('email', 'like', '%'.$request->search.'%');
                    });
            });
        }

        $stats = [
            'total' => Order::count(),
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/Orders/List/OrderListPage', [
            'orders' => $query->cursorPaginate(15)->withQueryString(),
            'filters' => $request->only(['status', 'search', 'payment_status', 'payment_method']),
            'stats' => $stats,
        ]);
    }

    public function show($id)
    {
        $order = Order::with([
            'user',
            'items.product',
            'items.product.primaryImage',
            'payment',
        ])->findOrFail($id);

        return Inertia::render('Admin/Orders/Details/OrderDetailsPage', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::with('user')->findOrFail($id);
        $order->update(['status' => $request->status]);

        if ($request->status === 'delivered' && $order->user) {
            $order->user->notify(new OrderCompletedNotification($order));
        }

        if ($request->status === 'paid' && $order->user) {
            $order->user->notify(new OrderPaidNotification($order));
        }

        return back()->with('success', 'Order status updated successfully!');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $query = Order::query();

        if ($request->all) {
            if ($request->status && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('order_number', 'like', '%'.$request->search.'%')
                        ->orWhereHas('user', function ($u) use ($request) {
                            $u->where('name', 'like', '%'.$request->search.'%')
                                ->orWhere('email', 'like', '%'.$request->search.'%');
                        });
                });
            }
        } else {
            $query->whereIn('id', $request->ids);
        }

        $field = $request->field; // 'status' or 'payment_status'
        $value = $request->value;

        if ($field === 'status') {
            $query->update(['status' => $value]);
        } elseif ($field === 'payment_status') {
            // Need to update the related Payment model
            $orderIds = $query->pluck('id');
            Payment::whereIn('order_id', $orderIds)->update(['status' => $value]);
        }

        return back()->with('success', 'Orders updated successfully');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->ids;
        if ($request->all) {
            $query = Order::query();
            if ($request->status && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('order_number', 'like', '%'.$request->search.'%')
                        ->orWhereHas('user', function ($u) use ($request) {
                            $u->where('name', 'like', '%'.$request->search.'%');
                        });
                });
            }
            $query->delete();
        } else {
            Order::whereIn('id', $ids)->delete();
        }

        return back()->with('success', 'Orders deleted successfully!');
    }

    public function export(Request $request): StreamedResponse
    {
        $query = Order::with(['user', 'payment'])->withCount('items')->latest();

        if ($request->ids && is_array($request->ids)) {
            $query->whereIn('id', $request->ids);
        } else {
            if ($request->status && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('order_number', 'like', '%'.$request->search.'%')
                        ->orWhereHas('user', function ($u) use ($request) {
                            $u->where('name', 'like', '%'.$request->search.'%')
                                ->orWhere('email', 'like', '%'.$request->search.'%');
                        });
                });
            }
        }

        $orders = $query->get();
        $filename = "orders-".date('Y-m-d').".csv";
        
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = [
            'Order Number', 
            'Date', 
            'Customer Name', 
            'Customer Email', 
            'Customer Phone', 
            'Shipping Address', 
            'District', 
            'Upazila',
            'Items Count',
            'Subtotal',
            'Discount',
            'Shipping Cost',
            'Total Amount', 
            'Payment Status', 
            'Delivery Status', 
            'Payment Method'
        ];

        $callback = function() use ($orders, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->order_number,
                    $order->created_at->format('Y-m-d H:i'),
                    $order->shipping_name ?: ($order->user?->name ?? 'Guest'),
                    $order->shipping_email ?: ($order->user?->email ?? 'N/A'),
                    $order->shipping_phone ?: ($order->user?->phone ?? 'N/A'),
                    $order->shipping_address ?: 'N/A',
                    $order->shipping_district ?: 'N/A',
                    $order->shipping_upazila ?: 'N/A',
                    $order->items_count ?? 0,
                    $order->subtotal,
                    $order->discount,
                    $order->shipping_cost,
                    $order->total_amount,
                    $order->payment?->status ?? 'unpaid',
                    $order->status,
                    $order->payment_method ?: ($order->payment?->method ?? 'N/A')
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return back()->with('success', 'Order deleted successfully!');
    }
}
