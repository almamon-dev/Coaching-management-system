import React from 'react';
import { Link } from '@inertiajs/react';

export default function UpcomingEventsSection({ events = [] }) {
    // Array of color themes for the date box and accents
    const eventColors = [
        { main: 'text-rose-600', border: 'border-rose-500', bg: 'bg-rose-100', icon: 'text-rose-500' },
        { main: 'text-emerald-600', border: 'border-emerald-500', bg: 'bg-emerald-100', icon: 'text-emerald-500' },
        { main: 'text-blue-600', border: 'border-blue-500', bg: 'bg-blue-100', icon: 'text-blue-500' },
        { main: 'text-amber-600', border: 'border-amber-500', bg: 'bg-amber-100', icon: 'text-amber-500' },
    ];

    return (
        <section className="py-16 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 font-bold text-[10px] uppercase tracking-wider rounded-full mb-3">Stay Updated</div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Upcoming Events</h2>
                        <p className="text-slate-600 text-[15px]">Don't miss out on what's happening around our beautiful campus this month.</p>
                    </div>
                    <Link href="/events" className="shrink-0 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition-colors shadow-sm text-sm">
                        View All Events
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {events && events.length > 0 ? (
                        events.map((event, index) => {
                            const colors = eventColors[index % eventColors.length];
                            const eventDate = new Date(event.date);
                            const month = eventDate.toLocaleString('default', { month: 'short' });
                            const day = eventDate.getDate().toString().padStart(2, '0');

                            return (
                                <div key={event.id} className="bg-white rounded-sm overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row group">
                                    <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0">
                                        <img src={event.image || '/images/default_event.png'} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className={`absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg border-b-2 ${colors.border} min-w-[55px]`}>
                                            <span className={`block ${colors.main} font-bold text-[10px] uppercase mb-0.5`}>{month}</span>
                                            <span className="block text-xl font-black text-slate-900 leading-none">{day}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-5 flex flex-col justify-center">
                                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                            {event.time && (
                                                <span className="flex items-center gap-1.5">
                                                    <svg className={`w-3.5 h-3.5 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
                                                    {event.time}
                                                </span>
                                            )}
                                            {event.location && (
                                                <span className="flex items-center gap-1.5">
                                                    <svg className={`w-3.5 h-3.5 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> 
                                                    {event.location}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`text-[17px] font-bold text-slate-900 mb-1.5 group-hover:${colors.main} transition-colors leading-snug`}>
                                            {event.title}
                                        </h3>
                                        <p className="text-slate-600 text-[13px] leading-relaxed mb-3 line-clamp-2">
                                            {event.description}
                                        </p>
                                        <Link href={`/events/${event.slug}`} className={`mt-auto ${colors.main} font-bold text-[13px] inline-flex items-center group-hover:gap-1.5 transition-all`}>
                                            Read More <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No upcoming events at the moment. Please check back later.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
