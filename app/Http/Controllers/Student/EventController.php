<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return Inertia::render('Student/Events/Index', [
            'events' => $events
        ]);
    }

    public function create()
    {
        return Inertia::render('Student/Events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'nullable|date_format:H:i',
            'location' => 'required|string|max:255',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        $validated['user_id'] = Auth::id();
        $validated['status'] = 'pending';

        Event::create($validated);

        return redirect()->route('student.events.index')->with('success', 'Event request submitted for verification.');
    }
}
