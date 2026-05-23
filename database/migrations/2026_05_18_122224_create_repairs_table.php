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
        Schema::create('repairs', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique(); // E.g. REP-2026-0001
            
            // Relationships
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Customer
            $table->foreignId('technician_id')->nullable()->constrained('users')->onDelete('set null'); // Technician
            
            // Purchased Device vs Custom Device Flag
            $table->boolean('is_purchased_device')->default(false);
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null'); // Purchased product reference
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');       // Order reference
            
            // Device Details (Filled manually if custom device, or cached/copied from product details if purchased)
            $table->string('device_type')->nullable(); // Laptop, Phone, Tablet, etc.
            $table->string('brand')->nullable();       // Apple, Asus, HP, etc.
            $table->string('model_name')->nullable();  // iPhone 14 Pro, Zenbook 14, etc.
            $table->string('serial_number')->nullable();
            
            // Issue & Notes
            $table->text('issue_description')->nullable();
            $table->text('diagnostics_notes')->nullable();
            $table->text('customer_notes')->nullable();
            
            // Kiosk Retail Store Columns
            $table->string('token_number')->nullable(); // E.g. T-102
            $table->string('counter_name')->nullable(); // E.g. Counter 1, Counter 2
            
            // Cost & Payments
            $table->decimal('service_charge', 10, 2)->default(0.00); // Labor Cost
            $table->decimal('parts_cost', 10, 2)->default(0.00);     // Total cost of spare parts
            $table->decimal('total_cost', 10, 2)->default(0.00);     // service_charge + parts_cost
            $table->boolean('is_paid')->default(false);
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('unpaid');     // unpaid, paid
            
            // Statuses
            $table->string('status')->default('pending');
            // pending, approved, diagnosing, awaiting_quote, repairing, testing, ready, completed, cancelled
            
            // Logistics & Warranty
            $table->string('pickup_method')->default('drop_off'); // drop_off, courier
            $table->text('shipping_address')->nullable();
            $table->string('tracking_number')->nullable(); // Courier tracking ID
            $table->timestamp('warranty_ends_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repairs');
    }
};
