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

        // Generate 30 students ONLY for Class Six
        $currentYear = date('y');
        $baseCount = StudentProfile::count();
        $studentIndex = 1;

        foreach ($classes as $academicClass) {
            // Only seed students for Class Six (numeric_value 6)
            if ($academicClass->numeric_value !== 6) {
                continue;
            }

            $sections = $academicClass->sections;
            if ($sections->isEmpty()) continue;

            for ($i = 1; $i <= 30; $i++) {
                $user = User::create([
                    'name' => $faker->name,
                    'username' => 'student' . $studentIndex,
                    'email' => 'student' . $studentIndex . '@sms.com',
                    'phone' => '017' . str_pad($studentIndex, 8, '0', STR_PAD_LEFT),
                    'password' => Hash::make('password'),
                    'user_type' => 'user',
                ]);

                $studentId = $currentYear . str_pad($baseCount + $studentIndex, 4, '0', STR_PAD_LEFT);

                $profile = StudentProfile::create([
                    'user_id' => $user->id,
                    'student_id' => $studentId,
                    'guardian_name' => $faker->name,
                    'guardian_phone' => '018' . str_pad($studentIndex, 8, '0', STR_PAD_LEFT),
                    'guardian_relation' => $faker->randomElement(['Father', 'Mother', 'Uncle']),
                    'guardian_email' => 'guardian' . $studentIndex . '@sms.com',
                    'dob' => $faker->date('Y-m-d', '-12 years'),
                    'gender' => $faker->randomElement(['male', 'female']),
                    'blood_group' => $faker->randomElement(['A+', 'O+', 'B+', 'AB+']),
                    'address' => $faker->address,
                ]);

                // Assign to the current class and a random section within that class
                $randomSection = $sections->random();

                Enrollment::create([
                    'student_profile_id' => $profile->id,
                    'academic_session_id' => $session->id,
                    'academic_class_id' => $academicClass->id,
                    'section_id' => $randomSection->id,
                    'status' => 'active',
                    'roll_number' => $i, // Sequential roll number from 1 to 30
                ]);

                $studentIndex++;
            }
        }
    }
}
