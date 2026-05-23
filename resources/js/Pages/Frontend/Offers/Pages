import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Calendar, MapPin, Globe, Home, ChevronRight } from 'lucide-react';

export default function Index({ offers = [] }) {
    // Format date string beautifully (e.g. "13 May 2026")
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <>
            <Head title="Latest Special Offers & Deals" />

            {/* Breadcrumb Header */}
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
                            <span className="ml-2 text-slate-400">Offer</span>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="bg-[#f2f4f8] py-8">
                <div className="container mx-auto px-4">
                    {offers.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="text-slate-400" size={32} />
                            </div>
                            <h2 className="text-lg font-bold text-[#081621] mb-2">No Active Offers</h2>
                            <p className="text-sm text-slate-500">Currently, there are no active promotional offers. Please check back later!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {offers.map((offer) => {
                                const isOnlineOnly = offer.store_type?.toLowerCase().includes('online');
                                return (
                                    <div 
                                        key={offer.id} 
                                        className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 group"
                                    >
                                        {/* Image Banner */}
                                        <div className="relative aspect-video overflow-hidden bg-slate-100 border-b border-slate-100">
                                            <img 
                                                src={offer.image || 'https://www.startech.com.bd/image/catalog/logo.png'} 
                                                alt={offer.title} 
                                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Details & Info */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            {/* Meta Info Row */}
                                            <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold mb-4 border-b border-slate-100 pb-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span>
                                                        {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {isOnlineOnly ? (
                                                        <>
                                                            <Globe size={14} className="text-[#3749bb]" />
                                                            <span>Online</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MapPin size={14} className="text-[#4f46e5]" />
                                                            <span>{offer.store_type || 'All Outlet'}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-[17px] font-bold text-[#081621] text-center mb-2 leading-snug group-hover:text-[#4f46e5] transition-colors">
                                                {offer.title}
                                            </h3>

                                            {/* Short Description */}
                                            <p className="text-sm text-slate-500 text-center line-clamp-2 mb-6 font-medium leading-relaxed flex-1">
                                                {offer.description}
                                            </p>

                                            {/* View Details Button */}
                                            <div className="text-center mt-auto">
                                                <Link 
                                                    href={route('offers.show', offer.slug)}
                                                    className="inline-block px-8 py-2 bg-[#3749bb] hover:bg-[#081621] text-white font-bold text-[13px] rounded transition-colors shadow-xs hover:shadow-md"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

Index.layout = page => <FrontendLayout children={page} categories={page.props.categories} brands={page.props.brands} />;
