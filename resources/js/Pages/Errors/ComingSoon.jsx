import React from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link } from '@inertiajs/react';
import { Wrench } from 'lucide-react';

export default function ComingSoon() {
    return (
        <FrontendLayout>
            <Head title="Coming Soon - Lohadi High School" />
            
            <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] text-center font-inter">
                <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                    <Wrench size={48} strokeWidth={1.5} />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Under Construction</h1>
                <p className="text-lg text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
                    We are currently working hard to build this page. It will be available very soon. Thank you for your patience!
                </p>
                
                <Link href="/" className="inline-flex px-8 py-3 bg-[#16a34a] text-white font-bold rounded-sm hover:bg-[#15803d] transition-colors shadow-sm">
                    Go Back Home
                </Link>
            </div>
        </FrontendLayout>
    );
}
