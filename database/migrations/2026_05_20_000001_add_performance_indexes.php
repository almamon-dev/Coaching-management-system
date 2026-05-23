<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // product_images: compound index for primaryImage eager load
        Schema::table('product_images', function (Blueprint $table) {
            $table->index(['product_id', 'is_primary'], 'product_images_product_id_is_primary_index');
        });

        // product_categories: reverse index so we can filter products by category fast
        Schema::table('product_categories', function (Blueprint $table) {
            $table->index(['category_id', 'product_id'], 'product_categories_category_product_index');
        });



        // products: composite index for status + created_at (default sort)
        Schema::table('products', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'products_status_created_at_index');
            $table->index(['status', 'price'], 'products_status_price_index');
            $table->index(['brand_id', 'status'], 'products_brand_status_index');
            $table->index('is_featured', 'products_is_featured_index');
        });
    }

    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->dropIndex('product_images_product_id_is_primary_index');
        });
        Schema::table('product_categories', function (Blueprint $table) {
            $table->dropIndex('product_categories_category_product_index');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_status_created_at_index');
            $table->dropIndex('products_status_price_index');
            $table->dropIndex('products_brand_status_index');
            $table->dropIndex('products_is_featured_index');
        });
    }
};
