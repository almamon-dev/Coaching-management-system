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

            $user = auth()->user();
            
            // Handle Guest Checkout
            if (!$user) {
                // Check if user already exists
                $user = \App\Models\User::where('email', $data['email'])
                    ->orWhere('phone', $data['mobile'])
                    ->first();
                
                if (!$user) {
                    $plainPassword = \Illuminate\Support\Str::random(8);
                    
                    // Create new user for guest
                    $user = \App\Models\User::create([
                        'name' => $data['firstName'] . ' ' . $data['lastName'],
                        'email' => $data['email'],
                        'phone' => $data['mobile'],
                        'password' => \Illuminate\Support\Facades\Hash::make($plainPassword),
                        'user_type' => 'customer',
                        'status' => 'active',
                        'is_verified' => true,
                    ]);
                    
                    // Send Email with Password
                    try {
                        \Illuminate\Support\Facades\Mail::send('emails.welcome', ['user' => $user, 'password' => $plainPassword], function ($m) use ($user) {
                            $m->to($user->email)->subject('Welcome to DailyFresh - Your Account Details');
                        });
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::error('Failed to send welcome email: ' . $e->getMessage());
                    }
                    
                    // Log the new user in automatically
                    auth()->login($user);
                } else {
                    // Auto login if user exists but isn't logged in during checkout
                    auth()->login($user);
                }
            }

            // 2. Create the order using dynamic prefix
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => \App\Support\Generators\NumberGenerator::generate('order_prefix', 'ORD-', 10),
                
                // Customer Shipping Snapshot
                'shipping_name' => $data['firstName'] . ' ' . $data['lastName'],
                'shipping_email' => $data['email'],
                'shipping_phone' => $data['mobile'],
                'shipping_address' => $data['address'],
                'shipping_upazila' => $data['upazila'] ?? null,
                'shipping_district' => $data['district'],
                'shipping_zip_code' => $data['shipping_zip_code'] ?? null,
                'delivery_instructions' => $data['delivery_instructions'] ?? null,
                
                // Billing Info Snapshot
                'is_billing_same_as_shipping' => $data['is_billing_same_as_shipping'],
                'billing_name' => $data['is_billing_same_as_shipping'] ? ($data['firstName'] . ' ' . $data['lastName']) : ($data['billing_name'] ?? null),
                'billing_email' => $data['is_billing_same_as_shipping'] ? $data['email'] : ($data['billing_email'] ?? null),
                'billing_phone' => $data['is_billing_same_as_shipping'] ? $data['mobile'] : ($data['billing_phone'] ?? null),
                'billing_address' => $data['is_billing_same_as_shipping'] ? $data['address'] : ($data['billing_address'] ?? null),
                'billing_upazila' => $data['is_billing_same_as_shipping'] ? ($data['upazila'] ?? null) : ($data['billing_upazila'] ?? null),
                'billing_district' => $data['is_billing_same_as_shipping'] ? $data['district'] : ($data['billing_district'] ?? null),
                'billing_zip_code' => $data['is_billing_same_as_shipping'] ? ($data['shipping_zip_code'] ?? null) : ($data['billing_zip_code'] ?? null),
                
                // Professional B2B/Company fields
                'company_name' => $data['company_name'] ?? null,
                'vat_id' => $data['vat_id'] ?? null,

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
            if ($user && method_exists($user, 'notify')) {
                $user->notify(new \App\Notifications\OrderPlacedNotification($order));
            }

            // Notify Admins
            $admins = \App\Models\User::where('user_type', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\OrderPlacedNotification($order));
            }

            return $order;
        });
    }
}
