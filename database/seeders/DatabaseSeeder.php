<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
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
use App\Models\OperationalExpense;
use App\Models\OperationalIncome;
use App\Models\Exam;
use App\Models\Mark;
use App\Models\Result;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\StudyMaterial;
use App\Models\Notice;
use App\Models\ActivityLog;
use App\Models\RolePermission;
use App\Models\Setting;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Settings Setup
        $settings = [
            'center_name' => 'Apex Coaching & Learning Center',
            'center_tagline' => 'Excellence in Education',
            'center_logo' => '/images/logo.png',
            'phone' => '+880 1711-000000',
            'email' => 'info@apexcoaching.bd',
            'address' => 'House 42, Road 11, Block E, Banani, Dhaka, Bangladesh',
            'currency_symbol' => '৳',
            'academic_year' => '2026',
            'receipt_footer_note' => 'Thank you for choosing Apex Coaching Center. Keep this receipt for future reference.',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // 2. Default Permissions Matrix
        $modules = [
            'dashboard', 'students', 'admissions', 'teachers', 'courses', 'batches',
            'routines', 'attendance', 'fees', 'receipts', 'expenses', 'incomes',
            'exams', 'results', 'assignments', 'materials', 'notices', 'reports',
            'permissions', 'logs', 'settings', 'backup'
        ];

        RolePermission::updateOrCreate(
            ['role' => 'super_admin'],
            ['permissions' => $modules]
        );

        RolePermission::updateOrCreate(
            ['role' => 'manager'],
            ['permissions' => array_diff($modules, ['permissions', 'backup'])]
        );

        RolePermission::updateOrCreate(
            ['role' => 'teacher'],
            ['permissions' => ['dashboard', 'routines', 'attendance', 'exams', 'results', 'assignments', 'materials', 'notices']]
        );

        RolePermission::updateOrCreate(
            ['role' => 'accountant'],
            ['permissions' => ['dashboard', 'students', 'admissions', 'fees', 'receipts', 'expenses', 'incomes', 'reports']]
        );

        RolePermission::updateOrCreate(
            ['role' => 'student'],
            ['permissions' => ['dashboard', 'routines', 'attendance', 'fees', 'exams', 'results', 'assignments', 'materials', 'notices']]
        );

        RolePermission::updateOrCreate(
            ['role' => 'guardian'],
            ['permissions' => ['dashboard', 'routines', 'attendance', 'fees', 'exams', 'results', 'assignments', 'notices']]
        );

        // 3. User Creation (Super Admin, Manager, Teacher, Accountant, Guardian, Student)
        $adminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@coaching.com',
            'user_type' => 'super_admin',
            'status' => 'active',
            'phone' => '+8801700000001',
            'password' => Hash::make('password'),
        ]);

        $managerUser = User::create([
            'name' => 'Tanvir Ahmed (Manager)',
            'email' => 'manager@coaching.com',
            'user_type' => 'manager',
            'status' => 'active',
            'phone' => '+8801700000002',
            'password' => Hash::make('password'),
        ]);

        $accountantUser = User::create([
            'name' => 'Salma Begum (Accountant)',
            'email' => 'accountant@coaching.com',
            'user_type' => 'accountant',
            'status' => 'active',
            'phone' => '+8801700000003',
            'password' => Hash::make('password'),
        ]);

        $teacherUser1 = User::create([
            'name' => 'Dr. Rafiqul Islam',
            'email' => 'teacher1@coaching.com',
            'user_type' => 'teacher',
            'status' => 'active',
            'phone' => '+8801711223344',
            'password' => Hash::make('password'),
        ]);

        $teacherUser2 = User::create([
            'name' => 'Nusrat Jahan',
            'email' => 'teacher2@coaching.com',
            'user_type' => 'teacher',
            'status' => 'active',
            'phone' => '+8801711223355',
            'password' => Hash::make('password'),
        ]);

        $guardianUser = User::create([
            'name' => 'Kamrul Hassan',
            'email' => 'guardian@coaching.com',
            'user_type' => 'guardian',
            'status' => 'active',
            'phone' => '+8801819000111',
            'password' => Hash::make('password'),
        ]);

        $studentUser1 = User::create([
            'name' => 'Arafat Hassan',
            'email' => 'student1@coaching.com',
            'user_type' => 'student',
            'status' => 'active',
            'phone' => '+8801911998877',
            'password' => Hash::make('password'),
        ]);

        $studentUser2 = User::create([
            'name' => 'Samia Hassan',
            'email' => 'student2@coaching.com',
            'user_type' => 'student',
            'status' => 'active',
            'phone' => '+8801911998866',
            'password' => Hash::make('password'),
        ]);

        // 4. Teacher Profiles
        $teacher1 = TeacherProfile::create([
            'user_id' => $teacherUser1->id,
            'teacher_id' => 'TCH-001',
            'name' => 'Dr. Rafiqul Islam',
            'phone' => '+8801711223344',
            'email' => 'teacher1@coaching.com',
            'qualification' => 'M.Sc, Ph.D in Physics (DU)',
            'designation' => 'Senior Physics Instructor',
            'specialization' => 'Physics & Higher Math',
            'address' => 'Dhanmondi, Dhaka',
            'status' => 'active',
        ]);

        $teacher2 = TeacherProfile::create([
            'user_id' => $teacherUser2->id,
            'teacher_id' => 'TCH-002',
            'name' => 'Nusrat Jahan',
            'phone' => '+8801711223355',
            'email' => 'teacher2@coaching.com',
            'qualification' => 'M.Sc in Chemistry (BUET)',
            'designation' => 'Chemistry Department Head',
            'specialization' => 'Organic & Physical Chemistry',
            'address' => 'Mirpur, Dhaka',
            'status' => 'active',
        ]);

        // 5. Guardian Profile
        $guardian = GuardianProfile::create([
            'user_id' => $guardianUser->id,
            'guardian_id' => 'GRD-101',
            'name' => 'Kamrul Hassan',
            'phone' => '+8801819000111',
            'email' => 'guardian@coaching.com',
            'occupation' => 'Business Owner',
            'address' => 'Uttara Sector 4, Dhaka',
        ]);

        // 6. Courses & Subjects
        $courseHSC = Course::create([
            'title' => 'Physics 1st & 2nd Paper',
            'code' => 'HSC-PHY-101',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 500.00,
            'fee' => 1500.00,
            'duration' => '12 Months',
            'total_lectures' => 48,
            'total_lessons' => 14,
            'description' => 'Comprehensive Higher Secondary Physics preparation covering mechanics, waves, electromagnetism, and modern physics.',
            'syllabus_details' => '<h3>Lesson 1: Vector Algebra & Calculus Basics</h3><ul><li><strong>Lecture 1:</strong> Vector Resolution, Dot & Cross Product Applications</li><li><strong>Lecture 2:</strong> Gradient, Divergence, and Vector Differentiation</li><li><strong>Lecture 3:</strong> Mathematical Problem Solving on Vector Kinematics</li></ul><h3>Lesson 2: Newtonian Mechanics</h3><ul><li><strong>Lecture 4:</strong> Newton\'s Laws of Motion, Momentum Conservation</li><li><strong>Lecture 5:</strong> Friction, Circular Motion & Centripetal Acceleration</li><li><strong>Lecture 6:</strong> Rotational Dynamics & Moment of Inertia</li></ul><h3>Lesson 3: Work, Energy & Power</h3><ul><li><strong>Lecture 7:</strong> Work-Energy Theorem & Conservation Laws</li><li><strong>Lecture 8:</strong> Elastic Collisions & Power Equations</li></ul><h3>Lesson 4: Electricity & Magnetism</h3><ul><li><strong>Lecture 9:</strong> Coulomb\'s Law, Electric Potential & Gauss\'s Theorem</li><li><strong>Lecture 10:</strong> Magnetic Effect of Current & Ampere\'s Law</li></ul>',
            'status' => 'active',
        ]);

        $courseMath = Course::create([
            'title' => 'Higher Mathematics 1st & 2nd Paper',
            'code' => 'HSC-MATH-102',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 500.00,
            'fee' => 1600.00,
            'duration' => '12 Months',
            'total_lectures' => 52,
            'total_lessons' => 16,
            'description' => 'Complete coverage of Differential Calculus, Integral Calculus, Matrix, Conics, and Vector Geometry.',
            'syllabus_details' => '<h3>Lesson 1: Matrix & Determinants</h3><ul><li><strong>Lecture 1:</strong> Types of Matrices, Operations & Inverse Matrix</li><li><strong>Lecture 2:</strong> Cramer\'s Rule & Solving Linear Equation Systems</li></ul><h3>Lesson 2: Differential Calculus</h3><ul><li><strong>Lecture 3:</strong> Limits, Continuity & Standard Formulas</li><li><strong>Lecture 4:</strong> Differentiation of Trigonometric & Logarithmic Functions</li><li><strong>Lecture 5:</strong> Maxima & Minima Applications</li></ul><h3>Lesson 3: Integral Calculus</h3><ul><li><strong>Lecture 6:</strong> Indefinite Integration Techniques & Substitution</li><li><strong>Lecture 7:</strong> Definite Integration & Area Under Curves</li></ul>',
            'status' => 'active',
        ]);

        $courseChemistry = Course::create([
            'title' => 'Chemistry 1st & 2nd Paper',
            'code' => 'HSC-CHE-103',
            'category' => 'HSC / Intermediate',
            'admission_fee' => 500.00,
            'fee' => 1400.00,
            'duration' => '12 Months',
            'total_lectures' => 44,
            'total_lessons' => 12,
            'description' => 'In-depth study of Organic Chemistry mechanisms, Qualitative Analysis, Electrochemistry, and Thermochemistry.',
            'syllabus_details' => '<h3>Lesson 1: Qualitative Chemistry</h3><ul><li><strong>Lecture 1:</strong> Atomic Models, Quantum Numbers & Electronic Configuration</li><li><strong>Lecture 2:</strong> Solubility, Solubility Product & Flame Tests</li></ul><h3>Lesson 2: Chemical Changes & Kinetics</h3><ul><li><strong>Lecture 3:</strong> Reaction Rates, Rate Constant & Activation Energy</li><li><strong>Lecture 4:</strong> Chemical Equilibrium, Le Chatelier Principle & Kc/Kp</li></ul><h3>Lesson 3: Organic Chemistry Essentials</h3><ul><li><strong>Lecture 5:</strong> Nomenclature, Isomerism & Reaction Mechanisms</li><li><strong>Lecture 6:</strong> Alkanes, Alkenes & Aromatic Compounds</li></ul>',
            'status' => 'active',
        ]);

        $courseSSC = Course::create([
            'title' => 'SSC General Mathematics Master Program',
            'code' => 'SSC-MATH-201',
            'category' => 'SSC',
            'admission_fee' => 300.00,
            'fee' => 1200.00,
            'duration' => '10 Months',
            'total_lectures' => 36,
            'total_lessons' => 10,
            'description' => 'Comprehensive Board Exam preparation for SSC General Math including Algebra, Geometry, Trigonometry, and Statistics.',
            'syllabus_details' => '<h3>Lesson 1: Real Numbers & Sets</h3><ul><li><strong>Lecture 1:</strong> Classification of Real Numbers & Set Operations</li><li><strong>Lecture 2:</strong> Venn Diagrams & Practical Applications</li></ul><h3>Lesson 2: Algebraic Expressions & Equations</h3><ul><li><strong>Lecture 3:</strong> Polynomial Formulas, Factorization & Simplification</li><li><strong>Lecture 4:</strong> Quadratic Equations & Discriminant Properties</li></ul><h3>Lesson 3: Trigonometry & Geometry</h3><ul><li><strong>Lecture 5:</strong> Trigonometric Ratios & Height-Distance Problems</li><li><strong>Lecture 6:</strong> Circle Theorems & Geometric Proofs</li></ul>',
            'status' => 'active',
        ]);

        $subjPhysics = Subject::create([
            'name' => 'Physics 1st & 2nd Paper',
            'code' => 'PHY-101',
            'course_id' => $courseHSC->id,
            'total_lectures' => 48,
            'total_lessons' => 14,
            'description' => 'Mechanics, Electromagnetism, Modern Physics',
            'syllabus_details' => $courseHSC->syllabus_details,
        ]);

        $subjChemistry = Subject::create([
            'name' => 'Chemistry 1st & 2nd Paper',
            'code' => 'CHE-101',
            'course_id' => $courseChemistry->id,
            'total_lectures' => 44,
            'total_lessons' => 12,
            'description' => 'Organic, Inorganic & Physical Chemistry',
            'syllabus_details' => $courseChemistry->syllabus_details,
        ]);

        // 7. Batches
        $batchAlpha = Batch::create([
            'name' => 'HSC Alpha Physics Morning',
            'course_id' => $courseHSC->id,
            'subject_id' => $subjPhysics->id,
            'teacher_id' => $teacher1->id,
            'room' => 'Room 101',
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'class_days' => 'Sun, Tue, Thu',
            'class_time' => '09:00 AM - 10:30 AM',
            'max_students' => 35,
            'status' => 'active',
        ]);

        $batchBeta = Batch::create([
            'name' => 'HSC Beta Chemistry Afternoon',
            'course_id' => $courseHSC->id,
            'subject_id' => $subjChemistry->id,
            'teacher_id' => $teacher2->id,
            'room' => 'Room 102',
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'class_days' => 'Sat, Mon, Wed',
            'class_time' => '03:00 PM - 04:30 PM',
            'max_students' => 30,
            'status' => 'active',
        ]);

        // 8. Student Profiles
        $student1 = StudentProfile::create([
            'user_id' => $studentUser1->id,
            'student_id' => 'CSM-2026-0001',
            'name' => 'Arafat Hassan',
            'dob' => '2008-05-14',
            'gender' => 'male',
            'phone' => '+8801911998877',
            'email' => 'student1@coaching.com',
            'address' => 'Uttara Sector 4, Dhaka',
            'guardian_name' => 'Kamrul Hassan',
            'guardian_phone' => '+8801819000111',
            'guardian_id' => $guardian->id,
            'school_college' => 'Dhaka City College',
            'course_id' => $courseHSC->id,
            'batch_id' => $batchAlpha->id,
            'admission_date' => '2026-01-05',
            'status' => 'active',
            'notes' => 'Regular student, very attentive.',
        ]);

        $student2 = StudentProfile::create([
            'user_id' => $studentUser2->id,
            'student_id' => 'CSM-2026-0002',
            'name' => 'Samia Hassan',
            'dob' => '2009-08-20',
            'gender' => 'female',
            'phone' => '+8801911998866',
            'email' => 'student2@coaching.com',
            'address' => 'Uttara Sector 4, Dhaka',
            'guardian_name' => 'Kamrul Hassan',
            'guardian_phone' => '+8801819000111',
            'guardian_id' => $guardian->id,
            'school_college' => 'Holy Cross College',
            'course_id' => $courseHSC->id,
            'batch_id' => $batchBeta->id,
            'admission_date' => '2026-01-08',
            'status' => 'active',
            'notes' => 'Sibling of Arafat Hassan.',
        ]);

        // 9. Class Routines
        $routine1 = ClassRoutine::create([
            'batch_id' => $batchAlpha->id,
            'subject_id' => $subjPhysics->id,
            'teacher_id' => $teacher1->id,
            'room' => 'Room 101',
            'class_date' => date('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '10:30:00',
            'status' => 'scheduled',
            'notes' => 'Chapter 3 Vector Calculus',
        ]);

        $routine2 = ClassRoutine::create([
            'batch_id' => $batchBeta->id,
            'subject_id' => $subjChemistry->id,
            'teacher_id' => $teacher2->id,
            'room' => 'Room 102',
            'class_date' => date('Y-m-d'),
            'start_time' => '15:00:00',
            'end_time' => '16:30:00',
            'status' => 'scheduled',
            'notes' => 'Chemical Kinetics & Reactions',
        ]);

        // 10. Attendances
        Attendance::create([
            'student_id' => $student1->id,
            'batch_id' => $batchAlpha->id,
            'class_routine_id' => $routine1->id,
            'date' => date('Y-m-d'),
            'status' => 'present',
            'remark' => 'On time',
        ]);

        Attendance::create([
            'student_id' => $student2->id,
            'batch_id' => $batchBeta->id,
            'class_routine_id' => $routine2->id,
            'date' => date('Y-m-d'),
            'status' => 'present',
            'remark' => 'On time',
        ]);

        // 11. Fee Types & Invoices & Payments
        $feeTypeAdmission = FeeType::create([
            'name' => 'Admission Fee',
            'code' => 'FEE-ADM',
            'default_amount' => 3000.00,
            'description' => 'One-time initial admission charge',
        ]);

        $feeTypeMonthly = FeeType::create([
            'name' => 'Monthly Coaching Fee',
            'code' => 'FEE-MON',
            'default_amount' => 2500.00,
            'description' => 'Monthly tuition fee for active course',
        ]);

        $invoice1 = FeeInvoice::create([
            'invoice_no' => 'INV-2026-0001',
            'student_id' => $student1->id,
            'fee_type_id' => $feeTypeAdmission->id,
            'title' => 'Admission & 1st Month Tuition',
            'amount' => 5500.00,
            'discount' => 500.00,
            'net_amount' => 5000.00,
            'paid_amount' => 5000.00,
            'due_amount' => 0.00,
            'due_date' => '2026-01-10',
            'status' => 'paid',
        ]);

        $payment1 = FeePayment::create([
            'receipt_no' => 'RCP-2026-0001',
            'student_id' => $student1->id,
            'invoice_id' => $invoice1->id,
            'paid_amount' => 5000.00,
            'discount_amount' => 500.00,
            'payment_method' => 'bKash',
            'previous_due' => 5000.00,
            'remaining_due' => 0.00,
            'payment_date' => '2026-01-05',
            'collected_by' => $accountantUser->id,
            'remarks' => 'bKash TrxID: 9A8B7C6D5E',
        ]);

        $invoice2 = FeeInvoice::create([
            'invoice_no' => 'INV-2026-0002',
            'student_id' => $student2->id,
            'fee_type_id' => $feeTypeMonthly->id,
            'title' => 'August 2026 Monthly Tuition Fee',
            'amount' => 2500.00,
            'discount' => 0.00,
            'net_amount' => 2500.00,
            'paid_amount' => 1000.00,
            'due_amount' => 1500.00,
            'due_date' => '2026-08-10',
            'status' => 'partial',
        ]);

        $payment2 = FeePayment::create([
            'receipt_no' => 'RCP-2026-0002',
            'student_id' => $student2->id,
            'invoice_id' => $invoice2->id,
            'paid_amount' => 1000.00,
            'discount_amount' => 0.00,
            'payment_method' => 'Cash',
            'previous_due' => 2500.00,
            'remaining_due' => 1500.00,
            'payment_date' => '2026-08-02',
            'collected_by' => $accountantUser->id,
            'remarks' => 'Partial cash payment',
        ]);

        // 12. Operational Income & Expense (Strictly no salary/payroll)
        OperationalIncome::create([
            'income_no' => 'INC-2026-0001',
            'category' => 'Admission Fee',
            'title' => 'Student Admission Collection',
            'amount' => 5000.00,
            'income_date' => '2026-01-05',
            'payment_method' => 'bKash',
            'source' => 'Student RCP-2026-0001',
            'notes' => 'Admission collection for Arafat Hassan',
            'created_by' => $accountantUser->id,
        ]);

        OperationalExpense::create([
            'expense_no' => 'EXP-2026-0001',
            'category' => 'Rent',
            'title' => 'Coaching Premises Monthly Rent',
            'amount' => 35000.00,
            'expense_date' => '2026-08-01',
            'payment_method' => 'Bank',
            'notes' => 'Banani Campus 2nd Floor Rent',
            'receipt_ref' => 'RENT-AUG-2026',
            'created_by' => $managerUser->id,
        ]);

        OperationalExpense::create([
            'expense_no' => 'EXP-2026-0002',
            'category' => 'Electricity',
            'title' => 'DESCO Utility Bill',
            'amount' => 8400.00,
            'expense_date' => '2026-08-03',
            'payment_method' => 'bKash',
            'notes' => 'Electricity bill for July 2026',
            'receipt_ref' => 'DESCO-987654',
            'created_by' => $managerUser->id,
        ]);

        // 13. Exam & Results
        $exam1 = Exam::create([
            'title' => 'Monthly Physics Evaluation Test-1',
            'course_id' => $courseHSC->id,
            'batch_id' => $batchAlpha->id,
            'exam_date' => '2026-07-25',
            'total_marks' => 100.00,
            'pass_marks' => 40.00,
            'status' => 'published',
        ]);

        Mark::create([
            'exam_id' => $exam1->id,
            'subject_id' => $subjPhysics->id,
            'student_id' => $student1->id,
            'obtained_marks' => 92.00,
            'is_absent' => false,
            'remarks' => 'Outstanding performance!',
        ]);

        Result::create([
            'exam_id' => $exam1->id,
            'student_id' => $student1->id,
            'total_marks' => 100.00,
            'obtained_marks' => 92.00,
            'percentage' => 92.00,
            'grade' => 'A+',
            'gpa' => 5.00,
            'pass_status' => 'pass',
        ]);

        // 14. Assignments & Materials
        $assignment1 = Assignment::create([
            'title' => 'Vector Physics & Kinematics Problem Set',
            'batch_id' => $batchAlpha->id,
            'subject_id' => $subjPhysics->id,
            'teacher_id' => $teacher1->id,
            'description' => 'Solve problems 1 through 15 from Chapter 3 problem book.',
            'due_date' => '2026-08-18 23:59:59',
            'max_marks' => 50.00,
        ]);

        AssignmentSubmission::create([
            'assignment_id' => $assignment1->id,
            'student_id' => $student1->id,
            'submission_text' => 'Here are my worked out solutions for Vector Problems.',
            'marks_obtained' => 48.00,
            'feedback' => 'Great step-by-step vector algebra work!',
            'status' => 'reviewed',
            'submitted_at' => '2026-08-10 14:30:00',
        ]);

        StudyMaterial::create([
            'title' => 'HSC Physics Vector Lecture Notes PDF',
            'course_id' => $courseHSC->id,
            'batch_id' => $batchAlpha->id,
            'subject_id' => $subjPhysics->id,
            'file_type' => 'PDF',
            'link_url' => 'https://example.com/vector-notes.pdf',
            'description' => 'Comprehensive hand-written notes on Vector Dot & Cross Products.',
            'uploaded_by' => $teacherUser1->id,
        ]);

        // 15. Notices
        Notice::create([
            'title' => 'Weekly Model Test Schedule Announcement',
            'content' => 'All HSC 2026 students are hereby informed that the upcoming weekly Physics Model Test will take place this Friday at 10:00 AM.',
            'target_role' => 'all',
            'course_id' => $courseHSC->id,
            'batch_id' => $batchAlpha->id,
            'category' => 'Exam',
            'priority' => 'high',
            'published_at' => date('Y-m-d H:i:s'),
            'created_by' => $adminUser->id,
        ]);

        // 16. Activity Log
        ActivityLog::create([
            'user_id' => $adminUser->id,
            'user_name' => 'Super Admin',
            'user_role' => 'super_admin',
            'action' => 'System Initialized',
            'module' => 'System',
            'description' => 'Operational Coaching Center Management System fully configured and seeded.',
            'ip_address' => '127.0.0.1',
        ]);
    }
}
