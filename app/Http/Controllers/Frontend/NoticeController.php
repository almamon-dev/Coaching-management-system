<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class NoticeController extends Controller
{
    public function index()
    {
        $noticesDb = \App\Models\Notice::with('creator')
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        $noticesDb->getCollection()->transform(function ($item) {
            $date = $item->published_at ?? $item->created_at;
            return [
                'id' => encrypt($item->id),
                'title' => $item->title,
                'category' => $item->category ?? 'General',
                'day' => $date ? $date->format('d') : date('d'),
                'month' => $date ? strtoupper($date->format('M')) : date('M'),
                'date' => $date ? $date->format('Y-m-d') : date('Y-m-d'),
                'description' => $item->content,
                'is_new' => $date ? $date->diffInDays(now()) <= 7 : false,
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

        $noticeModel = \App\Models\Notice::with('creator')->whereNotNull('published_at')->find($decryptedId);

        if (!$noticeModel) {
            abort(404);
        }

        $date = $noticeModel->published_at ?? $noticeModel->created_at;

        $notice = [
            'id' => encrypt($noticeModel->id),
            'title' => $noticeModel->title,
            'category' => $noticeModel->category ?? 'General',
            'day' => $date ? $date->format('d') : date('d'),
            'month' => $date ? strtoupper($date->format('M')) : date('M'),
            'date' => $date ? $date->format('Y-m-d') : date('Y-m-d'),
            'description' => $noticeModel->content,
            'is_new' => $date ? $date->diffInDays(now()) <= 7 : false,
            'author' => $noticeModel->creator ? $noticeModel->creator->name : 'Administration',
            'attachment' => null, // Attachments could be added to DB later
        ];

        // Get 3 recent notices excluding the current one for the sidebar
        $recentNoticesDb = \App\Models\Notice::whereNotNull('published_at')
            ->where('id', '!=', $decryptedId)
            ->orderBy('published_at', 'desc')
            ->take(3)
            ->get();

        $recentNotices = $recentNoticesDb->map(function ($item) {
            $recentDate = $item->published_at ?? $item->created_at;
            return [
                'id' => encrypt($item->id),
                'title' => $item->title,
                'category' => $item->category ?? 'General',
                'day' => $recentDate ? $recentDate->format('d') : date('d'),
                'month' => $recentDate ? strtoupper($recentDate->format('M')) : date('M'),
                'date' => $recentDate ? $recentDate->format('Y-m-d') : date('Y-m-d'),
                'description' => $item->content,
                'is_new' => $recentDate ? $recentDate->diffInDays(now()) <= 7 : false,
            ];
        })->all();

        return Inertia::render('Frontend/Notices/Show', [
            'notice' => $notice,
            'recentNotices' => $recentNotices
        ]);
    }
}
