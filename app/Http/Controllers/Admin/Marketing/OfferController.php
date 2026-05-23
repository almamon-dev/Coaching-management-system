<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OfferController extends Controller
{
    /**
     * Display a listing of offers.
     */
    public function index(Request $request)
    {
        $query = Offer::query();

        // Search Filter
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Status Filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status === 'active' ? 1 : 0);
        }

        // Sorting
        $sort = $request->get('sort_by', 'latest');
        match($sort) {
            'title_asc' => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            'date_asc' => $query->orderBy('start_date', 'asc'),
            'date_desc' => $query->orderBy('start_date', 'desc'),
            default => $query->latest()
        };

        $offers = $query->cursorPaginate($request->per_page ?? 10)->withQueryString();

        return Inertia::render('Admin/Marketing/Offers/List/OfferListPage', [
            'offers' => $offers,
            'filters' => $request->only(['search', 'status', 'sort_by', 'per_page']),
            'stats' => [
                'total' => Offer::count(),
                'active' => Offer::where('status', 1)->count(),
                'inactive' => Offer::where('status', 0)->count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new offer.
     */
    public function create()
    {
        return Inertia::render('Admin/Marketing/Offers/Create/OfferCreatePage');
    }

    /**
     * Store a newly created offer in database.
     */
    public function store(Request $request)
    {
        $rules = [
            'title' => 'required|string|max:200',
            'slug' => 'nullable|string|max:200|unique:offers,slug',
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'store_type' => 'required|string|max:100',
            'status' => 'boolean',
            'details' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        // Generate slug if empty
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle Image
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('offers', 'public');
            $validated['image'] = Storage::url($path);
        } elseif ($request->filled('image_url')) {
            $validated['image'] = $request->image_url;
        }

        Offer::create($validated);

        return redirect()->route('admin.marketing.offers.index')->with('success', 'Offer created successfully.');
    }

    /**
     * Show the form for editing the specified offer.
     */
    public function edit(Offer $offer)
    {
        return Inertia::render('Admin/Marketing/Offers/Edit/OfferEditPage', [
            'offer' => $offer
        ]);
    }

    /**
     * Update the specified offer in database.
     */
    public function update(Request $request, Offer $offer)
    {
        $rules = [
            'title' => 'required|string|max:200',
            'slug' => 'required|string|max:200|unique:offers,slug,' . $offer->id,
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'store_type' => 'required|string|max:100',
            'status' => 'boolean',
            'details' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        // Handle Image
        if ($request->hasFile('image_file')) {
            // Delete old image if it was uploaded
            if ($offer->image && Str::startsWith($offer->image, '/storage/')) {
                $oldPath = Str::after($offer->image, '/storage/');
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image_file')->store('offers', 'public');
            $validated['image'] = Storage::url($path);
        } elseif ($request->filled('image_url')) {
            $validated['image'] = $request->image_url;
        }

        $offer->update($validated);

        return redirect()->route('admin.marketing.offers.index')->with('success', 'Offer updated successfully.');
    }

    /**
     * Remove the specified offer.
     */
    public function destroy(Offer $offer)
    {
        // Delete old image if it was uploaded
        if ($offer->image && Str::startsWith($offer->image, '/storage/')) {
            $oldPath = Str::after($offer->image, '/storage/');
            Storage::disk('public')->delete($oldPath);
        }

        $offer->delete();

        return redirect()->back()->with('success', 'Offer deleted successfully.');
    }

    /**
     * Update the status of the offer.
     */
    public function updateStatus(Request $request, Offer $offer)
    {
        $status = $request->has('status') ? $request->status : !$offer->status;
        $offer->update(['status' => $status]);
        
        return redirect()->back()->with('success', 'Status updated successfully.');
    }

    /**
     * Bulk update status for offers.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
            'status' => 'required|integer|in:0,1'
        ]);

        $query = Offer::query();

        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        } else {
            if ($request->has('search')) {
                $query->where('title', 'like', '%'.$request->search.'%');
            }
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status === 'active' ? 1 : 0);
            }
        }

        $query->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Selected offers updated successfully.');
    }

    /**
     * Bulk delete offers.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
        ]);

        $query = Offer::query();

        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        } else {
            if ($request->has('search')) {
                $query->where('title', 'like', '%'.$request->search.'%');
            }
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status === 'active' ? 1 : 0);
            }
        }

        $offers = $query->get();
        foreach ($offers as $offer) {
            if ($offer->image && Str::startsWith($offer->image, '/storage/')) {
                $oldPath = Str::after($offer->image, '/storage/');
                Storage::disk('public')->delete($oldPath);
            }
            $offer->delete();
        }

        return redirect()->back()->with('success', 'Selected offers deleted successfully.');
    }
}
