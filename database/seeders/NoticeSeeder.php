<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notice;
use App\Models\User;

class NoticeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('user_type', 'super_admin')->first() 
            ?? User::where('user_type', 'admin')->first() 
            ?? User::first();

        $adminId = $admin ? $admin->id : 1;

        $notices = [
            [
                'title' => 'Weekly Physics Model Test Schedule (HSC 2026)',
                'content' => 'All HSC 2026 science batch students are informed that the upcoming weekly Physics Model Test on Kinematics and Dynamics will take place this Friday at 10:00 AM in Hall Room B. Attendance is mandatory for all registered students.',
                'target_role' => 'all',
                'category' => 'Exam',
                'priority' => 'high',
                'published_at' => now()->subHours(3),
                'created_by' => $adminId,
            ],
            [
                'title' => 'Special Math Revision & Doubt Clearing Session',
                'content' => 'Special extra problem-solving classes for Class 9 & 10 Higher Mathematics have been scheduled for tomorrow afternoon from 3:00 PM to 5:30 PM. Students are advised to bring their homework question sheets.',
                'target_role' => 'all',
                'category' => 'Academic',
                'priority' => 'normal',
                'published_at' => now()->subDays(1)->setTime(11, 30),
                'created_by' => $adminId,
            ],
            [
                'title' => 'Guardian-Teacher Coordination Meeting Announced',
                'content' => 'Respected guardians of SSC 2026 candidates are cordially invited to the quarterly academic performance review and guidance meeting this Saturday at 4:00 PM in the Main Auditorium.',
                'target_role' => 'all',
                'category' => 'Meeting',
                'priority' => 'high',
                'published_at' => now()->subDays(2)->setTime(16, 0),
                'created_by' => $adminId,
            ],
            [
                'title' => 'Admissions Open for New Academic Batches (2026-2027)',
                'content' => 'Admissions for new academic sessions in Class 9, Class 10, SSC, and HSC batches are officially ongoing. Limited seats available per batch. Visit our administrative desk for prospectus and registration details.',
                'target_role' => 'all',
                'category' => 'Announcement',
                'priority' => 'normal',
                'published_at' => now()->subDays(3)->setTime(10, 15),
                'created_by' => $adminId,
            ],
            [
                'title' => 'Library & Digital Study Resources Available',
                'content' => 'Students can now borrow reference books and lecture formula booklets from the coaching library. Digital question banks and solved exam papers are also accessible via the student portal.',
                'target_role' => 'all',
                'category' => 'Academic',
                'priority' => 'normal',
                'published_at' => now()->subDays(5)->setTime(14, 0),
                'created_by' => $adminId,
            ],
            [
                'title' => 'SSC 2026 Pre-Board Evaluation Results Published',
                'content' => 'The results of the recent Pre-Board comprehensive assessment have been officially published on the notice board and sent via SMS to registered guardian numbers.',
                'target_role' => 'all',
                'category' => 'Exam',
                'priority' => 'normal',
                'published_at' => now()->subDays(7)->setTime(9, 45),
                'created_by' => $adminId,
            ],
        ];

        foreach ($notices as $noticeData) {
            Notice::updateOrCreate(
                ['title' => $noticeData['title']],
                $noticeData
            );
        }

        $this->command->info('Notices successfully seeded with dynamic recent dates.');
    }
}
