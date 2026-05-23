<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Counter;

use App\Http\Controllers\Controller;
use App\Models\Counter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CounterController extends Controller
{
    /**
     * Display a listing of counters with search, filters and stats.
     */
    public function index(Request $request)
    {
        $query = Counter::query();

        // Search Filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status Filter
        if ($request->filled('status') && $request->status !== 'all') {
            $isActive = $request->status === 'active' ? 1 : 0;
            $query->where('is_active', $isActive);
        }

        // Stats calculation
        $stats = [
            'all' => Counter::count(),
            'active' => Counter::where('is_active', 1)->count(),
            'inactive' => Counter::where('is_active', 0)->count(),
        ];

        // Paginate results
        $perPage = $request->input('per_page', 10);
        $counters = $query->orderBy('name', 'asc')->cursorPaginate($perPage)->withQueryString();

        return Inertia::render('Admin/Counters/List/CounterListPage', [
            'counters' => $counters,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new counter.
     */
    public function create()
    {
        return Inertia::render('Admin/Counters/Create/CounterCreatePage');
    }

    /**
     * Store a newly created counter.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:counters,name',
            'description' => 'nullable|string|max:500',
            'is_active' => 'required|boolean',
        ]);

        Counter::create($validated);

        return redirect()->route('admin.counters.index')->with('success', 'Counter Desk created successfully.');
    }

    /**
     * Show the form for editing the specified counter.
     */
    public function edit(Counter $counter)
    {
        return Inertia::render('Admin/Counters/Edit/CounterEditPage', [
            'counter' => $counter
        ]);
    }

    /**
     * Update the specified counter.
     */
    public function update(Request $request, Counter $counter)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:counters,name,' . $counter->id,
            'description' => 'nullable|string|max:500',
            'is_active' => 'required|boolean',
        ]);

        $counter->update($validated);

        return redirect()->route('admin.counters.index')->with('success', 'Counter Desk updated successfully.');
    }

    /**
     * Remove the specified counter.
     */
    public function destroy(Counter $counter)
    {
        $counter->delete();

        return redirect()->route('admin.counters.index')->with('success', 'Counter Desk deleted successfully.');
    }

    /**
     * Toggle status of the specified counter.
     */
    public function updateStatus(Request $request, Counter $counter)
    {
        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $counter->update([
            'is_active' => $request->is_active
        ]);

        return redirect()->back()->with('success', 'Counter status updated successfully.');
    }

    /**
     * Bulk update status of selected counters.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
            'is_active' => 'required|boolean',
        ]);

        $query = Counter::query();

        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        } else {
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }
            if ($request->filled('status') && $request->status !== 'all') {
                $isActive = $request->status === 'active' ? 1 : 0;
                $query->where('is_active', $isActive);
            }
        }

        $query->update(['is_active' => $request->is_active ? 1 : 0]);

        return redirect()->back()->with('success', 'Selected counters updated successfully.');
    }

    /**
     * Bulk destroy selected counters.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
        ]);

        $query = Counter::query();

        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        } else {
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }
            if ($request->filled('status') && $request->status !== 'all') {
                $isActive = $request->status === 'active' ? 1 : 0;
                $query->where('is_active', $isActive);
            }
        }

        $query->delete();

        return redirect()->back()->with('success', 'Selected counters deleted successfully.');
    }
}
