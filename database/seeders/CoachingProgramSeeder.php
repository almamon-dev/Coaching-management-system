<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Course;
use App\Models\Subject;
use App\Models\Batch;
use App\Models\TeacherProfile;
use App\Models\GuardianProfile;
use App\Models\StudentProfile;
use App\Models\ClassRoutine;
use App\Models\Attendance;
use App\Models\FeeType;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\Exam;
use App\Models\Mark;
use App\Models\Result;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\StudyMaterial;
use App\Models\Notice;

class CoachingProgramSeeder extends Seeder
{
    /**
     * Seed 7 batches (3 Morning, 3 Afternoon, 1 Night — 1 hour each)
     * with 20 Bangladeshi students per batch (140 students total),
     * covering Higher Math, Physics, Chemistry, ICT (1st & 2nd Paper)
     * as well as Class 9 & Class 10 batches.
     */
    public function run(): void
    {
        $password = Hash::make('password');
        $today = date('Y-m-d');

        // 1. Clean reset of academic, batch, and student records while keeping Admin/Staff accounts
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        DB::table('batch_student')->truncate();
        AssignmentSubmission::truncate();
        Assignment::truncate();
        StudyMaterial::truncate();
        Mark::truncate();
        Result::truncate();
        Exam::truncate();
        Attendance::truncate();
        ClassRoutine::truncate();
        FeePayment::truncate();
        FeeInvoice::truncate();
        StudentProfile::truncate();
        GuardianProfile::truncate();
        Batch::truncate();
        Subject::truncate();
        Course::truncate();
        User::whereIn('user_type', ['student', 'guardian'])->delete();

        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        // 2. Ensure core staff users exist
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@coaching.com'],
            [
                'name' => 'Super Admin',
                'user_type' => 'super_admin',
                'status' => 'active',
                'phone' => '+8801700000001',
                'password' => $password,
            ]
        );

        $accountantUser = User::firstOrCreate(
            ['email' => 'accountant@coaching.com'],
            [
                'name' => 'Salma Begum (Accountant)',
                'user_type' => 'accountant',
                'status' => 'active',
                'phone' => '+8801700000003',
                'password' => $password,
            ]
        );

        // 3. Ensure 4 Expert Bangladeshi Teachers exist (Physics, Higher Math, Chemistry, ICT)
        $teachersData = [
            [
                'email' => 'teacher1@coaching.com',
                'teacher_id' => 'TCH-001',
                'name' => 'Dr. Rafiqul Islam',
                'phone' => '+8801711223344',
                'qualification' => 'M.Sc, Ph.D in Physics (DU)',
                'designation' => 'Senior Physics Instructor',
                'specialization' => 'Physics 1st & 2nd Paper',
                'address' => 'Dhanmondi, Dhaka',
            ],
            [
                'email' => 'teacher2@coaching.com',
                'teacher_id' => 'TCH-002',
                'name' => 'Nusrat Jahan Chowdhury',
                'phone' => '+8801711223355',
                'qualification' => 'M.Sc in Chemistry (BUET)',
                'designation' => 'Chemistry Department Head',
                'specialization' => 'Chemistry 1st & 2nd Paper',
                'address' => 'Mirpur DOHS, Dhaka',
            ],
            [
                'email' => 'teacher3@coaching.com',
                'teacher_id' => 'TCH-003',
                'name' => 'Prof. Mahmudul Hasan',
                'phone' => '+8801711223366',
                'qualification' => 'M.Sc in Applied Mathematics (DU)',
                'designation' => 'Senior Higher Math Lecturer',
                'specialization' => 'Higher Math 1st & 2nd Paper',
                'address' => 'Uttara Sector 7, Dhaka',
            ],
            [
                'email' => 'teacher4@coaching.com',
                'teacher_id' => 'TCH-004',
                'name' => 'Tanvir Ahmed Khan',
                'phone' => '+8801711223377',
                'qualification' => 'B.Sc in CSE (BUET)',
                'designation' => 'Lead ICT Instructor',
                'specialization' => 'ICT 1st & 2nd Paper',
                'address' => 'Banani, Dhaka',
            ],
        ];

