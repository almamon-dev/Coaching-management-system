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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('image')->nullable();
            $table->date('date');
            $table->time('time')->nullable();
            $table->string('location');
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->enum('registration_required', ['yes', 'no'])->default('no');
            $table->date('registration_deadline')->nullable();
            $table->enum('status', ['published', 'draft', 'pending'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
