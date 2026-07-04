<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Spring Harvest Festival & Cultural Show',
                'slug' => 'spring-harvest-festival-cultural-show',
                'description' => 'Join us for a celebration of local culture, agriculture, and student performances in our open-air campus ground.',
                'image' => '/images/event_harvest.png',
                'date' => '2027-03-15',
                'time' => '10:00:00',
                'location' => 'Main Field',
                'contact_person' => 'Mr. Karim',
                'contact_phone' => '017xxxxxxxx',
                'registration_required' => 'yes',
                'registration_deadline' => '2027-03-10',
                'status' => 'published',
            ],
            [
                'title' => 'Inter-School Outdoor Science Fair',
                'slug' => 'inter-school-outdoor-science-fair',
                'description' => 'Students from neighboring villages will gather to demonstrate eco-friendly science projects and innovations.',
                'image' => '/images/event_science.png',
                'date' => '2027-03-22',
                'time' => '09:00:00',
                'location' => 'Outdoor Lab',
                'contact_person' => 'Ms. Tasnim',
                'contact_phone' => '018xxxxxxxx',
                'registration_required' => 'no',
                'status' => 'published',
            ],
            [
                'title' => 'Annual Football Championship Final',
                'slug' => 'annual-football-championship-final',
                'description' => 'The most awaited sports event of the year! Cheer for your favorite houses as they battle for the cup.',
                'image' => '/images/event_football.png',
                'date' => '2027-04-05',
                'time' => '15:00:00',
                'location' => 'Stadium',
                'contact_person' => 'Mr. Rahman',
                'contact_phone' => '019xxxxxxxx',
                'registration_required' => 'yes',
                'registration_deadline' => '2027-04-01',
                'status' => 'published',
            ],
            [
                'title' => 'Pohela Boishakh Celebration',
                'slug' => 'pohela-boishakh-celebration',
                'description' => 'Celebrate the Bengali New Year with traditional food, music, and vibrant rallies across the campus.',
                'image' => '/images/event_boishakh.png',
                'date' => '2027-04-14',
                'time' => '08:00:00',
                'location' => 'School Courtyard',
                'contact_person' => 'Ms. Rina',
                'contact_phone' => '016xxxxxxxx',
                'registration_required' => 'no',
                'registration_deadline' => '2027-04-10',
                'status' => 'published',
            ],
        ];

        foreach ($events as $event) {
            \App\Models\Event::create($event);
        }
    }
}
