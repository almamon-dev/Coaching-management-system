import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Hero from './Partials/Hero';
import FeatureLinks from './Partials/FeatureLinks';
import CategoryGrid from './Partials/CategoryGrid';
import ProductCard from '@/Components/Frontend/ProductCard';
import { MapPin, ChevronRight, Store } from 'lucide-react';

// Hardcoded exact 20 products from the Star Tech screenshot to ensure 100% visual fidelity
const starTechProducts = [
    {
        id: 1,
        name: 'Beko BNVOH 180 1.5 Ton Smart Inverter Split AC',
        price: 52500,
        discount_price: 42990,
        slug: 'beko-bnvoh-180-1-5-ton-smart-inverter-split-ac',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/air-conditioner/beko/bnvoh-180/bnvoh-180-500x500.jpg'
        }
    },
    {
        id: 2,
        name: 'Brother HL-L2320D Monochrome Laser Printer',
        price: 18900,
        discount_price: 17700,
        slug: 'brother-hl-l2320d-monochrome-laser-printer',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/printer/brother/hl-l2320d/hl-l2320d-500x500.jpg'
        }
    },
    {
        id: 3,
        name: 'Viewsonic VA2261-2 21.5 Inch Full HD LED Monitor',
        price: 11000,
        discount_price: 10200,
        slug: 'viewsonic-va2261-2-21-5-inch-full-hd-led-monitor',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/monitor/viewsonic/va2261-2/va2261-2-500x500.jpg'
        }
    },
    {
        id: 4,
        name: 'Gamet Premium Ergonomic Gaming Chair (Red/Black)',
        price: 13300,
        discount_price: 12800,
        slug: 'gamet-premium-ergonomic-gaming-chair-red-black',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/gaming-chair/havit/gc932/gc932-red-500x500.jpg'
        }
    },
    {
        id: 5,
        name: 'Antec NX310 Mid Tower ARGB Gaming Casing',
        price: 4900,
        discount_price: 4500,
        slug: 'antec-nx310-mid-tower-argb-gaming-casing',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/casing/antec/nx310/nx310-500x500.jpg'
        }
    },
    {
        id: 6,
        name: 'Intel Core i3 Budget Friendly Custom Built PC',
        price: 30500,
        discount_price: 28500,
        slug: 'intel-core-i3-budget-friendly-custom-built-pc',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/desktop-pc/star-pc/intel-core-i3-10100-pc-500x500.jpg'
        }
    },
    {
        id: 7,
        name: 'Singer Sewing Machine with Smart Speed Controller',
        price: 19100,
        discount_price: 17600,
        slug: 'singer-sewing-machine-with-smart-speed-controller',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/sewing-machine/singer/singer-sewing-machine-500x500.jpg'
        }
    },
    {
        id: 8,
        name: 'Gigabyte H510M H Ultra Durable Motherboard',
        price: 15000,
        discount_price: 14200,
        slug: 'gigabyte-h510m-h-ultra-durable-motherboard',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/motherboard/gigabyte/h510m-h/h510m-h-500x500.jpg'
        }
    },
    {
        id: 9,
        name: 'MSI Optix G241V E2 23.8 Inch IPS Gaming Monitor',
        price: 18900,
        discount_price: 17900,
        slug: 'msi-optix-g241v-e2-23-8-inch-ips-gaming-monitor',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/monitor/msi/optix-g241v/optix-g241v-500x500.jpg'
        }
    },
    {
        id: 10,
        name: 'LG 22MK600M-B 21.5 Inch IPS Borderless Monitor',
        price: 15500,
        discount_price: 14800,
        slug: 'lg-22mk600m-b-21-5-inch-ips-borderless-monitor',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/monitor/lg/22mk600m-b/22mk600m-b-500x500.jpg'
        }
    },
    {
        id: 11,
        name: 'Epson EB-E01 XGA 3300 Lumens Projector',
        price: 50000,
        discount_price: 47500,
        slug: 'epson-eb-e01-xga-3300-lumens-projector',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/projector/epson/eb-e01/eb-e01-500x500.jpg'
        }
    },
    {
        id: 12,
        name: 'Lenovo IdeaPad Duet 3 Intel Celeron 10.3 Inch Laptop',
        price: 34800,
        discount_price: 31800,
        slug: 'lenovo-ideapad-duet-3-intel-celeron-10-3-inch-laptop',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/laptop/lenovo/ideapad-duet-3-10igl5/ideapad-duet-3-10igl5-500x500.jpg'
        }
    },
    {
        id: 13,
        name: 'MSI GF63 Thin 11SC Intel Core i5 Gaming Laptop',
        price: 72500,
        discount_price: 68500,
        slug: 'msi-gf63-thin-11sc-intel-core-i5-gaming-laptop',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/laptop/msi/gf63-thin-11sc/gf63-thin-11sc-500x500.jpg'
        }
    },
    {
        id: 14,
        name: 'Lenovo ThinkCentre M70q Tiny Intel Mini PC',
        price: 40000,
        discount_price: 37800,
        slug: 'lenovo-thinkcentre-m70q-tiny-intel-mini-pc',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/desktop-pc/mini-pc/lenovo/thinkcentre-m70q-tiny/thinkcentre-m70q-tiny-500x500.jpg'
        }
    },
    {
        id: 15,
        name: 'HP Pavilion 15-eg2002TU Intel Core i5 15.6 Inch Laptop',
        price: 66000,
        discount_price: 62500,
        slug: 'hp-pavilion-15-eg2002tu-intel-core-i5-15-6-inch-laptop',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/laptop/hp/pavilion-15-eg2002tu/pavilion-15-eg2002tu-500x500.jpg'
        }
    },
    {
        id: 16,
        name: 'Kent Gold+ 20 Litres Gravity Water Purifier',
        price: 11100,
        discount_price: 10500,
        slug: 'kent-gold-plus-20-litres-gravity-water-purifier',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/water-purifier/kent/kent-gold-plus/kent-gold-plus-500x500.jpg'
        }
    },
    {
        id: 17,
        name: 'DJI Mavic Mini Fly More Combo Ultra-Light Drone',
        price: 48000,
        discount_price: 45000,
        slug: 'dji-mavic-mini-fly-more-combo-ultra-light-drone',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/drone/dji/mavic-mini/mavic-mini-fly-more-combo-500x500.jpg'
        }
    },
    {
        id: 18,
        name: 'Soundpeats Free2 Classic Wireless Earbuds',
        price: 3500,
        discount_price: 3200,
        slug: 'soundpeats-free2-classic-wireless-earbuds',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/earphones/soundpeats/free2-classic/free2-classic-500x500.jpg'
        }
    },
    {
        id: 19,
        name: 'Sony PlayStation 5 PS5 Slim Console (Global Edition)',
        price: 70000,
        discount_price: 65500,
        slug: 'sony-playstation-5-ps5-slim-console-global-edition',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/gaming-console/sony/playstation-5/ps5-slim-500x500.jpg'
        }
    },
    {
        id: 20,
        name: 'GBC Security Currency Counting Machine with Detection',
        price: 13800,
        discount_price: 12800,
        slug: 'gbc-security-currency-counting-machine-with-detection',
        primary_image: {
            full_url: 'https://www.startech.com.bd/image/cache/catalog/money-counter/gbc/gbc-money-counting-machine-500x500.jpg'
        }
    }
];

