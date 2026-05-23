<?php

namespace App\Http\Controllers\Admin\Variant;

use App\Http\Controllers\Controller;
use App\Models\GlobalVariant;
use App\Models\GlobalVariantOption;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class VariantController extends Controller
{
    public function index(Request $request)
    {
        $query = GlobalVariant::with('options')->withCount('options');

        // Search
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Status Filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status === 'active' ? 1 : 0);
        }

        $variants = $query->orderByDesc('id')->paginate($request->per_page ?? 10)->withQueryString();

        $stats = [
            'total' => GlobalVariant::count(),
            'active' => GlobalVariant::where('status', 1)->count(),
            'inactive' => GlobalVariant::where('status', 0)->count(),
        ];

        return Inertia::render('Admin/Variants/Index', [
            'variants' => $variants,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'stats' => $stats
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:select,radio',
        ]);

        GlobalVariant::create($request->only(['name', 'type']) + ['status' => 1]);

        return redirect()->back()->with('success', 'Variant created successfully.');
    }

    public function update(Request $request, GlobalVariant $variant)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:select,radio',
        ]);

        $variant->update($request->only(['name', 'type']));

        return redirect()->back()->with('success', 'Variant updated successfully.');
    }

    public function updateStatus(Request $request, GlobalVariant $variant)
    {
        $request->validate(['is_active' => 'required|boolean']);
        $variant->update(['status' => $request->is_active ? 1 : 0]);
        return redirect()->back()->with('success', 'Variant status updated.');
    }

    public function destroy(GlobalVariant $variant)
    {
        $variant->delete();
        return redirect()->back()->with('success', 'Variant deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
        ]);

        if ($request->all) {
            GlobalVariant::truncate();
        } else {
            GlobalVariant::whereIn('id', $request->ids)->delete();
        }

        return redirect()->back()->with('success', 'Selected variants deleted.');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
            'is_active' => 'required|boolean',
        ]);

        $query = GlobalVariant::query();
        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        }
        $query->update(['status' => $request->is_active ? 1 : 0]);

        return redirect()->back()->with('success', 'Status updated for selected variants.');
    }

    public function storeOption(Request $request, GlobalVariant $variant)
    {
        $request->validate(['value' => 'required|string|max:255']);
        $variant->options()->create(['value' => $request->value]);
        return redirect()->back()->with('success', 'Option added successfully.');
    }

    public function updateOption(Request $request, GlobalVariant $variant, GlobalVariantOption $option)
    {
        $request->validate(['value' => 'required|string|max:255']);
        $option->update(['value' => $request->value]);
        return redirect()->back()->with('success', 'Option updated successfully.');
    }

    public function destroyOption(GlobalVariant $variant, GlobalVariantOption $option)
    {
        $option->delete();
        return redirect()->back()->with('success', 'Option deleted successfully.');
    }
}
