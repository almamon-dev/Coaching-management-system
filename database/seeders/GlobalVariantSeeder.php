<?php

namespace Database\Seeders;

use App\Models\GlobalVariant;
use App\Models\GlobalVariantOption;
use Illuminate\Database\Seeder;

class GlobalVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $variants = [
            [
                'name' => 'Color',
                'type' => 'radio',
                'status' => 1,
                'options' => [
                    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Silver', 'Gold', 
                    'Space Gray', 'Rose Gold', 'RoyalBlue', 'Neon Green', 'Brown', 'Gray', 
                    'Purple', 'Pink', 'Orange', 'Maroon', 'Navy Blue', 'Light Blue'
                ]
            ],
            [
                'name' => 'Size',
                'type' => 'select',
                'status' => 1,
                'options' => [
                   'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL','Free Size','Over Size'
                ]
            ],
          
            [
                'name' => 'Weight',
                'type' => 'select',
                'status' => 1,
                'options' => [
                    '50g', '100g', '200g', '250g', '500g', '750g', 
                    '1kg', '1.5kg', '2kg', '2.5kg', '3kg', '5kg', '10kg', '20kg', '25kg', '50kg',
                    '100ml', '250ml', '500ml', '1L', '2L', '5L'
                ]
            ],
        ];

        foreach ($variants as $variantData) {
            $options = $variantData['options'];
            unset($variantData['options']);

            $variant = GlobalVariant::firstOrCreate(
                ['name' => $variantData['name']],
                $variantData
            );

            foreach ($options as $optionValue) {
                GlobalVariantOption::firstOrCreate([
                    'global_variant_id' => $variant->id,
                    'value' => $optionValue
                ]);
            }
        }
    }
}
