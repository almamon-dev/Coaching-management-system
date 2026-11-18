<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        Testimonial::truncate();

        $testimonials = [
            [
                'name' => 'Ariful Islam',
                'batch' => 'HSC Science Batch',
                'institution' => 'Dhaka College',
                'badge' => 'GPA 5.00 (Golden A+)',
                'quote' => 'The complex topics in Physics and Higher Mathematics were explained with such clarity. Regular weekly model tests built my confidence to excel in the board examination.',
                'initials' => 'AI',
                'color' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
                'sort_order' => 1,
                'status' => 'published',
            ],
            [
                'name' => 'Tasmia Rahman',
                'batch' => 'SSC Science Batch',
                'institution' => 'Viqarunnisa Noon School',
                'badge' => 'GPA 5.00 & Board Top',
                'quote' => 'The personal mentorship and problem-solving techniques were extraordinary. Dedicated problem-solving sessions helped me achieve 100% marks in Mathematics.',
                'initials' => 'TR',
                'color' => 'bg-purple-100 text-purple-800 border-purple-300',
                'sort_order' => 2,
                'status' => 'published',
            ],
            [
                'name' => 'Farhan Ahmed',
                'batch' => 'HSC Special Batch',
                'institution' => 'Notre Dame College',
                'badge' => 'GPA 5.00 (Golden A+)',
                'quote' => 'The structured lecture sheets for Chemistry and ICT combined with regular tests made my preparation complete. Ullash Coaching played a key role in my academic success.',
                'initials' => 'FA',
                'color' => 'bg-blue-100 text-blue-800 border-blue-300',
                'sort_order' => 3,
                'status' => 'published',
            ],
            [
                'name' => 'Sumaiya Akter',
                'batch' => 'Class 10 Intensive Batch',
                'institution' => 'Holy Cross College',
                'badge' => 'GPA 5.00 Achiever',
                'quote' => 'Regular attendance tracking and result feedback helped me stay disciplined. Complex topics were broken down and explained with joy and simplicity.',
                'initials' => 'SA',
                'color' => 'bg-rose-100 text-rose-800 border-rose-300',
                'sort_order' => 4,
                'status' => 'published',
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::create($t);
        }
    }
}

