<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Blog;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::query();

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            if ($status === 'active') $query->where('is_active', true);
            if ($status === 'inactive') $query->where('is_active', false);
        }

        $blogs = $query->latest()->paginate($request->input('per_page', 10))->withQueryString();
        
        $stats = [
            'total' => Blog::count(),
            'active' => Blog::where('is_active', true)->count(),
            'inactive' => Blog::where('is_active', false)->count(),
        ];

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'stats' => $stats
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blogs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('blogs', 'public');
        }

        Blog::create($validated);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog created successfully.');
    }

    public function edit(Blog $blog)
    {
        return Inertia::render('Admin/Blogs/Edit', [
            'blog' => $blog
        ]);
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blogs,slug,' . $blog->id,
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('blogs', 'public');
        }

        $blog->update($validated);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog updated successfully.');
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();
        return redirect()->back()->with('success', 'Blog deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        $all = $request->input('all', false);

        if ($all) {
            Blog::truncate();
        } else if (count($ids)) {
            Blog::whereIn('id', $ids)->delete();
        }

        return redirect()->back()->with('success', 'Selected blogs deleted successfully.');
    }

    public function updateStatus(Request $request, Blog $blog)
    {
        $blog->update(['is_active' => $request->input('is_active')]);
        return redirect()->back()->with('success', 'Status updated successfully.');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $ids = $request->input('ids', []);
        $all = $request->input('all', false);
        $isActive = $request->input('is_active');

        if ($all) {
            Blog::query()->update(['is_active' => $isActive]);
        } else if (count($ids)) {
            Blog::whereIn('id', $ids)->update(['is_active' => $isActive]);
        }

        return redirect()->back()->with('success', 'Selected blogs updated successfully.');
    }
}