        $teachers = [];
        foreach ($teachersData as $index => $tData) {
            $tUser = User::updateOrCreate(
                ['email' => $tData['email']],
                [
                    'name' => $tData['name'],
                    'user_type' => 'teacher',
                    'status' => 'active',
                    'phone' => $tData['phone'],
                    'password' => $password,
                ]
            );

            $teachers[$index] = TeacherProfile::updateOrCreate(
                ['teacher_id' => $tData['teacher_id']],
                [
                    'user_id' => $tUser->id,
                    'name' => $tData['name'],
                    'phone' => $tData['phone'],
                    'email' => $tData['email'],
                    'qualification' => $tData['qualification'],
                    'designation' => $tData['designation'],
                    'specialization' => $tData['specialization'],
                    'address' => $tData['address'],
                    'status' => 'active',
                ]
            );
        }

        // 4. Create Courses & 1st/2nd Paper Subjects + Class 9 & Class 10 Courses
        $coursePhysics = Course::create([
            'title' => 'Physics (1st & 2nd Paper)',
            'code' => 'HSC-PHY-101',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 500.00,
            'fee' => 1500.00,
            'duration' => '12 Months',
            'total_lectures' => 48,
            'total_lessons' => 16,
            'description' => 'Complete HSC Physics 1st & 2nd Paper covering Vector, Mechanics, Thermodynamics, Electricity, and Modern Physics.',
            'status' => 'active',
        ]);

        $courseHigherMath = Course::create([
            'title' => 'Higher Math (1st & 2nd Paper)',
            'code' => 'HSC-HMATH-102',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 500.00,
            'fee' => 1600.00,
            'duration' => '12 Months',
            'total_lectures' => 52,
            'total_lessons' => 18,
            'description' => 'Complete Higher Mathematics 1st & 2nd Paper covering Matrix, Calculus, Complex Numbers, Conics, and Mechanics.',
            'status' => 'active',
        ]);

        $courseChemistry = Course::create([
            'title' => 'Chemistry (1st & 2nd Paper)',
            'code' => 'HSC-CHE-103',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 500.00,
            'fee' => 1500.00,
            'duration' => '12 Months',
            'total_lectures' => 46,
            'total_lessons' => 14,
            'description' => 'In-depth HSC Chemistry 1st & 2nd Paper covering Qualitative Chemistry, Kinetics, Organic Chemistry & Electrochemistry.',
            'status' => 'active',
        ]);

        $courseICT = Course::create([
            'title' => 'ICT (1st & 2nd Paper)',
            'code' => 'HSC-ICT-104',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 400.00,
            'fee' => 1200.00,
            'duration' => '10 Months',
            'total_lectures' => 40,
            'total_lessons' => 12,
            'description' => 'Complete ICT 1st & 2nd Paper including Number Systems, Digital Logic Gates, HTML/Web Design, C Programming & SQL.',
            'status' => 'active',
        ]);

        $courseClass9 = Course::create([
            'title' => 'Class 9 Science Complete (Math, Physics, Chem & ICT)',
            'code' => 'CLS9-SCI-201',
            'category' => 'Class 9',
            'admission_fee' => 500.00,
            'fee' => 1800.00,
            'duration' => '12 Months',
            'total_lectures' => 60,
            'total_lessons' => 20,
            'description' => 'Class 9 foundational batch covering Higher Math, Physics, Chemistry, and ICT with weekly board-standard tests.',
            'status' => 'active',
        ]);

        $courseClass10 = Course::create([
            'title' => 'Class 10 / SSC Special (Math, Physics, Chem & ICT)',
            'code' => 'CLS10-SCI-301',
            'category' => 'Class 10',
            'admission_fee' => 500.00,
            'fee' => 2000.00,
            'duration' => '12 Months',
            'total_lectures' => 64,
            'total_lessons' => 22,
            'description' => 'Class 10 & SSC preparation covering Higher Math, Physics, Chemistry, and ICT board CQ & MCQ mastery.',
            'status' => 'active',
        ]);

        // Subjects (Higher Math, Physics, Chemistry, ICT — 1st Paper & 2nd Paper + Class 9 & Class 10)
        $subjPhy1 = Subject::create(['name' => 'Physics 1st Paper', 'code' => 'PHY-101', 'course_id' => $coursePhysics->id, 'total_lectures' => 24, 'total_lessons' => 8, 'description' => 'Vector, Mechanics, Waves & Optics']);
        $subjPhy2 = Subject::create(['name' => 'Physics 2nd Paper', 'code' => 'PHY-102', 'course_id' => $coursePhysics->id, 'total_lectures' => 24, 'total_lessons' => 8, 'description' => 'Thermodynamics, Electricity, Magnetism & Modern Physics']);

