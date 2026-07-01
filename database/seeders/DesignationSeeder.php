<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Designation;

class DesignationSeeder extends Seeder
{
    public function run(): void
    {
        $designations = [
            ['name' => 'Principal (অধ্যক্ষ)', 'description' => 'The head of the school. (বিদ্যালয়ের প্রধান।)'],
            ['name' => 'Vice Principal (উপাধ্যক্ষ)', 'description' => 'Assists the principal in managing the school. (বিদ্যালয় পরিচালনায় অধ্যক্ষকে সহায়তা করেন।)'],
            ['name' => 'Head of Department (বিভাগীয় প্রধান)', 'description' => 'Leads a specific academic department. (একটি নির্দিষ্ট একাডেমিক বিভাগের নেতৃত্ব দেন।)'],
            ['name' => 'Senior Teacher (সিনিয়র শিক্ষক)', 'description' => 'Experienced teacher with advanced responsibilities. (উন্নত দায়িত্বপ্রাপ্ত অভিজ্ঞ শিক্ষক।)'],
            ['name' => 'Assistant Teacher (সহকারী শিক্ষক)', 'description' => 'Supports teaching activities and classroom management. (পাঠদান কার্যক্রম এবং শ্রেণীকক্ষ পরিচালনায় সহায়তা করেন।)'],
            ['name' => 'Librarian (গ্রন্থাগারিক)', 'description' => 'Manages the school library and resources. (বিদ্যালয়ের গ্রন্থাগার এবং সম্পদ পরিচালনা করেন।)'],
            ['name' => 'Clerk (করণিক)', 'description' => 'Handles administrative and clerical tasks. (দাপ্তরিক এবং করণিক কাজ পরিচালনা করেন।)'],
            ['name' => 'Accountant (হিসাবরক্ষক)', 'description' => 'Manages school finances and accounts. (বিদ্যালয়ের অর্থ এবং হিসাব পরিচালনা করেন।)'],
            ['name' => 'Peon (পিয়ন)', 'description' => 'General support staff for school operations. (বিদ্যালয় পরিচালনার জন্য সাধারণ সহায়ক কর্মী।)']
        ];

        foreach ($designations as $designation) {
            Designation::updateOrCreate(
                ['name' => $designation['name']],
                ['description' => $designation['description'], 'status' => true]
            );
        }
    }
}
