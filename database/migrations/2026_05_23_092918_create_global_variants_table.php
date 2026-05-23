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
        Schema::create('global_variants', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Weight', 'Size'
            $table->string('type')->default('select'); // e.g., 'select', 'radio'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('global_variants');
    }
};