        $subjMath1 = Subject::create(['name' => 'Higher Math 1st Paper', 'code' => 'HMATH-101', 'course_id' => $courseHigherMath->id, 'total_lectures' => 26, 'total_lessons' => 9, 'description' => 'Matrix, Trigonometry, Straight Lines & Calculus']);
        $subjMath2 = Subject::create(['name' => 'Higher Math 2nd Paper', 'code' => 'HMATH-102', 'course_id' => $courseHigherMath->id, 'total_lectures' => 26, 'total_lessons' => 9, 'description' => 'Complex Numbers, Polynomials, Conics & Statics']);

        $subjChem1 = Subject::create(['name' => 'Chemistry 1st Paper', 'code' => 'CHE-101', 'course_id' => $courseChemistry->id, 'total_lectures' => 23, 'total_lessons' => 7, 'description' => 'Qualitative Chemistry, Periodic Properties & Chemical Changes']);
        $subjChem2 = Subject::create(['name' => 'Chemistry 2nd Paper', 'code' => 'CHE-102', 'course_id' => $courseChemistry->id, 'total_lectures' => 23, 'total_lessons' => 7, 'description' => 'Environmental Chemistry, Organic Chemistry & Quantitative Analysis']);

        $subjICT1 = Subject::create(['name' => 'ICT 1st Paper', 'code' => 'ICT-101', 'course_id' => $courseICT->id, 'total_lectures' => 20, 'total_lessons' => 6, 'description' => 'Communication Systems, Number System & Digital Devices']);
        $subjICT2 = Subject::create(['name' => 'ICT 2nd Paper', 'code' => 'ICT-102', 'course_id' => $courseICT->id, 'total_lectures' => 20, 'total_lessons' => 6, 'description' => 'Web Design, HTML, C Programming & Database Management']);

        $subjC9HM = Subject::create(['name' => 'Class 9 Higher Math', 'code' => 'C9-HMATH', 'course_id' => $courseClass9->id, 'total_lectures' => 20, 'total_lessons' => 6, 'description' => 'Class 9 Higher Mathematics Foundation']);
        $subjC9Phy = Subject::create(['name' => 'Class 9 Physics', 'code' => 'C9-PHY', 'course_id' => $courseClass9->id, 'total_lectures' => 15, 'total_lessons' => 5, 'description' => 'Motion, Force, Work, Power & Energy']);
        $subjC9Chem = Subject::create(['name' => 'Class 9 Chemistry', 'code' => 'C9-CHE', 'course_id' => $courseClass9->id, 'total_lectures' => 15, 'total_lessons' => 5, 'description' => 'Matter, Structure of Atom & Periodic Table']);
        $subjC9ICT = Subject::create(['name' => 'Class 9 ICT', 'code' => 'C9-ICT', 'course_id' => $courseClass9->id, 'total_lectures' => 10, 'total_lessons' => 4, 'description' => 'Computing, Digital Literacy & Spreadsheet']);

        $subjC10HM = Subject::create(['name' => 'Class 10 Higher Math', 'code' => 'C10-HMATH', 'course_id' => $courseClass10->id, 'total_lectures' => 20, 'total_lessons' => 7, 'description' => 'SSC Higher Math Trigonometry, Geometry & Probability']);
        $subjC10Phy = Subject::create(['name' => 'Class 10 Physics', 'code' => 'C10-PHY', 'course_id' => $courseClass10->id, 'total_lectures' => 16, 'total_lessons' => 5, 'description' => 'Optics, Static Electricity, Current Electricity & Electronics']);
        $subjC10Chem = Subject::create(['name' => 'Class 10 Chemistry', 'code' => 'C10-CHE', 'course_id' => $courseClass10->id, 'total_lectures' => 16, 'total_lessons' => 5, 'description' => 'Mole Concept, Hydrocarbon & Mineral Resources']);
        $subjC10ICT = Subject::create(['name' => 'Class 10 ICT', 'code' => 'C10-ICT', 'course_id' => $courseClass10->id, 'total_lectures' => 12, 'total_lessons' => 5, 'description' => 'Multimedia, Graphics, Troubleshooting & SSC ICT']);

