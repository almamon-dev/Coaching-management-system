import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Calendar, MapPin, Globe, Home, ChevronRight, ArrowLeft } from 'lucide-react';

export default function Show({ offer }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const isOnlineOnly = offer.store_type?.toLowerCase().includes('online');

    return (
        <>
            <Head title={`${offer.title} - Special Offer`} />

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-slate-200 py-3 shadow-xs">
                <div className="container mx-auto px-4">
                    <ol className="flex items-center space-x-2 text-[13px] text-slate-500 font-medium">
                        <li>
                            <Link href="/" className="hover:text-[#4f46e5] transition-colors flex items-center gap-1">
                                <Home size={14} className="mt-[-2px]" />
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <ChevronRight size={14} className="text-slate-400" />
                            <Link href="/offer" className="ml-2 hover:text-[#4f46e5] transition-colors">
                                Offer
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <ChevronRight size={14} className="text-slate-400" />
                            <span className="ml-2 text-slate-400 truncate max-w-[200px] md:max-w-none">{offer.title}</span>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Main Section */}
            <main className="bg-[#f2f4f8] py-8">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Back to all offers button */}
                    <div className="mb-6">
                        <Link 
                            href="/offer" 
                            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#4f46e5] font-bold text-sm transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Offers</span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
                        {/* High-res Banner Image */}
                        <div className="aspect-video w-full bg-slate-100 max-h-[480px] overflow-hidden flex items-center justify-center border-b border-slate-200">
                            <img 
                                src={offer.image || 'https://www.startech.com.bd/image/catalog/logo.png'} 
                                alt={offer.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Title and Short Description */}
                        <div className="p-6 md:p-8 border-b border-slate-100">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-[#081621] mb-3 leading-tight">
                                {offer.title}
                            </h1>
                            <p className="text-slate-600 text-base font-medium leading-relaxed">
                                {offer.description}
                            </p>
                        </div>

                        {/* Offer Meta Information Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f8fafc] p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3 bg-white p-4 rounded border border-slate-100 shadow-2xs">
                                <div className="p-2.5 bg-slate-100 rounded text-slate-500">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Campaign Period</p>
                                    <p className="text-[14px] text-slate-700 font-bold mt-0.5">
                                        {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-4 rounded border border-slate-100 shadow-2xs">
                                <div className="p-2.5 bg-slate-100 rounded text-slate-500">
                                    {isOnlineOnly ? <Globe size={20} className="text-[#3749bb]" /> : <MapPin size={20} className="text-[#4f46e5]" />}
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Applicable Location</p>
                                    <p className="text-[14px] text-slate-700 font-bold mt-0.5">
                                        {offer.store_type || 'All Outlet'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Description/HTML Content */}
                        {offer.details && (
                            <div className="p-6 md:p-8">
                                <h2 className="text-[18px] font-bold text-[#081621] mb-4 pb-2 border-b border-slate-200">
                                    Offer Details & Conditions
                                </h2>
                                <div 
                                    className="prose max-w-none text-slate-600 text-[14px] leading-relaxed space-y-4"
                                    dangerouslySetInnerHTML={{ __html: offer.details }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

Show.layout = page => <FrontendLayout children={page} categories={page.props.categories} brands={page.props.brands} />;
