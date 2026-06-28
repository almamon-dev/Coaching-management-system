<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
            PageSeeder::class,
            AcademicClassSeeder::class,
            \Database\Seeders\AcademicSessionSeeder::class,
            SubjectSeeder::class,
            DepartmentSeeder::class,
            DesignationSeeder::class,
            TeacherSeeder::class,
            ClassRoutineSeeder::class,
            StudentSeeder::class,
        ]);
    }
}
