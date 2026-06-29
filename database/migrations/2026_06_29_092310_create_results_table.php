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
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            
            $table->decimal('total_marks', 8, 2)->default(0);
            $table->decimal('gpa', 4, 2)->default(0);
            $table->string('grade')->nullable(); // e.g. A+, F
            $table->enum('status', ['Passed', 'Failed'])->default('Passed');
            
            $table->boolean('is_published')->default(false);
            $table->text('remarks')->nullable();
            
            $table->timestamps();

            // Unique constraint to prevent duplicate results for a student in an exam
            $table->unique(['exam_id', 'academic_class_id', 'section_id', 'student_id'], 'results_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
