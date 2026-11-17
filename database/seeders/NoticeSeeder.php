<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notice;
use App\Models\User;
use App\Notifications\NewNoticeNotification;
use Illuminate\Support\Facades\Notification;

class NoticeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('user_type', 'admin')->first() ?? User::first();

        if (!$admin) {
            $this->command->error('No admin user found to create notices.');
            return;
        }

        $noticesData = [
            [
                'title' => 'Upcoming Final Examinations',
                'content' => 'Dear students and guardians, the upcoming model tests and examinations will commence from next month. Please check the routine attached on the coaching notice board.',
                'type' => 'notice',
                'target_audience' => 'all',
                'status' => 'published',
                'published_at' => now()->subDays(1),
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Teachers Meeting at 3 PM',
                'content' => 'All teaching staff are requested to gather in the main auditorium for the monthly academic progress meeting.',
                'type' => 'announcement',
                'target_audience' => 'teacher',
                'status' => 'published',
                'published_at' => now()->subHours(2),
                'created_by' => $admin->id,
            ],
            [
                'title' => 'New Library Rules',
                'content' => 'Students must return their borrowed books within 14 days to avoid a late fee penalty.',
                'type' => 'notice',
                'target_audience' => 'student',
                'status' => 'published',
                'published_at' => now()->subMinutes(30),
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Annual Sports Day 2026',
                'content' => 'Get ready for the annual sports day! Registrations for track and field events are now open.',
                'type' => 'announcement',
                'target_audience' => 'all',
                'status' => 'published',
                'published_at' => now(),
                'created_by' => $admin->id,
            ]
        ];

        foreach ($noticesData as $data) {
            $notice = Notice::create($data);
            
            $query = User::query();
            if ($notice->target_audience === 'teacher') {
                $query->where('user_type', 'teacher');
            } elseif ($notice->target_audience === 'student') {
                $query->where('user_type', 'student');
            }
            
            $users = $query->get();
            if ($users->count() > 0) {
                Notification::send($users, new NewNoticeNotification($notice));
                $this->command->info('Notified ' . $users->count() . ' users for "' . $notice->title . '"');
            } else {
                $this->command->warn('No users found to notify for "' . $notice->title . '"');
            }
        }

        $this->command->info('Notices seeded and notifications sent successfully.');
    }
}
