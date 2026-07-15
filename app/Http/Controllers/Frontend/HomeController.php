<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Founder;
use App\Models\ImportantLink;
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
                    'image' => \App\Support\Media\FileUrlGenerator::generate($event->image),
                    'date' => $event->date->format('Y-m-d'),
                    'time' => $event->time ? date('h:i A', strtotime($event->time)) : null,
                    'location' => $event->location,
                ];
            });

        $galleries = \App\Models\Gallery::where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->latest()
            ->take(4)
            ->get()
            ->map(function($gallery) {
                return [
                    'id' => encrypt($gallery->id),
                    'title' => $gallery->title,
                    'category' => $gallery->category,
                    'image' => \App\Support\Media\FileUrlGenerator::generate($gallery->image),
                ];
            });

        $founders = \App\Models\Founder::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get()
            ->map(function($founder) {
                return [
                    'id' => encrypt($founder->id),
                    'name' => $founder->name,
                    'role' => $founder->role,
                    'description' => $founder->description,
                    'image' => \App\Support\Media\FileUrlGenerator::generate($founder->image),
                ];
            });

        return Inertia::render('Frontend/Home', [
            'notices' => $notices,
            'events' => $events,
            'galleries' => $galleries,
            'founders' => $founders,
        ]);
    }
}
