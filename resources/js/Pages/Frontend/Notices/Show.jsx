import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Calendar, User, Download, FileText, ChevronRight, Share2, Printer, ArrowLeft } from 'lucide-react';

export default function NoticeShow({ notice = {}, recentNotices = [], settings = {} }) {
    const { settings: globalSettings } = usePage().props;
    const centerName = settings?.center_name || globalSettings?.center_name || "Ullash Coaching Center";
    const address = settings?.address || globalSettings?.address || "Dhaka, Bangladesh";

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-GB', options);
        } catch {
            return dateString;
        }
    };

    const getMonthAbbr = (dateString, fallback = 'NOV') => {
        if (!dateString) return fallback;
        try {
            return new Date(dateString).toLocaleString('default', { month: 'short' }).toUpperCase();
        } catch {
            return fallback;
        }
    };

    const getDayNum = (dateString, fallback = '16') => {
        if (!dateString) return fallback;
        try {
            return new Date(dateString).getDate();
        } catch {
            return fallback;
        }
    };

    return (
        <FrontendLayout>
            <Head title={`${notice.title || 'Notice Details'} - ${centerName}`}>
                <style type="text/css" media="print">
                    {`
                        @page { size: A4 portrait; margin: 0; }
                        body { padding: 1.5cm; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    `}
                </style>
            </Head>

            {/* Print Only Header */}
            <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 pt-8">
                <img src="/images/Logo.png" alt="Logo" className="h-14 mx-auto mb-4 object-contain" />
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">{centerName}</h1>
                <p className="text-slate-600">{address}</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">OFFICIAL NOTICE</h2>
                </div>
            </div>

            {/* Page Header Banner (Hidden in Print) */}
            <div className="bg-[#009ca6] text-white py-12 md:py-14 relative overflow-hidden font-inter print:hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3.5 shadow-xs">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link href={route('notices.index')} className="hover:text-emerald-200 transition-colors">Notices</Link>
                        <ChevronRight size={12} />
                        <span>Details</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-3xl mx-auto">
                        {notice.title}
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-8 bg-transparent font-inter print:py-0 print:bg-white">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:grid-cols-1 print:block">
                        
                        {/* Left Content Column (Notice Details) */}
                        <div className="lg:col-span-2 print:col-span-1">
                            <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs overflow-hidden print:shadow-none print:border-none">
                                
                                {/* Print Only Title */}
                                <h1 className="hidden print:block text-2xl font-bold text-slate-900 mb-4 px-5 pt-5">
                                    {notice.title}
                                </h1>

                                {/* Meta Header with Tear-off Calendar Date Badge */}
                                <div className="bg-white border-b border-slate-200/90 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:bg-white print:border-b-2 print:border-slate-800 print:px-5">
                                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                                        {/* Tear-off Calendar Date Card */}
                                        <div className="flex flex-col items-center rounded-[4px] overflow-hidden border border-slate-200/90 bg-white shadow-2xs shrink-0 w-16">
                                            <div className="w-full bg-[#009ca6] text-white text-[11px] font-black uppercase tracking-wider text-center py-1 leading-none">
                                                {notice.month || getMonthAbbr(notice.date, 'NOV')}
                                            </div>
                                            <div className="w-full py-2 flex items-center justify-center bg-white">
                                                <span className="font-black text-2xl text-slate-800 leading-none">
                                                    {notice.day || getDayNum(notice.date, '16')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <span className="px-2 py-0.5 bg-teal-50 text-[#009ca6] border border-teal-200/80 text-[10px] sm:text-[10.5px] font-bold rounded-[3px] uppercase tracking-wide">
                                                    Official Notice
                                                </span>
                                                {notice.category && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] sm:text-[10.5px] font-semibold rounded-[3px]">
                                                        {notice.category}
                                                    </span>
                                                )}
                                                {notice.is_new && (
                                                    <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider shrink-0 shadow-2xs">
                                                        Important Update
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-[#009ca6] print:hidden" />
                                                    <span><strong className="hidden print:inline">Date: </strong>{formatDate(notice.date)}</span>
                                                </div>
                                                {notice.author && (
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={13} className="text-[#009ca6] print:hidden" />
                                                        <span><strong className="hidden print:inline">Issued By: </strong><strong className="text-slate-700 font-semibold">{notice.author}</strong></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons: Print & Share */}
                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center print:hidden">
                                        <button 
                                            onClick={() => window.print()}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-[4px] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                            title="Print Notice"
                                        >
                                            <Printer size={14} className="text-[#009ca6]" />
                                            <span>Print</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({ title: notice.title, url: window.location.href });
                                                } else {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    alert('Notice link copied to clipboard!');
                                                }
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-[#009ca6] bg-slate-50 hover:bg-teal-50/50 border border-slate-200/90 hover:border-teal-200 rounded-[4px] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                            title="Share Notice"
                                        >
                                            <Share2 size={14} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Notice Body */}
                                <div className="p-5 md:p-6 print:px-5 print:py-6">
                                    <div className="prose prose-slate max-w-none text-[14px] leading-relaxed text-slate-700 print:text-black">
                                        {notice.description ? (
                                            notice.description.split('\n').map((paragraph, idx) => (
                                                <p key={idx} className="mb-3">{paragraph}</p>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 italic">No description provided for this notice.</p>
                                        )}
                                    </div>

                                    {/* Attachment Section */}
                                    {notice.attachment && (
                                        <div className="mt-8 pt-6 border-t border-slate-100 print:hidden">
                                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <FileText size={16} className="text-rose-500" />
                                                Attached Documents
                                            </h3>
                                            <a 
                                                href="#"
                                                className="inline-flex items-center gap-3 p-3.5 border border-slate-200/90 rounded-[4px] hover:border-[#009ca6] hover:bg-teal-50/30 transition-all group w-full sm:w-auto shadow-2xs"
                                            >
                                                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-[3px] border border-rose-100 flex items-center justify-center shrink-0">
                                                    <Download size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-slate-800 group-hover:text-[#009ca6] transition-colors">{notice.attachment}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">Official Notice Document • Click to Download</p>
                                                </div>
                                            </a>
                                        </div>
                                    )}

                                    {/* Back to Notices Link */}
                                    <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between print:hidden">
                                        <Link 
                                            href={route('notices.index')}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#009ca6] transition-colors"
                                        >
                                            <ArrowLeft size={14} />
                                            <span>Back to Notice Board</span>
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Print Only Footer/Signature Area */}
                                <div className="hidden print:block mt-24 px-6">
                                    <div className="flex justify-end">
                                        <div className="text-center">
                                            <div className="w-48 border-t border-slate-800 mb-2"></div>
                                            <p className="font-bold text-black">{notice.author}</p>
                                            <p className="text-sm">{centerName}</p>
                                        </div>
                                    </div>
                                    <div className="mt-16 text-center text-sm text-slate-500 border-t border-slate-300 pt-4">
                                        Printed from {centerName} Official Portal
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                        {/* Right Column (Sidebar) - Hidden in Print */}
                        <div className="lg:col-span-1 space-y-6 print:hidden">
                            
                            {/* Recent Notices Widget */}
                            <div className="bg-white border border-slate-200/90 shadow-2xs rounded-[4px] overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                                    <h3 className="text-[13.5px] font-bold text-slate-900 flex items-center gap-2">
                                        <FileText size={15} className="text-[#009ca6]" />
                                        Other Recent Notices
                                    </h3>
                                    {recentNotices && recentNotices.length > 0 && (
                                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-[3px]">
                                            {recentNotices.length} Notices
                                        </span>
                                    )}
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {recentNotices && recentNotices.length > 0 ? (
                                        recentNotices.map((recent) => (
                                            <Link 
                                                key={recent.id} 
                                                href={route('notices.show', recent.id)}
                                                className="flex items-start gap-3 p-3.5 hover:bg-teal-50/25 transition-all group cursor-pointer"
                                            >
                                                {/* Tear-off Calendar Date Badge (Exact match to screenshot) */}
                                                <div className="flex flex-col items-center rounded-[4px] overflow-hidden border border-slate-200/90 bg-white shadow-2xs shrink-0 w-14 group-hover:border-[#009ca6] group-hover:shadow-xs transition-all mt-0.5">
                                                    <div className="w-full bg-[#009ca6] group-hover:bg-[#008790] text-white text-[10px] font-black uppercase tracking-wider text-center py-0.5 leading-tight transition-colors">
                                                        {recent.month || getMonthAbbr(recent.date, 'JUL')}
                                                    </div>
                                                    <div className="w-full py-1.5 flex items-center justify-center bg-white group-hover:bg-teal-50/20 transition-colors">
                                                        <span className="font-black text-lg text-slate-800 leading-none group-hover:text-[#009ca6] transition-colors">
                                                            {recent.day || getDayNum(recent.date, '28')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12.5px] font-bold text-slate-800 group-hover:text-[#009ca6] transition-colors leading-snug line-clamp-2 mb-1">
                                                        {recent.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-medium">
                                                        <span>{formatDate(recent.date)}</span>
                                                        {recent.category && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-slate-500">{recent.category}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-4 text-xs text-slate-500 text-center">No other notices.</div>
                                    )}
                                </div>
                                <div className="bg-slate-50/80 p-2.5 border-t border-slate-200/80 text-center">
                                    <Link 
                                        href={route('notices.index')} 
                                        className="text-[11px] font-bold text-[#009ca6] hover:text-[#007f87] uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                                    >
                                        <span>View All Notices</span>
                                        <ChevronRight size={13} />
                                    </Link>
                                </div>
                            </div>

                            {/* Important Quick Links Widget */}
                            <div className="border border-[#009ca6]/30 shadow-2xs overflow-hidden bg-[#f4fbfa] rounded-[4px]">
                                <div className="bg-[#009ca6] py-2.5 px-3.5">
                                    <h3 className="text-[13px] font-bold text-white tracking-wide uppercase">Quick Links</h3>
                                </div>
                                <div className="flex flex-col py-1.5">
                                    {[
                                        { title: 'Notice Board', url: route('notices.index') },
                                        { title: 'Academic Courses & Programs', url: '/#courses' },
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
                                            className="py-2.5 px-4 text-[#333333] hover:text-[#009ca6] hover:bg-white/80 transition-colors text-[12.5px] font-semibold border-b border-slate-100/60 last:border-0 flex items-center justify-between group"
                                        >
                                            <span>{link.title}</span>
                                            <ChevronRight size={13} className="text-slate-300 group-hover:text-[#009ca6] group-hover:translate-x-0.5 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
