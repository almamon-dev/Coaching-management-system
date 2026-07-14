<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Event;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Support\Media\FileUploader;
use App\Support\Media\FileRemover;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('user')->orderBy('created_at', 'desc');

        if ($request->filled('tab') && $request->tab !== 'all') {
            if ($request->tab === 'published') {
                $query->where('status', 'published');
            } elseif ($request->tab === 'pending') {
                $query->where('status', 'pending');
            }
        }

        $events = $query->paginate(10)->withQueryString();

        $counts = [
            'all' => Event::count(),
            'published' => Event::where('status', 'published')->count(),
            'pending' => Event::where('status', 'pending')->count(),
        ];
        
        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'counts' => $counts,
            'currentTab' => $request->tab ?? 'all'
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'location' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'registration_required' => 'required|in:yes,no',
            'registration_deadline' => 'nullable|date',
            'status' => 'required|in:published,draft,pending',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        
        // Ensure slug uniqueness
        $originalSlug = $validated['slug'];
        $count = 1;
        while (Event::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $count;
            $count++;
        }

        $validated['user_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $validated['image'] = FileUploader::upload('events', $request->file('image'));
        }

        Event::create($validated);

        return redirect()->route('admin.events.index')->with('success', 'Event created successfully.');
    }

    public function edit(Event $event)
    {
        return Inertia::render('Admin/Events/Edit', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'location' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'registration_required' => 'required|in:yes,no',
            'registration_deadline' => 'nullable|date',
            'status' => 'required|in:published,draft,pending',
        ]);

        if ($request->title !== $event->title) {
            $validated['slug'] = Str::slug($validated['title']);
            
            $originalSlug = $validated['slug'];
            $count = 1;
            while (Event::where('slug', $validated['slug'])->where('id', '!=', $event->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $count;
                $count++;
            }
        }

        if ($request->hasFile('image')) {
            if ($event->image) {
                FileRemover::delete($event->image);
            }
            $validated['image'] = FileUploader::upload('events', $request->file('image'));
        }

        $event->update($validated);

        return redirect()->route('admin.events.index')->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event)
    {
        if ($event->image) {
            FileRemover::delete($event->image);
        }
        $event->delete();
        
        return redirect()->route('admin.events.index')->with('success', 'Event deleted successfully.');
    }

    public function approve(Event $event)
    {
        $event->update(['status' => 'published']);
        return back()->with('success', 'Event approved successfully.');
    }

    public function reject(Event $event)
    {
        $event->update(['status' => 'draft']);
        return back()->with('success', 'Event rejected successfully.');
    }
}
