<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class NoticeController extends Controller
{
    // Hardcoded notices for now. Will be moved to database later.
    private $notices = [
        [
            'id' => 1,
            'title' => 'Admission Open for 2026 Academic Year',
            'date' => '2025-12-15',
            'description' => 'Admission process for class 6 to 9 will start from 20th December. Collect forms from the school office. Please make sure to bring the recent passport size photographs, birth certificate copy, and previous school\'s testimonial. The admission test will be held on the 28th of December at the main school campus. Results will be published on the same day in the evening.',
            'is_new' => true,
            'author' => 'Headmaster',
            'attachment' => 'admission-guideline-2026.pdf',
        ],
        [
            'id' => 2,
            'title' => 'Winter Vacation Announcement',
            'date' => '2025-12-10',
            'description' => 'The school will remain closed from 25th December to 5th January on account of the winter vacation. All regular classes and academic activities will resume from 6th January. We wish all our students and their families a very happy and safe holiday.',
            'is_new' => true,
            'author' => 'Administration',
            'attachment' => null,
        ],
        [
            'id' => 3,
            'title' => 'Annual Sports Competition 2026',
            'date' => '2025-12-05',
            'description' => 'Students interested in participating in the annual sports day are requested to submit their names to their respective class teachers by the 15th of December. The main events will include 100m sprint, long jump, high jump, and relay race. The final competition will be held on the 10th of January in the school playground.',
            'is_new' => false,
            'author' => 'Sports Committee',
            'attachment' => 'sports-schedule.pdf',
        ],
        [
            'id' => 4,
            'title' => 'Parent-Teacher Meeting for Class 10',
            'date' => '2025-11-28',
            'description' => 'A mandatory parent-teacher meeting will be held on the upcoming Saturday to discuss SSC exam preparations. All parents are requested to be present at the school auditorium exactly at 10:00 AM. Class teachers will be sharing individual student progress reports.',
            'is_new' => false,
            'author' => 'Class Teacher, Class 10',
            'attachment' => null,
        ]
    ];

    public function show($id)
    {
        try {
            // Decrypt the incoming ID
            $decryptedId = decrypt($id);
        } catch (\Exception $e) {
            abort(404);
        }

        $notice = collect($this->notices)->firstWhere('id', (int) $decryptedId);

        if (!$notice) {
            abort(404);
        }

        // Get 3 recent notices excluding the current one for the sidebar
        $recentNotices = collect($this->notices)
            ->where('id', '!=', (int) $decryptedId)
            ->take(3)
            ->map(function ($item) {
                // Encrypt ID for the recent notices links
                $item['id'] = encrypt($item['id']);
                return $item;
            })
            ->values()
            ->all();

        // Encrypt the current notice ID just in case it's used in the view
        $notice['id'] = encrypt($notice['id']);

        return Inertia::render('Frontend/Notices/Show', [
            'notice' => $notice,
            'recentNotices' => $recentNotices
        ]);
    }
}
