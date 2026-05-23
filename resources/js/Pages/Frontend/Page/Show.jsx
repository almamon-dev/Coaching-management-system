import React from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function Show({ page, categories, brands }) {
    return (
        <FrontendLayout categories={categories} brands={brands}>
            <Head title={`${page.meta_title || page.title} - GadgetZone`}>
                <meta name="description" content={page.meta_description || ''} />
            </Head>

            <div className="w-full bg-white min-h-[60vh] pb-12">
                {/* Breadcrumb */}
                <div className="py-4 bg-white border-b border-slate-200/60">
                    <div className="container mx-auto px-4 flex items-center gap-2 text-[13px]">
                        <Link href="/" className="text-gray-600 hover:text-[#4f46e5] px-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </Link>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-gray-400">{page.title}</span>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto bg-white">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                            {page.title}
                        </h1>

                        {/* Rich Dynamic Content */}
                        <div 
                            className="dynamic-content text-slate-700 text-[14px] leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </div>

                {/* Scope CSS to style HTML tags inside the database safely */}
                <style dangerouslySetInnerHTML={{__html: `
                    .dynamic-content > h1:first-child { display: none; }
                    .dynamic-content h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
                    .dynamic-content h2 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-top: 1.5rem; margin-bottom: 0.5rem; }
                    .dynamic-content h3 { font-size: 1.1rem; font-weight: 600; color: #334155; margin-top: 1.25rem; margin-bottom: 0.5rem; }
                    .dynamic-content p { margin-bottom: 1rem; color: #475569; }
                    .dynamic-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                    .dynamic-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
                    .dynamic-content li { margin-bottom: 0.25rem; color: #475569; }
                    .dynamic-content strong { font-weight: 600; color: #0f172a; }
                    .dynamic-content a { color: #4f46e5; text-decoration: underline; }
                    .dynamic-content a:hover { color: #4338ca; }
                `}} />
            </div>
        </FrontendLayout>
    );
}
