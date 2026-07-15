<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Founder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Support\Media\FileUploader;
use App\Support\Media\FileRemover;

class FounderController extends Controller
{
    public function index(Request $request)
    {
        $query = Founder::query();
        
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('role', 'like', '%' . $request->search . '%');
        }

        $founders = $query->orderBy('order', 'asc')->paginate($request->per_page ?? 10)->withQueryString();

        return Inertia::render('Admin/Founders/Index', [
            'founders' => $founders,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = FileUploader::upload($request->file('image'), 'founders');
        }

        Founder::create($validated);

        return back()->with('success', 'Founder created successfully.');
    }

    public function update(Request $request, Founder $founder)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($founder->image) {
                FileRemover::remove($founder->image);
            }
            $validated['image'] = FileUploader::upload($request->file('image'), 'founders');
        }

        $founder->update($validated);

        return back()->with('success', 'Founder updated successfully.');
    }

    public function destroy(Founder $founder)
    {
        if ($founder->image) {
            FileRemover::remove($founder->image);
        }
        $founder->delete();

        return back()->with('success', 'Founder deleted successfully.');
    }
}
