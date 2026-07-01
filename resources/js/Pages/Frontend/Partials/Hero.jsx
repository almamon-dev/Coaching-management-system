import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
    {
        id: 1,
        image: '/images/hero_bg_1.png',
        title: 'Inspire Learning for Innovation and Transformation',
        description: 'Lohadi High School provides education that sparks curiosity, critical thinking, and a passion for learning. Our education methodology highlights the role of learning in fostering innovation, driving positive change in various fields, and transforming both individuals and society.',
        link: '#'
    },
    {
        id: 2,
        image: '/images/hero_bg_2.png',
        title: 'Empowering the Next Generation of Global Leaders',
        description: 'We believe in nurturing the unique potential of every student through a blend of academic rigor, character development, and real-world problem solving.',
        link: '#'
    }
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full h-[480px] md:h-[580px] lg:h-[680px] bg-slate-900 overflow-hidden font-inter">
            {/* Slider Images */}
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                    />

                    {/* Green Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#16a34a]/90 via-[#16a34a]/60 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4 md:px-8 lg:px-10">
                            <div className="max-w-2xl text-white">
                                <h1 className="text-3xl md:text-4xl lg:text-[40px] font-black leading-tight mb-4 drop-shadow-md tracking-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-[13px] md:text-[14px] text-white/90 mb-6 leading-relaxed font-medium drop-shadow-md max-w-lg">
                                    {slide.description}
                                </p>
                                <Link
                                    href={slide.link}
                                    className="inline-flex px-8 py-2.5 bg-white text-[#16a34a] hover:bg-slate-50 rounded-sm font-bold text-[13px] transition-colors shadow-lg"
                                >
                                    Apply Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Slider Controls */}
            <div className="absolute bottom-20 left-0 right-0 z-20">
                <div className="container mx-auto px-4 md:px-8 lg:px-10 flex items-center justify-between">

                    {/* Dots */}
                    <div className="flex items-center gap-2">
                        {SLIDES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white/50 ${index === currentSlide ? 'bg-white' : 'bg-transparent hover:bg-white/30'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Arrows */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                            className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            <ChevronLeft size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
                            className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            <ChevronRight size={20} strokeWidth={1.5} />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}   