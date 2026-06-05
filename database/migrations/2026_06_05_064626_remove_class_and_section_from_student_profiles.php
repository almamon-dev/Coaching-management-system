<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropForeign(['academic_class_id']);
            $table->dropForeign(['section_id']);
            $table->dropColumn(['academic_class_id', 'section_id', 'roll_number']);
        });
    }

    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->foreignId('academic_class_id')->nullable()->constrained('academic_classes')->onDelete('set null');
            $table->foreignId('section_id')->nullable()->constrained('sections')->onDelete('set null');
            $table->string('roll_number')->nullable();
        });
    }
};
