<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users (both students and teachers)
        // Let's get up to 50 students and 10 teachers to make it fast but realistic
        $students = User::whereIn('id', \App\Models\StudentProfile::select('user_id'))->limit(50)->get();
        $teachers = User::whereIn('id', \App\Models\TeacherProfile::select('user_id'))->limit(10)->get();
        $allUsers = $students->concat($teachers);

        if ($allUsers->isEmpty()) {
            $this->command->warn('No users found. Please seed users first.');
            return;
        }

        // Generate data for the last 30 days
        $startDate = Carbon::today()->subDays(29);
        $endDate = Carbon::today();
        
        $statuses = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late', 'on_leave']; // 70% present chance
        
        $records = [];
        $now = Carbon::now();

        $this->command->info('Seeding attendance data for the last 30 days...');

        // Clear existing attendances in this date range to avoid duplicates
        DB::table('attendances')->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])->delete();

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            // Skip weekends (optional, but realistic for schools)
            if ($date->isWeekend()) {
                continue;
            }

            foreach ($allUsers as $user) {
                // Randomly assign a status based on probabilities
                $status = $statuses[array_rand($statuses)];
                
                $remarks = null;
                if ($status === 'late') {
                    $remarks = 'Traffic delay';
                } elseif ($status === 'on_leave') {
                    $remarks = 'Medical leave';
                } elseif ($status === 'absent') {
                    $remarks = 'Unexcused absence';
                }

                $records[] = [
                    'user_id' => $user->id,
                    'date' => $date->toDateString(),
                    'status' => $status,
                    'remarks' => $remarks,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        // Insert in chunks to avoid memory issues
        $chunks = array_chunk($records, 500);
        foreach ($chunks as $chunk) {
            DB::table('attendances')->insert($chunk);
        }

        $this->command->info('Successfully seeded ' . count($records) . ' attendance records!');
    }
}
