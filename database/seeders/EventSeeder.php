<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::truncate();

        $events = [
            [
                'title' => 'Annual Merit Award & Achievers Crest Ceremony',
                'slug' => 'annual-merit-award-achievers-crest-ceremony',
                'description' => 'Ullash Coaching Center honors top scorers in HSC and SSC board exams with merit crests, certificates, and recognition by the Director.',
                'image' => '/images/ullash_award_crest_01.jpg',
                'date' => '2027-03-15',
                'time' => '16:00:00',
                'location' => 'Main Auditorium & Reception Wing',
                'contact_person' => 'Md. Faruk Hossain (Director)',
                'contact_phone' => '01711223344',
                'registration_required' => 'no',
                'status' => 'published',
            ],
            [
                'title' => 'HSC & SSC Central Model Test Grand Exam',
                'slug' => 'hsc-ssc-central-model-test-grand-exam',
                'description' => 'Board-standard centralized model test examination in our air-conditioned classrooms with strict invigilation and detailed script evaluation.',
                'image' => '/images/ullash_classroom_model_test_01.jpg',
                'date' => '2027-03-25',
                'time' => '09:00:00',
                'location' => 'Examination Hall 1 & 2',
                'contact_person' => 'Model Test Controller',
                'contact_phone' => '01711223355',
                'registration_required' => 'yes',
                'registration_deadline' => '2027-03-20',
                'status' => 'published',
            ],
            [
                'title' => 'HSC Batch Grand Farewell & Celebration Ceremony',
                'slug' => 'hsc-batch-grand-farewell-celebration-ceremony',
                'description' => 'Grand farewell ceremony for outgoing HSC examinees featuring gift pack presentations, celebration cake cutting, and motivational guidance from faculty.',
                'image' => '/images/ullash_farewell_gift_ceremony.jpg',
                'date' => '2027-04-05',
                'time' => '11:00:00',
                'location' => 'Coaching Campus Hall',
                'contact_person' => 'Program Coordinator',
                'contact_phone' => '01711223366',
                'registration_required' => 'no',
                'status' => 'published',
            ],
            [
                'title' => 'New HSC ICT Batch Admission & Orientation Seminar',
                'slug' => 'new-hsc-ict-batch-admission-orientation-seminar',
                'description' => 'Special orientation seminar on ICT syllabus coverage, C programming, and practical board question mastery for HSC science and commerce students.',
                'image' => '/images/ullash_ict_batch_poster.jpg',
                'date' => '2027-04-14',
                'time' => '10:00:00',
                'location' => 'ICT Seminar Room',
                'contact_person' => 'Tanvir Ahmed Khan (Lead ICT Instructor)',
                'contact_phone' => '01711223377',
                'registration_required' => 'yes',
                'registration_deadline' => '2027-04-12',
                'status' => 'published',
            ],
            [
                'title' => 'Female Batch Academic Counseling & Campus Study Camp',
                'slug' => 'female-batch-academic-counseling-campus-study-camp',
                'description' => 'Dedicated academic discussion and progress review for female examinees with faculty mentors at Ullash Coaching campus grounds.',
                'image' => '/images/ullash_campus_female_batch.jpg',
                'date' => '2027-05-10',
                'time' => '10:30:00',
                'location' => 'Campus Garden & Counseling Wing',
                'contact_person' => 'Academic Coordinator',
                'contact_phone' => '01711223388',
                'registration_required' => 'yes',
                'registration_deadline' => '2027-05-08',
                'status' => 'published',
            ],
            [
                'title' => 'Academic Guidance & Personalized Mentorship Workshop',
                'slug' => 'academic-guidance-personalized-mentorship-workshop',
                'description' => 'One-on-one student counseling and board exam strategic roadmap session led by Director Md. Faruk Hossain and senior lecturers.',
                'image' => '/images/ullash_campus_mentorship.jpg',
                'date' => '2027-05-20',
                'time' => '15:00:00',
                'location' => 'Executive Office & Meeting Room',
                'contact_person' => 'Student Affairs Desk',
                'contact_phone' => '01711223399',
                'registration_required' => 'no',
                'status' => 'published',
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
