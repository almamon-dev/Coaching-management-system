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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. A+, A, B
            $table->decimal('grade_point', 3, 2); // e.g. 5.00, 4.00
            $table->decimal('min_mark', 5, 2); // e.g. 80.00
            $table->decimal('max_mark', 5, 2); // e.g. 100.00
            $table->string('remarks')->nullable(); // e.g. Excellent, Good
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