        // 5. Create 7 Batches (3 Morning, 3 Afternoon, 1 Night — 1 Hour Each)
        $batchDefinitions = [
            // --- MORNING (3 Batches, 1 Hour Each) ---
            [
                'name' => 'Morning-01: HSC Physics (1st & 2nd Paper)',
                'course' => $coursePhysics,
                'subject' => $subjPhy1,
                'teacher' => $teachers[0],
                'room' => 'Room 101',
                'image' => '/images/batches/batch_physics.jpg',
                'class_days' => 'Sun, Tue, Thu',
                'class_time' => '07:00 AM - 08:00 AM',
                'start_time' => '07:00:00',
                'end_time' => '08:00:00',
                'shift' => 'Morning',
                'level' => 'HSC',
            ],
            [
                'name' => 'Morning-02: HSC Higher Math (1st & 2nd Paper)',
                'course' => $courseHigherMath,
                'subject' => $subjMath1,
                'teacher' => $teachers[2],
                'room' => 'Room 102',
                'image' => '/images/batches/batch_higher_math.jpg',
                'class_days' => 'Sun, Tue, Thu',
                'class_time' => '08:00 AM - 09:00 AM',
                'start_time' => '08:00:00',
                'end_time' => '09:00:00',
                'shift' => 'Morning',
                'level' => 'HSC',
            ],
            [
                'name' => 'Morning-03: Class 9 Science (Higher Math, Physics, Chem & ICT)',
                'course' => $courseClass9,
                'subject' => $subjC9HM,
                'teacher' => $teachers[1],
                'room' => 'Room 103',
                'image' => '/images/batches/batch_class9.jpg',
                'class_days' => 'Sat, Mon, Wed',
                'class_time' => '09:00 AM - 10:00 AM',
                'start_time' => '09:00:00',
                'end_time' => '10:00:00',
                'shift' => 'Morning',
                'level' => 'Class 9',
            ],

            // --- AFTERNOON (3 Batches, 1 Hour Each) ---
            [
                'name' => 'Afternoon-01: Class 10 / SSC (Higher Math, Physics, Chem & ICT)',
                'course' => $courseClass10,
                'subject' => $subjC10HM,
                'teacher' => $teachers[0],
                'room' => 'Room 101',
                'image' => '/images/batches/batch_class10.jpg',
                'class_days' => 'Sun, Tue, Thu',
                'class_time' => '03:00 PM - 04:00 PM',
                'start_time' => '15:00:00',
                'end_time' => '16:00:00',
                'shift' => 'Afternoon',
                'level' => 'Class 10',
            ],
            [
                'name' => 'Afternoon-02: HSC Chemistry (1st & 2nd Paper)',
                'course' => $courseChemistry,
                'subject' => $subjChem1,
                'teacher' => $teachers[1],
                'room' => 'Room 102',
                'image' => '/images/batches/batch_chemistry.jpg',
                'class_days' => 'Sat, Mon, Wed',
                'class_time' => '04:00 PM - 05:00 PM',
                'start_time' => '16:00:00',
                'end_time' => '17:00:00',
                'shift' => 'Afternoon',
                'level' => 'HSC',
            ],
            [
                'name' => 'Afternoon-03: HSC ICT (1st & 2nd Paper)',
                'course' => $courseICT,
                'subject' => $subjICT1,
                'teacher' => $teachers[3],
                'room' => 'Room 104',
                'image' => '/images/batches/batch_ict.jpg',
                'class_days' => 'Sun, Tue, Thu',
                'class_time' => '05:00 PM - 06:00 PM',
                'start_time' => '17:00:00',
                'end_time' => '18:00:00',
                'shift' => 'Afternoon',
                'level' => 'HSC',
            ],

            // --- NIGHT (1 Batch, 1 Hour) ---
            [
                'name' => 'Night-01: Class 9 & 10 Combined Revision (Math, Physics, Chem & ICT)',
                'course' => $courseClass10,
                'subject' => $subjC10Phy,
                'teacher' => $teachers[2],
                'room' => 'Room 101',
                'image' => '/images/batches/batch_revision.jpg',
                'class_days' => 'Sat, Mon, Wed',
                'class_time' => '07:30 PM - 08:30 PM',
                'start_time' => '19:30:00',
                'end_time' => '20:30:00',
                'shift' => 'Night',
                'level' => 'Class 9 & 10',
            ],
        ];

