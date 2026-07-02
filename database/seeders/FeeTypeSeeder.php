<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FeeType;

class FeeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $feeTypes = [
            // Academic Fees
            ['category' => 'Academic Fees', 'name' => 'Tuition Fee (মাসিক বেতন)', 'code' => 'TUITION_FEE'],
            ['category' => 'Academic Fees', 'name' => 'Admission Fee (ভর্তি ফি)', 'code' => 'ADMISSION_FEE'],
            ['category' => 'Academic Fees', 'name' => 'Re-Admission Fee (পুনঃভর্তি ফি)', 'code' => 'RE_ADMISSION_FEE'],
            ['category' => 'Academic Fees', 'name' => 'Registration Fee (রেজিস্ট্রেশন ফি)', 'code' => 'REGISTRATION_FEE'],
            ['category' => 'Academic Fees', 'name' => 'Session Fee (সেশন ফি)', 'code' => 'SESSION_FEE'],
            ['category' => 'Academic Fees', 'name' => 'Annual Fee (বার্ষিক ফি)', 'code' => 'ANNUAL_FEE'],
            ['category' => 'Academic Fees', 'name' => 'Development Fee (উন্নয়ন ফি)', 'code' => 'DEVELOPMENT_FEE'],

            // Examination Fees
            ['category' => 'Examination Fees', 'name' => 'Exam Fee (পরীক্ষার ফি)', 'code' => 'EXAM_FEE'],
            ['category' => 'Examination Fees', 'name' => 'Practical Exam Fee (ব্যবহারিক পরীক্ষার ফি)', 'code' => 'PRACTICAL_EXAM_FEE'],
            ['category' => 'Examination Fees', 'name' => 'Board Exam Fee (বোর্ড পরীক্ষার ফি)', 'code' => 'BOARD_EXAM_FEE'],
            ['category' => 'Examination Fees', 'name' => 'Certificate Fee (সনদ ফি)', 'code' => 'CERTIFICATE_FEE'],

            // Facilities Fees
            ['category' => 'Facilities Fees', 'name' => 'Transport Fee (যাতায়াত ফি)', 'code' => 'TRANSPORT_FEE'],
            ['category' => 'Facilities Fees', 'name' => 'Library Fee (লাইব্রেরি ফি)', 'code' => 'LIBRARY_FEE'],
            ['category' => 'Facilities Fees', 'name' => 'Laboratory Fee (ল্যাব ফি)', 'code' => 'LABORATORY_FEE'],
            ['category' => 'Facilities Fees', 'name' => 'Computer Lab Fee', 'code' => 'COMPUTER_LAB_FEE'],
            ['category' => 'Facilities Fees', 'name' => 'Smart Class Fee', 'code' => 'SMART_CLASS_FEE'],
            ['category' => 'Facilities Fees', 'name' => 'Sports Fee (ক্রীড়া ফি)', 'code' => 'SPORTS_FEE'],
            ['category' => 'Facilities Fees', 'name' => 'Cultural Fee (সাংস্কৃতিক কার্যক্রম ফি)', 'code' => 'CULTURAL_FEE'],

            // Student Services
            ['category' => 'Student Services', 'name' => 'ID Card Fee', 'code' => 'ID_CARD_FEE'],
            ['category' => 'Student Services', 'name' => 'Diary Fee', 'code' => 'DIARY_FEE'],
            ['category' => 'Student Services', 'name' => 'Magazine Fee', 'code' => 'MAGAZINE_FEE'],
            ['category' => 'Student Services', 'name' => 'Uniform Fee', 'code' => 'UNIFORM_FEE'],
            ['category' => 'Student Services', 'name' => 'Books Fee', 'code' => 'BOOKS_FEE'],
            ['category' => 'Student Services', 'name' => 'Stationery Fee', 'code' => 'STATIONERY_FEE'],
            ['category' => 'Student Services', 'name' => 'Hostel Fee (যদি থাকে)', 'code' => 'HOSTEL_FEE'],
            ['category' => 'Student Services', 'name' => 'Cafeteria Fee (যদি থাকে)', 'code' => 'CAFETERIA_FEE'],

            // Penalties & Miscellaneous
            ['category' => 'Penalties & Miscellaneous', 'name' => 'Late Fine (বিলম্ব ফি)', 'code' => 'LATE_FINE'],
            ['category' => 'Penalties & Miscellaneous', 'name' => 'Absence Fine (অনুপস্থিতি জরিমানা)', 'code' => 'ABSENCE_FINE'],
            ['category' => 'Penalties & Miscellaneous', 'name' => 'Lost Book Fine (লাইব্রেরি বই হারানোর জরিমানা)', 'code' => 'LOST_BOOK_FINE'],
            ['category' => 'Penalties & Miscellaneous', 'name' => 'Damage Charge (ক্ষতিপূরণ)', 'code' => 'DAMAGE_CHARGE'],
            ['category' => 'Penalties & Miscellaneous', 'name' => 'Miscellaneous Fee (অন্যান্য ফি)', 'code' => 'MISCELLANEOUS_FEE'],

            // Optional Fees
            ['category' => 'Optional Fees', 'name' => 'Coaching Fee', 'code' => 'COACHING_FEE'],
            ['category' => 'Optional Fees', 'name' => 'Extra Class Fee', 'code' => 'EXTRA_CLASS_FEE'],
            ['category' => 'Optional Fees', 'name' => 'Club Membership Fee', 'code' => 'CLUB_MEMBERSHIP_FEE'],
            ['category' => 'Optional Fees', 'name' => 'Educational Tour Fee', 'code' => 'EDUCATIONAL_TOUR_FEE'],
            ['category' => 'Optional Fees', 'name' => 'Event Fee', 'code' => 'EVENT_FEE'],
            ['category' => 'Optional Fees', 'name' => 'Graduation Fee', 'code' => 'GRADUATION_FEE'],
            ['category' => 'Optional Fees', 'name' => 'Alumni Fee', 'code' => 'ALUMNI_FEE'],
        ];

        foreach ($feeTypes as $feeType) {
            FeeType::updateOrCreate(
                ['code' => $feeType['code']],
                [
                    'name' => $feeType['name'],
                    'category' => $feeType['category'],
                    'is_active' => true,
                ]
            );
        }
    }
}
