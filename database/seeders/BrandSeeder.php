<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            // Major Global Brands
            ['name' => 'Apple',       'slug' => 'apple',       'is_featured' => true,  'status' => 1, 'description' => 'Premium laptops, desktops and devices from Cupertino.'],
            ['name' => 'Samsung',     'slug' => 'samsung',     'is_featured' => true,  'status' => 1, 'description' => 'South Korean electronics giant.'],
            ['name' => 'Sony',        'slug' => 'sony',        'is_featured' => true,  'status' => 1, 'description' => 'Japanese leader in audio and gaming.'],
            ['name' => 'Microsoft',   'slug' => 'microsoft',   'is_featured' => true,  'status' => 1, 'description' => 'Surface devices and software ecosystems.'],
            ['name' => 'Google',      'slug' => 'google',      'is_featured' => false, 'status' => 1, 'description' => 'Pixel phones and smart home devices.'],
            ['name' => 'Intel',       'slug' => 'intel',       'is_featured' => true,  'status' => 1, 'description' => 'Leading semiconductor and processor manufacturer.'],
            ['name' => 'AMD',         'slug' => 'amd',         'is_featured' => true,  'status' => 1, 'description' => 'Advanced Micro Devices processors and graphics.'],

            // PC / Laptop Brands
            ['name' => 'HP',          'slug' => 'hp',          'is_featured' => true,  'status' => 1, 'description' => 'Personal computers, laptops and printers.'],
            ['name' => 'Dell',        'slug' => 'dell',        'is_featured' => true,  'status' => 1, 'description' => 'High-performance computing solutions.'],
            ['name' => 'Lenovo',      'slug' => 'lenovo',      'is_featured' => true,  'status' => 1, 'description' => 'Global leader in business and gaming laptops.'],
            ['name' => 'Asus',        'slug' => 'asus',        'is_featured' => true,  'status' => 1, 'description' => 'Republic of Gamers and creative laptops.'],
            ['name' => 'Acer',        'slug' => 'acer',        'is_featured' => true,  'status' => 1, 'description' => 'Affordable and performance laptops and monitors.'],
            ['name' => 'MSI',         'slug' => 'msi',         'is_featured' => true,  'status' => 1, 'description' => 'High-end gaming hardware and laptops.'],
            ['name' => 'Gigabyte',    'slug' => 'gigabyte',    'is_featured' => false, 'status' => 1, 'description' => 'Motherboards, GPUs and gaming peripherals.'],
            ['name' => 'Razer',       'slug' => 'razer',       'is_featured' => true,  'status' => 1, 'description' => 'For gamers, by gamers.'],
            ['name' => 'Tecno',       'slug' => 'tecno',       'is_featured' => false, 'status' => 1, 'description' => 'Affordable tech products for emerging markets.'],
            ['name' => 'Chuwi',       'slug' => 'chuwi',       'is_featured' => false, 'status' => 1, 'description' => 'Budget-friendly tablets and mini PCs.'],
            ['name' => 'Thunderobot', 'slug' => 'thunderobot', 'is_featured' => false, 'status' => 1, 'description' => 'Gaming laptops and peripherals.'],
            ['name' => 'Walton',      'slug' => 'walton',      'is_featured' => false, 'status' => 1, 'description' => 'Bangladeshi electronics and appliance brand.'],

            // Monitor Brands
            ['name' => 'LG',          'slug' => 'lg',          'is_featured' => true,  'status' => 1, 'description' => 'Premium monitors, TVs and home appliances.'],
            ['name' => 'AOC',         'slug' => 'aoc',         'is_featured' => false, 'status' => 1, 'description' => 'Affordable gaming and professional monitors.'],
            ['name' => 'BenQ',        'slug' => 'benq',        'is_featured' => false, 'status' => 1, 'description' => 'Professional and gaming display solutions.'],
            ['name' => 'Philips',     'slug' => 'philips',     'is_featured' => false, 'status' => 1, 'description' => 'Professional monitors and home electronics.'],
            ['name' => 'ViewSonic',   'slug' => 'viewsonic',   'is_featured' => false, 'status' => 1, 'description' => 'Visual display solutions and projectors.'],
            ['name' => 'Corsair',     'slug' => 'corsair',     'is_featured' => false, 'status' => 1, 'description' => 'Gaming peripherals, RAM and monitors.'],
            ['name' => 'Value-Top',   'slug' => 'value-top',   'is_featured' => false, 'status' => 1, 'description' => 'Budget monitors and peripherals.'],
            ['name' => 'Xiaomi',      'slug' => 'xiaomi',      'is_featured' => false, 'status' => 1, 'description' => 'Value-focused Chinese tech company.'],
            ['name' => 'Dahua',       'slug' => 'dahua',       'is_featured' => false, 'status' => 1, 'description' => 'Security and surveillance solutions.'],
            ['name' => 'Hikvision',   'slug' => 'hikvision',   'is_featured' => false, 'status' => 1, 'description' => 'World-leading video surveillance products.'],
            ['name' => 'Thermaltake', 'slug' => 'thermaltake', 'is_featured' => false, 'status' => 1, 'description' => 'PC cooling and gaming peripherals.'],
            ['name' => 'PC Power',    'slug' => 'pc-power',    'is_featured' => false, 'status' => 1, 'description' => 'Local PC brand and peripherals.'],
            ['name' => 'Arzopa',      'slug' => 'arzopa',      'is_featured' => false, 'status' => 1, 'description' => 'Portable monitors and displays.'],
            ['name' => 'Koorui',      'slug' => 'koorui',      'is_featured' => false, 'status' => 1, 'description' => 'Affordable gaming monitors.'],
            ['name' => 'Smart',       'slug' => 'smart',       'is_featured' => false, 'status' => 1, 'description' => 'Local electronics and display brand.'],
            ['name' => 'AIWA',        'slug' => 'aiwa',        'is_featured' => false, 'status' => 1, 'description' => 'Consumer electronics and audio brand.'],

            // Tablet Brands
            ['name' => 'Teclast',     'slug' => 'teclast',     'is_featured' => false, 'status' => 1, 'description' => 'Affordable tablets and laptops.'],
            ['name' => 'MacBook',     'slug' => 'macbook',     'is_featured' => false, 'status' => 1, 'description' => 'Apple MacBook laptop line.'],

            // Peripherals & Accessories
            ['name' => 'Logitech',     'slug' => 'logitech',     'is_featured' => true,  'status' => 1, 'description' => 'Premium peripherals and accessories.'],

            // Liquid Cooler
            ['name' => 'EKWB',         'slug' => 'ekwb',         'is_featured' => false, 'status' => 1, 'description' => 'Premium custom and AIO liquid cooling solutions.'],

            // Motherboard Brands
            ['name' => 'ASRock',       'slug' => 'asrock',       'is_featured' => false, 'status' => 1, 'description' => 'Innovative Intel and AMD motherboards.'],
            ['name' => 'Colorful',     'slug' => 'colorful',     'is_featured' => false, 'status' => 1, 'description' => 'Motherboards and graphics cards.'],

            // GPU Brands
            ['name' => 'NVIDIA',       'slug' => 'nvidia',       'is_featured' => true,  'status' => 1, 'description' => 'World-leading graphics processing units.'],
            ['name' => 'ZOTAC',        'slug' => 'zotac',        'is_featured' => false, 'status' => 1, 'description' => 'NVIDIA graphics cards and mini PCs.'],
            ['name' => 'Sapphire',     'slug' => 'sapphire',     'is_featured' => false, 'status' => 1, 'description' => 'AMD Radeon graphics cards.'],
            ['name' => 'PowerColor',   'slug' => 'powercolor',   'is_featured' => false, 'status' => 1, 'description' => 'AMD Radeon graphics cards.'],
            ['name' => 'INNO3D',       'slug' => 'inno3d',       'is_featured' => false, 'status' => 1, 'description' => 'NVIDIA GeForce graphics cards.'],
            ['name' => 'PNY',          'slug' => 'pny',          'is_featured' => false, 'status' => 1, 'description' => 'NVIDIA graphics cards, RAM and flash storage.'],
            ['name' => 'Manli',        'slug' => 'manli',        'is_featured' => false, 'status' => 1, 'description' => 'NVIDIA graphics cards.'],
            ['name' => 'GUNNIR',       'slug' => 'gunnir',       'is_featured' => false, 'status' => 1, 'description' => 'Intel Arc graphics cards.'],
            ['name' => 'ARKTEK',       'slug' => 'arktek',       'is_featured' => false, 'status' => 1, 'description' => 'Budget graphics cards and components.'],
            ['name' => 'AFOX',         'slug' => 'afox',         'is_featured' => false, 'status' => 1, 'description' => 'Budget graphics cards.'],
            ['name' => 'OCPC',         'slug' => 'ocpc',         'is_featured' => false, 'status' => 1, 'description' => 'RAM, SSDs and gaming accessories.'],
            ['name' => 'PELADN',       'slug' => 'peladn',       'is_featured' => false, 'status' => 1, 'description' => 'Mini PCs and compact computing solutions.'],

            // RAM Brands
            ['name' => 'Kingston',     'slug' => 'kingston',     'is_featured' => true,  'status' => 1, 'description' => 'Industry-leading memory and storage solutions.'],
            ['name' => 'G.Skill',      'slug' => 'g-skill',      'is_featured' => false, 'status' => 1, 'description' => 'High-performance gaming RAM and peripherals.'],
            ['name' => 'Adata',        'slug' => 'adata',        'is_featured' => false, 'status' => 1, 'description' => 'Memory modules, SSDs and flash storage.'],
            ['name' => 'TEAM',         'slug' => 'team',         'is_featured' => false, 'status' => 1, 'description' => 'RAM and flash storage solutions.'],
            ['name' => 'TwinMOS',      'slug' => 'twinmos',      'is_featured' => false, 'status' => 1, 'description' => 'Affordable RAM and storage products.'],
            ['name' => 'Patriot',      'slug' => 'patriot',      'is_featured' => false, 'status' => 1, 'description' => 'Gaming RAM and flash storage.'],
            ['name' => 'Transcend',    'slug' => 'transcend',    'is_featured' => false, 'status' => 1, 'description' => 'Reliable memory and storage solutions.'],
            ['name' => 'AITC',         'slug' => 'aitc',         'is_featured' => false, 'status' => 1, 'description' => 'RAM and computing accessories.'],
            ['name' => 'Lexar',        'slug' => 'lexar',        'is_featured' => false, 'status' => 1, 'description' => 'Flash memory and storage products.'],
            ['name' => 'Netac',        'slug' => 'netac',        'is_featured' => false, 'status' => 1, 'description' => 'Affordable RAM and SSD products.'],
            ['name' => 'Kimtigo',      'slug' => 'kimtigo',      'is_featured' => false, 'status' => 1, 'description' => 'Memory modules and storage solutions.'],
            ['name' => 'OSCOO',        'slug' => 'oscoo',        'is_featured' => false, 'status' => 1, 'description' => 'Budget RAM and SSD solutions.'],
            ['name' => 'Alimoto',      'slug' => 'alimoto',      'is_featured' => false, 'status' => 1, 'description' => 'RAM and storage accessories.'],
            ['name' => 'Crucial',      'slug' => 'crucial',      'is_featured' => false, 'status' => 1, 'description' => 'Memory and storage solutions by Micron.'],
            ['name' => 'Bory',         'slug' => 'bory',         'is_featured' => false, 'status' => 1, 'description' => 'Affordable memory and storage products.'],
            ['name' => 'MiPhi',        'slug' => 'miphi',        'is_featured' => false, 'status' => 1, 'description' => 'Specialized memory and storage components.'],
            ['name' => 'Addlink',      'slug' => 'addlink',      'is_featured' => false, 'status' => 1, 'description' => 'High-performance SSDs and memory.'],
            ['name' => 'KingBank',     'slug' => 'kingbank',     'is_featured' => false, 'status' => 1, 'description' => 'DDR memory modules.'],
            ['name' => 'Adata',        'slug' => 'adata',        'is_featured' => true,  'status' => 1, 'description' => 'Global leader in memory and storage.'],

            // Storage Brands
            ['name' => 'Toshiba',      'slug' => 'toshiba',      'is_featured' => false, 'status' => 1, 'description' => 'Reliable hard drives and storage solutions.'],
            ['name' => 'Western Digital', 'slug' => 'western-digital', 'is_featured' => true, 'status' => 1, 'description' => 'Leading global data storage brand.'],
            ['name' => 'Seagate',      'slug' => 'seagate',      'is_featured' => true,  'status' => 1, 'description' => 'Precision-engineered data storage solutions.'],
            ['name' => 'SanDisk',      'slug' => 'sandisk',      'is_featured' => false, 'status' => 1, 'description' => 'Flash memory and portable storage giant.'],
            ['name' => 'LaCie',        'slug' => 'lacie',        'is_featured' => false, 'status' => 1, 'description' => 'Premium external storage for creative professionals.'],

            // CPU Cooler / Component Brands
            ['name' => 'Antec',        'slug' => 'antec',        'is_featured' => false, 'status' => 1, 'description' => 'PC cases, power supplies and cooling solutions.'],
            ['name' => 'Gamdias',      'slug' => 'gamdias',      'is_featured' => false, 'status' => 1, 'description' => 'Gaming peripherals and cooling solutions.'],
            ['name' => 'MaxGreen',     'slug' => 'maxgreen',     'is_featured' => false, 'status' => 1, 'description' => 'Affordable PC cases and power supplies.'],
            ['name' => 'Huntkey',      'slug' => 'huntkey',      'is_featured' => false, 'status' => 1, 'description' => 'Power supplies and computer components.'],
            ['name' => 'T-WOLF',       'slug' => 't-wolf',       'is_featured' => false, 'status' => 1, 'description' => 'Gaming peripherals and accessories.'],
            ['name' => 'ARCTIC',       'slug' => 'arctic',       'is_featured' => false, 'status' => 1, 'description' => 'Efficient and quiet CPU and case cooling.'],
            ['name' => 'Ocypus',       'slug' => 'ocypus',       'is_featured' => false, 'status' => 1, 'description' => 'Budget-friendly CPU coolers and fans.'],
            ['name' => 'DeepCool',     'slug' => 'deepcool',     'is_featured' => false, 'status' => 1, 'description' => 'CPU coolers, cases and power supplies.'],
            ['name' => '1STPLAYER',    'slug' => '1stplayer',    'is_featured' => false, 'status' => 1, 'description' => 'Gaming peripherals and cooling products.'],
            ['name' => 'NZXT',         'slug' => 'nzxt',         'is_featured' => false, 'status' => 1, 'description' => 'Premium PC cases and cooling solutions.'],
            ['name' => 'Cooler Master', 'slug' => 'cooler-master', 'is_featured' => false, 'status' => 1, 'description' => 'Industry-leading cooling and PC accessories.'],
            ['name' => 'Cougar',       'slug' => 'cougar',       'is_featured' => false, 'status' => 1, 'description' => 'Gaming cases, coolers and peripherals.'],
            ['name' => 'Xigmatek',     'slug' => 'xigmatek',     'is_featured' => false, 'status' => 1, 'description' => 'PC cooling and gaming accessories.'],
            ['name' => 'Xtreme',       'slug' => 'xtreme',       'is_featured' => false, 'status' => 1, 'description' => 'Cooling fans and PC accessories.'],
            ['name' => 'upHere',       'slug' => 'uphere',       'is_featured' => false, 'status' => 1, 'description' => 'Affordable RGB fans and cooling products.'],
            ['name' => 'Yeston',       'slug' => 'yeston',       'is_featured' => false, 'status' => 1, 'description' => 'Graphics cards and PC components.'],
            ['name' => 'Golden Field', 'slug' => 'golden-field', 'is_featured' => false, 'status' => 1, 'description' => 'Popular PC cases and cooling solutions.'],
            ['name' => 'PC Power',     'slug' => 'pc-power',     'is_featured' => false, 'status' => 1, 'description' => 'Power supplies and gaming cases.'],
            ['name' => 'Monarch',      'slug' => 'monarch',      'is_featured' => false, 'status' => 1, 'description' => 'Quality computer hardware components.'],
            ['name' => 'Carbono',      'slug' => 'carbono',      'is_featured' => false, 'status' => 1, 'description' => 'Modern PC components and accessories.'],
            ['name' => 'ARS',          'slug' => 'ars',          'is_featured' => false, 'status' => 1, 'description' => 'Computer hardware and peripherals.'],
        ];
        foreach ($brands as $brand) {
            \App\Models\Brand::updateOrCreate(['slug' => $brand['slug']], $brand);
        }
    }
}
