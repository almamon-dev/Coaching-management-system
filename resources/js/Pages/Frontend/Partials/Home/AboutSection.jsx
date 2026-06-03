import React from 'react';
import { Link } from '@inertiajs/react';

export default function AboutSection() {
    return (
        <section className="py-12 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    <div className="lg:col-span-5 relative px-4 sm:px-0">
                        <div className="rounded-lg overflow-hidden shadow-lg relative z-10 border-4 border-white">
                            <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop" alt="Students studying in nature" className="w-full h-auto object-cover aspect-[16/10]" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#009ca6] rounded-full opacity-20 -z-10 blur-2xl"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#16a34a] rounded-full opacity-20 -z-10 blur-xl"></div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="inline-block px-3 py-1 bg-[#009ca6]/10 text-[#009ca6] font-bold text-[10px] uppercase tracking-wider rounded-full mb-3">About Our Institution</div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">
                            A Legacy of <span className="text-[#16a34a]">Excellence</span> & Innovation
                        </h2>
                        <p className="text-slate-600 text-[15px] leading-relaxed mb-4 font-medium max-w-3xl">
                            At Lohadi High School, we believe in nurturing the unique potential of every student. Our dedicated faculty, sprawling green campus, and innovative approach to education ensure that our graduates are well-prepared to thrive.
                        </p>
                        <p className="text-slate-500 text-[14px] leading-relaxed mb-6 max-w-3xl">
                            Established in 1942 with a vision to provide world-class education in a serene, natural environment, we focus on both academic excellence and character building.
                        </p>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-2 mb-8 max-w-2xl">
                            {[
                                'Lush Green Campus',
                                'Outdoor Learning Spaces',
                                'Spacious Playgrounds',
                                'Eco-friendly Facilities'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-slate-700 font-bold text-[13px]">
                                    <div className="w-4 h-4 rounded-full bg-[#16a34a]/20 flex items-center justify-center text-[#16a34a] shrink-0">
                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link href="#" className="inline-flex items-center justify-center px-6 py-2.5 bg-[#009ca6] hover:bg-[#007b83] text-white rounded font-bold transition-colors shadow-sm text-sm">
                            Read Our Full Story
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
