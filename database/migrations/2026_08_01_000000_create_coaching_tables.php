<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Courses
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('code')->unique();
            $table->decimal('fee', 10, 2)->default(0);
            $table->string('duration')->nullable(); // e.g. "6 Months", "1 Year"
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 2. Subjects
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 3. Teacher Profiles
        Schema::create('teacher_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('teacher_id')->unique();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('qualification')->nullable();
            $table->string('designation')->nullable();
            $table->string('specialization')->nullable();
            $table->text('address')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 4. Batches
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->onDelete('set null');
            $table->foreignId('teacher_id')->nullable()->constrained('teacher_profiles')->onDelete('set null');
            $table->string('room')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('class_days')->nullable(); // JSON or comma separated: "Mon,Wed,Fri"
            $table->string('class_time')->nullable(); // "10:00 AM - 11:30 AM"
            $table->integer('max_students')->default(40);
            $table->enum('status', ['active', 'completed', 'upcoming', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 5. Guardian Profiles
        Schema::create('guardian_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('guardian_id')->unique();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('occupation')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // 6. Student Profiles
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('student_id')->unique();
            $table->string('name');
            $table->string('photo')->nullable();
            $table->date('dob')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->default('male');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->foreignId('guardian_id')->nullable()->constrained('guardian_profiles')->onDelete('set null');
            $table->string('school_college')->nullable();
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('set null');
            $table->foreignId('batch_id')->nullable()->constrained('batches')->onDelete('set null');
            $table->date('admission_date')->nullable();
            $table->enum('status', ['active', 'inactive', 'passed_out', 'dropped'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 7. Class Routines
        Schema::create('class_routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->onDelete('set null');
            $table->foreignId('teacher_id')->nullable()->constrained('teacher_profiles')->onDelete('set null');
            $table->string('room')->nullable();
            $table->date('class_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', ['scheduled', 'completed', 'rescheduled', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 8. Attendance
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->foreignId('class_routine_id')->nullable()->constrained('class_routines')->onDelete('set null');
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'late', 'leave'])->default('present');
            $table->string('remark')->nullable();
            $table->timestamps();
        });

        // 9. Fee Types
        Schema::create('fee_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->decimal('default_amount', 10, 2)->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 10. Fee Invoices
        Schema::create('fee_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('fee_type_id')->nullable()->constrained('fee_types')->onDelete('set null');
            $table->string('title');
            $table->decimal('amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('net_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('due_amount', 10, 2);
            $table->date('due_date')->nullable();
            $table->enum('status', ['paid', 'partial', 'unpaid'])->default('unpaid');
            $table->timestamps();
        });

        // 11. Fee Payments / Receipts
        Schema::create('fee_payments', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_no')->unique();
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('invoice_id')->nullable()->constrained('fee_invoices')->onDelete('set null');
            $table->decimal('paid_amount', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('payment_method')->default('Cash'); // Cash, bKash, Nagad, Bank, Online
            $table->decimal('previous_due', 10, 2)->default(0);
            $table->decimal('remaining_due', 10, 2)->default(0);
            $table->date('payment_date');
            $table->foreignId('collected_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        // 12. Operational Expenses (Strictly Operational - No HR Salary)
        Schema::create('operational_expenses', function (Blueprint $table) {
            $table->id();
            $table->string('expense_no')->unique();
            $table->string('category'); // Rent, Electricity, Internet, Stationery, Marketing, Equipment, Maintenance, Other
            $table->string('title');
            $table->decimal('amount', 10, 2);
            $table->date('expense_date');
            $table->string('payment_method')->default('Cash');
            $table->text('notes')->nullable();
            $table->string('receipt_ref')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 13. Operational Incomes
        Schema::create('operational_incomes', function (Blueprint $table) {
            $table->id();
            $table->string('income_no')->unique();
            $table->string('category'); // Admission Fee, Monthly Fee, Course Fee, Exam Fee, Other
            $table->string('title');
            $table->decimal('amount', 10, 2);
            $table->date('income_date');
            $table->string('payment_method')->default('Cash');
            $table->string('source')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 14. Exams
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('set null');
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->date('exam_date');
            $table->decimal('total_marks', 8, 2)->default(100);
            $table->decimal('pass_marks', 8, 2)->default(40);
            $table->enum('status', ['upcoming', 'ongoing', 'published', 'completed'])->default('upcoming');
            $table->timestamps();
        });

        // 15. Marks
        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->onDelete('set null');
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->decimal('obtained_marks', 8, 2)->default(0);
            $table->boolean('is_absent')->default(false);
            $table->string('remarks')->nullable();
            $table->timestamps();
        });

        // 16. Results
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->decimal('total_marks', 8, 2);
            $table->decimal('obtained_marks', 8, 2);
            $table->decimal('percentage', 5, 2);
            $table->string('grade'); // A+, A, A-, B, C, D, F
            $table->decimal('gpa', 3, 2); // 5.00 scale
            $table->enum('pass_status', ['pass', 'fail'])->default('pass');
            $table->timestamps();
        });

        // 17. Assignments
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->onDelete('set null');
            $table->foreignId('teacher_id')->nullable()->constrained('teacher_profiles')->onDelete('set null');
            $table->text('description')->nullable();
            $table->string('attachment_url')->nullable();
            $table->dateTime('due_date');
            $table->decimal('max_marks', 8, 2)->default(100);
            $table->timestamps();
        });

        // 18. Assignment Submissions
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->string('submission_file')->nullable();
            $table->text('submission_text')->nullable();
            $table->decimal('marks_obtained', 8, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->enum('status', ['submitted', 'reviewed', 'late'])->default('submitted');
            $table->dateTime('submitted_at');
            $table->timestamps();
        });

        // 19. Study Materials
        Schema::create('study_materials', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('set null');
            $table->foreignId('batch_id')->nullable()->constrained('batches')->onDelete('set null');
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->onDelete('set null');
            $table->string('file_path')->nullable();
            $table->string('file_type')->nullable(); // PDF, Note, Document, Image, Video, Link
            $table->string('link_url')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 20. Notices
        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('target_role')->default('all'); // all, course, batch, teachers, guardians, students
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('cascade');
            $table->foreignId('batch_id')->nullable()->constrained('batches')->onDelete('cascade');
            $table->string('category')->default('Announcement'); // Exam, Holiday, Cancellation, Routine change, Fee reminder, Announcement
            $table->string('priority')->default('normal'); // high, normal, low
            $table->dateTime('published_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 21. Activity Logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('user_name')->nullable();
            $table->string('user_role')->nullable();
            $table->string('action'); // Student Added, Fee Collected, etc.
            $table->string('module')->nullable();
            $table->text('description')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });

        // 22. Role Permissions Matrix
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('role')->unique();
            $table->json('permissions');
            $table->timestamps();
        });

        // 23. Backup Logs
        Schema::create('backups', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('file_size');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('backups');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('notices');
        Schema::dropIfExists('study_materials');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('results');
        Schema::dropIfExists('marks');
        Schema::dropIfExists('exams');
        Schema::dropIfExists('operational_incomes');
        Schema::dropIfExists('operational_expenses');
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('fee_invoices');
        Schema::dropIfExists('fee_types');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('class_routines');
        Schema::dropIfExists('student_profiles');
        Schema::dropIfExists('guardian_profiles');
        Schema::dropIfExists('batches');
        Schema::dropIfExists('teacher_profiles');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('courses');
    }
};
