import React from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link } from '@inertiajs/react';

export default function Events() {
    return (
        <FrontendLayout>
            <Head title="Events - Lohadi High School" />

            {/* Header */}
            <div className="bg-rose-600 text-white py-16">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">All Events</h1>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        Stay up to date with all the upcoming and past events happening at Lohadi High School.
                    </p>
                </div>
            </div>

            {/* Events Content */}
            <div className="container mx-auto px-4 md:px-8 py-16 max-w-8xl">
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between mb-10 gap-4">
                    <h2 className="text-2xl font-bold text-slate-900">Event Calendar 2026</h2>
                    <div className="flex gap-2">
                        <select className="border-slate-200 rounded-md text-sm text-slate-600 focus:ring-rose-500 focus:border-rose-500">
                            <option>All Categories</option>
                            <option>Sports</option>
                            <option>Culture</option>
                            <option>Science & Tech</option>
                        </select>
                        <select className="border-slate-200 rounded-md text-sm text-slate-600 focus:ring-rose-500 focus:border-rose-500">
                            <option>Upcoming</option>
                            <option>Past Events</option>
                        </select>
                    </div>
                </div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Event 1 */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">
                        <div className="relative h-56 overflow-hidden">
                            <img src="/images/event_harvest.png" alt="Harvest Festival" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center shadow-lg min-w-[60px] border-b-2 border-rose-500">
                                <span className="block text-rose-600 font-bold text-[11px] uppercase mb-0.5">Mar</span>
                                <span className="block text-2xl font-black text-slate-900 leading-none">15</span>
                            </div>
                            <div className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Culture</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 10:00 AM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Main Field</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors leading-snug">Spring Harvest Festival</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">Join us for a celebration of local culture, agriculture, and student performances in our open-air campus ground.</p>
                            <button className="w-full py-2.5 rounded-lg border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-colors">Register Now</button>
                        </div>
                    </div>

                    {/* Event 2 */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">
                        <div className="relative h-56 overflow-hidden">
                            <img src="/images/event_science.png" alt="Science Fair" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center shadow-lg min-w-[60px] border-b-2 border-emerald-500">
                                <span className="block text-emerald-600 font-bold text-[11px] uppercase mb-0.5">Mar</span>
                                <span className="block text-2xl font-black text-slate-900 leading-none">22</span>
                            </div>
                            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Science</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 09:00 AM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Outdoor Lab</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors leading-snug">Inter-School Science Fair</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">Students from neighboring villages will gather to demonstrate eco-friendly science projects and innovations.</p>
                            <button className="w-full py-2.5 rounded-lg border border-emerald-200 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors">Register Now</button>
                        </div>
                    </div>

                    {/* Event 3 */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">
                        <div className="relative h-56 overflow-hidden">
                            <img src="/images/event_football.png" alt="Football Championship" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center shadow-lg min-w-[60px] border-b-2 border-blue-500">
                                <span className="block text-blue-600 font-bold text-[11px] uppercase mb-0.5">Apr</span>
                                <span className="block text-2xl font-black text-slate-900 leading-none">05</span>
                            </div>
                            <div className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Sports</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 03:00 PM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Stadium</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">Football Championship Final</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">The most awaited sports event of the year! Cheer for your favorite houses as they battle for the cup.</p>
                            <button className="w-full py-2.5 rounded-lg border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-colors">Buy Tickets</button>
                        </div>
                    </div>

                    {/* Event 4 */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">
                        <div className="relative h-56 overflow-hidden">
                            <img src="/images/event_boishakh.png" alt="Pohela Boishakh" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center shadow-lg min-w-[60px] border-b-2 border-amber-500">
                                <span className="block text-amber-600 font-bold text-[11px] uppercase mb-0.5">Apr</span>
                                <span className="block text-2xl font-black text-slate-900 leading-none">14</span>
                            </div>
                            <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Festival</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 08:00 AM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> School Courtyard</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors leading-snug">Pohela Boishakh Celebration</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">Celebrate the Bengali New Year with traditional food, music, and vibrant rallies across the campus.</p>
                            <button className="w-full py-2.5 rounded-lg border border-amber-200 text-amber-600 font-bold hover:bg-amber-50 transition-colors">Open to All</button>
                        </div>
                    </div>

                    {/* Event 5 */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">
                        <div className="relative h-56 overflow-hidden">
                            <img src="/images/event_ptm.png" alt="Parent-Teacher Meeting" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center shadow-lg min-w-[60px] border-b-2 border-indigo-500">
                                <span className="block text-indigo-600 font-bold text-[11px] uppercase mb-0.5">May</span>
                                <span className="block text-2xl font-black text-slate-900 leading-none">10</span>
                            </div>
                            <div className="absolute top-4 right-4 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Academic</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 11:00 AM</span>
                                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Auditorium</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">Parent-Teacher Conference</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">Mid-term evaluation and feedback session for all grades. Parents are highly encouraged to attend.</p>
                            <button className="w-full py-2.5 rounded-lg border border-indigo-200 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">Details</button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <button className="inline-block px-10 py-3 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-sm">
                        Load More Events ↓
                    </button>
                </div>
            </div>
        </FrontendLayout>
    );
}
