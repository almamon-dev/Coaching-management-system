<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('slug', 200)->unique();
            $table->string('sku', 100)->unique();
            $table->unsignedBigInteger('brand_id')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('sub_category_id')->nullable();
            $table->unsignedBigInteger('sub_sub_category_id')->nullable();
            $table->longText('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->enum('discount_type', ['fixed', 'percentage'])->nullable();
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->timestamp('discount_start_date')->nullable();
            $table->timestamp('discount_end_date')->nullable();
            $table->integer('stock')->default(0);
            $table->integer('view_count')->default(0);
            $table->string('warranty', 150)->nullable();
            $table->tinyInteger('status')->default(1);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            
            $table->foreign('brand_id')->references('id')->on('brands')->onDelete('set null');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('sub_category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('sub_sub_category_id')->references('id')->on('categories')->onDelete('set null');
            
            // Performance Indexes
            $table->index('price');
            $table->index('status');
            $table->index('brand_id');
            $table->index('category_id');
            $table->index('created_at');
        });
        DB::statement('ALTER TABLE products ADD FULLTEXT fulltext_index (name)');
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
