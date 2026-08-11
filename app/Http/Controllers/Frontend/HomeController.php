<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Notice;
use App\Models\Course;

class HomeController extends Controller
{
    public function index()
    {
        $dbNotices = Notice::latest()->take(5)->get();

        $notices = $dbNotices->map(function($notice) {
            return [
                'id' => $notice->id,
                'title' => $notice->title,
                'date' => $notice->published_at ? date('Y-m-d', strtotime((string)$notice->published_at)) : date('Y-m-d'),
                'description' => $notice->content,
                'is_new' => true,
            ];
        });

        $courses = Course::where('status', 'active')->get();

        return Inertia::render('Frontend/Home', [
            'notices' => $notices,
            'events' => [],
            'galleries' => [],
            'founders' => [],
            'courses' => $courses,
        ]);
    }
}
