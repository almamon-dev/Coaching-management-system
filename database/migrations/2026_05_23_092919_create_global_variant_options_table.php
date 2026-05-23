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
        Schema::create('global_variant_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('global_variant_id')->constrained('global_variants')->onDelete('cascade');
            $table->string('value'); // e.g., '250g', '500g'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('global_variant_options');
    }
};
