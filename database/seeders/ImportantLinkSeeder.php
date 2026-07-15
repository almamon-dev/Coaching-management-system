<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImportantLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $links = [
            'News',
            'Notice',
            'FAQ',
            'Campus Events',
            'Research Events',
            'Upcoming Events',
            'Sexual Harassment Prevention'
        ];

        foreach ($links as $index => $link) {
            \App\Models\ImportantLink::create([
                'title' => $link,
                'url' => null, // Placeholder for future actual URLs
                'is_active' => true,
                'order' => $index + 1
            ]);
        }
    }
}
