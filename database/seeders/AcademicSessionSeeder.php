<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicSession;

class AcademicSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sessions = [
            [
                'name' => '2025-2026',
                'start_date' => '2025-01-01',
                'end_date' => '2025-12-31',
                'is_current' => false,
            ],
            [
                'name' => '2026-2027',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'is_current' => true,
            ],
            [
                'name' => '2027-2028',
                'start_date' => '2027-01-01',
                'end_date' => '2027-12-31',
                'is_current' => false,
            ],
        ];

        foreach ($sessions as $session) {
            AcademicSession::updateOrCreate(
                ['name' => $session['name']],
                $session
            );
        }
    }
}
