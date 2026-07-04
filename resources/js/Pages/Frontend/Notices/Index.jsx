import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { ChevronRight, FileText, Calendar, Search } from 'lucide-react';

export default function Index({ notices }) {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const count = notices.data?.length || 0;

    return (
        <FrontendLayout>
            <Head title="Notice Board - Kirtonia High School" />

            {/* Page Header */}
            <div className="bg-slate-900 py-6 relative overflow-hidden font-inter">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 max-w-8xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight mb-1">
                                Notice Board
                            </h1>
                            <p className="text-slate-400 text-[13px] md:text-[14px] font-medium leading-relaxed max-w-2xl">
                                Stay updated with the latest announcements, examination schedules, and official notices from the school administration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="border-b border-slate-200 bg-white shadow-sm sticky top-[110px] md:top-[128px] z-40">
                <div className="container mx-auto px-4 md:px-8 max-w-8xl py-3">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                        <Link href="/" className="hover:text-[#16a34a] transition-colors">Home</Link>
                        <ChevronRight size={14} className="text-slate-300" />
                        <span className="text-slate-800">Notices</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-10 bg-transparent min-h-[500px]">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                        
                        {/* Header/Toolbar */}
                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                                    <FileText size={18} className="text-[#009ca6]" />
                                    All Notices
                                </h2>
                            </div>
                            <div className="text-[12px] text-slate-500 font-medium">
                                Showing <span className="font-bold text-slate-700">{notices.from || 0}</span> to <span className="font-bold text-slate-700">{notices.to || 0}</span> of <span className="font-bold text-slate-700">{notices.total || 0}</span> results
                            </div>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-slate-100">
                            {notices.data && notices.data.length > 0 ? (
                                notices.data.map((notice) => (
                                    <Link 
                                        key={notice.id}
                                        href={route('notices.show', notice.id)}
                                        className="group block p-4 hover:bg-[#16a34a]/5 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Date Box (Compact) */}
                                            <div className="flex flex-col items-center justify-center bg-white border border-slate-200 text-slate-600 rounded w-[52px] h-[52px] shadow-sm shrink-0 group-hover:border-[#16a34a] group-hover:text-[#16a34a] transition-all">
                                                <span className="font-black text-[18px] leading-none">
                                                    {new Date(notice.date).getDate()}
                                                </span>
                                                <span className="font-bold text-[9px] uppercase tracking-widest mt-0.5">
                                                    {new Date(notice.date).toLocaleString('default', { month: 'short', year: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-[14px] md:text-[15px] font-bold text-slate-800 group-hover:text-[#16a34a] transition-colors truncate">
                                                        {notice.title}
                                                    </h3>
                                                    {notice.is_new && (
                                                        <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0 shadow-sm">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-1.5 text-[11px] font-semibold text-slate-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <FileText size={12} className="text-[#009ca6]" /> {notice.author}
                                                    </span>
                                                </div>
                                                <p className="text-[13px] text-slate-600 line-clamp-1">
                                                    {notice.description}
                                                </p>
                                            </div>
                                            
                                            {/* Action Icon */}
                                            <div className="hidden md:flex shrink-0 items-center justify-center text-slate-300 group-hover:text-[#16a34a] transition-colors self-center px-2">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                                        <Search size={20} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">No Notices Found</h3>
                                    <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
                                        There are currently no published notices available. Please check back later.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {notices.links && notices.links.length > 3 && (
                            <div className="p-3 border-t border-slate-200 bg-slate-50 flex flex-wrap justify-center gap-1">
                                {notices.links.map((link, index) => {
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-[12px] font-bold rounded transition-colors ${
                                                link.active 
                                                ? 'bg-[#16a34a] text-white border border-[#16a34a]' 
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                                            } ${!link.url && 'opacity-50 cursor-not-allowed hover:bg-white hover:text-slate-600'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
