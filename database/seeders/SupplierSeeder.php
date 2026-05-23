<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Star Tech Ltd',
                'slug' => 'star-tech-ltd',
                'email' => 'sales@startech.com',
                'phone' => '+880 1234 567890',
                'address' => 'Dhaka, Bangladesh',
                'status' => 1,
                'brands' => ['HP', 'Dell', 'Asus', 'Gigabyte', 'MSI']
            ],
            [
                'name' => 'Global Brand Pvt Ltd',
                'slug' => 'global-brand-pvt-ltd',
                'email' => 'info@globalbrand.com.bd',
                'phone' => '+880 1711 000000',
                'address' => 'Motijheel, Dhaka',
                'status' => 1,
                'brands' => ['Asus', 'Adata', 'TwinMOS', 'G.Skill']
            ],
            [
                'name' => 'UCC Corporation',
                'slug' => 'ucc-corporation',
                'email' => 'support@ucc-bd.com',
                'phone' => '+880 1911 111111',
                'address' => 'Dhaka, Bangladesh',
                'status' => 1,
                'brands' => ['MSI', 'Transcend', 'Seagate', 'Western Digital']
            ],
            [
                'name' => 'Ryans Computers',
                'slug' => 'ryans-computers',
                'email' => 'sales@ryans.com',
                'phone' => '+880 1811 222222',
                'address' => 'Dhaka, Bangladesh',
                'status' => 1,
                'brands' => ['Lenovo', 'HP', 'Dell', 'Gigabyte']
            ],
            [
                'name' => 'Excel Technologies',
                'slug' => 'excel-technologies',
                'email' => 'info@excel.com.bd',
                'phone' => '+880 1611 333333',
                'address' => 'Dhaka, Bangladesh',
                'status' => 1,
                'brands' => ['Antec', 'Crucial', 'Lexar', 'PNY']
            ]
        ];
 
        foreach ($suppliers as $sData) {
            $brandNames = $sData['brands'];
            unset($sData['brands']);
 
            $supplier = \App\Models\Supplier::create($sData);
 
            $brandIds = \App\Models\Brand::whereIn('name', $brandNames)->pluck('id')->toArray();
            $supplier->brands()->attach($brandIds);
        }
    }
}
