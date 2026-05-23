<?php

namespace Database\Seeders;

use App\Models\Offer;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate existing offers first
        Offer::truncate();

        // 1. Eid Utshob Offer
        Offer::create([
            'title' => 'Eid Utshob',
            'slug' => 'eid-utshob',
            'description' => 'Get Amazing Discount, Bkash Caseback, and Free Home Delivery on Eid Utshob!',
            'image' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=85',
            'start_date' => Carbon::parse('2026-05-13'),
            'end_date' => Carbon::parse('2026-05-27'),
            'store_type' => 'Online',
            'status' => true,
            'details' => '<p>Celebrate this festive season with our Eid Utshob deals! Enjoy up to 80,000 BDT discount on laptops, desktops, and gaming rigs.</p><ul><li>Up to ৳80,000 instant discount on selected premium products.</li><li>Free home delivery nationwide on selected online orders.</li><li>Exclusive ৳1,000 instant cashback with bKash online payment.</li><li>0% EMI facilities up to 12 months with leading credit cards.</li></ul><p>Grab the best deals of the season and upgrade your tech game! Offer valid till 27th May 2026.</p>',
        ]);

        // 2. bKash Cashback Offer
        Offer::create([
            'title' => 'bKash 1000tk Cashback Offer!',
            'slug' => 'bkash-1000tk-cashback-offer',
            'description' => 'Get 1000tk Instant bKash Cashback on Online Payment !',
            'image' => 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=85',
            'start_date' => Carbon::parse('2026-05-05'),
            'end_date' => Carbon::parse('2026-05-31'),
            'store_type' => 'Online',
            'status' => true,
            'details' => '<p>Make your online shopping even more rewarding! Pay with bKash on our website and get up to ৳1,000 instant cashback on your purchases.</p><ul><li>Get instant cashback on minimum transactions.</li><li>Applicable for online payments only through the checkout gateway.</li><li>Cashback amount will be credited directly to your bKash wallet.</li><li>Offer valid on selected product categories including Laptop, Component, and Monitor.</li></ul><p>Shop now and enjoy easy payment with maximum benefits! Offer valid till 31st May 2026.</p>',
        ]);

        // 3. Deep Freezer Deal
        Offer::create([
            'title' => 'Deep Freezer Deal',
            'slug' => 'deep-freezer-deal',
            'description' => 'Enjoy Exciting Discounts on Selected Refrigerator!',
            'image' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=85',
            'start_date' => Carbon::parse('2026-05-05'),
            'end_date' => Carbon::parse('2026-05-31'),
            'store_type' => 'All Outlet',
            'status' => true,
            'details' => '<p>Looking to upgrade your home appliances? Our Deep Freezer Deal is here with massive discounts on selected refrigerators and deep freezers from top brands.</p><ul><li>Enjoy up to 30% discount on selected models.</li><li>0% interest EMI options available at all retail outlets.</li><li>Official manufacturer warranty and free installation service included.</li><li>Exchange offer: Trade in your old appliance and get additional discounts.</li></ul><p>Visit any of our physical outlets today to explore the deals in person! Offer valid till 31st May 2026.</p>',
        ]);
    }
}
