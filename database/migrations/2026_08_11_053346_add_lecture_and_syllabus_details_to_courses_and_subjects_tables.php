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
        Schema::table('courses', function (Blueprint $table) {
            $table->integer('total_lectures')->nullable()->after('duration');
            $table->integer('total_lessons')->nullable()->after('total_lectures');
            $table->text('syllabus_details')->nullable()->after('description');
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->integer('total_lectures')->nullable()->after('course_id');
            $table->integer('total_lessons')->nullable()->after('total_lectures');
            $table->text('syllabus_details')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['total_lectures', 'total_lessons', 'syllabus_details']);
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropColumn(['total_lectures', 'total_lessons', 'syllabus_details']);
        });
    }
};
