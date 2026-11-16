<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('batch_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('cascade');
            $table->decimal('monthly_fee', 10, 2)->default(0);
            $table->string('roll_number', 50)->nullable();
            $table->enum('status', ['active', 'dropped', 'completed'])->default('active');
            $table->date('enrolled_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'batch_id']);
        });

        // Migrate existing students into batch_student table
        $students = DB::table('student_profiles')
            ->whereNotNull('batch_id')
            ->get();

        foreach ($students as $student) {
            $batch = DB::table('batches')->where('id', $student->batch_id)->first();
            $course = $batch ? DB::table('courses')->where('id', $batch->course_id)->first() : null;
            $fee = $course ? (float)$course->fee : 0;

            DB::table('batch_student')->insertOrIgnore([
                'student_id' => $student->id,
                'batch_id' => $student->batch_id,
                'course_id' => $student->course_id ?? ($batch ? $batch->course_id : null),
                'monthly_fee' => $fee,
                'status' => 'active',
                'enrolled_at' => $student->admission_date ?? date('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_student');
    }
};
