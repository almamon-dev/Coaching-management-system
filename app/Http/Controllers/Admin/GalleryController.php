<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Support\Media\FileUploader;
use App\Support\Media\FileRemover;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'all');

        $query = Gallery::latest();

        if ($tab === 'published') {
            $query->where('status', 'published');
        } elseif ($tab === 'draft') {
            $query->where('status', 'draft');
        }

        $galleries = $query->paginate(10)->withQueryString();

        $galleries->getCollection()->transform(function ($gallery) {
            $gallery->image_url = \App\Support\Media\FileUrlGenerator::generate($gallery->image);
            return $gallery;
        });

        $counts = [
            'all' => Gallery::count(),
            'published' => Gallery::where('status', 'published')->count(),
            'draft' => Gallery::where('status', 'draft')->count(),
        ];

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => $galleries,
            'counts' => $counts,
            'currentTab' => $tab,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Galleries/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'image' => 'required|image|max:2048',
            'is_featured' => 'boolean',
            'status' => 'required|in:published,draft',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = FileUploader::upload('galleries', $request->file('image'));
        }

        Gallery::create($validated);

        return redirect()->route('admin.galleries.index')->with('success', 'Gallery item created successfully.');
    }

    public function edit(Gallery $gallery)
    {
        $gallery->image_url = \App\Support\Media\FileUrlGenerator::generate($gallery->image);
        return Inertia::render('Admin/Galleries/Edit', [
            'gallery' => $gallery,
        ]);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'boolean',
            'status' => 'required|in:published,draft',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($gallery->image) {
                FileRemover::delete($gallery->image);
            }
            $validated['image'] = FileUploader::upload('galleries', $request->file('image'));
        }

        $gallery->update($validated);

        return redirect()->route('admin.galleries.index')->with('success', 'Gallery item updated successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->image) {
            FileRemover::delete($gallery->image);
        }
        $gallery->delete();

        return redirect()->route('admin.galleries.index')->with('success', 'Gallery item deleted successfully.');
    }
}
