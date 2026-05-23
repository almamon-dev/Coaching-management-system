<?php

namespace Database\Seeders;

use App\Models\AttributePreset;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AttributePresetSeeder extends Seeder
{
    public function run()
    {
        $presets = [
            [
                'name' => 'Desktop PC Specs',
                'slug' => 'desktop-pc-specs',
                'fields' => [
                    [
                        'name' => 'Processor',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Processor',
                        'options' => "Intel\nAMD\nApple",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'RAM',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select RAM Size',
                        'options' => "8 GB\n16 GB\n32 GB\n64 GB\n128 GB",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'SSD',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select SSD Capacity',
                        'options' => "256GB SSD\n512GB SSD\n1TB SSD\n2TB SSD",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Graphics',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Graphics Type',
                        'options' => "Shared / Integrated\nDedicated 4GB\nDedicated 6GB\nDedicated 8GB\nDedicated 12GB\nDedicated 16GB\nDedicated 32GB",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                ]
            ],
            [
                'name' => 'Laptop Specs',
                'slug' => 'laptop-specs',
                'fields' => [
                    [
                        'name' => 'Processor Type',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Processor Type',
                        'options' => "Intel\nAMD\nApple\nSnapdragon",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Processor Model',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Processor Model',
                        'options' => "Snapdragon X Plus\nIntel Core 3\nIntel Core 5\nIntel Core 7\nIntel Core 9\nSnapdragon X X1\nRyzen AI 9 HX 370\nRyzen AI 7\nRyzen AI 5",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Generation',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Generation',
                        'options' => "Intel 10th Gen\nIntel 11th Gen\nIntel 13th Gen\nIntel 12th Gen\nIntel 14th Gen\nRyzen 3000 Series\nRyzen 5000 Series\nRyzen 7000 Series\nRyzen 8000 Series",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Display Size',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Display Size',
                        'options' => "Below 13-inch\n13-Inch to 13.9-Inch\n14-Inch to 14.9-Inch\n15-Inch to 15.9-Inch\n16-Inch to 16.9-Inch\n17-Inch to 17.9-Inch",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Display Type',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Display Type',
                        'options' => "LED\nOLED",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'RAM Size',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select RAM Size',
                        'options' => "4 GB\n8 GB\n12 GB\n16 GB\n18 GB\n24 GB\n32 GB\n48 GB\n36 GB",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'RAM Type',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select RAM Type',
                        'options' => "DDR4\nDDR5",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'HDD',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select HDD',
                        'options' => "1 TB",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'SSD',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select SSD',
                        'options' => "256 GB\n512 GB\n1 TB\n2 TB\n4 TB",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Graphics',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Graphics',
                        'options' => "Shared / Integrated\nDedicated 4GB\nDedicated 6GB\nDedicated 8GB\nDedicated 12GB\nDedicated 16GB\nDedicated 24GB",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Operating System',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select OS',
                        'options' => "Free Dos\nWindows\nmacOS",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Special Features',
                        'type' => 'dropdown_multiple',
                        'unit' => '',
                        'placeholder' => 'Select Features',
                        'options' => "Backlit Keyboard\nFinger Print\n360°\nTouch Screen\nDual Display\nType-C Port\nRJ45 LAN Port",
                        'is_required' => false,
                        'show_in_filter' => true
                    ]
                ]
            ],
            [
                'name' => 'Monitor Specs',
                'slug' => 'monitor-specs',
                'fields' => [
                    [
                        'name' => 'Screen Size',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Screen Size',
                        'options' => "15-17 inch\n18-20 inch\n21-22 inch\n23-25 inch\n26-30 inch\n31-43 inch\n47 inch & Above",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Resolution',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Resolution',
                        'options' => "HD or Below\nFHD\n2K QHD\n4K UHD\n5K",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Panel Type',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Panel Type',
                        'options' => "TN\nVA\nIPS\nOLED\nMini LED",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Refresh Rate',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Refresh Rate',
                        'options' => "Up to 75 Hz\n100 Hz\n120 Hz\n144 Hz\n160 Hz\n165 Hz\n170 Hz\n175 Hz\n180 Hz",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Response Time',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Response Time',
                        'options' => "< 0.5 ms\n1-4 ms\n5-7 ms\n8-12 ms\n13-14 ms\n15 ms & Above",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Input Type',
                        'type' => 'dropdown_multiple',
                        'unit' => '',
                        'placeholder' => 'Select Input Types',
                        'options' => "VGA\nHDMI\nDisplayPort\nDVI\nD-SUB\nUSB\nUSB Type-C\nThunderbolt\nAudio Jack",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Features',
                        'type' => 'dropdown_multiple',
                        'unit' => '',
                        'placeholder' => 'Select Features',
                        'options' => "Touch Screen\nBuilt-in Speaker\nCurved Screen\nBuilt-in Webcam\nAMD FreeSync\nNVIDIA G-Sync\nGaming\nUltra Wide\nWall Mountable",
                        'is_required' => false,
                        'show_in_filter' => true
                    ]
                ]
            ],
            [
                'name' => 'Tablet Specs',
                'slug' => 'tablet-specs',
                'fields' => [
                    [
                        'name' => 'Screen Size',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Screen Size',
                        'options' => "Up to 6.4 inch\n6.5 to 7.4 inch\n7.5 to 8.4 inch\n8.5 to 9.4 inch\n9.5 to 10.4 inch\n10.5 to 11.4 inch",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Storage',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Storage',
                        'options' => "16GB\n32GB\n64GB\n128GB\n256GB\n512GB\n1TB",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'RAM',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select RAM',
                        'options' => "1 GB\n2 GB\n3 GB\n4 GB\n6 GB\n8 GB\n12 GB\n16 GB",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Operating System',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select OS',
                        'options' => "Android\nWindows\niPadOS",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Connectivity',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Connectivity',
                        'options' => "Wi-Fi only\nWi-Fi + Cellular",
                        'is_required' => false,
                        'show_in_filter' => true
                    ]
                ]
            ],
            [
                'name' => 'TV Specs',
                'slug' => 'tv-specs',
                'fields' => [
                    [
                        'name' => 'Size',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Size',
                        'options' => "32 Inch\n43 Inch\n50 Inch\n55 Inch\n65 Inch\n70 Inch\n75 Inch\n77 Inch\n85 Inch",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Resolution',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Resolution',
                        'options' => "HD\nFull HD\n4K UHD\n8K",
                        'is_required' => true,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Type',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Type',
                        'options' => "Basic\nSmart\nAndroid",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Technology',
                        'type' => 'dropdown_single',
                        'unit' => '',
                        'placeholder' => 'Select Technology',
                        'options' => "LED\nOLED\nQLED\nMini LED\nQD-Mini LED",
                        'is_required' => false,
                        'show_in_filter' => true
                    ],
                    [
                        'name' => 'Special Features',
                        'type' => 'dropdown_multiple',
                        'unit' => '',
                        'placeholder' => 'Select Features',
                        'options' => "HDR\nDolby Audio\nDTS Sound\nNetflix",
                        'is_required' => false,
                        'show_in_filter' => true
                    ]
                ]
            ]
        ];

        foreach ($presets as $preset) {
            AttributePreset::updateOrCreate(
                ['slug' => $preset['slug']],
                $preset
            );
        }
    }
}
