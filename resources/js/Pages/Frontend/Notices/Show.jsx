import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Calendar, User, Download, FileText, ChevronRight, Share2, Printer } from 'lucide-react';

export default function NoticeShow({ notice, recentNotices }) {
    // Helper to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <FrontendLayout>
            <Head title={`${notice.title} - Lohadi High School Notice`}>
                <style type="text/css" media="print">
                    {`
                        @page { size: A4 portrait; margin: 0; }
                        body { padding: 1.5cm; }
                        /* Ensure background graphics are printed if user enabled them, though we rely on CSS colors */
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    `}
                </style>
            </Head>

            {/* Print Only Header */}
            <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 pt-8">
                <img src="/images/logo_final.png" alt="Lohadi High School" className="h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Lohadi High School</h1>
                <p className="text-slate-600">Kapasia, Gazipur, Bangladesh</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">OFFICIAL NOTICE</h2>
                </div>
            </div>

            {/* Page Header (Hidden in Print) */}
            <div className="bg-slate-900 py-6 relative overflow-hidden font-inter print:hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                    <div className="flex items-center gap-2 text-[#16a34a] font-bold text-[10px] uppercase tracking-wider mb-2">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={10} />
                        <Link href={route('notices.index')} className="hover:text-white transition-colors">Notices</Link>
                        <ChevronRight size={10} />
                        <span className="text-slate-400">Notice Details</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black text-white leading-tight max-w-4xl">
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
                            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-none">
                                
                                {/* Print Only Title */}
                                <h1 className="hidden print:block text-2xl font-bold text-slate-900 mb-4 px-5 pt-5">
                                    {notice.title}
                                </h1>

                                {/* Meta Info Bar */}
                                <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 print:bg-white print:border-b-2 print:border-slate-800 print:px-5">
                                    <div className="flex items-center gap-5">
                                        <div className="flex items-center gap-2 text-slate-600 text-[12px] font-medium print:text-black">
                                            <Calendar size={14} className="text-[#009ca6] print:hidden" />
                                            <span><strong className="hidden print:inline">Date:</strong> {formatDate(notice.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 text-[12px] font-medium print:text-black">
                                            <User size={14} className="text-[#009ca6] print:hidden" />
                                            <span><strong className="hidden print:inline">Issued By:</strong> {notice.author}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 print:hidden">
                                        <button 
                                            onClick={() => window.print()}
                                            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors tooltip"
                                            title="Print Notice"
                                        >
                                            <Printer size={16} />
                                        </button>
                                        <button 
                                            className="p-1.5 text-slate-400 hover:text-[#16a34a] bg-white border border-slate-200 rounded hover:bg-green-50 transition-colors"
                                            title="Share Notice"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Notice Body */}
                                <div className="p-5 md:p-6 print:px-5 print:py-6">
                                    {notice.is_new && (
                                        <span className="inline-block bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider mb-4 shadow-sm print:hidden">
                                            Important Update
                                        </span>
                                    )}
                                    
                                    <div className="prose prose-slate max-w-none text-[14px] leading-relaxed text-slate-700 print:text-black">
                                        {notice.description.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-3">{paragraph}</p>
                                        ))}
                                    </div>

                                    {/* Attachment Section */}
                                    {notice.attachment && (
                                        <div className="mt-10 pt-6 border-t border-slate-100 print:hidden">
                                            <h3 className="text-[14px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <FileText size={18} className="text-rose-500" />
                                                Attached Documents
                                            </h3>
                                            <a 
                                                href="#"
                                                className="inline-flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-[#16a34a] hover:bg-green-50 transition-colors group w-full sm:w-auto"
                                            >
                                                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-md flex items-center justify-center shrink-0">
                                                    <Download size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-slate-800 group-hover:text-[#16a34a] transition-colors">{notice.attachment}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">PDF Document • Download</p>
                                                </div>
                                            </a>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Print Only Footer/Signature Area */}
                                <div className="hidden print:block mt-24 px-6">
                                    <div className="flex justify-end">
                                        <div className="text-center">
                                            <div className="w-48 border-t border-slate-800 mb-2"></div>
                                            <p className="font-bold text-black">{notice.author}</p>
                                            <p className="text-sm">Lohadi High School</p>
                                        </div>
                                    </div>
                                    <div className="mt-16 text-center text-sm text-slate-500 border-t border-slate-300 pt-4">
                                        Printed from Lohadi High School Official Portal (lohadihighschool.edu.bd)
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                        {/* Right Column (Sidebar) - Hidden in Print */}
                        <div className="lg:col-span-1 space-y-6 print:hidden">
                            
                            {/* Recent Notices Widget */}
                            <div className="bg-white border border-slate-200 shadow-sm rounded overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-200 p-3.5">
                                    <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                                        <FileText size={16} className="text-[#009ca6]" />
                                        Other Recent Notices
                                    </h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {recentNotices.length > 0 ? (
                                        recentNotices.map((recent) => (
                                            <Link 
                                                key={recent.id} 
                                                href={route('notices.show', recent.id)}
                                                className="block p-4 hover:bg-[#16a34a]/5 transition-colors group"
                                            >
                                                <p className="text-[13px] font-bold text-slate-800 group-hover:text-[#16a34a] transition-colors leading-snug mb-1.5 line-clamp-2">
                                                    {recent.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                                    <Calendar size={12} />
                                                    <span>{formatDate(recent.date)}</span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-slate-500 text-center">No other notices.</div>
                                    )}
                                </div>
                                <div className="bg-slate-50 p-2.5 border-t border-slate-200 text-center">
                                    <Link href={route('notices.index')} className="text-[11px] font-bold text-[#16a34a] hover:underline uppercase tracking-wider">
                                        View All Notices
                                    </Link>
                                </div>
                            </div>

                            {/* Important Links Widget */}
                            <div className="border border-[#009ca6]/20 shadow-sm overflow-hidden bg-[#f4fbfa] rounded">
                                <div className="bg-[#009ca6] py-2.5 px-3.5">
                                    <h3 className="text-[14px] font-bold text-white tracking-wide">Quick Links</h3>
                                </div>
                                <div className="flex flex-col py-2">
                                    {[
                                        'Academic Calendar',
                                        'Class Routines',
                                        'Exam Results',
                                        'Syllabus & Curriculum',
                                        'Rules & Regulations'
                                    ].map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={route('coming.soon')}
                                            className="py-2.5 px-5 text-[#333333] hover:text-[#009ca6] hover:bg-white/80 transition-colors text-[13px] font-semibold border-b border-slate-100/50 last:border-0 flex items-center justify-between group"
                                        >
                                            {link}
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-[#009ca6] transition-colors" />
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
