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
        // 1. Events Table
        if (!Schema::hasTable('events')) {
            Schema::create('events', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('description');
                $table->string('image')->nullable();
                $table->date('date');
                $table->string('time')->nullable();
                $table->string('location')->nullable();
                $table->string('contact_person')->nullable();
                $table->string('contact_phone')->nullable();
                $table->string('registration_required')->default('no');
                $table->date('registration_deadline')->nullable();
                $table->string('color')->default('rose');
                $table->enum('status', ['published', 'pending', 'draft'])->default('published');
                $table->timestamps();
            });
        }

        // 2. Galleries Table
        if (!Schema::hasTable('galleries')) {
            Schema::create('galleries', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('category')->default('Activities');
                $table->string('image');
                $table->integer('sort_order')->default(0);
                $table->enum('status', ['published', 'draft'])->default('published');
                $table->timestamps();
            });
        }

        // 3. Testimonials (Student Success Stories) Table
        if (!Schema::hasTable('testimonials')) {
            Schema::create('testimonials', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('batch')->nullable();
                $table->string('institution')->nullable();
                $table->string('badge')->nullable();
                $table->text('quote');
                $table->string('image')->nullable();
                $table->string('initials')->nullable();
                $table->string('color')->nullable();
                $table->integer('sort_order')->default(0);
                $table->enum('status', ['published', 'draft'])->default('published');
                $table->timestamps();
            });
        }

        // 4. Important Links Table
        if (!Schema::hasTable('important_links')) {
            Schema::create('important_links', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('url')->nullable();
                $table->boolean('is_active')->default(true);
                $table->integer('order')->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('important_links');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('galleries');
        Schema::dropIfExists('events');
    }
};

