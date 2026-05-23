<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::query()
            ->select(['id', 'name', 'price', 'discount_price'])
            ->where('status', 1)
            ->inRandomOrder()
            ->limit(80)
            ->get();

        if ($products->isEmpty()) {
            $this->command?->warn('OrderSeeder skipped: no active products found.');

            return;
        }

        DB::transaction(function () use ($products): void {
            $this->clearExistingSeedOrders();

            $customers = $this->seedCustomers();
            $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            $paidStatuses = ['processing', 'shipped', 'delivered'];
            $paymentProfiles = [
                ['method' => 'cod', 'status' => 'pending'],
                ['method' => 'bkash', 'status' => 'completed'],
                ['method' => 'nagad', 'status' => 'completed'],
                ['method' => 'sslcommerz', 'status' => 'completed'],
                ['method' => 'stripe', 'status' => 'completed'],
                ['method' => 'card', 'status' => 'failed'],
                ['method' => 'bkash', 'status' => 'refunded'],
            ];

            for ($index = 1; $index <= 30; $index++) {
                $customer = $customers->random();
                $address = $customer->addresses->first();
                $items = $products->random(random_int(1, min(4, $products->count())));

                $subtotal = 0;
                $orderItems = [];

                foreach ($items as $product) {
                    $quantity = random_int(1, 3);
                    $price = (float) ($product->discount_price ?: $product->price);
                    $lineTotal = $price * $quantity;
                    $subtotal += $lineTotal;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'quantity' => $quantity,
                        'price' => $price,
                        'total' => $lineTotal,
                    ];
                }

                $discount = $index % 5 === 0 ? round($subtotal * 0.05, 2) : 0;
                $shippingCost = $subtotal >= 50000 ? 0 : 120;
                $totalAmount = $subtotal - $discount + $shippingCost;
                $payment = $paymentProfiles[array_rand($paymentProfiles)];
                $status = $payment['status'] === 'completed'
                    ? $paidStatuses[array_rand($paidStatuses)]
                    : $statuses[array_rand($statuses)];

                if ($payment['status'] === 'failed') {
                    $status = 'pending';
                }

                if ($payment['status'] === 'refunded') {
                    $status = 'cancelled';
                }

                $order = Order::create([
                    'user_id' => $customer->id,
                    'order_number' => sprintf('SEED-ORD-%05d', $index),
                    'shipping_name' => $address?->name ?: $customer->name,
                    'shipping_email' => $customer->email,
                    'shipping_phone' => $customer->phone,
                    'shipping_address' => $address?->address ?: 'House 12, Road 8',
                    'shipping_upazila' => $address?->area ?: 'Dhanmondi',
                    'shipping_district' => $address?->city ?: 'Dhaka',
                    'subtotal' => $subtotal,
                    'discount' => $discount,
                    'shipping_cost' => $shippingCost,
                    'total_amount' => $totalAmount,
                    'status' => $status,
                    'shipping_address_id' => $address?->id,
                    'order_notes' => $index % 4 === 0 ? 'Please call before delivery.' : null,
                    'created_at' => now()->subDays(30 - $index),
                    'updated_at' => now()->subDays(30 - $index),
                ]);

                foreach ($orderItems as $item) {
                    OrderItem::create([
                        ...$item,
                        'order_id' => $order->id,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->updated_at,
                    ]);
                }

                Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => $payment['method'],
                    'transaction_id' => $payment['status'] === 'pending'
                        ? null
                        : strtoupper($payment['method']).'-'.Str::upper(Str::random(10)),
                    'amount' => $totalAmount,
                    'status' => $payment['status'],
                    'payment_details' => json_encode([
                        'source' => 'database_seeder',
                        'gateway' => $payment['method'],
                        'order_number' => $order->order_number,
                    ]),
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                ]);
            }
        });

        $this->command?->info('Seeded 30 orders with order items and payments.');
    }

    private function clearExistingSeedOrders(): void
    {
        Order::query()
            ->where('order_number', 'like', 'SEED-ORD-%')
            ->delete();
    }

    private function seedCustomers()
    {
        $customers = collect([
            [
                'name' => 'Demo User',
                'email' => 'mamon193p@gmail.com',
                'phone' => '01800000000',
                'address' => '123 Tech Avenue, Sector 7',
                'city' => 'Dhaka',
                'area' => 'Uttara',
            ],
            [
                'name' => 'Nusrat Jahan',
                'email' => 'nusrat.customer@getitmoving.com',
                'phone' => '01810000001',
                'address' => 'House 22, Road 4, Block C',
                'city' => 'Dhaka',
                'area' => 'Banani',
            ],
            [
                'name' => 'Sabbir Ahmed',
                'email' => 'sabbir.customer@getitmoving.com',
                'phone' => '01810000002',
                'address' => 'Flat 5B, Green View Tower',
                'city' => 'Chattogram',
                'area' => 'Agrabad',
            ],
            [
                'name' => 'Maliha Rahman',
                'email' => 'maliha.customer@getitmoving.com',
                'phone' => '01810000003',
                'address' => 'House 9, Shahjalal Uposhohor',
                'city' => 'Sylhet',
                'area' => 'Uposhohor',
            ],
            [
                'name' => 'Tanvir Hasan',
                'email' => 'tanvir.customer@getitmoving.com',
                'phone' => '01810000004',
                'address' => 'Holding 41, New Market Road',
                'city' => 'Khulna',
                'area' => 'Sonadanga',
            ],
        ]);

        return $customers->map(function (array $customer): User {
            $user = User::updateOrCreate(
                ['email' => $customer['email']],
                [
                    'name' => $customer['name'],
                    'password' => Hash::make('user123'),
                    'user_type' => 'user',
                    'phone' => $customer['phone'],
                    'is_verified' => true,
                    'email_verified_at' => now(),
                    'verified_at' => now(),
                    'terms_accepted_at' => now(),
                ]
            );

            Address::updateOrCreate(
                ['user_id' => $user->id, 'type' => 'Home'],
                [
                    'name' => $customer['name'],
                    'address' => $customer['address'],
                    'city' => $customer['city'],
                    'area' => $customer['area'],
                    'post_code' => '1207',
                    'is_primary' => true,
                ]
            );

            return $user->load('addresses');
        });
    }
}
