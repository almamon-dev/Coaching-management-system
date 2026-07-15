import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { ChevronRight, FileText, Download, Calendar as CalendarIcon, BookOpen, AlertCircle } from 'lucide-react';

export default function Resources({ resources, currentType, pageTitle }) {
    
    // Helper to render the appropriate icon based on resource type
    const renderIcon = (type) => {
        switch (type) {
            case 'routine': return <CalendarIcon size={24} className="text-blue-500" />;
            case 'calendar': return <CalendarIcon size={24} className="text-amber-500" />;
            case 'syllabus': return <BookOpen size={24} className="text-emerald-500" />;
            default: return <FileText size={24} className="text-slate-500" />;
        }
    };

    return (
        <FrontendLayout>
            <Head title={`${pageTitle} - Academics`} />

            {/* Page Header */}
            <div className="bg-slate-900 py-6 md:py-8 relative overflow-hidden font-inter print:hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                    <div className="flex items-center gap-2 text-[#16a34a] font-bold text-[10px] uppercase tracking-wider mb-2">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={10} />
                        <span className="text-slate-400">Academics</span>
                        <ChevronRight size={10} />
                        <span className="text-slate-400">{pageTitle}</span>
                    </div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight max-w-4xl">
                        {pageTitle}
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-12 bg-slate-50 font-inter min-h-[60vh]">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    
                    {resources && resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.map((resource) => (
                                <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                                    <div className="p-5 flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                                            {renderIcon(resource.type)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[15px] text-slate-800 leading-tight mb-1">
                                                {resource.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium mb-4">
                                                {resource.academic_class && (
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                        Class {resource.academic_class.name}
                                                    </span>
                                                )}
                                                {resource.year && (
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                        Year {resource.year}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                                        {resource.file_path ? (
                                            <a 
                                                href={`/storage/${resource.file_path}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-[13px] font-bold text-[#16a34a] hover:text-[#15803d]"
                                            >
                                                <Download size={14} /> Download PDF
                                            </a>
                                        ) : (
                                            <span className="text-[13px] text-slate-400 italic">No file attached</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">No {pageTitle} Found</h3>
                            <p className="text-[14px] text-slate-500 max-w-md">
                                There are currently no {pageTitle.toLowerCase()} available for download. Please check back later or contact the administration.
                            </p>
                        </div>
                    )}

                </div>
            </section>
        </FrontendLayout>
    );
}
