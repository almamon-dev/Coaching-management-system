<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FounderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $founders = [
            [
                'name' => 'Late Abdur Rahman',
                'role' => 'Chief Founder',
                'description' => 'Established the first academic building in 1942 and envisioned a bright future for the village.',
                'image' => null,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Late Haji Shariatullah',
                'role' => 'Honorable Land Donor',
                'description' => 'Donated 5 acres of land for the main campus and the school playground.',
                'image' => null,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Late Begum Rokeya',
                'role' => 'Co-Founder',
                'description' => 'Played a key role in establishing the female branch of the school in 1948.',
                'image' => null,
                'is_active' => true,
                'order' => 3,
            ]
        ];

        foreach ($founders as $founder) {
            \App\Models\Founder::create($founder);
        }
    }
}
