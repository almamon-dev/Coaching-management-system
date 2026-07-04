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

        return Inertia::render('Frontend/Home', [
            'notices' => $notices,
        ]);
    }
}
