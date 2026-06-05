<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Static Notices for now (to be made dynamic later)
        $notices = [
            [
                'id' => encrypt(1),
                'title' => 'Admission Open for 2026 Academic Year',
                'date' => '2025-12-15',
                'description' => 'Admission process for class 6 to 9 will start from 20th December. Collect forms from the school office.',
                'is_new' => true,
            ],
            [
                'id' => encrypt(2),
                'title' => 'Winter Vacation Announcement',
                'date' => '2025-12-10',
                'description' => 'The school will remain closed from 25th December to 5th January on account of the winter vacation.',
                'is_new' => true,
            ],
            [
                'id' => encrypt(3),
                'title' => 'Annual Sports Competition 2026',
                'date' => '2025-12-05',
                'description' => 'Students interested in participating in the annual sports day are requested to submit their names to their respective class teachers.',
                'is_new' => false,
            ],
            [
                'id' => encrypt(4),
                'title' => 'Parent-Teacher Meeting for Class 10',
                'date' => '2025-11-28',
                'description' => 'A mandatory parent-teacher meeting will be held on the upcoming Saturday to discuss SSC exam preparations.',
                'is_new' => false,
            ]
        ];

        return Inertia::render('Frontend/Home', [
            'notices' => $notices,
        ]);
    }
}
