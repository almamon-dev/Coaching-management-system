<?php

namespace App\Http\Controllers\Admin\Category;

use App\Http\Controllers\Controller;
use App\Models\GlobalDiscount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GlobalDiscountController extends Controller
{
    public function index()
    {
        $discounts = GlobalDiscount::orderByDesc('id')->get();
        
        return Inertia::render('Admin/Categories/Marketing/CategoryDiscountPage', [
            'discounts' => $discounts,
            'categories' => \App\Models\Category::select('id', 'name')->where('status', 1)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'target_type' => 'required|in:all,category,sub_category,sub_sub_category,brand',
            'target_id' => 'nullable|integer',
            'status' => 'boolean',
        ]);

        GlobalDiscount::create($validated);

        return redirect()->back()->with('success', 'Global discount created successfully.');
    }

    public function update(Request $request, GlobalDiscount $discount)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'target_type' => 'required|in:all,category,sub_category,sub_sub_category,brand',
            'target_id' => 'nullable|integer',
            'status' => 'boolean',
        ]);

        $discount->update($validated);

        return redirect()->back()->with('success', 'Global discount updated successfully.');
    }

    public function updateStatus(Request $request, GlobalDiscount $discount)
    {
        $request->validate(['status' => 'required|boolean']);
        $discount->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status updated successfully.');
    }

    public function destroy(GlobalDiscount $discount)
    {
        $discount->delete();

        return redirect()->back()->with('success', 'Global discount deleted successfully.');
    }
}
