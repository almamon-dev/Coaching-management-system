<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subject_teacher', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // The Teacher
            $table->foreignId('academic_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_teacher');
    }
};
