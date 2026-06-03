import React from 'react';
import { Link } from '@inertiajs/react';

export default function CampusLifeSection() {
    return (
        <section className="py-10 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[11px] rounded-full mb-3">Vibrant Community</div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">School Life & Activities</h2>
                        <p className="text-slate-600 text-[14px] leading-relaxed">Education goes beyond the classroom. Explore the vibrant student life, clubs, sports, and cultural events.</p>
                    </div>
                    <Link href="/gallery" className="shrink-0 px-5 py-2 border-2 border-[#009ca6] text-[#009ca6] hover:bg-[#009ca6] hover:text-white rounded font-bold transition-colors text-[13px]">
                        View Gallery
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[450px]">
                    <div className="md:col-span-2 md:row-span-2 rounded-sm overflow-hidden relative group">
                        <img src="/images/campus_sports.png" alt="Sports Day in Field" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-5 left-5 right-5">
                            <span className="px-2.5 py-0.5 bg-[#16a34a] text-white text-[10px] font-bold uppercase tracking-wider rounded mb-2 inline-block">Sports</span>
                            <h3 className="text-xl font-bold text-white leading-tight">Annual Athletics Meet</h3>
                        </div>
                    </div>
                    <div className="md:col-span-2 rounded-sm overflow-hidden relative group">
                        <img src="/images/campus_culture.png" alt="Cultural Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <span className="px-2.5 py-0.5 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-1.5 inline-block">Culture</span>
                            <h3 className="text-lg font-bold text-white leading-tight">Spring Cultural Fest</h3>
                        </div>
                    </div>
                    <div className="rounded-sm overflow-hidden relative group">
                        <img src="/images/campus_academics.png" alt="Outdoor Study" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                            <span className="px-2 py-0.5 bg-[#009ca6] text-white text-[9px] font-bold uppercase tracking-wider rounded mb-1.5 inline-block">Academics</span>
                            <h3 className="text-[15px] font-bold text-white leading-tight">Outdoor Learning</h3>
                        </div>
                    </div>
                    <div className="rounded-sm overflow-hidden relative group">
                        <img src="/images/campus_facilities.png" alt="Nature Campus" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                            <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider rounded mb-1.5 inline-block">Facilities</span>
                            <h3 className="text-[15px] font-bold text-white leading-tight">Green Campus</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
