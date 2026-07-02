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
        Schema::create('fee_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // The student
            $table->foreignId('academic_class_id')->nullable()->constrained('academic_classes')->nullOnDelete();
            $table->foreignId('fee_group_id')->nullable()->constrained('fee_groups')->nullOnDelete();
            
            $table->string('invoice_number')->unique();
            $table->string('title')->comment('E.g. Class 10 Monthly Fee - January');
            
            $table->date('invoice_date');
            $table->date('due_date');
            
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('fine_amount', 10, 2)->default(0);
            
            $table->enum('status', ['unpaid', 'partial', 'paid', 'cancelled'])->default('unpaid');
            $table->text('note')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_invoices');
    }
};
