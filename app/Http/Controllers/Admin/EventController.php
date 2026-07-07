<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Event;
use Inertia\Inertia;

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
