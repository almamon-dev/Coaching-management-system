<?php

namespace App\Services\Frontend;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function placeOrder(array $data)
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'];

            $subtotal = collect($items)->reduce(fn($acc, $item) => $acc + ($item['price'] * $item['quantity']), 0);

            $shippingCost = 0;
            if ($data['deliveryMethod'] === 'home') {
                $shippingCost = 200;
            } elseif ($data['deliveryMethod'] === 'express') {
                $shippingCost = 300;
            }

            $total = $subtotal + $shippingCost;

            // 2. Create the order using dynamic prefix
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => \App\Support\Generators\NumberGenerator::generate('order_prefix', 'ORD-', 10),
                
                // Customer Shipping Snapshot
                'shipping_name' => $data['firstName'] . ' ' . $data['lastName'],
                'shipping_email' => $data['email'],
                'shipping_phone' => $data['mobile'],
                'shipping_address' => $data['address'],
                'shipping_upazila' => $data['upazila'] ?? null,
                'shipping_district' => $data['district'],

                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total_amount' => $total,
                'status' => 'pending',
                'order_notes' => $data['comment'] ?? null,
                'shipping_address_id' => null,
            ]);

            // 2. Create Order Items
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['price'] * $item['quantity'],
                ]);
            }

            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $data['paymentMethod'],
                'amount' => $total,
                'status' => 'pending',
            ]);

            // 4. Send Notifications
            $user = auth()->user();
            $user->notify(new \App\Notifications\OrderPlacedNotification($order));

            // Notify Admins
            $admins = \App\Models\User::where('user_type', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\OrderPlacedNotification($order));
            }

            return $order;
        });
    }
}