        // 6. Curated 140 Unique Authentic Bangladeshi Student Names + Guardian Names + Schools
        $bangladeshiNames = [
            // Batch 1 (20)
            ['Arafat Hassan', 'male'], ['Nusrat Jahan Mim', 'female'], ['Tanvir Hossain', 'male'], ['Sadia Afrin', 'female'],
            ['Mehedi Hasan', 'male'], ['Tasnim Tabassum', 'female'], ['Rakibul Islam', 'male'], ['Farhana Yasmin', 'female'],
            ['Nafis Iqbal', 'male'], ['Sumaiya Akter', 'female'], ['Mahmudul Hasan', 'male'], ['Jannatul Ferdous', 'female'],
            ['Sabbir Ahmed', 'male'], ['Tanjila Rahman', 'female'], ['Ashraful Alam', 'male'], ['Maliha Islam', 'female'],
            ['Fahim Shahriar', 'male'], ['Nafisa Anjum', 'female'], ['Rashedul Karim', 'male'], ['Lamia Chowdhury', 'female'],

            // Batch 2 (20)
            ['Tariqul Islam', 'male'], ['Samia Rahman', 'female'], ['Imran Khan', 'male'], ['Sharmin Akter', 'female'],
            ['Zayed Bin Tariq', 'male'], ['Humayra Kabir', 'female'], ['Shafiqul Islam', 'male'], ['Fariha Sultana', 'female'],
            ['Hasibul Haque', 'male'], ['Nadia Islam', 'female'], ['Sakib Al Hasan', 'male'], ['Raisa Tabassum', 'female'],
            ['Kamrul Hasan', 'male'], ['Marjia Khatun', 'female'], ['Naimur Rahman', 'male'], ['Tahsina Islam', 'female'],
            ['Iftekhar Mahmud', 'male'], ['Ayesha Siddiqua', 'female'], ['Rubel Mia', 'male'], ['Zarin Tasnim', 'female'],

            // Batch 3 - Class 9 (20)
            ['Ariful Islam', 'male'], ['Mehnaz Hossain', 'female'], ['Sohanur Rahman', 'male'], ['Anika Tahsin', 'female'],
            ['Rezaul Karim', 'male'], ['Tasfia Rahman', 'female'], ['Saiful Islam', 'male'], ['Nusrat Fatema', 'female'],
            ['Habibur Rahman', 'male'], ['Afia Jahin', 'female'], ['Jahidul Islam', 'male'], ['Sabina Yasmin', 'female'],
            ['Nabil Ahmed', 'male'], ['Tamanna Akter', 'female'], ['Monirul Islam', 'male'], ['Ferdousi Begum', 'female'],
            ['Touhidul Islam', 'male'], ['Ruksana Parvin', 'female'], ['Mashrafi Bin Mortaza', 'male'], ['Sanjida Islam', 'female'],

            // Batch 4 - Class 10 (20)
            ['Farhan Sadik', 'male'], ['Tania Sultana', 'female'], ['Mushfiqur Rahim', 'male'], ['Sabikun Nahar', 'female'],
            ['Shahriar Nafees', 'male'], ['Labiba Rahman', 'female'], ['Asifur Rahman', 'male'], ['Humaira Tabassum', 'female'],
            ['Tamim Iqbal', 'male'], ['Sadia Islam Prova', 'female'], ['Mominul Haque', 'male'], ['Mithila Farzana', 'female'],
            ['Al-Amin Hossain', 'male'], ['Jhumur Akter', 'female'], ['Fazle Rabbi', 'male'], ['Nazia Afrin', 'female'],
            ['Ridwanul Haque', 'male'], ['Proma Chowdhury', 'female'], ['Shanto Mia', 'male'], ['Noshin Nawar', 'female'],

            // Batch 5 (20)
            ['Sajidul Islam', 'male'], ['Rupa Akter', 'female'], ['Mahfuzur Rahman', 'male'], ['Moumita Sen', 'female'],
            ['Nasir Uddin', 'male'], ['Tania Ahmed', 'female'], ['Khalid Hasan', 'male'], ['Arpita Das', 'female'],
            ['Ehsanul Haque', 'male'], ['Shayla Parvin', 'female'], ['Towhid Hridoy', 'male'], ['Fabiha Rahman', 'female'],
            ['Zahirul Islam', 'male'], ['Nabila Nawar', 'female'], ['Shuvojit Roy', 'male'], ['Mahiya Mahi', 'female'],
            ['Babar Ali', 'male'], ['Priyanka Saha', 'female'], ['Rafsan Jani', 'male'], ['Anannya Dey', 'female'],

            // Batch 6 (20)
            ['Parvez Hossain', 'male'], ['Israt Jahan', 'female'], ['Masud Rana', 'male'], ['Sultana Razia', 'female'],
            ['Salman Farsi', 'male'], ['Khadija Tul Kubra', 'female'], ['Sohel Rana', 'male'], ['Shirin Akter', 'female'],
            ['Zakaria Hossain', 'male'], ['Nargis Sultana', 'female'], ['Atikur Rahman', 'male'], ['Sumona Haque', 'female'],
            ['Mizanur Rahman', 'male'], ['Farzana Karim', 'female'], ['Sumon Chandra Das', 'male'], ['Rima Akter', 'female'],
            ['Jubayer Ahmed', 'male'], ['Tasmia Islam', 'female'], ['Kawsar Mahmud', 'male'], ['Purnima Barua', 'female'],

            // Batch 7 - Night (20)
            ['Tanjim Hasan Sakib', 'male'], ['Disha Moni', 'female'], ['Shubhojit Barua', 'male'], ['Meher Afroz', 'female'],
            ['Riyad Mahmud', 'male'], ['Fatema Tuz Zohra', 'female'], ['Mustafizur Rahman', 'male'], ['Nusrat Imrose', 'female'],
            ['Litton Kumar Das', 'male'], ['Tasnuva Tisha', 'female'], ['Anamul Haque', 'male'], ['Orpita Chowdhury', 'female'],
            ['Siam Ahmed', 'male'], ['Nabila Islam', 'female'], ['Afif Hossain', 'male'], ['Rafa Nanjiba', 'female'],
            ['Hasan Mahmud', 'male'], ['Tanjin Tisha', 'female'], ['Shoriful Islam', 'male'], ['Safa Kabir', 'female'],
        ];

