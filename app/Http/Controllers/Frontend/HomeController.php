<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $dbNotices = \App\Models\Notice::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->take(5)
            ->get();

        $notices = $dbNotices->map(function($notice) {
            return [
                'id' => encrypt($notice->id),
                'title' => $notice->title,
                'date' => $notice->published_at ? $notice->published_at->format('Y-m-d') : $notice->created_at->format('Y-m-d'),
                'description' => $notice->content,
                'is_new' => $notice->published_at ? $notice->published_at->diffInDays(now()) <= 7 : false,
            ];
        });

        $events = \App\Models\Event::where('status', 'published')
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->take(4)
            ->get()
            ->map(function($event) {
                return [
                    'id' => encrypt($event->id),
                    'title' => $event->title,
                    'slug' => $event->slug,
                    'description' => $event->description,
                    'image' => $event->image,
                    'date' => $event->date->format('Y-m-d'),
                    'time' => $event->time ? date('h:i A', strtotime($event->time)) : null,
                    'location' => $event->location,
                ];
            });

        return Inertia::render('Frontend/Home', [
            'notices' => $notices,
            'events' => $events,
        ]);
    }
}
