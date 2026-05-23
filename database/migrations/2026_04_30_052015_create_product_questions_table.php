<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('question');
            $table->text('answer')->nullable();
            $table->tinyInteger('status')->default(0); // 0: pending, 1: answered
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_questions');
    }
};
