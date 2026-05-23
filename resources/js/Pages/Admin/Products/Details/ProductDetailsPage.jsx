/**
 * ProductDetailsPage Component
 * 
 * Displays comprehensive details about a specific product.
 * Includes inventory status, technical specs, and marketing campaigns.
 */
import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import {
    Edit, ShieldCheck, Package,
    Tag, CheckCircle2, List,
    Image as ImageIcon, Zap, Clock, FileText, Printer,
    ChevronRight, ShoppingCart, CreditCard, Ticket
} from 'lucide-react';

// Shared Utils & Components
import { cn } from '@/lib/utils';
import TextInput from '@/Components/TextInput';

// Local Components
import ProductPrintView from './Components/Print/ProductPrintView';

const ProductDetailsPage = ({ auth, product }) => {

    // --- Pagination & Filter State ---
    const [couponSearch, setCouponSearch] = useState('');
    const [couponPerPage, setCouponPerPage] = useState(5);
    const [couponPage, setCouponPage] = useState(1);

    const [brochureSearch, setBrochureSearch] = useState('');
    const [brochurePerPage, setBrochurePerPage] = useState(5);
    const [brochurePage, setBrochurePage] = useState(1);
    const [couponTab, setCouponTab] = useState('active'); // 'active', 'history'
    const [brochureTab, setBrochureTab] = useState('files'); // 'files', 'archive'

    // --- Computed Coupons ---
    const filteredCoupons = useMemo(() => {
        return (product.coupons || []).filter(c =>
            c.title?.toLowerCase().includes(couponSearch.toLowerCase()) ||
            c.code?.toLowerCase().includes(couponSearch.toLowerCase())
        );
    }, [product.coupons, couponSearch]);

    const paginatedCoupons = useMemo(() => {
        const start = (couponPage - 1) * couponPerPage;
        return filteredCoupons.slice(start, start + couponPerPage);
    }, [filteredCoupons, couponPage, couponPerPage]);

    const totalCouponPages = Math.ceil(filteredCoupons.length / couponPerPage);

    // --- Computed Brochures ---
    const filteredBrochures = useMemo(() => {
        return (product.brochures || []).filter(b =>
            b.title?.toLowerCase().includes(brochureSearch.toLowerCase())
        );
    }, [product.brochures, brochureSearch]);

    const paginatedBrochures = useMemo(() => {
        const start = (brochurePage - 1) * brochurePerPage;
        return filteredBrochures.slice(start, start + brochurePerPage);
    }, [filteredBrochures, brochurePage, brochurePerPage]);

    const totalBrochurePages = Math.ceil(filteredBrochures.length / brochurePerPage);

    // Function to handle print
    const handlePrint = () => {
        window.print();
    };

    // Formatting currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(price || 0).replace('BDT', '৳');
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title={`${product.name} - Star Tech Style`} />

            <div className="max-w-full mx-auto p-6 pb-12 bg-white shadow-sm border-x border-slate-50 min-h-screen">

                {/* 1. Breadcrumbs & Actions */}
                <div className="flex items-center justify-between py-3 border-b border-slate-100 mb-4 print:hidden">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400 uppercase tracking-wider">
                        <Link href={route('admin.products.index')} className="hover:text-[#ef4a23]">Products</Link>
                        <ChevronRight size={12} />
                        <span className="text-slate-600 font-bold">{product.brand?.name}</span>
                        <ChevronRight size={12} />
                        <span className="text-[#ef4a23] font-bold">{product.sku}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handlePrint} className="h-9 px-4 border border-slate-200 text-slate-500 rounded-[2px] text-[11px] font-bold uppercase flex items-center gap-2 hover:bg-slate-50 transition-all">
                            <Printer size={14} /> Print
                        </button>
                        <Link href={route("admin.products.edit", product.id)} className="h-9 px-5 bg-[#081621] text-white rounded-[2px] text-[11px] font-bold uppercase flex items-center gap-2 hover:bg-[#ef4a23] transition-all shadow-md shadow-[#ef4a23]/10">
                            <Edit size={14} /> Edit
                        </Link>
                    </div>
                </div>
                {/* 2. Product Identity Section - Redesigned to be Left-Aligned & High-Density */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-50">
                    <div className="flex-1">
                        <h1 className="text-[18px] font-medium text-[#081621] leading-tight tracking-tight mb-2">
                            {product.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-[1px] text-[9px]">
                                <Package size={10} />
                                SKU: {product.sku}
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-0.5 border rounded-[1px] text-[9px]",
                                Boolean(product.status) ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                            )}>
                                <CheckCircle2 size={10} />
                                {Boolean(product.status) ? "In Stock" : "Out of Stock"}
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-[1px] text-[9px]">
                                <Tag size={10} />
                                Brand: {product.brand?.name}
                            </div>
                            {product.coupons_count > 0 && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#ef4a23]/5 text-[#ef4a23] border border-[#ef4a23]/10 rounded-[1px] text-[9px] font-bold">
                                    <Tag size={10} />
                                    {product.coupons_count} Active Coupons
                                </div>
                            )}
                            {product.brochures_count > 0 && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-[1px] text-[9px] font-bold">
                                    <FileText size={10} />
                                    {product.brochures_count} Brochures
                                </div>
                            )}
                            {product.has_emi && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-[1px] text-[9px]">
                                    <CreditCard size={10} />
                                    EMI Available
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-4 bg-[#FAFBFD] p-3.5 rounded-[1px] border border-slate-100 shadow-sm">
                        <div className="text-right border-r border-slate-200 pr-4">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Cash Price</p>
                            <p className="text-[20px] font-black text-[#ef4a23] leading-none tracking-tight">
                                {formatPrice(product.discount_price || product.price)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Regular Price</p>
                            <p className="text-[16px] font-bold text-slate-400 leading-none line-through decoration-slate-300">
                                {formatPrice(product.price * 1.1)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Main Content: Image & Key Info */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    {/* Left: Product Image */}
                    <div className="lg:col-span-5">
                        <div className="border border-slate-100 rounded-[4px] p-6 bg-white sticky top-24">
                            <img
                                src={product.primary_image?.full_url || (product.images?.[0]?.full_url)}
                                className="w-full h-auto object-contain max-h-[400px]"
                                alt={product.name}
                            />
                            <div className="grid grid-cols-5 gap-2 mt-4">
                                {product.images?.slice(0, 5).map((img, i) => (
                                    <div key={i} className="aspect-square border border-slate-100 rounded-[2px] p-1 hover:border-[#ef4a23] transition-all cursor-pointer overflow-hidden">
                                        <img src={img.full_url} className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Key Features & Payment */}
                    <div className="lg:col-span-7">
                        <h2 className="text-[15px] font-bold text-[#081621] mb-4 uppercase tracking-tight">Key Features</h2>

                        <div className="space-y-2.5 mb-6">
                            {product.features?.length > 0 ? product.features.map((f, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#ef4a23]"></div>
                                    <p className="text-[13px] text-slate-700 font-medium leading-none">{f.feature}</p>
                                </div>
                            )) : (
                                <p className="text-slate-400 italic text-[13px]">No features listed.</p>
                            )}
                            <Link href="#specifications" className="inline-block text-[#ef4a23] text-[12px] font-bold border-b border-[#ef4a23] pb-0.5 mt-2 hover:text-[#081621] hover:border-[#081621] transition-all cursor-pointer">
                                View More Info
                            </Link>
                        </div>

                        {/* Payment Box (Star Tech Style) */}
                        <div className="bg-[#FAFBFD] border border-slate-100 rounded-[1px] p-5 shadow-sm">
                            <h3 className="text-[13px] font-bold text-[#081621] mb-4">Payment Options</h3>

                            <div className={cn("grid gap-3", product.has_emi ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                                {/* Cash Price */}
                                <div className="bg-white border-2 border-[#ef4a23]/20 hover:border-[#ef4a23] p-4 rounded-[1px] relative cursor-pointer group transition-all">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[20px] font-bold text-[#081621] leading-none group-hover:text-[#ef4a23]">{formatPrice(product.discount_price || product.price)}</span>
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#ef4a23] flex items-center justify-center p-0.5">
                                            <div className="w-full h-full rounded-full bg-[#ef4a23]"></div>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Cash Price</p>
                                    <p className="text-[9px] font-medium text-slate-400 italic">Online Payment / Cash</p>
                                </div>

                                {/* EMI Price */}
                                {Boolean(product.has_emi) && (
                                    <div className="bg-white border border-slate-200 hover:border-[#ef4a23] p-4 rounded-[1px] cursor-pointer group transition-all">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[20px] font-bold text-slate-400 group-hover:text-[#081621]">{formatPrice(product.emi_monthly || (product.price / 12))}</span>
                                            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 group-hover:border-[#ef4a23]"></div>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Monthly EMI</p>
                                        <p className="text-[9px] font-medium text-slate-400 italic">0% EMI for {product.emi_duration || 12} Months</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-[12px] font-bold text-slate-700">
                                    <ShieldCheck size={16} className="text-[#ef4a23]" />
                                    <span>Warranty: {product.warranty || "1 Year Official Warranty"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[12px] font-bold text-slate-700">
                                    <ShoppingCart size={16} className="text-[#ef4a23]" />
                                    <span>Delivery: Home Delivery & Store Pickup Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                {/* 4. Specifications & Attributes Section */}
                <div id="specifications" className="pt-6 border-t border-slate-100 scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-[16px] font-bold text-[#081621] mb-4 uppercase tracking-tight flex items-center gap-2">
                            <List size={16} className="text-[#ef4a23]" /> Technical Specification
                        </h2>
                        <div className="border border-slate-100 rounded-[4px] overflow-hidden">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-slate-50">
                                    {product.tech_specs?.length > 0 ? product.tech_specs.map((s, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-2.5 text-[11px] font-bold text-slate-400 w-[40%] bg-slate-50/20">{s.spec_key}</td>
                                            <td className="px-4 py-2.5 text-[12px] font-bold text-[#081621]">{s.spec_value}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="2" className="px-4 py-8 text-center text-slate-300 italic text-[12px]">No specs defined.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-[16px] font-bold text-[#081621] mb-4 uppercase tracking-tight flex items-center gap-2">
                            <Zap size={16} className="text-[#ef4a23]" /> Filtering Attributes
                        </h2>
                        <div className="border border-slate-100 rounded-[4px] overflow-hidden">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-slate-50">
                                    {product.attribute_values?.length > 0 ? product.attribute_values.map((av, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-2.5 text-[11px] font-bold text-slate-400 w-[40%] bg-slate-50/20">{av.attribute?.name}</td>
                                            <td className="px-4 py-2.5 text-[12px] font-bold text-[#ef4a23]">
                                                {av.attribute_value?.value || av.value_text || 'N/A'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="2" className="px-4 py-8 text-center text-slate-300 italic text-[12px]">No filtering attributes linked.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 5. Product Description Section */}
                <div className="mt-10 pt-6 border-t border-slate-100 mb-10">
                    <h2 className="text-[18px] font-bold text-[#081621] mb-4 uppercase tracking-tight">Description</h2>
                    <div
                        className="prose prose-slate max-w-none text-[15px] text-slate-600 font-medium leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </div>                {/* 6. Marketing Records: Coupons & Brochures - Two Column High Fidelity Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-1 gap-12 pt-12 border-t border-slate-100">

                    {/* Voucher Records Section */}
                    <div className="bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[16px] font-medium text-[#081621]">Coupon Records</h3>
                        </div>
                        {/* Tabs Style (Matching Screenshot) */}
                        <div className="flex items-center gap-8 border-b border-slate-100 mb-6 px-1">
                            <button
                                onClick={() => setCouponTab('active')}
                                className={cn(
                                    "pb-3 text-[13px] font-normal whitespace-nowrap transition-all border-b-2",
                                    couponTab === 'active' ? "border-[#ef4a23] text-[#ef4a23]" : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Active Coupons ({filteredCoupons.length})
                            </button>
                            <button
                                onClick={() => setCouponTab('history')}
                                className={cn(
                                    "pb-3 text-[13px] font-normal whitespace-nowrap transition-all border-b-2",
                                    couponTab === 'history' ? "border-[#ef4a23] text-[#ef4a23]" : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Coupon History
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {couponTab === 'active' ? (
                                filteredCoupons.length > 0 ? filteredCoupons.map((coupon, i) => (
                                    <div key={i} className="group relative bg-white border border-slate-100 rounded-[1px] p-3 hover:border-[#ef4a23] transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-[1px] bg-[#ef4a23]/5 flex items-center justify-center text-[#ef4a23] font-bold text-[14px] border border-[#ef4a23]/10">
                                                %
                                            </div>
                                            <div className="flex flex-col">
                                                <h4 className="text-[13px] font-bold text-[#081621] leading-tight group-hover:text-[#ef4a23] transition-colors">{coupon.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-[#ef4a23] tracking-widest uppercase">{coupon.code}</span>
                                                    <span className="text-[10px] text-slate-300">•</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{coupon.used_count || 0} / {coupon.usage_limit || '∞'} USED</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[13px] font-black text-[#ef4a23] leading-none">
                                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `৳${coupon.discount_value}`}
                                                </p>
                                                <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">
                                                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'FOREVER'}
                                                </p>
                                            </div>
                                            <Link
                                                href={route("admin.marketing.campaigns.edit", coupon.id)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-300 border border-slate-100 rounded-[1px] hover:bg-[#081621] hover:text-white transition-all"
                                            >
                                                <Edit size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[1px]">
                                        <Ticket size={24} className="text-slate-200 mb-2" />
                                        <p className="text-[13px] font-bold text-slate-400">No Active Vouchers</p>
                                    </div>
                                )
                            ) : (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[1px]">
                                    <Clock size={24} className="text-slate-200 mb-2" />
                                    <p className="text-[13px] font-bold text-slate-400">No Coupon History</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Print View (Hidden in Browser, Visible in Print) */}
            <ProductPrintView product={product} />

            {/* Global Print Styles */}
            <style>{`
                @media print {
                    @page { 
                        margin: 0; 
                    }
                    
                    /* Hide everything */
                    body * {
                        visibility: hidden;
                    }
                    
                    /* Show only the print view and its children */
                    .print-view, .print-view * {
                        visibility: visible;
                    }
                    
                    /* Position the print view at the top-left */
                    .print-view {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        display: block !important;
                        padding: 0; /* Handled by internal table spacing */
                    }

                    /* Remove unwanted gaps */
                    body, html {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                }
            `}</style>
        </AdminLayout>
    );
};

export default ProductDetailsPage;
