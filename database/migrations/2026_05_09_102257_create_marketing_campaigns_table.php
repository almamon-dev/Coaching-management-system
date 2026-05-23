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
        Schema::create('marketing_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // coupon, brochure
            $table->string('title');
            $table->string('code')->nullable();
            $table->string('discount_type')->nullable(); // fixed, percentage
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->decimal('min_purchase', 10, 2)->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->string('file_path')->nullable();
            $table->string('thumbnail')->nullable();
            $table->integer('download_count')->default(0);
            $table->boolean('status')->default(true);
            $table->string('applies_to')->default('all');
            $table->json('target_ids')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketing_campaigns');
    }
};
