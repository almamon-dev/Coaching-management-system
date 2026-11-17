<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::orderBy('sort_order', 'asc')->paginate(12);

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'batch' => 'nullable|string|max:255',
            'institution' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'initials' => 'nullable|string|max:10',
            'color' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:published,draft',
        ]);

        if (empty($validated['initials'])) {
            $words = explode(' ', $validated['name']);
            $validated['initials'] = strtoupper(substr($words[0] ?? 'S', 0, 1) . substr($words[1] ?? '', 0, 1));
        }

        if (empty($validated['color'])) {
            $validated['color'] = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        }

        Testimonial::create($validated);

        return redirect()->back()->with('success', 'Student success story added successfully.');
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'batch' => 'nullable|string|max:255',
            'institution' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'initials' => 'nullable|string|max:10',
            'color' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:published,draft',
        ]);

        $testimonial->update($validated);

        return redirect()->back()->with('success', 'Student success story updated successfully.');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return redirect()->back()->with('success', 'Student success story deleted successfully.');
    }
}