export default function Home({ categories }) {
    return (
        <>
            <Head title="Premium Tech Shop in Bangladesh | Gaget" />

            {/* Main Carousel & Banners */}
            <Hero />

            {/* Feature Bullet Links */}
            <FeatureLinks />

            {/* Grid of Categories */}
            <CategoryGrid categories={categories} />

            {/* 30+ Physical Stores Banner */}
            <section className="container mx-auto px-4 py-6">
                <div className="bg-[#002f6c] rounded-lg border border-[#002f6c]/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-[#4f46e5] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#4f46e5]/25">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">30+ Physical Stores</h3>
                            <p className="text-xs md:text-sm text-slate-200 font-medium mt-1">
                                Visit our physical stores in Dhaka, Chittagong, Sylhet, Rangpur, Khulna, and Rajshahi for exclusive offline deals and hands-on service.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="#"
                        className="bg-[#4f46e5] hover:bg-[#3749bb] text-white font-bold text-sm uppercase px-8 py-3.5 rounded-md shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 shrink-0"
                    >
                        Find Our Store
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#081621] mb-1 font-inter">Featured Products</h2>
                    <p className="text-sm text-slate-500 font-medium font-inter">Check out our latest featured products</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {starTechProducts.map((product) => (
                        <ProductCard key={product.id} product={product} compact={true} />
                    ))}
                </div>
            </section>

            {/* Signature Bangladeshi Tech Store SEO Content Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-[13px] md:text-[14px] space-y-6">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-[#081621] mb-3 tracking-tight leading-tight">
                            Leading Computer, Laptop & Gaming PC Retail & Online Shop in Bangladesh
                        </h1>
                        <p className="text-slate-500 leading-relaxed">
                            Welcome to <strong className="text-[#081621]">Gaget</strong>, the absolute premier technology megastore in Bangladesh. Whether you are looking for a high-end <a href="#" className="text-[#4f46e5] hover:underline font-semibold">gaming PC</a>, a high-performance business <a href="#" className="text-[#4f46e5] hover:underline font-semibold">laptop</a>, advanced server installations, or the latest smart home gadgets, Gaget brings you an unrivaled catalog of genuine, certified products at the most competitive pricing. We operate over 30+ state-of-the-art physical stores in major hubs including Dhaka, Chittagong, Rangpur, Gazipur, Rajshahi, Khulna, and Barisal, combined with a robust, lightning-fast online nationwide delivery system.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2">
                            Best Laptop Shop in Bangladesh
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            Gaget is recognized as the country's leading authority in premium laptops. We house the largest inventory of <a href="#" className="text-[#3749bb] hover:underline font-semibold">Apple MacBook</a> (MacBook Air, MacBook Pro M3), <a href="#" className="text-[#3749bb] hover:underline">ASUS Zenbook</a>, ROG, TUF Gaming, <a href="#" className="text-[#3749bb] hover:underline">HP Pavilion</a>, Spectre, Victus, Lenovo Legion, IdeaPad, Dell XPS, Inspiron, Acer Aspire, Predator, and Xiaomi laptops. From ultrabooks for students to heavy-duty workhorse workstations for developers and 3D animators, we guarantee genuine international warranty coverage on every purchase.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2">
                            Best Desktop PC Shop in Bangladesh
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            Build your dream custom PC with our signature <a href="#" className="text-[#4f46e5] hover:underline font-semibold">PC Builder</a> tool or select from our pre-configured desktop PCs. Gaget is the official distributor of top-tier desktop hardware in Bangladesh. Choose from Intel Core i3, i5, i7, i9 and AMD Ryzen 3, 5, 7, 9 processors, motherboards from <a href="#" className="text-[#3749bb] hover:underline">ASUS</a>, <a href="#" className="text-[#3749bb] hover:underline">MSI</a>, <a href="#" className="text-[#3749bb] hover:underline">Gigabyte</a>, ASRock, RAMs, high-speed NVMe SSDs, graphics cards, and premium casings.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2">
                            Best Gaming PC Shop in Bangladesh
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            Gaget is the ultimate sanctuary for passionate gamers. We design and assemble customized high-performance gaming PCs tailored to run the latest AAA titles at maximum settings. Enhance your battle station with professional gaming peripherals including mechanical keyboards, gaming mice, premium headsets, and ergonomic gaming chairs.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2">
                            Best Office Equipment Shop in Bangladesh
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            Keep your corporate or home office running at maximum efficiency. We provide top-class enterprise hardware including heavy-duty printers (<a href="#" className="text-[#4f46e5] hover:underline">HP</a>, <a href="#" className="text-[#4f46e5] hover:underline">Canon</a>, <a href="#" className="text-[#4f46e5] hover:underline">Epson</a>), scanners, photocopy machines, reliable online/offline UPS, professional routers (TP-Link, Netgear, Mikrotik), security cameras (Hikvision, Dahua), biometric attendance systems, and corporate server accessories.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2">
                            Best Online Shopping Place in Bangladesh
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            Gaget provides the most seamless and secure online tech shopping experience in the country. Our fully featured e-commerce portal allows you to search, compare specs, and purchase with real-time updates. Enjoy multiple payment options, including major credit cards, mobile financial services (bKash, Nagad, Rocket), EMI, and cash on delivery (COD) nationwide.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2">
                            Trusted Online Tech Shopping with Premium Delivery & Warranty Support
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            At Gaget, customer satisfaction is our top priority. We offer a modern e-commerce platform with multiple secured payment methods, including major Credit/Debit Cards, Mobile Financial Services (bKash, Nagad, Rocket), EMI options, and Cash on Delivery (COD) anywhere in Bangladesh. Track your order in real time and enjoy 24/7 online technical support or reach our customer care line at 16793. Experience premium tech retail like never before!
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

Home.layout = page => <FrontendLayout children={page} categories={page.props.categories} brands={page.props.brands} />;