        $guardianFathers = [
            'Kamrul Hassan', 'Abul Kalam Azad', 'Mofizur Rahman', 'Shafiqul Alam', 'Nazrul Islam',
            'Aminul Haque', 'Delwar Hossain', 'Matiur Rahman', 'Golam Kibria', 'Mokhlesur Rahman',
            'Zillur Rahman', 'Habibullah Bahar', 'Anisur Rahman', 'Badrul Alam', 'Serajul Islam',
            'Kazi Fazlul Haque', 'Tariqul Islam', 'Mozammel Haque', 'Lutfor Rahman', 'Siddiqur Rahman',
        ];

        $areas = [
            'Dhanmondi, Dhaka', 'Mirpur-10, Dhaka', 'Uttara Sector 4, Dhaka', 'Mohammadpur, Dhaka',
            'Banani, Dhaka', 'Bashundhara R/A, Dhaka', 'Rampura, Dhaka', 'Khilgaon, Dhaka',
            'Motijheel, Dhaka', 'Badda, Dhaka', 'Farmgate, Dhaka', 'Lalmatia, Dhaka',
        ];

        $collegesHSC = [
            'Notre Dame College', 'Viqarunnisa Noon School & College', 'Dhaka City College',
            'Holy Cross College', 'Dhaka Residential Model College', 'Rajuk Uttara Model College',
            'Ideal School & College', 'Birshreshtha Noor Mohammad Public College',
        ];

        $schoolsClass9_10 = [
            'Ideal School & College, Motijheel', 'Viqarunnisa Noon School', 'Motijheel Govt. Boys High School',
            'Monipur High School & College', 'St. Joseph Higher Secondary School', 'Udayan Uchcha Madhyamik Bidyalaya',
            'Govt. Laboratory High School', 'Willes Little Flower School',
        ];

        // Ensure Fee Types exist
        $feeTypeMonthly = FeeType::firstOrCreate(
            ['code' => 'FEE-MON'],
            ['name' => 'Monthly Coaching Fee', 'default_amount' => 1500.00, 'description' => 'Monthly tuition fee']
        );

        $studentCounter = 0;

