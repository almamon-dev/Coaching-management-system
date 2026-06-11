<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\Subject;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = ['Science', 'Humanities', 'Commerce', 'Mathematics', 'Languages', 'Physical Education', 'Arts'];
        $designations = ['Senior Teacher', 'Assistant Teacher', 'Lecturer', 'Head of Department', 'Instructor'];
        
        // Get all subject IDs to randomly assign as specializations
        $subjectIds = Subject::pluck('id')->toArray();
        if (empty($subjectIds)) {
            // Fallback if no subjects exist
            $subjectIds = [1, 2, 3];
        }

        for ($i = 1; $i <= 15; $i++) {
            // Create User
            $user = User::create([
                'name' => "Teacher $i " . fake()->lastName(),
                'email' => "teacher" . uniqid() . "@school.com",
                'phone' => fake()->phoneNumber(),
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);

            // Assign Teacher Role
            $role = \Spatie\Permission\Models\Role::findOrCreate('teacher', 'web');
            $user->assignRole($role);

            // Determine random specializations (1 to 3 subjects)
            shuffle($subjectIds);
            $specializations = array_slice($subjectIds, 0, rand(1, 3));
            
            // Convert to strings to match how the frontend sends/expects them if necessary
            $specializations = array_map('strval', $specializations);

            // Create Profile
            TeacherProfile::create([
                'user_id' => $user->id,
                'employee_id' => 'EMP-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'designation' => fake()->randomElement($designations),
                'department' => fake()->randomElement($departments),
                'joining_date' => fake()->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
                'qualifications' => 'M.Sc, B.Ed',
                'specializations' => $specializations,
            ]);
        }
    }
}
