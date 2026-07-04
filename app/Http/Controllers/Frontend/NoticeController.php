<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class NoticeController extends Controller
{
    public function index()
    {
        $noticesDb = \App\Models\Notice::with('creator')->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        $noticesDb->getCollection()->transform(function ($item) {
            return [
                'id' => encrypt($item->id),
                'title' => $item->title,
                'date' => $item->published_at ? $item->published_at->format('Y-m-d') : $item->created_at->format('Y-m-d'),
                'description' => $item->content,
                'is_new' => $item->published_at ? $item->published_at->diffInDays(now()) <= 7 : false,
                'author' => $item->creator ? $item->creator->name : 'Administration',
            ];
        });

        return Inertia::render('Frontend/Notices/Index', [
            'notices' => $noticesDb
        ]);
    }

    public function show($id)
    {
        try {
            $decryptedId = decrypt($id);
        } catch (\Exception $e) {
            abort(404);
        }

        $noticeModel = \App\Models\Notice::with('creator')->where('status', 'published')->find($decryptedId);

        if (!$noticeModel) {
            abort(404);
        }

        $notice = [
            'id' => encrypt($noticeModel->id),
            'title' => $noticeModel->title,
            'date' => $noticeModel->published_at ? $noticeModel->published_at->format('Y-m-d') : $noticeModel->created_at->format('Y-m-d'),
            'description' => $noticeModel->content,
            'is_new' => $noticeModel->published_at ? $noticeModel->published_at->diffInDays(now()) <= 7 : false,
            'author' => $noticeModel->creator ? $noticeModel->creator->name : 'Administration',
            'attachment' => null, // Attachments could be added to DB later
        ];

        // Get 3 recent notices excluding the current one for the sidebar
        $recentNoticesDb = \App\Models\Notice::where('status', 'published')
            ->where('id', '!=', $decryptedId)
            ->orderBy('published_at', 'desc')
            ->take(3)
            ->get();

        $recentNotices = $recentNoticesDb->map(function ($item) {
            return [
                'id' => encrypt($item->id),
                'title' => $item->title,
                'date' => $item->published_at ? $item->published_at->format('Y-m-d') : $item->created_at->format('Y-m-d'),
                'description' => $item->content,
                'is_new' => $item->published_at ? $item->published_at->diffInDays(now()) <= 7 : false,
            ];
        })->all();

        return Inertia::render('Frontend/Notices/Show', [
            'notice' => $notice,
            'recentNotices' => $recentNotices
        ]);
    }
}