        foreach ($batchDefinitions as $bIndex => $bDef) {
            $batchNumber = $bIndex + 1;

            $batch = Batch::create([
                'name' => $bDef['name'],
                'course_id' => $bDef['course']->id,
                'subject_id' => $bDef['subject']->id,
                'teacher_id' => $bDef['teacher']->id,
                'room' => $bDef['room'],
                'image' => $bDef['image'] ?? null,
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'class_days' => $bDef['class_days'],
                'class_time' => $bDef['class_time'],
                'max_students' => 25,
                'status' => 'active',
            ]);

            // Create Class Routine for Today and Tomorrow
            $routineToday = ClassRoutine::create([
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'teacher_id' => $bDef['teacher']->id,
                'room' => $bDef['room'],
                'class_date' => $today,
                'start_time' => $bDef['start_time'],
                'end_time' => $bDef['end_time'],
                'status' => 'scheduled',
                'notes' => "{$bDef['shift']} 1-Hour Session: {$bDef['subject']->name}",
            ]);

            ClassRoutine::create([
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'teacher_id' => $bDef['teacher']->id,
                'room' => $bDef['room'],
                'class_date' => date('Y-m-d', strtotime('+1 day')),
                'start_time' => $bDef['start_time'],
                'end_time' => $bDef['end_time'],
                'status' => 'scheduled',
                'notes' => "{$bDef['shift']} Lecture Continuation",
            ]);

            // Create Published Exam for this Batch
            $exam = Exam::create([
                'title' => "Monthly Evaluation Test - {$bDef['subject']->name}",
                'course_id' => $bDef['course']->id,
                'batch_id' => $batch->id,
                'exam_date' => date('Y-m-d', strtotime('-3 days')),
                'total_marks' => 100.00,
                'pass_marks' => 40.00,
                'status' => 'published',
            ]);

            // Create 1 Study Material & 1 Assignment for this Batch
            StudyMaterial::create([
                'title' => "{$bDef['subject']->name} Lecture Sheet & Formula Guide",
                'course_id' => $bDef['course']->id,
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'file_type' => 'PDF',
                'link_url' => 'https://example.com/lecture-notes.pdf',
                'description' => "Comprehensive notes and board CQ/MCQ practice sheets for {$bDef['name']}.",
                'uploaded_by' => $bDef['teacher']->user_id ?? $adminUser->id,
            ]);

            Assignment::create([
                'title' => "{$bDef['subject']->name} Weekly Problem Set",
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'teacher_id' => $bDef['teacher']->id,
                'description' => "Complete all creative and MCQ problems from Chapter 1 & 2.",
                'due_date' => date('Y-m-d 23:59:59', strtotime('+5 days')),
                'max_marks' => 50.00,
            ]);

            // Seed exactly 20 Bangladeshi Students for this Batch
            for ($roll = 1; $roll <= 20; $roll++) {
                $nameInfo = $bangladeshiNames[$studentCounter] ?? ["Student {$batchNumber}-{$roll}", 'male'];
                $studentName = ucwords($nameInfo[0]);
                $gender = $nameInfo[1];
                $studentCounter++;

                $serial = str_pad($studentCounter, 4, '0', STR_PAD_LEFT);
                $studentCode = "CSM-2026-{$serial}";
                $phoneNum = '+88017' . str_pad(10000000 + ($studentCounter * 371), 8, '0', STR_PAD_LEFT);
                $guardianPhone = '+88018' . str_pad(20000000 + ($studentCounter * 419), 8, '0', STR_PAD_LEFT);

                // Keep student1@coaching.com as the very first student for quick demo login
                $email = ($studentCounter === 1)
                    ? 'student1@coaching.com'
                    : "student.b{$batchNumber}." . str_pad($roll, 2, '0', STR_PAD_LEFT) . '@coaching.com';

                $guardianName = $guardianFathers[$studentCounter % count($guardianFathers)] . ' (' . explode(' ', $studentName)[0] . '\'s Guardian)';
                $area = $areas[$studentCounter % count($areas)];
                $school = in_array($bDef['level'], ['Class 9', 'Class 10', 'Class 9 & 10'])
                    ? $schoolsClass9_10[$studentCounter % count($schoolsClass9_10)]
                    : $collegesHSC[$studentCounter % count($collegesHSC)];

                // Student User
                $studentUser = User::create([
                    'name' => $studentName,
                    'email' => $email,
                    'user_type' => 'student',
                    'status' => 'active',
                    'phone' => $phoneNum,
                    'password' => $password,
                ]);

                // Guardian Profile (every 2 students or unique)
                $guardian = GuardianProfile::create([
                    'guardian_id' => "GRD-{$serial}",
                    'name' => $guardianFathers[$studentCounter % count($guardianFathers)],
                    'phone' => $guardianPhone,
                    'email' => "guardian{$serial}@coaching.com",
                    'occupation' => $studentCounter % 3 === 0 ? 'Govt. Service' : ($studentCounter % 2 === 0 ? 'Business' : 'Engineer'),
                    'address' => $area,
                ]);

                // Student Profile
                $student = StudentProfile::create([
                    'user_id' => $studentUser->id,
                    'student_id' => $studentCode,
                    'name' => $studentName,
                    'dob' => in_array($bDef['level'], ['Class 9', 'Class 10', 'Class 9 & 10']) ? '2011-04-12' : '2008-06-18',
                    'gender' => $gender,
                    'phone' => $phoneNum,
                    'email' => $email,
                    'address' => $area,
                    'guardian_name' => $guardian->name,
                    'guardian_phone' => $guardianPhone,
                    'guardian_id' => $guardian->id,
                    'school_college' => $school,
                    'course_id' => $bDef['course']->id,
                    'batch_id' => $batch->id,
                    'admission_date' => '2026-01-10',
                    'status' => 'active',
                    'notes' => "Enrolled in {$bDef['name']}",
                ]);

                // Attach to batch_student pivot
                $student->batches()->attach($batch->id, [
                    'course_id' => $bDef['course']->id,
                    'monthly_fee' => $bDef['course']->fee,
                    'roll_number' => str_pad($roll, 2, '0', STR_PAD_LEFT),
                    'status' => 'active',
                    'enrolled_at' => '2026-01-10',
                ]);

                // Seed Today's Attendance (Mostly Present, few Late/Absent for realism)
                $attStatus = ($roll % 15 === 0) ? 'absent' : (($roll % 9 === 0) ? 'late' : 'present');
                Attendance::create([
                    'student_id' => $student->id,
                    'batch_id' => $batch->id,
                    'class_routine_id' => $routineToday->id,
                    'date' => $today,
                    'status' => $attStatus,
                    'remark' => $attStatus === 'present' ? 'On time' : ($attStatus === 'late' ? '5 mins late' : 'Informed guardian'),
                ]);

                // Seed Exam Marks & Published Result for all 20 students
                $score = match (true) {
                    $roll <= 4 => 95 - ($roll * 2),      // A+ (87-93)
                    $roll <= 10 => 82 - (($roll - 4) * 2), // A / A- (70-80)
                    $roll <= 17 => 68 - (($roll - 10) * 3), // B / C (47-65)
                    $roll === 18 => 44,                   // D
                    default => 34 + ($roll - 19),         // Fail (34-35)
                };

                [$grade, $gpa] = match (true) {
                    $score >= 80 => ['A+', 5.00],
                    $score >= 70 => ['A', 4.00],
                    $score >= 60 => ['A-', 3.50],
                    $score >= 50 => ['B', 3.00],
                    $score >= 40 => ['C', 2.00],
                    default => ['F', 0.00],
                };

                Mark::create([
                    'exam_id' => $exam->id,
                    'subject_id' => $bDef['subject']->id,
                    'student_id' => $student->id,
                    'obtained_marks' => $score,
                    'is_absent' => false,
                    'remarks' => $score >= 80 ? 'Excellent performance' : ($score >= 40 ? 'Good effort' : 'Needs extra care'),
                ]);

                Result::create([
                    'exam_id' => $exam->id,
                    'student_id' => $student->id,
                    'total_marks' => 100.00,
                    'obtained_marks' => $score,
                    'percentage' => $score,
                    'grade' => $grade,
                    'gpa' => $gpa,
                    'pass_status' => $score >= 40 ? 'pass' : 'fail',
                ]);

                // Seed Tuition Fee Invoice (Paid for most, Partial/Unpaid for a few)
                $feeAmt = (float) $bDef['course']->fee;
                $isPaid = ($roll % 4 !== 0);
                $paidAmt = $isPaid ? $feeAmt : ($feeAmt / 2);
                $dueAmt = $feeAmt - $paidAmt;

                $invoice = FeeInvoice::create([
                    'invoice_no' => "INV-2026-{$serial}",
                    'student_id' => $student->id,
                    'fee_type_id' => $feeTypeMonthly->id,
                    'title' => date('F Y') . " Tuition Fee ({$bDef['course']->code})",
                    'amount' => $feeAmt,
                    'discount' => 0.00,
                    'net_amount' => $feeAmt,
                    'paid_amount' => $paidAmt,
                    'due_amount' => $dueAmt,
                    'due_date' => date('Y-m-d', strtotime('+7 days')),
                    'status' => $dueAmt == 0 ? 'paid' : 'partial',
                ]);

                if ($paidAmt > 0) {
                    FeePayment::create([
                        'receipt_no' => "RCP-2026-{$serial}",
                        'student_id' => $student->id,
                        'invoice_id' => $invoice->id,
                        'paid_amount' => $paidAmt,
                        'discount_amount' => 0.00,
                        'payment_method' => $roll % 2 === 0 ? 'bKash' : 'Cash',
                        'previous_due' => $feeAmt,
                        'remaining_due' => $dueAmt,
                        'payment_date' => $today,
                        'collected_by' => $accountantUser->id,
                        'remarks' => 'Monthly batch fee payment',
                    ]);
                }
            }
        }
    }
}
