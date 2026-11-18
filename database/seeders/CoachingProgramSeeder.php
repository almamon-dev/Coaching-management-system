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
     * Seed exactly 5 batches:
     * 1. HSC Higher Math (1st & 2nd Paper)
     * 2. HSC Physics (1st & 2nd Paper)
     * 3. HSC ICT (1st & 2nd Paper)
     * 4. Class 10 / SSC Special (Math, Physics, Chem & ICT)
     * 5. Class 9 Science Complete (Math, Physics, Chem & ICT)
     *
     * Exactly 10 students per batch (50 students total).
     * Every student gets complete dynamic data:
     * - User login (student1@coaching.com through student50@coaching.com, pass: password)
     * - Profile & Guardian details
     * - Enrolled batch & courses
     * - Class routines (today, upcoming, and past)
     * - Attendance history & verified percentage
     * - Tuition fee invoices & payment receipts
     * - Published exam results, marks & marksheets
     * - Assignments & reviewed submissions
     * - Study materials & lecture sheets
     * - Academic notices
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

        // 3. Ensure 4 Expert Bangladeshi Teachers exist
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
                'name' => 'Prof. Mahmudul Hasan',
                'phone' => '+8801711223366',
                'qualification' => 'M.Sc in Applied Mathematics (DU)',
                'designation' => 'Senior Higher Math Lecturer',
                'specialization' => 'Higher Math 1st & 2nd Paper',
                'address' => 'Uttara Sector 7, Dhaka',
            ],
            [
                'email' => 'teacher3@coaching.com',
                'teacher_id' => 'TCH-003',
                'name' => 'Tanvir Ahmed Khan',
                'phone' => '+8801711223377',
                'qualification' => 'B.Sc in CSE (BUET)',
                'designation' => 'Lead ICT Instructor',
                'specialization' => 'ICT 1st & 2nd Paper',
                'address' => 'Banani, Dhaka',
            ],
            [
                'email' => 'teacher4@coaching.com',
                'teacher_id' => 'TCH-004',
                'name' => 'Nusrat Jahan Chowdhury',
                'phone' => '+8801711223355',
                'qualification' => 'M.Sc in Chemistry (BUET)',
                'designation' => 'Senior Science Faculty',
                'specialization' => 'General Science & Chemistry',
                'address' => 'Mirpur DOHS, Dhaka',
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

        // 4. Create Exactly 5 Courses: HSC Math, HSC Physics, HSC ICT, Class 10, Class 9
        $courseHigherMath = Course::create([
            'title' => 'Higher Math (1st & 2nd Paper)',
            'code' => 'HSC-HMATH-101',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 500.00,
            'fee' => 1600.00,
            'duration' => '12 Months',
            'total_lectures' => 52,
            'total_lessons' => 18,
            'description' => 'Complete Higher Mathematics 1st & 2nd Paper covering Matrix, Calculus, Complex Numbers, Conics, Trigonometry, and Vectors.',
            'syllabus_details' => '<h3>Higher Math 1st Paper</h3><ul><li>Matrix & Determinants</li><li>Straight Lines & Circle Geometry</li><li>Trigonometric Functions & Equations</li><li>Differential & Integral Calculus</li></ul><h3>Higher Math 2nd Paper</h3><ul><li>Complex Numbers & Polynomials</li><li>Conics: Parabola, Ellipse & Hyperbola</li><li>Inverse Trigonometry</li><li>Statics & Dynamics Mechanics</li></ul>',
            'status' => 'active',
        ]);

        $coursePhysics = Course::create([
            'title' => 'Physics (1st & 2nd Paper)',
            'code' => 'HSC-PHY-102',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 500.00,
            'fee' => 1500.00,
            'duration' => '12 Months',
            'total_lectures' => 48,
            'total_lessons' => 16,
            'description' => 'Complete HSC Physics 1st & 2nd Paper covering Vectors, Mechanics, Work & Energy, Wave Motion, Thermodynamics, and Electromagnetism.',
            'syllabus_details' => '<h3>Physics 1st Paper</h3><ul><li>Vector Algebra & Calculus</li><li>Newtonian Mechanics & Gravitation</li><li>Structural Properties of Matter</li><li>Periodic Motion & Waves</li></ul><h3>Physics 2nd Paper</h3><ul><li>Thermodynamics & Heat Engines</li><li>Static & Current Electricity</li><li>Magnetic Effect of Current</li><li>Geometrical Optics & Modern Physics</li></ul>',
            'status' => 'active',
        ]);

        $courseICT = Course::create([
            'title' => 'ICT (1st & 2nd Paper)',
            'code' => 'HSC-ICT-103',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 400.00,
            'fee' => 1200.00,
            'duration' => '10 Months',
            'total_lectures' => 40,
            'total_lessons' => 12,
            'description' => 'Complete ICT 1st & 2nd Paper including Number Systems, Logic Gates, HTML Web Design, C Programming Language, and Database Management (SQL).',
            'syllabus_details' => '<h3>Lesson 1: Communication Systems & Networking</h3><p>Data transmission modes, medium, and network topology.</p><h3>Lesson 2: Number System & Digital Logic</h3><p>Binary, Octal, Hexadecimal conversions, 2\'s complement, logic gates & boolean algebra.</p><h3>Lesson 3: HTML & Web Design</h3><p>Web page structure, tables, hyperlinks, images, and forms.</p><h3>Lesson 4: C Programming</h3><p>Variables, control flow (if/else, loops), arrays, and functions.</p><h3>Lesson 5: Database Management System</h3><p>Relational databases, primary keys, queries, and SQL basics.</p>',
            'status' => 'active',
        ]);

        $courseClass10 = Course::create([
            'title' => 'Class 10 / SSC Special (Math, Physics, Chem & ICT)',
            'code' => 'CLS10-SCI-201',
            'category' => 'Class 10',
            'admission_fee' => 500.00,
            'fee' => 2000.00,
            'duration' => '12 Months',
            'total_lectures' => 64,
            'total_lessons' => 22,
            'description' => 'Class 10 & SSC Board Exam special program covering Higher Math, General Math, Physics, Chemistry, and ICT with intensive CQ & MCQ model tests.',
            'syllabus_details' => '<h3>SSC Science Subjects</h3><ul><li><strong>Higher Math:</strong> Algebraic Expressions, Geometry, Trigonometry, Coordinate Geometry</li><li><strong>Physics:</strong> Optics, Static & Current Electricity, Modern Physics</li><li><strong>Chemistry:</strong> Mole Concept, Chemical Reactions, Hydrocarbons</li><li><strong>ICT:</strong> Multimedia, Graphics & SSC Curriculum Practice</li></ul>',
            'status' => 'active',
        ]);

        $courseClass9 = Course::create([
            'title' => 'Class 9 Science Complete (Math, Physics, Chem & ICT)',
            'code' => 'CLS9-SCI-301',
            'category' => 'Class 9',
            'admission_fee' => 500.00,
            'fee' => 1800.00,
            'duration' => '12 Months',
            'total_lectures' => 60,
            'total_lessons' => 20,
            'description' => 'Class 9 foundational science program covering Higher Math, Physics, Chemistry, and ICT with regular board-pattern weekly tests.',
            'syllabus_details' => '<h3>Class 9 Science Foundation</h3><ul><li><strong>Higher Math:</strong> Set & Functions, Algebraic Formulas, Geometry Theorems</li><li><strong>Physics:</strong> Motion, Force, Work Power & Energy, State of Matter</li><li><strong>Chemistry:</strong> Structure of Matter, Periodic Table, Chemical Bonds</li><li><strong>ICT:</strong> Computer System, Safe Internet Usage & Digital Literacy</li></ul>',
            'status' => 'active',
        ]);

        // 5. Create Corresponding Subjects
        $subjMath = Subject::create([
            'name' => 'Higher Math 1st & 2nd Paper',
            'code' => 'HMATH-101',
            'course_id' => $courseHigherMath->id,
            'total_lectures' => 52,
            'total_lessons' => 18,
            'description' => 'Matrix, Vectors, Trigonometry, Calculus, Complex Numbers & Conics',
            'syllabus_details' => $courseHigherMath->syllabus_details,
        ]);

        $subjPhysics = Subject::create([
            'name' => 'Physics 1st & 2nd Paper',
            'code' => 'PHY-101',
            'course_id' => $coursePhysics->id,
            'total_lectures' => 48,
            'total_lessons' => 16,
            'description' => 'Vector, Mechanics, Waves, Thermodynamics, Electricity & Optics',
            'syllabus_details' => $coursePhysics->syllabus_details,
        ]);

        $subjICT = Subject::create([
            'name' => 'ICT 1st & 2nd Paper',
            'code' => 'ICT-101',
            'course_id' => $courseICT->id,
            'total_lectures' => 40,
            'total_lessons' => 12,
            'description' => 'Number Systems, Logic Gates, HTML, C Programming & SQL Database',
            'syllabus_details' => $courseICT->syllabus_details,
        ]);

        $subjClass10 = Subject::create([
            'name' => 'Class 10 Science (Math, Physics, Chem & ICT)',
            'code' => 'C10-SCI',
            'course_id' => $courseClass10->id,
            'total_lectures' => 64,
            'total_lessons' => 22,
            'description' => 'SSC Higher Math, Physics, Chemistry, and ICT Board CQ/MCQ Mastery',
            'syllabus_details' => $courseClass10->syllabus_details,
        ]);

        $subjClass9 = Subject::create([
            'name' => 'Class 9 Science (Math, Physics, Chem & ICT)',
            'code' => 'C9-SCI',
            'course_id' => $courseClass9->id,
            'total_lectures' => 60,
            'total_lessons' => 20,
            'description' => 'Class 9 Higher Math, Physics, Chemistry, and ICT Foundation',
            'syllabus_details' => $courseClass9->syllabus_details,
        ]);

        // 6. Exactly 5 Batches Matching the 5 Programs
        $batchDefinitions = [
            [
                'name' => 'HSC Higher Math (1st & 2nd Paper)',
                'course' => $courseHigherMath,
                'subject' => $subjMath,
                'teacher' => $teachers[1], // Prof. Mahmudul Hasan
                'room' => 'Room 102',
                'image' => '/images/batches/batch_higher_math.jpg',
                'class_days' => 'Sun, Tue, Thu',
                'class_time' => '08:00 AM - 09:00 AM',
                'start_time' => '08:00:00',
                'end_time' => '09:00:00',
                'shift' => 'Morning',
                'level' => 'HSC',
                'batch_code' => 'MATH',
            ],
            [
                'name' => 'HSC Physics (1st & 2nd Paper)',
                'course' => $coursePhysics,
                'subject' => $subjPhysics,
                'teacher' => $teachers[0], // Dr. Rafiqul Islam
                'room' => 'Room 101',
                'image' => '/images/batches/batch_physics.jpg',
                'class_days' => 'Sun, Tue, Thu',
                'class_time' => '09:00 AM - 10:00 AM',
                'start_time' => '09:00:00',
                'end_time' => '10:00:00',
                'shift' => 'Morning',
                'level' => 'HSC',
                'batch_code' => 'PHY',
            ],
            [
                'name' => 'HSC ICT (1st & 2nd Paper)',
                'course' => $courseICT,
                'subject' => $subjICT,
                'teacher' => $teachers[2], // Tanvir Ahmed Khan
                'room' => 'Room 104',
                'image' => '/images/batches/batch_ict.jpg',
                'class_days' => 'Sat, Mon, Wed',
                'class_time' => '04:00 PM - 05:00 PM',
                'start_time' => '16:00:00',
                'end_time' => '17:00:00',
                'shift' => 'Afternoon',
                'level' => 'HSC',
                'batch_code' => 'ICT',
            ],
            [
                'name' => 'Class 10 / SSC Special (Math, Physics, Chem & ICT)',
                'course' => $courseClass10,
                'subject' => $subjClass10,
                'teacher' => $teachers[0], // Dr. Rafiqul Islam
                'room' => 'Room 101',
                'image' => '/images/batches/batch_class10.jpg',
                'class_days' => 'Sun, Tue, Thu',
                'class_time' => '03:00 PM - 04:00 PM',
                'start_time' => '15:00:00',
                'end_time' => '16:00:00',
                'shift' => 'Afternoon',
                'level' => 'Class 10',
                'batch_code' => 'C10',
            ],
            [
                'name' => 'Class 9 Science Complete (Math, Physics, Chem & ICT)',
                'course' => $courseClass9,
                'subject' => $subjClass9,
                'teacher' => $teachers[3], // Nusrat Jahan Chowdhury
                'room' => 'Room 103',
                'image' => '/images/batches/batch_class9.jpg',
                'class_days' => 'Sat, Mon, Wed',
                'class_time' => '10:00 AM - 11:00 AM',
                'start_time' => '10:00:00',
                'end_time' => '11:00:00',
                'shift' => 'Morning',
                'level' => 'Class 9',
                'batch_code' => 'C9',
            ],
        ];

        // 7. Exactly 50 Authentic Bangladeshi Students (10 Per Batch)
        $bangladeshiStudents = [
            // Batch 1: HSC Higher Math (10)
            ['Arafat Hassan', 'male', 'Dhaka City College'],
            ['Nusrat Jahan Mim', 'female', 'Viqarunnisa Noon College'],
            ['Tanvir Hossain', 'male', 'Notre Dame College'],
            ['Sadia Afrin', 'female', 'Holy Cross College'],
            ['Mehedi Hasan', 'male', 'Dhaka Residential Model College'],
            ['Tasnim Tabassum', 'female', 'Rajuk Uttara Model College'],
            ['Rakibul Islam', 'male', 'Birshreshtha Noor Mohammad College'],
            ['Farhana Yasmin', 'female', 'Ideal School & College'],
            ['Nafis Iqbal', 'male', 'Notre Dame College'],
            ['Sumaiya Akter', 'female', 'Holy Cross College'],

            // Batch 2: HSC Physics (10)
            ['Mahmudul Hasan Shanto', 'male', 'Notre Dame College'],
            ['Jannatul Ferdous Oishee', 'female', 'Viqarunnisa Noon College'],
            ['Sabbir Ahmed Khan', 'male', 'Dhaka City College'],
            ['Tanjila Rahman', 'female', 'Holy Cross College'],
            ['Ashraful Alam', 'male', 'Dhaka Residential Model College'],
            ['Maliha Islam', 'female', 'Rajuk Uttara Model College'],
            ['Fahim Shahriar', 'male', 'Notre Dame College'],
            ['Nafisa Anjum', 'female', 'Viqarunnisa Noon College'],
            ['Rashedul Karim', 'male', 'Birshreshtha Noor Mohammad College'],
            ['Lamia Chowdhury', 'female', 'Holy Cross College'],

            // Batch 3: HSC ICT (10)
            ['Zubair Ahmed', 'male', 'Notre Dame College'],
            ['Sharmin Sultana', 'female', 'Viqarunnisa Noon College'],
            ['Al-Amin Hossain', 'male', 'Dhaka City College'],
            ['Nowshin Jahan', 'female', 'Holy Cross College'],
            ['Kamrul Hasan Rifat', 'male', 'Dhaka Residential Model College'],
            ['Ishrat Jahan', 'female', 'Rajuk Uttara Model College'],
            ['Saifur Rahman', 'male', 'Notre Dame College'],
            ['Marufa Akter', 'female', 'Viqarunnisa Noon College'],
            ['Shakil Mahmud', 'male', 'Birshreshtha Noor Mohammad College'],
            ['Tahmina Khatun', 'female', 'Holy Cross College'],

            // Batch 4: Class 10 / SSC Special (10)
            ['Sayeed Anwar', 'male', 'Ideal School & College, Motijheel'],
            ['Nazmun Nahar', 'female', 'Viqarunnisa Noon School'],
            ['Imtiaz Hossain', 'male', 'Motijheel Govt. Boys High School'],
            ['Sanjida Islam', 'female', 'Monipur High School & College'],
            ['Habibur Rahman', 'male', 'St. Joseph Higher Secondary School'],
            ['Sabrina Rahman', 'female', 'Udayan Uchcha Madhyamik Bidyalaya'],
            ['Faysal Ahmed', 'male', 'Govt. Laboratory High School'],
            ['Umme Habiba', 'female', 'Willes Little Flower School'],
            ['Tariqul Islam', 'male', 'Ideal School & College, Motijheel'],
            ['Ayesha Siddika', 'female', 'Viqarunnisa Noon School'],

            // Batch 5: Class 9 Science Complete (10)
            ['Abdullah Al Mamun', 'male', 'Motijheel Govt. Boys High School'],
            ['Humaira Anjum', 'female', 'Viqarunnisa Noon School'],
            ['Mustafizur Rahman', 'male', 'St. Joseph Higher Secondary School'],
            ['Fatema Tuj Johra', 'female', 'Monipur High School & College'],
            ['Golam Rabbi', 'male', 'Govt. Laboratory High School'],
            ['Shirin Akter', 'female', 'Udayan Uchcha Madhyamik Bidyalaya'],
            ['Asif Mahmud', 'male', 'Ideal School & College, Motijheel'],
            ['Nusrat Fariha', 'female', 'Willes Little Flower School'],
            ['Shahadat Hossain', 'male', 'Motijheel Govt. Boys High School'],
            ['Zannatun Nayem', 'female', 'Viqarunnisa Noon School'],
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

        // Ensure Fee Types exist
        $feeTypeMonthly = FeeType::firstOrCreate(
            ['code' => 'FEE-MON'],
            ['name' => 'Monthly Coaching Fee', 'default_amount' => 1500.00, 'description' => 'Monthly tuition fee']
        );

        $feeTypeAdmission = FeeType::firstOrCreate(
            ['code' => 'FEE-ADM'],
            ['name' => 'Admission & Registration Fee', 'default_amount' => 500.00, 'description' => 'Initial admission charge']
        );

        $studentGlobalIndex = 0;

        foreach ($batchDefinitions as $bIndex => $bDef) {
            $batchNumber = $bIndex + 1;

            // Create Batch
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
                'max_students' => 10,
                'status' => 'active',
            ]);

            // Class Routines: Past, Today, Tomorrow, and Next Week
            $routineToday = ClassRoutine::create([
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'teacher_id' => $bDef['teacher']->id,
                'room' => $bDef['room'],
                'class_date' => $today,
                'start_time' => $bDef['start_time'],
                'end_time' => $bDef['end_time'],
                'status' => 'scheduled',
                'notes' => "{$bDef['shift']} Lecture: {$bDef['subject']->name}",
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
                'notes' => "Interactive Problem Solving & CQ Drill",
            ]);

            ClassRoutine::create([
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'teacher_id' => $bDef['teacher']->id,
                'room' => $bDef['room'],
                'class_date' => date('Y-m-d', strtotime('+3 days')),
                'start_time' => $bDef['start_time'],
                'end_time' => $bDef['end_time'],
                'status' => 'scheduled',
                'notes' => "Weekly Assessment & Board Question Analysis",
            ]);

            // Create 2 Published Exams for this Batch
            $exam1 = Exam::create([
                'title' => "Weekly Evaluation Test - {$bDef['subject']->name}",
                'course_id' => $bDef['course']->id,
                'batch_id' => $batch->id,
                'exam_date' => date('Y-m-d', strtotime('-5 days')),
                'total_marks' => 100.00,
                'pass_marks' => 40.00,
                'status' => 'published',
            ]);

            $exam2 = Exam::create([
                'title' => "Monthly Model Test - {$bDef['subject']->name}",
                'course_id' => $bDef['course']->id,
                'batch_id' => $batch->id,
                'exam_date' => date('Y-m-d', strtotime('-18 days')),
                'total_marks' => 100.00,
                'pass_marks' => 40.00,
                'status' => 'published',
            ]);

            // Create 2 Assignments for this Batch
            $assignment1 = Assignment::create([
                'title' => "{$bDef['subject']->name} Chapter 1 & 2 CQ Problem Set",
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'teacher_id' => $bDef['teacher']->id,
                'description' => "Solve all textbook creative questions and numerical exercises from Chapter 1 & 2.",
                'due_date' => date('Y-m-d 23:59:59', strtotime('+4 days')),
                'max_marks' => 50.00,
            ]);

            $assignment2 = Assignment::create([
                'title' => "{$bDef['subject']->name} Board Standard MCQ & Formula Derivation",
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'teacher_id' => $bDef['teacher']->id,
                'description' => "Practice 50 board standard MCQs and derive core formulas in your homework notebook.",
                'due_date' => date('Y-m-d 23:59:59', strtotime('+8 days')),
                'max_marks' => 50.00,
            ]);

            // Create 2 Study Materials for this Batch
            StudyMaterial::create([
                'title' => "{$bDef['subject']->name} Comprehensive Lecture Sheet & Formula Handbook",
                'course_id' => $bDef['course']->id,
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'file_type' => 'PDF',
                'link_url' => 'https://example.com/lecture-handbook.pdf',
                'description' => "Complete lecture notes, standard definitions, and formula cheat sheet for {$bDef['name']}.",
                'uploaded_by' => $bDef['teacher']->user_id ?? $adminUser->id,
            ]);

            StudyMaterial::create([
                'title' => "{$bDef['subject']->name} Top Board Exam CQ & MCQ Question Bank",
                'course_id' => $bDef['course']->id,
                'batch_id' => $batch->id,
                'subject_id' => $bDef['subject']->id,
                'file_type' => 'PDF',
                'link_url' => 'https://example.com/board-question-bank.pdf',
                'description' => "Past 5-year board questions categorized by topic with full model answers.",
                'uploaded_by' => $bDef['teacher']->user_id ?? $adminUser->id,
            ]);

            // Create Batch Notice
            Notice::create([
                'title' => "Class Schedule & Routine Notice for {$bDef['name']}",
                'content' => "All students of {$bDef['name']} are instructed to attend daily lectures at {$bDef['class_time']} in {$bDef['room']}. Bring your lecture sheets and notebooks.",
                'target_role' => 'students',
                'course_id' => $bDef['course']->id,
                'batch_id' => $batch->id,
                'category' => 'Academic',
                'priority' => 'high',
                'published_at' => $today . ' 08:00:00',
                'created_by' => $adminUser->id,
            ]);

            // Seed EXACTLY 10 Students for this Batch
            for ($roll = 1; $roll <= 10; $roll++) {
                $studentData = $bangladeshiStudents[$studentGlobalIndex];
                $studentName = $studentData[0];
                $gender = $studentData[1];
                $school = $studentData[2];
                $studentGlobalIndex++;

                $batchShort = StudentProfile::getBatchShortCode($batch, $bDef['course']);
                $serial = str_pad($roll, 4, '0', STR_PAD_LEFT);
                $studentCode = "UCCA-{$batchShort}-{$serial}";
                $phoneNum = '+88017' . str_pad(10000000 + ($studentGlobalIndex * 419), 8, '0', STR_PAD_LEFT);
                $guardianPhone = '+88018' . str_pad(20000000 + ($studentGlobalIndex * 523), 8, '0', STR_PAD_LEFT);

                // Easy login: student1@coaching.com through student50@coaching.com
                $email = "student{$studentGlobalIndex}@coaching.com";

                $guardianName = $guardianFathers[$studentGlobalIndex % count($guardianFathers)];
                $area = $areas[$studentGlobalIndex % count($areas)];

                // Student User Account
                $studentUser = User::create([
                    'name' => $studentName,
                    'email' => $email,
                    'user_type' => 'student',
                    'status' => 'active',
                    'phone' => $phoneNum,
                    'password' => $password,
                ]);

                // Guardian Profile
                $guardian = GuardianProfile::create([
                    'guardian_id' => "GRD-{$serial}",
                    'name' => $guardianName,
                    'phone' => $guardianPhone,
                    'email' => "guardian{$studentGlobalIndex}@coaching.com",
                    'occupation' => $studentGlobalIndex % 3 === 0 ? 'Govt. Official' : ($studentGlobalIndex % 2 === 0 ? 'Business Owner' : 'Engineer'),
                    'address' => $area,
                ]);

                // Student Profile
                $student = StudentProfile::create([
                    'user_id' => $studentUser->id,
                    'student_id' => $studentCode,
                    'name' => $studentName,
                    'dob' => in_array($bDef['level'], ['Class 9', 'Class 10']) ? '2011-04-15' : '2008-06-20',
                    'gender' => $gender,
                    'phone' => $phoneNum,
                    'email' => $email,
                    'address' => $area,
                    'guardian_name' => $guardianName,
                    'guardian_phone' => $guardianPhone,
                    'guardian_id' => $guardian->id,
                    'school_college' => $school,
                    'course_id' => $bDef['course']->id,
                    'batch_id' => $batch->id,
                    'admission_date' => '2026-01-10',
                    'status' => 'active',
                    'notes' => "Enrolled in {$bDef['name']} • Roll: " . str_pad($roll, 2, '0', STR_PAD_LEFT),
                ]);

                // Attach to batch_student pivot table
                $student->batches()->attach($batch->id, [
                    'course_id' => $bDef['course']->id,
                    'monthly_fee' => $bDef['course']->fee,
                    'roll_number' => str_pad($roll, 2, '0', STR_PAD_LEFT),
                    'status' => 'active',
                    'enrolled_at' => '2026-01-10',
                ]);

                // 8. Dynamic Attendance: Seed 8 Attendance records across recent days
                $attDays = [0, 2, 4, 7, 9, 11, 14, 16];
                foreach ($attDays as $dayOffset) {
                    $attDate = date('Y-m-d', strtotime("-{$dayOffset} days"));
                    // Make mostly present, occasional late or absent
                    $status = ($dayOffset === 14 && $roll % 4 === 0) ? 'absent' : (($dayOffset === 7 && $roll % 3 === 0) ? 'late' : 'present');
                    $remark = match ($status) {
                        'present' => 'On time & active in class',
                        'late' => '10 minutes late',
                        'absent' => 'Sick leave (informed guardian)',
                    };

                    Attendance::create([
                        'student_id' => $student->id,
                        'batch_id' => $batch->id,
                        'class_routine_id' => $routineToday->id,
                        'date' => $attDate,
                        'status' => $status,
                        'remark' => $remark,
                    ]);
                }

                // 9. Dynamic Exam Marks & Results for Exam 1 & Exam 2
                // Exam 1 Results (Score 72 to 96)
                $score1 = 96 - ($roll * 2); // 94, 92, 90, 88, 86, 84, 82, 80, 78, 76
                $grade1 = $score1 >= 80 ? 'A+' : ($score1 >= 70 ? 'A' : 'A-');
                $gpa1 = $score1 >= 80 ? 5.00 : ($score1 >= 70 ? 4.00 : 3.50);

                Mark::create([
                    'exam_id' => $exam1->id,
                    'subject_id' => $bDef['subject']->id,
                    'student_id' => $student->id,
                    'obtained_marks' => $score1,
                    'is_absent' => false,
                    'remarks' => $score1 >= 90 ? 'Outstanding score!' : ($score1 >= 80 ? 'Very good performance!' : 'Good effort, keep it up.'),
                ]);

                Result::create([
                    'exam_id' => $exam1->id,
                    'student_id' => $student->id,
                    'total_marks' => 100.00,
                    'obtained_marks' => $score1,
                    'percentage' => $score1,
                    'grade' => $grade1,
                    'gpa' => $gpa1,
                    'pass_status' => 'pass',
                ]);

                // Exam 2 Results (Score 70 to 95)
                $score2 = 95 - (($roll % 5) * 3);
                $grade2 = $score2 >= 80 ? 'A+' : ($score2 >= 70 ? 'A' : 'A-');
                $gpa2 = $score2 >= 80 ? 5.00 : ($score2 >= 70 ? 4.00 : 3.50);

                Mark::create([
                    'exam_id' => $exam2->id,
                    'subject_id' => $bDef['subject']->id,
                    'student_id' => $student->id,
                    'obtained_marks' => $score2,
                    'is_absent' => false,
                    'remarks' => 'Good conceptual clarity.',
                ]);

                Result::create([
                    'exam_id' => $exam2->id,
                    'student_id' => $student->id,
                    'total_marks' => 100.00,
                    'obtained_marks' => $score2,
                    'percentage' => $score2,
                    'grade' => $grade2,
                    'gpa' => $gpa2,
                    'pass_status' => 'pass',
                ]);

                // 10. Dynamic Assignment Submissions
                AssignmentSubmission::create([
                    'assignment_id' => $assignment1->id,
                    'student_id' => $student->id,
                    'submission_text' => 'All chapter 1 & 2 creative problems worked out step-by-step.',
                    'marks_obtained' => 45.00 + ($roll % 5),
                    'feedback' => 'Well-organized handwritten solutions. Formulas properly derived.',
                    'status' => 'reviewed',
                    'submitted_at' => date('Y-m-d 15:30:00', strtotime('-2 days')),
                ]);

                // 11. Dynamic Fee Invoices & Payments
                $monthlyFee = (float) $bDef['course']->fee;

                // Monthly Tuition Fee Invoice
                $isPaidFull = ($roll % 3 !== 0); // 70% paid, 30% partial
                $paidMonthly = $isPaidFull ? $monthlyFee : ($monthlyFee / 2);
                $dueMonthly = $monthlyFee - $paidMonthly;

                $invMonthly = FeeInvoice::create([
                    'invoice_no' => "INV-2026-{$serial}",
                    'student_id' => $student->id,
                    'fee_type_id' => $feeTypeMonthly->id,
                    'title' => date('F Y') . " Tuition Fee ({$bDef['course']->code})",
                    'amount' => $monthlyFee,
                    'discount' => 0.00,
                    'net_amount' => $monthlyFee,
                    'paid_amount' => $paidMonthly,
                    'due_amount' => $dueMonthly,
                    'due_date' => date('Y-m-d', strtotime('+10 days')),
                    'status' => $dueMonthly == 0 ? 'paid' : 'partial',
                ]);

                if ($paidMonthly > 0) {
                    FeePayment::create([
                        'receipt_no' => "RCP-2026-{$serial}",
                        'student_id' => $student->id,
                        'invoice_id' => $invMonthly->id,
                        'paid_amount' => $paidMonthly,
                        'discount_amount' => 0.00,
                        'payment_method' => $roll % 2 === 0 ? 'bKash' : 'Cash',
                        'previous_due' => $monthlyFee,
                        'remaining_due' => $dueMonthly,
                        'payment_date' => date('Y-m-d', strtotime('-3 days')),
                        'collected_by' => $accountantUser->id,
                        'remarks' => $roll % 2 === 0 ? 'bKash TrxID: BK' . rand(10000000, 99999999) : 'Cash Payment at Office Counter',
                    ]);
                }

                // Admission Fee Invoice (Paid)
                $admFee = (float) $bDef['course']->admission_fee;
                $invAdm = FeeInvoice::create([
                    'invoice_no' => "ADM-2026-{$serial}",
                    'student_id' => $student->id,
                    'fee_type_id' => $feeTypeAdmission->id,
                    'title' => "Admission & Enrollment Fee ({$bDef['course']->code})",
                    'amount' => $admFee,
                    'discount' => 0.00,
                    'net_amount' => $admFee,
                    'paid_amount' => $admFee,
                    'due_amount' => 0.00,
                    'due_date' => '2026-01-10',
                    'status' => 'paid',
                ]);

                FeePayment::create([
                    'receipt_no' => "RCP-ADM-{$serial}",
                    'student_id' => $student->id,
                    'invoice_id' => $invAdm->id,
                    'paid_amount' => $admFee,
                    'discount_amount' => 0.00,
                    'payment_method' => 'Cash',
                    'previous_due' => $admFee,
                    'remaining_due' => 0.00,
                    'payment_date' => '2026-01-10',
                    'collected_by' => $accountantUser->id,
                    'remarks' => 'Admission registration clearance receipt',
                ]);
            }
        }

        // Multi-Batch Enrollment for Student 1 (student1@coaching.com)
        $student1 = StudentProfile::find(1);
        $physicsBatch = Batch::find(2);
        if ($student1 && $physicsBatch) {
            $student1->batches()->syncWithoutDetaching([
                $physicsBatch->id => [
                    'course_id' => $physicsBatch->course_id,
                    'monthly_fee' => 1500.00,
                    'roll_number' => '01',
                    'status' => 'active',
                    'enrolled_at' => '2026-01-10',
                ]
            ]);

            // Add Results for Physics Batch (Exam 3 & Exam 4)
            Result::updateOrInsert(
                ['exam_id' => 3, 'student_id' => $student1->id],
                [
                    'total_marks' => 100.00,
                    'obtained_marks' => 91.00,
                    'percentage' => 91.00,
                    'grade' => 'A+',
                    'gpa' => 5.00,
                    'pass_status' => 'pass',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            Result::updateOrInsert(
                ['exam_id' => 4, 'student_id' => $student1->id],
                [
                    'total_marks' => 100.00,
                    'obtained_marks' => 88.50,
                    'percentage' => 88.50,
                    'grade' => 'A+',
                    'gpa' => 5.00,
                    'pass_status' => 'pass',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // Add multi-month attendance for Batch 1 and Batch 2
            $sampleDates = [
                ['batch' => 1, 'date' => '2026-11-01', 'status' => 'present', 'remark' => 'Calculus drill completed'],
                ['batch' => 1, 'date' => '2026-11-03', 'status' => 'present', 'remark' => 'Regular attendance'],
                ['batch' => 1, 'date' => '2026-11-08', 'status' => 'present', 'remark' => 'Problem solving set'],
                ['batch' => 1, 'date' => '2026-10-15', 'status' => 'present', 'remark' => 'Matrix revision'],
                ['batch' => 1, 'date' => '2026-10-22', 'status' => 'present', 'remark' => 'Board model test'],
                ['batch' => 1, 'date' => '2026-09-10', 'status' => 'present', 'remark' => 'Geometry foundations'],
                ['batch' => 2, 'date' => '2026-11-02', 'status' => 'present', 'remark' => 'Thermodynamics drill'],
                ['batch' => 2, 'date' => '2026-11-07', 'status' => 'present', 'remark' => 'Current electricity lab'],
                ['batch' => 2, 'date' => '2026-11-14', 'status' => 'present', 'remark' => 'Circuit analysis test'],
                ['batch' => 2, 'date' => '2026-10-12', 'status' => 'present', 'remark' => 'Newtonian mechanics'],
                ['batch' => 2, 'date' => '2026-10-26', 'status' => 'late',    'remark' => '5 mins late'],
                ['batch' => 2, 'date' => '2026-09-14', 'status' => 'present', 'remark' => 'Vector cross product'],
            ];

            foreach ($sampleDates as $sd) {
                Attendance::updateOrInsert(
                    ['student_id' => $student1->id, 'batch_id' => $sd['batch'], 'date' => $sd['date']],
                    ['status' => $sd['status'], 'remark' => $sd['remark'], 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }
}
