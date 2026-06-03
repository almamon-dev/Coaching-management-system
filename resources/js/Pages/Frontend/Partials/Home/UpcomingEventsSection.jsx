import React from 'react';
import { Link } from '@inertiajs/react';

export default function UpcomingEventsSection() {
    return (
        <section className="py-16 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 font-bold text-[10px] uppercase tracking-wider rounded-full mb-3">Stay Updated</div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Upcoming Events</h2>
                        <p className="text-slate-600 text-[15px]">Don't miss out on what's happening around our beautiful campus this month.</p>
                    </div>
                    <Link href="#" className="shrink-0 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition-colors shadow-sm text-sm">
                        View All Events
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Event Card 1 */}
                    <div className="bg-white rounded-sm overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row group">
                        <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop" alt="Harvest Festival" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg border-b-2 border-rose-500 min-w-[55px]">
                                <span className="block text-rose-600 font-bold text-[10px] uppercase mb-0.5">Mar</span>
                                <span className="block text-xl font-black text-slate-900 leading-none">15</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 10:00 AM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Main Field</span>
                            </div>
                            <h3 className="text-[17px] font-bold text-slate-900 mb-1.5 group-hover:text-rose-600 transition-colors leading-snug">Spring Harvest Festival & Cultural Show</h3>
                            <p className="text-slate-600 text-[13px] leading-relaxed mb-3 line-clamp-2">Join us for a celebration of local culture, agriculture, and student performances in our open-air campus ground.</p>
                            <a href="#" className="mt-auto text-rose-600 font-bold text-[13px] inline-flex items-center group-hover:gap-1.5 transition-all">Read More <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        </div>
                    </div>

                    {/* Event Card 2 */}
                    <div className="bg-white rounded-sm overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row group">
                        <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=1332&auto=format&fit=crop" alt="Science Fair" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg border-b-2 border-emerald-500 min-w-[55px]">
                                <span className="block text-emerald-600 font-bold text-[10px] uppercase mb-0.5">Mar</span>
                                <span className="block text-xl font-black text-slate-900 leading-none">22</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 09:00 AM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Outdoor Lab</span>
                            </div>
                            <h3 className="text-[17px] font-bold text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors leading-snug">Inter-School Outdoor Science Fair</h3>
                            <p className="text-slate-600 text-[13px] leading-relaxed mb-3 line-clamp-2">Students from neighboring villages will gather to demonstrate eco-friendly science projects and innovations.</p>
                            <a href="#" className="mt-auto text-emerald-600 font-bold text-[13px] inline-flex items-center group-hover:gap-1.5 transition-all">Read More <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        </div>
                    </div>

                    {/* Event Card 3 */}
                    <div className="bg-white rounded-sm overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row group">
                        <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1518605368461-1e96a30c5e63?q=80&w=2070&auto=format&fit=crop" alt="Football Championship" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg border-b-2 border-blue-500 min-w-[55px]">
                                <span className="block text-blue-600 font-bold text-[10px] uppercase mb-0.5">Apr</span>
                                <span className="block text-xl font-black text-slate-900 leading-none">05</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 03:00 PM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Stadium</span>
                            </div>
                            <h3 className="text-[17px] font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors leading-snug">Annual Football Championship Final</h3>
                            <p className="text-slate-600 text-[13px] leading-relaxed mb-3 line-clamp-2">The most awaited sports event of the year! Cheer for your favorite houses as they battle for the cup.</p>
                            <a href="#" className="mt-auto text-blue-600 font-bold text-[13px] inline-flex items-center group-hover:gap-1.5 transition-all">Read More <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        </div>
                    </div>

                    {/* Event Card 4 */}
                    <div className="bg-white rounded-sm overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row group">
                        <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1522037943542-fbc94e10df2e?q=80&w=2070&auto=format&fit=crop" alt="Pohela Boishakh" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg border-b-2 border-amber-500 min-w-[55px]">
                                <span className="block text-amber-600 font-bold text-[10px] uppercase mb-0.5">Apr</span>
                                <span className="block text-xl font-black text-slate-900 leading-none">14</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 08:00 AM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> School Courtyard</span>
                            </div>
                            <h3 className="text-[17px] font-bold text-slate-900 mb-1.5 group-hover:text-amber-600 transition-colors leading-snug">Pohela Boishakh Celebration</h3>
                            <p className="text-slate-600 text-[13px] leading-relaxed mb-3 line-clamp-2">Celebrate the Bengali New Year with traditional food, music, and vibrant rallies across the campus.</p>
                            <a href="#" className="mt-auto text-amber-600 font-bold text-[13px] inline-flex items-center group-hover:gap-1.5 transition-all">Read More <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
