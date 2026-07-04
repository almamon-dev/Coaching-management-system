<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Event;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with('user')->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('Admin/Events/Index', [
            'events' => $events
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
