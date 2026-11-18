<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class batcheseeder extends Seeder
{
    public function run(): void
    {
        $batches = [
            // ─── HSC / Intermediate ───────────────────────────────────
            [
                'title'       => 'Physics 1st & 2nd Paper',
                'code'        => 'HSC-PHY',
                'category'    => 'HSC / Intermediate',
                'fee'         => 1200,
                'admission_fee' => 500,
                'duration'    => '2 Years',
                'description' => 'Complete HSC Physics covering mechanics, waves, optics & modern physics.',
                'status'      => 'active',
            ],
            [
                'title'       => 'Chemistry 1st & 2nd Paper',
                'code'        => 'HSC-CHE',
                'category'    => 'HSC / Intermediate',
                'fee'         => 1200,
                'admission_fee' => 500,
                'duration'    => '2 Years',
                'description' => 'Organic, inorganic and physical chemistry for HSC students.',
                'status'      => 'active',
            ],
            [
                'title'       => 'Higher Math 1st & 2nd Paper',
                'code'        => 'HSC-HMT',
                'category'    => 'HSC / Intermediate',
                'fee'         => 1300,
                'admission_fee' => 500,
                'duration'    => '2 Years',
                'description' => 'Calculus, algebra, coordinate geometry and statistics for HSC.',
                'status'      => 'active',
            ],
            [
                'title'       => 'Biology 1st & 2nd Paper',
                'code'        => 'HSC-BIO',
                'category'    => 'HSC / Intermediate',
                'fee'         => 1100,
                'admission_fee' => 500,
                'duration'    => '2 Years',
                'description' => 'Botany and zoology for HSC Biology group students.',
                'status'      => 'active',
            ],
            [
                'title'       => 'Bangla 1st & 2nd Paper',
                'code'        => 'HSC-BAN',
                'category'    => 'HSC / Intermediate',
                'fee'         => 900,
                'admission_fee' => 300,
                'duration'    => '2 Years',
                'description' => 'Bangla grammar, literature, essay and comprehension for HSC.',
                'status'      => 'active',
            ],
            [
                'title'       => 'English 1st & 2nd Paper',
                'code'        => 'HSC-ENG',
                'category'    => 'HSC / Intermediate',
                'fee'         => 1000,
                'admission_fee' => 300,
                'duration'    => '2 Years',
                'description' => 'Reading, writing, grammar and comprehension for HSC English.',
                'status'      => 'active',
            ],

            // ─── SSC ──────────────────────────────────────────────────
            [
                'title'       => 'SSC General Math',
                'code'        => 'SSC-GMT',
                'category'    => 'SSC',
                'fee'         => 900,
                'admission_fee' => 400,
                'duration'    => '1 Year',
                'description' => 'Arithmetic, algebra and geometry preparation for SSC exam.',
                'status'      => 'active',
            ],
            [
                'title'       => 'SSC Science (Phy + Che + Bio)',
                'code'        => 'SSC-SCI',
                'category'    => 'SSC',
                'fee'         => 1100,
                'admission_fee' => 500,
                'duration'    => '1 Year',
                'description' => 'Combined physics, chemistry and biology batch for SSC.',
                'status'      => 'active',
            ],
            [
                'title'       => 'SSC English',
                'code'        => 'SSC-ENG',
                'category'    => 'SSC',
                'fee'         => 800,
                'admission_fee' => 300,
                'duration'    => '1 Year',
                'description' => 'Grammar, writing skills and comprehension for SSC English.',
                'status'      => 'active',
            ],

            // ─── Class 8 ──────────────────────────────────────────────
            [
                'title'       => 'Class 8 Math',
                'code'        => 'CL8-MTH',
                'category'    => 'Class 8',
                'fee'         => 700,
                'admission_fee' => 250,
                'duration'    => '1 Year',
                'description' => 'Full syllabus math coaching for class 8 students.',
                'status'      => 'active',
            ],
            [
                'title'       => 'Class 8 Science',
                'code'        => 'CL8-SCI',
                'category'    => 'Class 8',
                'fee'         => 700,
                'admission_fee' => 250,
                'duration'    => '1 Year',
                'description' => 'Science coaching covering physics, chemistry and biology for class 8.',
                'status'      => 'active',
            ],
        ];

        foreach ($batches as $course) {
            Course::firstOrCreate(
                ['code' => $course['code']],
                $course
            );
        }

        $this->command->info('✅ ' . count($batches) . ' sample subjects seeded successfully!');
    }
}
