/**
 * CouponCreatePage Component
 * 
 * Interface for configuring and launching new discount campaigns.
 * Handles basic info, discount logic, usage limits, and product applicability.
 */
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { 
    ArrowLeft, ShieldCheck, Zap, Clock, Globe, 
    Send, X, Sparkles, Info
} from 'lucide-react';

// Shared Utilities
import Notify from '@/Utils/Notify';

// Local Components
import BasicInfoTab from '../Components/BasicInfoTab';
import DiscountLogicTab from '../Components/DiscountLogicTab';
import UsageExpiryTab from '../Components/UsageExpiryTab';
import ApplicabilityTab from '../Components/ApplicabilityTab';

const CouponCreatePage = ({ auth, categories, products }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'coupon',
        title: '',
        code: '',
        discount_type: 'fixed',
        discount_value: '',
        min_purchase: 0,
        expires_at: '',
        usage_limit: '',
        status: 1,
        applies_to: 'all',
        target_ids: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.marketing.campaigns.store'), {
            onSuccess: () => {
                Notify.success('Coupon Created', 'The discount code is now active.');
                reset();
            },
            onError: () => Notify.error('Action Failed', 'Please check for validation errors.')
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Create Coupon" />

            <div className="max-w-[1200px] mx-auto pb-20">
                {/* Header Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.marketing.coupons.index')}
                            className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-[#ef4a23] hover:border-[#ef4a23] transition-all active:scale-95 shadow-sm"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Add New Coupon</h1>
                            <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Configure promotional rules and discount codes</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.marketing.coupons.index')}
                            className="h-[38px] px-5 bg-white border border-slate-300 text-[#202223] rounded-[3px] font-bold text-[12px] hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <X size={16} /> Cancel
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="h-[38px] px-6 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {processing ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                            Publish Coupon
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Form Cards (Col 1-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 1. Basic Information */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <ShieldCheck size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Basic Information</h3>
                            </div>
                            <div className="p-8">
                                <BasicInfoTab data={data} setData={setData} errors={errors} />
                            </div>
                        </div>

                        {/* 2. Discount Configuration */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <Zap size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Discount Configuration</h3>
                            </div>
                            <div className="p-8">
                                <DiscountLogicTab data={data} setData={setData} errors={errors} />
                            </div>
                        </div>

                        {/* 3. Usage & Expiry */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <Clock size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Usage & Expiry</h3>
                            </div>
                            <div className="p-8">
                                <UsageExpiryTab data={data} setData={setData} errors={errors} />
                            </div>
                        </div>

                        {/* 4. Applicability */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <Globe size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Coupon Applicability</h3>
                            </div>
                            <div className="p-8">
                                <ApplicabilityTab
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    categories={categories}
                                    products={products}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Col 9-12) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Status Card */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <Sparkles size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Visibility</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[4px] border border-slate-100">
                                    <div>
                                        <p className="text-[13px] font-bold text-[#202223]">Coupon Status</p>
                                        <p className="text-[11px] text-slate-500 font-medium">Control code active state</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('status', data.status === 1 ? 0 : 1)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${data.status === 1 ? 'bg-[#008060]' : 'bg-slate-300'}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.status === 1 ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Guidelines Card */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="p-6">
                                <h4 className="text-[12px] font-bold mb-6 flex items-center gap-2.5 text-[#008060]">
                                    <div className="w-6 h-6 bg-[#008060]/10 flex items-center justify-center rounded-[1px]">
                                        <Info size={14} />
                                    </div>
                                    Coupon Guidelines
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        'Use codes like SUMMER20 for better recall.',
                                        'Avoid overlapping category-wide discounts.',
                                        'Set realistic usage limits to manage budget.',
                                        'Clearly communicate expiry dates to users.'
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-2 text-[11px] text-slate-500 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#008060] mt-1 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CouponCreatePage;
