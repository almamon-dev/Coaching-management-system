import React, { useState, useEffect } from 'react';

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            image: '/images/banners/main-banner.webp?v=3',
            alt: 'Beko 1.5 Ton AC Special Promotion',
            link: '#'
        },
        {
            id: 2,
            image: '/images/banners/main-banner-second.webp?v=3',
            alt: 'Exclusive Tech Deals',
            link: '#'
        },
        {
            id: 3,
            image: '/images/banners/main-banner-third.webp?v=3',
            alt: 'Custom Gaming PC Builder Offer',
            link: '#'
        }
    ];

    // Auto-play slider every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
                {/* Main Slider */}
                <div className="lg:col-span-3 rounded-xl overflow-hidden shadow-sm relative group aspect-[982/500] w-full bg-slate-100">
                    <div className="w-full h-full relative">
                        {slides.map((slide, index) => (
                            <a
                                key={slide.id}
                                href={slide.link}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.alt}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to Slide 1 if external links ever experience latency
                                        if (index !== 0) {
                                            e.target.src = '/images/banners/main-banner.webp?v=3';
                                        }
                                    }}
                                />
                            </a>
                        ))}
                    </div>

                    {/* Left & Right Controls */}
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                    >
                        ❯
                    </button>

                    {/* Indicator Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    index === currentSlide
                                        ? 'w-6 bg-[#4f46e5]'
                                        : 'w-2.5 bg-white/70 hover:bg-white'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Side Banners (Mobile App and AC Ton Calculator) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="flex-1 rounded-xl overflow-hidden shadow-sm aspect-[227/181] lg:aspect-auto border border-slate-100 hover:shadow-md transition-shadow duration-300 bg-slate-50 flex items-center justify-center">
                        <img
                            src="/images/banners/side-banner-1.webp?v=3"
                            alt="Star Tech Mobile App Promotion"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                        />
                    </div>
                    <div className="flex-1 rounded-xl overflow-hidden shadow-sm aspect-[227/181] lg:aspect-auto border border-slate-100 hover:shadow-md transition-shadow duration-300 bg-slate-50 flex items-center justify-center">
                        <img
                            src="/images/banners/side-banner-2.webp?v=3"
                            alt="AC Ton Calculator"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Marquee/Info Bar */}
            <div className="mt-6 bg-white py-3 px-6 rounded-[30px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
                    <span className="text-sm font-bold text-[#4f46e5]">Notice:</span>
                    <span className="text-sm text-slate-600 font-medium">
                        Our all branches are open from 9:00 AM to 8:00 PM. Follow our online activities for latest updates.
                    </span>
                </div>
            </div>
        </section>
    );
}
