<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Warehouse;
use Illuminate\Support\Str;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warehouses = [
            ['name' => 'Central Hub - New York', 'address' => '123 Manhattan Ave, New York, NY 10001', 'phone' => '+1-212-555-0101'],
            ['name' => 'West Coast Distribution', 'address' => '456 Sunset Blvd, Los Angeles, CA 90028', 'phone' => '+1-310-555-0202'],
            ['name' => 'Midwest Logistics Center', 'address' => '789 Wacker Dr, Chicago, IL 60601', 'phone' => '+1-312-555-0303'],
            ['name' => 'Texas Fulfillment Center', 'address' => '321 Commerce St, Dallas, TX 75201', 'phone' => '+1-214-555-0404'],
            ['name' => 'Florida Supply Chain', 'address' => '654 Ocean Dr, Miami, FL 33139', 'phone' => '+1-305-555-0505'],
            ['name' => 'Pacific Northwest Hub', 'address' => '987 Pike St, Seattle, WA 98101', 'phone' => '+1-206-555-0606'],
            ['name' => 'Atlanta Regional Depot', 'address' => '159 Peachtree St, Atlanta, GA 30303', 'phone' => '+1-404-555-0707'],
            ['name' => 'Denver High-Altitude Storage', 'address' => '753 Broadway, Denver, CO 80203', 'phone' => '+1-303-555-0808'],
            ['name' => 'Phoenix Sun Distribution', 'address' => '852 Central Ave, Phoenix, AZ 85004', 'phone' => '+1-602-555-0909'],
            ['name' => 'Boston Historic Warehouse', 'address' => '951 Boylston St, Boston, MA 02116', 'phone' => '+1-617-555-1010'],
            ['name' => 'San Francisco Tech Hub', 'address' => '357 Market St, San Francisco, CA 94105', 'phone' => '+1-415-555-1111'],
            ['name' => 'Las Vegas Strip Supply', 'address' => '147 Las Vegas Blvd, Las Vegas, NV 89109', 'phone' => '+1-702-555-1212'],
            ['name' => 'Philadelphia Liberty Depot', 'address' => '258 Chestnut St, Philadelphia, PA 19106', 'phone' => '+1-215-555-1313'],
            ['name' => 'Houston Space City Center', 'address' => '369 Main St, Houston, TX 77002', 'phone' => '+1-713-555-1414'],
            ['name' => 'Detroit Motor City Storage', 'address' => '741 Woodward Ave, Detroit, MI 48226', 'phone' => '+1-313-555-1515'],
        ];

        foreach ($warehouses as $index => $w) {
            Warehouse::create([
                'name' => $w['name'],
                'slug' => Str::slug($w['name']),
                'address' => $w['address'],
                'phone' => $w['phone'],
                'is_active' => ($index % 5 !== 0), // Mix of active/inactive
            ]);
        }
    }
}
