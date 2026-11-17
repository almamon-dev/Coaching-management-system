<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::orderBy('sort_order', 'asc')->paginate(12);

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => $galleries,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'image' => 'nullable',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:published,draft',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('galleries', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('galleries', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        if (empty($validated['image'])) {
            $validated['image'] = '/images/campus_sports.png';
        }

        Gallery::create($validated);

        return redirect()->back()->with('success', 'Gallery photo added successfully.');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'image' => 'nullable',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:published,draft',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('galleries', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('galleries', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $gallery->update($validated);

        return redirect()->back()->with('success', 'Gallery photo updated successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();

        return redirect()->back()->with('success', 'Gallery photo removed successfully.');
    }
}

