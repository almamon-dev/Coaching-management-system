<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\AcademicClass;
use App\Models\AcademicSession;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Ensure we have a current session
        $session = AcademicSession::firstOrCreate(
            ['is_current' => true],
            [
                'name' => '2026 Session',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31'
            ]
        );

        $classes = AcademicClass::with('sections')->get();

        if ($classes->isEmpty()) {
            return;
        }

        // Generate 3000 students
        $currentYear = date('y');
        $baseCount = StudentProfile::count();

        for ($i = 1; $i <= 300; $i++) {
            $user = User::create([
                'name' => $faker->name,
                'username' => 'student' . $i,
                'email' => 'student' . $i . '@sms.com',
                'phone' => '017' . str_pad($i, 8, '0', STR_PAD_LEFT),
                'password' => Hash::make('password'),
                'user_type' => 'user',
            ]);

            $studentId = $currentYear . str_pad($baseCount + $i, 4, '0', STR_PAD_LEFT);

            $profile = StudentProfile::create([
                'user_id' => $user->id,
                'student_id' => $studentId,
                'guardian_name' => $faker->name,
                'guardian_phone' => '018' . str_pad($i, 8, '0', STR_PAD_LEFT),
                'guardian_relation' => $faker->randomElement(['Father', 'Mother', 'Uncle']),
                'guardian_email' => 'guardian' . $i . '@sms.com',
                'dob' => $faker->date('Y-m-d', '-12 years'),
                'gender' => $faker->randomElement(['male', 'female']),
                'blood_group' => $faker->randomElement(['A+', 'O+', 'B+', 'AB+']),
                'address' => $faker->address,
            ]);

            // Assign to a random class and section
            $randomClass = $classes->random();
            $randomSection = $randomClass->sections->isNotEmpty() ? $randomClass->sections->random() : null;

            if ($randomSection) {
                Enrollment::create([
                    'student_profile_id' => $profile->id,
                    'academic_session_id' => $session->id,
                    'academic_class_id' => $randomClass->id,
                    'section_id' => $randomSection->id,
                    'status' => 'active',
                    'roll_number' => rand(1, 100),
                ]);
            }
        }
    }
}
