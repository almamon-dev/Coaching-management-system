<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Repair;

use App\Http\Controllers\Controller;
use App\Models\Repair;
use App\Models\RepairPart;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RepairController extends Controller
{
    /**
     * Display a listing of all repair tickets.
     */
    public function index(Request $request)
    {
        $query = Repair::with(['customer:id,name,email', 'technician:id,name', 'product:id,name']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                  ->orWhere('model_name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Technician filter
        if ($request->filled('technician_id')) {
            $query->where('technician_id', $request->technician_id);
        }

        $repairs = $query->orderBy('created_at', 'desc')->cursorPaginate($request->input('per_page', 15))->withQueryString();

        // Get technicians for assigning dropdown
        $technicians = User::where('user_type', 'admin')->get(['id', 'name']);

        // Calculate repair queue statistics for top stats bar
        $stats = [
            'total' => Repair::count(),
            'pending' => Repair::where('status', 'pending')->count(),
            'approved' => Repair::where('status', 'approved')->count(),
            'diagnosing' => Repair::where('status', 'diagnosing')->count(),
            'awaiting_quote' => Repair::where('status', 'awaiting_quote')->count(),
            'repairing' => Repair::where('status', 'repairing')->count(),
            'testing' => Repair::where('status', 'testing')->count(),
            'ready' => Repair::where('status', 'ready')->count(),
            'completed' => Repair::where('status', 'completed')->count(),
            'cancelled' => Repair::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/Repairs/List/RepairListPage', [
            'repairs' => $repairs,
            'technicians' => $technicians,
            'filters' => $request->only(['search', 'status', 'technician_id', 'per_page']),
            'stats' => $stats
        ]);
    }

    /**
     * Display a specific repair workspace.
     */
    public function show(Repair $repair)
    {
        $repair->load(['customer:id,name,email,phone', 'technician:id,name', 'parts.product:id,name,sku']);

        // Get all technicians
        $technicians = User::where('user_type', 'admin')->get(['id', 'name']);

        // Get spare parts from products for the inline search tool (category name 'Spare Parts' or tags/categories containing part)
        $spareParts = Product::where('status', 'active')
            ->where('stock', '>', 0)
            ->get(['id', 'name', 'price', 'stock', 'sku']);

        return Inertia::render('Admin/Repairs/Details/RepairDetailsPage', [
            'repair' => $repair,
            'technicians' => $technicians,
            'spareParts' => $spareParts
        ]);
    }

    /**
     * Register walk-in gadget details and start active diagnostics.
     */
    public function registerGadget(Request $request, Repair $repair)
    {
        $request->validate([
            'device_type' => 'required|string|max:50',
            'brand' => 'required|string|max:50',
            'model_name' => 'required|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'issue_description' => 'required|string|min:5',
        ]);

        $repair->update([
            'device_type' => $request->device_type,
            'brand' => $request->brand,
            'model_name' => $request->model_name,
            'serial_number' => $request->serial_number,
            'issue_description' => $request->issue_description,
            // Advance status to diagnosing to mark it as registered & checked-in!
            'status' => 'diagnosing',
        ]);

        return redirect()->back()->with('success', 'Gadget details registered and checked into diagnostics.');
    }

    /**
     * Assign a technician to the repair job.
     */
    public function assignTechnician(Request $request, Repair $repair)
    {
        $request->validate([
            'technician_id' => 'required|exists:users,id',
            'counter_name' => 'nullable|string|max:100'
        ]);

        $updateData = [
            'technician_id' => $request->technician_id,
            // Automatically advance status to diagnosing when technician is assigned
            'status' => $repair->status === 'pending' ? 'diagnosing' : $repair->status
        ];

        if ($request->filled('counter_name')) {
            $updateData['counter_name'] = $request->counter_name;
        }

        // Auto fallback if still empty
        if (empty($repair->counter_name) && !isset($updateData['counter_name'])) {
            $counters = \App\Models\Counter::active()->pluck('name')->toArray();
            if (empty($counters)) {
                $counters = ['Counter 1', 'Counter 2', 'Counter 3'];
            }
            $todayCount = Repair::whereDate('created_at', today())->count();
            $updateData['counter_name'] = $counters[$todayCount % count($counters)];
        }

        if (empty($repair->token_number)) {
            $todayCount = Repair::whereDate('created_at', today())->count();
            $updateData['token_number'] = 'T-' . str_pad($todayCount + 1, 3, '0', STR_PAD_LEFT);
        }

        $repair->update($updateData);

        return redirect()->back()->with('success', 'Technician and serving counter assigned successfully.');
    }

    /**
     * Save technician diagnostic reports and base service charge.
     */
    public function saveDiagnostics(Request $request, Repair $repair)
    {
        $request->validate([
            'diagnostics_notes' => 'required|string|min:5',
            'service_charge' => 'required|numeric|min:0',
        ]);

        // Calculate total cost
        $totalCost = $request->service_charge + $repair->parts_cost;

        $repair->update([
            'diagnostics_notes' => $request->diagnostics_notes,
            'service_charge' => $request->service_charge,
            'total_cost' => $totalCost,
            'status' => 'awaiting_quote' // Advance to awaiting customer quote approval
        ]);

        return redirect()->back()->with('success', 'Diagnostics saved. Ticket sent to customer for quote approval.');
    }

    /**
     * Add a spare part to the repair ticket, reducing the central product stock.
     */
    public function addSparePart(Request $request, Repair $repair)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock < $request->quantity) {
            return redirect()->back()->with('error', "Insufficient stock. Only {$product->stock} items available in inventory.");
        }

        DB::transaction(function () use ($request, $repair, $product) {
            // Deduct stock from product inventory
            $product->decrement('stock', $request->quantity);

            $unitPrice = $product->price;
            $totalPrice = $unitPrice * $request->quantity;

            // Add or update parts used list
            $existingPart = RepairPart::where('repair_id', $repair->id)
                ->where('product_id', $product->id)
                ->first();

            if ($existingPart) {
                $existingPart->increment('quantity', $request->quantity);
                $existingPart->update([
                    'total_price' => $existingPart->quantity * $existingPart->unit_price
                ]);
            } else {
                RepairPart::create([
                    'repair_id' => $repair->id,
                    'product_id' => $product->id,
                    'quantity' => $request->quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice
                ]);
            }

            // Recalculate aggregated billing sums
            $partsCost = RepairPart::where('repair_id', $repair->id)->sum('total_price');
            $repair->update([
                'parts_cost' => $partsCost,
                'total_cost' => $repair->service_charge + $partsCost
            ]);
        });

        return redirect()->back()->with('success', 'Spare part added to repair ticket and inventory adjusted.');
    }

    /**
     * Remove a spare part from the repair ticket, returning stock to central inventory.
     */
    public function removeSparePart(Repair $repair, $partId)
    {
        $part = RepairPart::where('repair_id', $repair->id)->findOrFail($partId);
        $product = Product::findOrFail($part->product_id);

        DB::transaction(function () use ($repair, $part, $product) {
            // Restore inventory stock levels
            $product->increment('stock', $part->quantity);

            // Delete item
            $part->delete();

            // Recalculate billing
            $partsCost = RepairPart::where('repair_id', $repair->id)->sum('total_price');
            $repair->update([
                'parts_cost' => $partsCost,
                'total_cost' => $repair->service_charge + $partsCost
            ]);
        });

        return redirect()->back()->with('success', 'Spare part removed and stock returned to inventory.');
    }

    /**
     * Transition the status of the repair job.
     */
    public function updateStatus(Request $request, Repair $repair)
    {
        $request->validate([
            'status' => 'required|string|in:pending,approved,diagnosing,awaiting_quote,repairing,testing,ready,completed,cancelled',
            'tracking_number' => 'nullable|string|max:100',
            'warranty_ends_at' => 'nullable|date',
            'payment_status' => 'nullable|string|in:unpaid,paid',
            'is_paid' => 'nullable|boolean'
        ]);

        $updates = [
            'status' => $request->status
        ];

        if ($request->filled('tracking_number')) {
            $updates['tracking_number'] = $request->tracking_number;
        }

        if ($request->filled('warranty_ends_at')) {
            $updates['warranty_ends_at'] = $request->warranty_ends_at;
        }

        if ($request->filled('payment_status')) {
            $updates['payment_status'] = $request->payment_status;
            $updates['is_paid'] = $request->payment_status === 'paid';
        }

        if ($request->status === 'completed' && !$repair->delivered_at) {
            $updates['delivered_at'] = now();
            // Automatically set a 30-day warranty if not specified
            if (!$repair->warranty_ends_at) {
                $updates['warranty_ends_at'] = now()->addDays(30);
            }
        }

        $repair->update($updates);

        return redirect()->back()->with('success', 'Repair ticket status updated successfully.');
    }

    /**
     * Perform bulk status updates for multiple selected tickets.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
            'status' => 'required|string|in:pending,approved,diagnosing,awaiting_quote,repairing,testing,ready,completed,cancelled'
        ]);

        $query = Repair::query();

        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        } else {
            // Apply standard active filters to matches
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('ticket_number', 'like', "%{$search}%")
                      ->orWhere('model_name', 'like', "%{$search}%")
                      ->orWhere('brand', 'like', "%{$search}%");
                });
            }
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
            if ($request->filled('technician_id')) {
                $query->where('technician_id', $request->technician_id);
            }
        }

        $updates = [
            'status' => $request->status
        ];

        if ($request->status === 'completed') {
            $updates['delivered_at'] = now();
            $updates['is_paid'] = true;
            $updates['payment_status'] = 'paid';
        }

        $query->update($updates);

        return redirect()->back()->with('success', 'Selected repair statuses updated successfully.');
    }

    /**
     * Delete multiple selected repair tickets in bulk.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
        ]);

        $query = Repair::query();

        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        } else {
            // Apply active query filters
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('ticket_number', 'like', "%{$search}%")
                      ->orWhere('model_name', 'like', "%{$search}%")
                      ->orWhere('brand', 'like', "%{$search}%");
                });
            }
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
            if ($request->filled('technician_id')) {
                $query->where('technician_id', $request->technician_id);
            }
        }

        $query->delete();

        return redirect()->back()->with('success', 'Selected repair tickets deleted successfully.');
    }
}
