import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Hero from './Partials/Hero';
import CategoryGrid from './Partials/CategoryGrid';
import ProductCard from '@/Components/Frontend/ProductCard';
import { MapPin, ChevronRight } from 'lucide-react';

export default function Home({ categories = [], featuredProducts = [], specialOffers = [] }) {
    return (
        <>
            <Head title="DailyFresh Super Shop - Fresh Groceries Online in Bangladesh" />

            {/* Main Carousel & Banners */}
            <Hero categories={categories} />

            {/* Grid of Categories */}
            <CategoryGrid categories={categories} />

            {/* 30+ Physical Outlets Banner */}
            <section className="container mx-auto px-4 py-6">
                <div className="bg-[#14532d] rounded-lg border border-emerald-950 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#f59e0b]/25">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">30+ Outlets Nationwide</h3>
                            <p className="text-xs md:text-sm text-emerald-100 font-medium mt-1">
                                Visit our nearest DailyFresh outlet for fresh farm-to-table groceries, exclusive offline deals, and personalized customer care.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="#"
                        className="bg-[#16a34a] hover:bg-green-700 text-white font-bold text-sm uppercase px-8 py-3.5 rounded-md shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 shrink-0"
                    >
                        Find Our Outlets
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <section className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#081621] mb-1 font-inter">Featured Products</h2>
                        <p className="text-sm text-slate-500 font-medium font-inter">Check out our fresh picks of the day</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} compact={true} />
                        ))}
                    </div>
                </section>
            )}

            {/* Special Offers Section */}
            {specialOffers.length > 0 && (
                <section className="container mx-auto px-4 py-8 border-t border-slate-200">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#081621] mb-1 font-inter">Special Offers & Discounts</h2>
                        <p className="text-sm text-slate-500 font-medium font-inter">Save big on daily cooking and baking essentials</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {specialOffers.map((product) => (
                            <ProductCard key={product.id} product={product} compact={true} />
                        ))}
                    </div>
                </section>
            )}

            {/* Signature Grocery Store SEO Content Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-[13px] md:text-[14px] space-y-6">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-[#081621] mb-3 tracking-tight leading-tight font-inter">
                            DailyFresh - Leading Online Grocery & Super Shop in Bangladesh
                        </h1>
                        <p className="text-slate-500 leading-relaxed font-inter">
                            Welcome to <strong className="text-[#081621]">DailyFresh Super Shop</strong>, the premier destination for fresh groceries, household items, and baby care essentials in Bangladesh. Whether you are looking for fresh daily <a href="#" className="text-[#16a34a] hover:underline font-semibold">fruits and vegetables</a>, premium quality meat & fish, organic eggs, or dairy products, DailyFresh brings you an unmatched inventory of genuine, hygienic goods at the most competitive price. We operate over 30+ outlets in major hubs across Dhaka, Chittagong, and Sylhet, combined with a fast, reliable online grocery delivery system straight to your doorstep.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2 font-inter">
                            Fresh Fruits & Vegetables Directly from Farmers
                        </h2>
                        <p className="text-slate-500 leading-relaxed font-inter">
                            At DailyFresh, we ensure that you get the highest quality farm-fresh vegetables and fruits. We work directly with local farmers across Bangladesh to source deshi potatoes, red onions, green lemons, tomatoes, garlic, ginger, and seasonal fruits like mangoes, litchis, apples, and bananas. Every item undergoes strict quality checks to ensure they are 100% organic, chemical-free, and fresh when delivered.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2 font-inter">
                            Premium Cooking & Baking Essentials
                        </h2>
                        <p className="text-slate-500 leading-relaxed font-inter">
                            Stock up your kitchen with top-grade cooking essentials. From premium Miniket rice, Basmati rice, and pure Rupchanda soybean oil, to deshi ghee, mustard oil, spices, flour, sugar, and baking needs, DailyFresh has it all. We ensure that our grocery staples are stored in pristine conditions and delivered with maximum hygiene.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2 font-inter">
                            Dairy, Beverages & Frozen Foods
                        </h2>
                        <p className="text-slate-500 leading-relaxed font-inter">
                            Keep your family healthy with premium dairy and breakfast products. Buy pasteurized liquid milk, butter, cheese, yogurt, and honey from trusted local brands like Aarong, Milk Vita, and Pran. We also offer a wide selection of refreshing beverages (Coca-Cola, juices, mineral water), premium tea & coffee, snacks, chocolates, and high-quality frozen foods like parathas, nuggets, and fish.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2 font-inter">
                            Hygienic Home Cleaning & Personal Care
                        </h2>
                        <p className="text-slate-500 leading-relaxed font-inter">
                            Maintain a spotless and germ-free home with our range of cleaning agents. We stock premium laundry detergents (Surf Excel, Rin), dishwashing liquids (Vim), floor cleaners, and disinfectants. Furthermore, browse our health and beauty category for international shampoos, soaps, toothpaste, body lotions, and hygiene essentials.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-[#081621] mb-2 font-inter">
                            Trusted Online Grocery Delivery with Fast & Safe Shipping
                        </h2>
                        <p className="text-slate-500 leading-relaxed font-inter">
                            DailyFresh offers a seamless online shopping experience with robust safety measures. Our temperature-controlled delivery vans ensure that fresh food items reach you without losing their freshness. We offer multiple secure payment methods, including major credit/debit cards, bKash, Nagad, and Cash on Delivery (COD) across Dhaka. Enjoy hassle-free refunds and a customer care hotline at 16793 for any assistance!
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

Home.layout = page => <FrontendLayout children={page} categories={page.props.categories} brands={page.props.brands} />;
