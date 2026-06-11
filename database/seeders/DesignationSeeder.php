<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Designation;

class DesignationSeeder extends Seeder
{
    public function run(): void
    {
        $designations = [
            ['name' => 'Principal', 'description' => 'The head of the school.'],
            ['name' => 'Vice Principal', 'description' => 'Assists the principal in managing the school.'],
            ['name' => 'Head of Department', 'description' => 'Leads a specific academic department.'],
            ['name' => 'Senior Teacher', 'description' => 'Experienced teacher with advanced responsibilities.'],
            ['name' => 'Assistant Teacher', 'description' => 'Supports teaching activities and classroom management.'],
            ['name' => 'Librarian', 'description' => 'Manages the school library and resources.'],
            ['name' => 'Clerk', 'description' => 'Handles administrative and clerical tasks.'],
            ['name' => 'Accountant', 'description' => 'Manages school finances and accounts.'],
            ['name' => 'Peon', 'description' => 'General support staff for school operations.']
        ];

        foreach ($designations as $designation) {
            Designation::updateOrCreate(
                ['name' => $designation['name']],
                ['description' => $designation['description'], 'status' => true]
            );
        }
    }
}
