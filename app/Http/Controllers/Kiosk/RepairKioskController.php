<?php

declare(strict_types=1);

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use App\Models\Repair;
use App\Models\User;
use App\Models\Product;
use App\Models\Counter;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;

class RepairKioskController extends Controller
{
    /**
     * Display the in-store walk-in kiosk screen.
     */
    public function showKiosk()
    {
        return Inertia::render('Kiosk/IndexPage');
    }

    /**
     * Display the standalone lobby TV serving board.
     */
    public function showQueueBoard()
    {
        return Inertia::render('Kiosk/QueueBoardPage');
    }

    /**
     * Join the repair servicing queue, generating a token & counter instantly.
     */
    public function joinQueue(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:8|max:20',
            'name' => 'required|string|max:100',
        ]);

        // Find or create walk-in customer User account
        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            // Generate a secure guest user account so they can track, login, and confirm later
            $user = User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->phone . '@gadget.guest',
                'password' => bcrypt(Str::random(16)),
                'user_type' => 'user',
            ]);
        }

        // Daily resetting walk-in token number generation (E.g. T-001, T-002)
        $todayCount = Repair::whereDate('created_at', today())->count();
        $tokenNumber = 'T-' . str_pad($todayCount + 1, 3, '0', STR_PAD_LEFT);

        // Round-robin counter assignment between active counters
        $counters = Counter::active()->pluck('name')->toArray();
        if (empty($counters)) {
            $counters = ['Counter 1', 'Counter 2', 'Counter 3'];
        }
        $counterName = $counters[$todayCount % count($counters)];

        // Generate the unique REP tracking ticket number
        $year = date('Y');
        $totalRepairs = Repair::count();
        $ticketNumber = 'REP-' . $year . '-' . str_pad($totalRepairs + 1, 4, '0', STR_PAD_LEFT);

        $repair = Repair::create([
            'user_id' => $user->id,
            'ticket_number' => $ticketNumber,
            'token_number' => $tokenNumber,
            'counter_name' => $counterName,
            'status' => 'pending', // Fresh walked-in pending counter consultation
            'pickup_method' => 'drop_off',
        ]);

        return response()->json([
            'success' => true,
            'token_number' => $tokenNumber,
            'counter_name' => $counterName,
            'ticket_number' => $ticketNumber,
            'customer_name' => $user->name,
        ]);
    }

    /**
     * Let customers pre-register their gadget repair details from the kiosk.
     */
    public function preRegisterRepair(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:8|max:20',
            'name' => 'required|string|max:100',
            'device_type' => 'required|string|max:50',
            'brand' => 'required|string|max:50',
            'model_name' => 'required|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'customer_notes' => 'nullable|string|max:500',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            $user = User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->phone . '@gadget.guest',
                'password' => bcrypt(Str::random(16)),
                'user_type' => 'user',
            ]);
        }

        $todayCount = Repair::whereDate('created_at', today())->count();
        $tokenNumber = 'T-' . str_pad($todayCount + 1, 3, '0', STR_PAD_LEFT);

        $counters = Counter::active()->pluck('name')->toArray();
        if (empty($counters)) {
            $counters = ['Counter 1', 'Counter 2', 'Counter 3'];
        }
        $counterName = $counters[$todayCount % count($counters)];

        $year = date('Y');
        $totalRepairs = Repair::count();
        $ticketNumber = 'REP-' . $year . '-' . str_pad($totalRepairs + 1, 4, '0', STR_PAD_LEFT);

        $repair = Repair::create([
            'user_id' => $user->id,
            'ticket_number' => $ticketNumber,
            'token_number' => $tokenNumber,
            'counter_name' => $counterName,
            'status' => 'pending',
            'pickup_method' => 'drop_off',
            'device_type' => $request->device_type,
            'brand' => $request->brand,
            'model_name' => $request->model_name,
            'serial_number' => $request->serial_number,
            'customer_notes' => $request->customer_notes,
        ]);

        return response()->json([
            'success' => true,
            'token_number' => $tokenNumber,
            'counter_name' => $counterName,
            'ticket_number' => $ticketNumber,
            'customer_name' => $user->name,
            'brand' => $repair->brand,
            'model_name' => $repair->model_name,
        ]);
    }

    /**
     * Check active service ticket status in-store.
     */
    public function checkStatus(Request $request)
    {
        $query = $request->input('query');
        if (empty($query)) {
            return response()->json(['success' => false, 'message' => 'Please enter your phone or ticket number.']);
        }

        $repairs = Repair::where('ticket_number', $query)
            ->orWhere('token_number', $query)
            ->orWhereHas('customer', function($q) use ($query) {
                $q->where('phone', $query)->orWhere('name', 'like', "%{$query}%");
            })
            ->with(['customer:id,name,phone', 'technician:id,name'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'repairs' => $repairs
        ]);
    }

    /**
     * Look up device warranty details based on Serial Number or Ticket.
     */
    public function checkWarranty(Request $request)
    {
        $query = $request->input('query');
        if (empty($query)) {
            return response()->json(['success' => false, 'message' => 'Please enter a valid Serial or Ticket number.']);
        }

        $repair = Repair::where('serial_number', $query)
            ->orWhere('ticket_number', $query)
            ->orWhere('token_number', $query)
            ->with('customer:id,name')
            ->first();

        if (!$repair) {
            return response()->json([
                'success' => false,
                'message' => 'No active repair or product record found matching this Serial or Ticket.'
            ]);
        }

        $isActive = false;
        if ($repair->warranty_ends_at) {
            $isActive = Carbon::parse($repair->warranty_ends_at)->isFuture();
        }

        return response()->json([
            'success' => true,
            'brand' => $repair->brand,
            'model_name' => $repair->model_name,
            'serial_number' => $repair->serial_number,
            'ticket_number' => $repair->ticket_number,
            'customer_name' => $repair->customer?->name,
            'has_warranty_info' => !empty($repair->warranty_ends_at),
            'warranty_ends_at' => $repair->warranty_ends_at ? Carbon::parse($repair->warranty_ends_at)->toDateString() : null,
            'is_active' => $isActive
        ]);
    }

    /**
     * Retrieve featured hot products to browse directly on Kiosk.
     */
    public function getProducts()
    {
        $products = Product::active()
            ->with('primaryImage')
            ->latest()
            ->take(8)
            ->get(['id', 'name', 'price', 'status', 'brand_id', 'category_id', 'description']);

        $products->each(function($p) {
            $p->thumbnail = $p->primaryImage ? asset('storage/' . $p->primaryImage->image_path) : null;
        });

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }

    /**
     * Retrieve live queue status board showing serving tokens per counter and upcoming waiting queue.
     */
    public function getQueueState()
    {
        // Query active or pending tickets from today only (includes admin-created tickets)
        $todayRepairs = Repair::whereDate('created_at', today())
            ->whereIn('status', ['pending', 'approved', 'diagnosing', 'repairing'])
            ->with('customer:id,name')
            ->orderBy('id', 'asc')
            ->get(['id', 'ticket_number', 'token_number', 'counter_name', 'status', 'user_id', 'brand', 'model_name']);

        $servingMap = [];
        $waitingList = [];

        // Active counters from database
        $counters = Counter::active()->pluck('name')->toArray();
        if (empty($counters)) {
            $counters = ['Counter 1', 'Counter 2', 'Counter 3'];
        }
        foreach ($counters as $c) {
            $servingMap[$c] = null;
        }

        foreach ($todayRepairs as $index => $repair) {
            // Generate fallback token on the fly if null (e.g. REP-2026-0001 -> T-001)
            $tokenNum = $repair->token_number ?: ('T-' . substr($repair->ticket_number, -3));
            
            // Assign a default counter on the fly if null using round-robin distribution
            $counter = $repair->counter_name ?: ($counters[$index % count($counters)]);

            if (in_array($repair->status, ['pending', 'approved', 'diagnosing', 'repairing'])) {
                // If undergoing active diagnostics/repairs, assign to counter
                if (in_array($repair->status, ['approved', 'diagnosing', 'repairing'])) {
                    $servingMap[$counter] = [
                        'token' => $tokenNum,
                        'ticket' => $repair->ticket_number,
                        'customer_name' => $repair->customer?->name,
                        'device' => $repair->brand ? ($repair->brand . ' ' . $repair->model_name) : 'Walk-in Consultation',
                        'status' => $repair->status
                    ];
                } else {
                    // Pending tickets wait in line but are assigned a counter
                    $waitingList[] = [
                        'token' => $tokenNum,
                        'ticket' => $repair->ticket_number,
                        'customer' => $repair->customer?->name,
                        'counter' => $counter,
                    ];
                }
            }
        }

        // Fallback: if counter is empty in servingMap, assign the first pending ticket belonging to that counter
        foreach ($counters as $c) {
            if (!$servingMap[$c]) {
                foreach ($todayRepairs as $index => $repair) {
                    $tokenNum = $repair->token_number ?: ('T-' . substr($repair->ticket_number, -3));
                    $counter = $repair->counter_name ?: ($counters[$index % count($counters)]);

                    if ($repair->status === 'pending' && $counter === $c) {
                        $servingMap[$c] = [
                            'token' => $tokenNum,
                            'ticket' => $repair->ticket_number,
                            'customer_name' => $repair->customer?->name,
                            'device' => $repair->brand ? ($repair->brand . ' ' . $repair->model_name) : 'Walk-in Consultation',
                            'status' => 'pending' // status is pending so we show it as "calling/waiting"
                        ];
                        // Remove from waiting list since it is displayed on the counter screen
                        $waitingList = array_values(array_filter($waitingList, function($item) use ($tokenNum) {
                            return $item['token'] !== $tokenNum;
                        }));
                        break;
                    }
                }
            }
        }

        // Format serving for view
        $serving = [];
        foreach ($servingMap as $counter => $data) {
            $serving[] = [
                'counter' => $counter,
                'token' => $data ? $data['token'] : 'FREE',
                'ticket' => $data ? $data['ticket'] : null,
                'customer' => $data ? ($data['customer_name'] ?? 'Open Desk') : 'Open Desk',
                'device' => $data ? $data['device'] : 'No device',
                'status' => $data ? $data['status'] : 'idle'
            ];
        }

        return response()->json([
            'success' => true,
            'serving' => $serving,
            'waiting' => $waitingList
        ]);
    }
}
