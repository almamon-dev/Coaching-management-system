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
        Schema::create('academic_resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['routine', 'calendar', 'syllabus', 'other'])->default('other');
            $table->foreignId('academic_class_id')->nullable()->constrained('academic_classes')->nullOnDelete();
            $table->string('year')->nullable();
            $table->string('file_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_resources');
    }
};
