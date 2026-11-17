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
                'title' => 'Annual Academic Science Fair & Robotics Expo',
                'slug' => 'annual-academic-science-fair-robotics-expo',
                'description' => 'Students from our academic batches will demonstrate science projects, robotics, and innovation models under expert instructor guidance.',
                'image' => '/images/coaching/coaching_12.jpg',
                'date' => '2027-03-15',
                'time' => '10:00:00',
                'location' => 'Science Lab & Auditorium',
                'contact_person' => 'Prof. Tariqul Islam',
                'contact_phone' => '01711223344',
                'registration_required' => 'yes',
                'registration_deadline' => '2027-03-10',
                'status' => 'published',
            ],
            [
                'title' => 'Annual Merit Award & Achievers Crest Ceremony',
                'slug' => 'annual-merit-award-achievers-crest-ceremony',
                'description' => 'Celebrating our top scorers in HSC and SSC board exams with crests, certificates of honor, and special merit awards on stage.',
                'image' => '/images/coaching/coaching_03.jpg',
                'date' => '2027-03-25',
                'time' => '16:00:00',
                'location' => 'Main Auditorium',
                'contact_person' => 'Academic Director',
                'contact_phone' => '01711223355',
                'registration_required' => 'no',
                'status' => 'published',
            ],
            [
                'title' => 'HSC & SSC Central Model Test Grand Exam',
                'slug' => 'hsc-ssc-central-model-test-grand-exam',
                'description' => 'Comprehensive board-standard model test series simulating actual exam hall conditions with strict timing and detailed evaluation.',
                'image' => '/images/coaching/coaching_04.jpg',
                'date' => '2027-04-05',
                'time' => '09:00:00',
                'location' => 'Exam Hall 1 & 2',
                'contact_person' => 'Examination Controller',
                'contact_phone' => '01711223366',
                'registration_required' => 'yes',
                'registration_deadline' => '2027-04-01',
                'status' => 'published',
            ],
            [
                'title' => 'University Admission & Career Guideline Seminar',
                'slug' => 'university-admission-career-guideline-seminar',
                'description' => 'Special session with BUET, Medical, and DU top achievers and faculty members guiding students on subject selection and entrance preparation.',
                'image' => '/images/coaching/coaching_06.jpg',
                'date' => '2027-04-14',
                'time' => '11:00:00',
                'location' => 'Seminar Hall',
                'contact_person' => 'Student Counselor',
                'contact_phone' => '01711223377',
                'registration_required' => 'no',
                'registration_deadline' => '2027-04-12',
                'status' => 'published',
            ],
            [
                'title' => 'Parent-Teacher Academic Evaluation & Counseling',
                'slug' => 'parent-teacher-academic-evaluation-counseling',
                'description' => 'One-on-one progress review between guardians and faculty members analyzing model test performance and study roadmap.',
                'image' => '/images/coaching/coaching_02.jpg',
                'date' => '2027-05-10',
                'time' => '10:30:00',
                'location' => 'Academic Counseling Wing',
                'contact_person' => 'Coordinator',
                'contact_phone' => '01711223388',
                'registration_required' => 'yes',
                'registration_deadline' => '2027-05-08',
                'status' => 'published',
            ],
            [
                'title' => 'Interactive Peer Discussion & Math Olympiad Workshop',
                'slug' => 'interactive-peer-discussion-math-olympiad-workshop',
                'description' => 'Collaborative problem-solving session for Class 9, 10, and HSC students focusing on advanced mathematics and conceptual physics.',
                'image' => '/images/coaching/coaching_05.jpg',
                'date' => '2027-05-20',
                'time' => '15:00:00',
                'location' => 'Study Room 3',
                'contact_person' => 'Higher Math Lead',
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
