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
        Schema::create('global_discounts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Eid Super Sale"
            $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('discount_value', 10, 2);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->enum('target_type', ['all', 'category', 'sub_category', 'sub_sub_category', 'brand'])->default('all');
            $table->unsignedBigInteger('target_id')->nullable(); // category_id, brand_id, etc.
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('global_discounts');
    }
};
