<?php

namespace Database\Seeders;

use App\Models\AcademicSession;
use App\Models\Exam;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $session = AcademicSession::firstOrCreate(
            ['is_current' => true],
            [
                'name' => date('Y') . ' Session',
                'start_date' => date('Y-01-01'),
                'end_date' => date('Y-12-31')
            ]
        );

        $exams = [
            [
                'name' => 'Half Yearly Examination ' . date('Y'),
                'academic_session_id' => $session->id,
                'start_date' => Carbon::now()->subMonths(2)->format('Y-m-d'),
                'end_date' => Carbon::now()->subMonths(2)->addDays(15)->format('Y-m-d'),
                'status' => 'completed',
                'description' => 'Mid term examination for all classes.',
            ],
            [
                'name' => 'Annual Examination ' . date('Y'),
                'academic_session_id' => $session->id,
                'start_date' => Carbon::now()->addMonths(3)->format('Y-m-d'),
                'end_date' => Carbon::now()->addMonths(3)->addDays(15)->format('Y-m-d'),
                'status' => 'upcoming',
                'description' => 'Final year examination for all classes.',
            ]
        ];

        foreach ($exams as $exam) {
            Exam::updateOrCreate(
                ['name' => $exam['name'], 'academic_session_id' => $exam['academic_session_id']],
                $exam
            );
        }
    }
}
