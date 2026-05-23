<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderReturn;
use Illuminate\Database\Seeder;

class OrderReturnSeeder extends Seeder
{
    public function run(): void
    {
        // Clean up any return requests for the main test order SEED-ORD-00016 to keep it fresh for manual testing
        OrderReturn::whereHas('order', function ($query) {
            $query->where('order_number', 'SEED-ORD-00016');
        })->delete();

        // Get seeded orders with items and user (excluding SEED-ORD-00016 and only taking delivered orders)
        $orders = Order::with(['items', 'user'])
            ->where('order_number', 'like', 'SEED-ORD-%')
            ->where('order_number', '!=', 'SEED-ORD-00016')
            ->where('status', 'delivered')
            ->get();

        if ($orders->isEmpty()) {
            $this->command?->warn('OrderReturnSeeder skipped: no seeded orders found.');
            return;
        }

        // We will seed returns for 3 random delivered orders, leaving others clean for testing
        $selectedOrders = $orders->shuffle()->take(3);
        $reasons = ['Defective', 'Damaged', 'Incorrect Item', 'Wrong Size', 'Not as Described'];
        $statuses = ['pending', 'approved', 'received', 'refunded', 'rejected'];
        $details = [
            'The item screen had scratches upon opening.',
            'The delivery box was dented and the charging port does not work.',
            'Received a different model than the one ordered.',
            'The size was too small and not fitting properly.',
            'Product color does not match the product image displayed online.'
        ];

        foreach ($selectedOrders as $index => $order) {
            if ($order->items->isEmpty()) {
                continue;
            }

            // Seed return requests for a random subset of items in the order
            $itemsToReturn = $order->items->shuffle()->take(rand(1, $order->items->count()));

            foreach ($itemsToReturn as $itemIndex => $item) {
                $status = $statuses[($index + $itemIndex) % count($statuses)];
                $reason = $reasons[($index + $itemIndex) % count($reasons)];
                $detail = $details[($index + $itemIndex) % count($details)];

                $resolvedAt = in_array($status, ['refunded', 'rejected', 'received'], true) ? now()->subDays(rand(1, 5)) : null;
                $adminNote = in_array($status, ['approved', 'received', 'refunded', 'rejected'], true) 
                    ? 'Processed return request. Action: ' . ucfirst($status) . '.'
                    : null;

                OrderReturn::updateOrCreate(
                    ['order_item_id' => $item->id, 'user_id' => $order->user_id],
                    [
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'quantity' => rand(1, $item->quantity),
                        'reason' => $reason,
                        'details' => $detail,
                        'status' => $status,
                        'admin_note' => $adminNote,
                        'requested_at' => now()->subDays(rand(6, 12)),
                        'resolved_at' => $resolvedAt,
                        'created_at' => now()->subDays(rand(6, 12)),
                        'updated_at' => now()->subDays(rand(1, 5)),
                    ]
                );
            }
        }

        $this->command?->info('Seeded order return requests.');
    }
}
