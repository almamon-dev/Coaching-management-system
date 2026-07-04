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
            AcademicSessionSeeder::class,
            SubjectSeeder::class,
            DepartmentSeeder::class,
            DesignationSeeder::class,
            TeacherSeeder::class,
            SubjectAllocationSeeder::class,
            ClassRoutineSeeder::class,
            StudentSeeder::class,
            AttendanceSeeder::class,
            ExamSeeder::class,
            GradeSeeder::class,
            AssignmentSeeder::class,
            MarkSeeder::class,
            ResultSeeder::class,
            StudentHistorySeeder::class,
            StudentOneHistorySeeder::class,
            FeeTypeSeeder::class,
            FeeGroupSeeder::class,
            FeeInvoiceSeeder::class,
        ]);
    }
}
