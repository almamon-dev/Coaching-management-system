import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function NoticeBoardSection({ notices = [] }) {
    return (
        <section id="notice-board" className="py-16 bg-transparent scroll-mt-24">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="max-w-full mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Left Column: Notice Board */}
                        <div className="lg:col-span-2">
                            <div className="flex items-end justify-between mb-4">
                                <div>
                                    <div className="inline-block px-3 py-0.5 bg-[#16a34a]/10 text-[#16a34a] font-bold text-[10px] rounded-full uppercase tracking-wider mb-1.5">Latest Updates</div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900">
                                        Notice Board
                                    </h2>
                                </div>
                                <Link href={route('notices.index')} className="inline-flex items-center text-[#16a34a] text-xs font-bold hover:text-[#009ca6] transition-colors mb-1">
                                    View All <ChevronRight size={14} />
                                </Link>
                            </div>

                            <div className="bg-white/60 backdrop-blur-md border border-[#16a34a]/20 rounded-sm shadow-sm overflow-hidden">
                                {notices && notices.length > 0 ? (
                                    <div className="divide-y divide-[#16a34a]/10">
                                        {notices.map((notice, index) => (
                                            <Link
                                                key={index}
                                                href={route('notices.show', notice.id)}
                                                className="flex gap-3.5 items-center p-3 hover:bg-white/90 transition-colors group cursor-pointer"
                                            >
                                                {/* Calendar Date Card */}
                                                <div className="flex flex-col items-center rounded-[4px] overflow-hidden border border-slate-200/90 bg-white shadow-2xs shrink-0 w-15 sm:w-16 group-hover:border-[#009ca6] group-hover:shadow-xs transition-all">
                                                    <div className="w-full bg-[#009ca6] text-white text-[10.5px] font-black uppercase tracking-wider text-center py-1 leading-none">
                                                        {new Date(notice.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                                    </div>
                                                    <div className="w-full py-2 flex items-center justify-center bg-white group-hover:bg-teal-50/20 transition-colors">
                                                        <span className="font-black text-xl text-slate-800 leading-none group-hover:text-[#009ca6] transition-colors">
                                                            {new Date(notice.date).getDate()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h3 className="text-[14px] font-bold text-slate-800 truncate group-hover:text-[#16a34a] transition-colors">
                                                            {notice.title}
                                                        </h3>
                                                        {notice.is_new && (
                                                            <span className="bg-red-50 text-red-600 border border-red-100 text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0 shadow-sm">New</span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-600 text-[12px] truncate">{notice.description}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-5 text-center text-slate-500 text-sm font-medium">
                                        No recent notices available.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Important Links */}
                        <div className="lg:col-span-1 pt-1 lg:pt-14">
                            <div className="border border-[#009ca6] shadow-sm overflow-hidden bg-[#f4fbfa] rounded-sm">
                                <div className="bg-[#009ca6] py-2.5 px-4">
                                    <h3 className="text-[18px] font-bold text-white font-serif tracking-wide">Important Links</h3>
                                </div>
                                <div className="flex flex-col py-1.5 min-h-[220px]">
                                    {[
                                        { title: 'Notice Board', url: route('notices.index') },
                                        { title: 'Academic batches & Programs', url: '/#batches' },
                                        { title: 'Admission Instructions', url: route('admissions') },
                                        { title: 'Campus Events & Seminars', url: route('events') },
                                        { title: 'Student Success Stories', url: route('success-stories') },
                                        { title: 'Photo Gallery', url: route('gallery') },
                                        { title: 'About Our Coaching', url: route('about-us') },
                                        { title: 'Student & Guardian Portal', url: route('student.login') },
                                        { title: 'Sexual Harassment & Safety Help', url: route('complaints.create') }
                                    ].map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className="py-2.5 px-4 text-[#333333] hover:text-[#009ca6] hover:bg-white/80 transition-colors text-[13px] font-medium flex items-center justify-between group"
                                        >
                                            <span>{link.title}</span>
                                            <span className="text-slate-300 group-hover:text-[#009ca6] group-hover:translate-x-0.5 transition-all">›</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
