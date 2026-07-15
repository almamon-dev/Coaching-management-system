<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ImportantLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImportantLinkController extends Controller
{
    public function index(Request $request)
    {
        $query = ImportantLink::query();

        if ($request->has('search') && !empty($request->search)) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $links = $query->orderBy('order', 'asc')
                       ->paginate(10)
                       ->withQueryString();

        return Inertia::render('Admin/ImportantLinks/Index', [
            'links' => $links,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        ImportantLink::create($validated);

        return redirect()->back()->with('success', 'Link created successfully.');
    }

    public function update(Request $request, ImportantLink $importantLink)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $importantLink->update($validated);

        return redirect()->back()->with('success', 'Link updated successfully.');
    }

    public function destroy(ImportantLink $importantLink)
    {
        $importantLink->delete();

        return redirect()->back()->with('success', 'Link deleted successfully.');
    }
}
