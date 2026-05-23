/**
 * OfferCreatePage Component
 *
 * Interface for publishing new promotional offers and banners.
 * Styled in perfect alignment with the standardized admin create page structure
 * using pre-existing custom UI components.
 */
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import {
    ArrowLeft, ShieldCheck, Calendar, FileImage,
    Send, X, Sparkles, Info
} from 'lucide-react';

// Pre-existing Custom Components
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import SelectInput from '@/Components/SelectInput';
import RichTextEditor from '@/Components/RichTextEditor';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

// Shared Utilities
import Notify from '@/Utils/Notify';

export default function OfferCreatePage({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        slug: '',
        description: '',
        image_file: null,
        image_url: '',
        start_date: '',
        end_date: '',
        store_type: 'Online',
        status: 1, // 1 for active, 0 for inactive
        details: '',
    });

    const [filePreview, setFilePreview] = React.useState(null);

    React.useEffect(() => {
        if (data.image_file) {
            const objectUrl = URL.createObjectURL(data.image_file);
            setFilePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setFilePreview(null);
        }
    }, [data.image_file]);

    const activePreviewUrl = filePreview || data.image_url;

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        setData(prev => ({
            ...prev,
            title,
            slug
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.marketing.offers.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                Notify.success('Offer Created', 'The promotional offer has been published.');
                reset();
            },
            onError: () => Notify.error('Action Failed', 'Please check for validation errors.')
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Create Offer" />

            <div className="max-w-ull mx-auto pb-20">
                {/* Header Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Add New Offer</h1>
                            <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Configure promotional banners and active campaign details</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.marketing.offers.index')}
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
                            Publish Offer
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

                            <div className="p-8 space-y-5">
                                <div>
                                    <InputLabel value="Offer Title *" />
                                    <TextInput
                                        type="text"
                                        placeholder="e.g. Eid Utshob Deal, bKash 1000tk Cashback"
                                        value={data.title}
                                        onChange={handleTitleChange}
                                        required
                                    />
                                    <InputError message={errors.title} />
                                    <InputError message={errors.slug} />
                                </div>

                                <div>
                                    <InputLabel value="Short Summary / Description" />
                                    <TextArea
                                        placeholder="A brief one-two sentence overview of the offer to display on cards..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>
                        </div>

                        {/* 2. Detailed Content Editor */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <Info size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Terms, Conditions & Details</h3>
                            </div>
                            <div className="p-8">
                                <InputLabel value="Detailed Description" />
                                <RichTextEditor
                                    value={data.details}
                                    onChange={(content) => setData('details', content)}
                                    placeholder="Write detailed terms and conditions of the offer..."
                                />
                                <InputError message={errors.details} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Col 9-12) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Visibility Card */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <Sparkles size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Visibility</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[4px] border border-slate-100">
                                    <div>
                                        <p className="text-[13px] font-bold text-[#202223]">Active Status</p>
                                        <p className="text-[11px] text-slate-500 font-medium">Show offer on the store frontend</p>
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

                                <div>
                                    <InputLabel value="Store / Outlet Type *" />
                                    <SelectInput
                                        value={data.store_type}
                                        onChange={(e) => setData('store_type', e.target.value)}
                                        options={[
                                            { id: 'Online', name: 'Online Only' },
                                            { id: 'All Outlet', name: 'All Outlet' }
                                        ]}
                                    />
                                    <InputError message={errors.store_type} />
                                </div>
                            </div>
                        </div>

                        {/* Campaign Duration Card */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-600">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <Calendar size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Campaign Period</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <InputLabel value="Start Date" />
                                    <TextInput
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div>
                                    <InputLabel value="End Date" />
                                    <TextInput
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>
                        </div>

                        {/* Banner Image Card */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#f4f6f8] flex items-center justify-center rounded-[3px] text-[#202223]">
                                    <FileImage size={18} />
                                </div>
                                <h3 className="text-[14px] font-bold text-[#202223]">Promo Banner</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Banner Live Preview */}
                                <div className="mb-4">
                                    <InputLabel value="Live Banner Preview" />
                                    {activePreviewUrl ? (
                                        <div className="relative group rounded-[4px] border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center min-h-[140px] max-h-[180px] shadow-xs transition-all duration-300 hover:shadow-md">
                                            <img
                                                src={activePreviewUrl}
                                                alt="Banner Preview"
                                                className="max-w-full max-h-[180px] object-contain transition-transform duration-500 group-hover:scale-102"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                                                }}
                                            />
                                            {/* Badge to show image source */}
                                            <div className="absolute top-2 left-2 bg-[#202223]/80 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-[2px] font-bold tracking-wider uppercase">
                                                {filePreview ? 'New Local File' : 'Online URL'}
                                            </div>
                                            
                                            {/* Clear Button */}
                                            {(data.image_file || data.image_url) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData(prev => ({
                                                            ...prev,
                                                            image_file: null,
                                                            image_url: ''
                                                        }));
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-all shadow-xs active:scale-90"
                                                    title="Clear selection"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-[4px] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center min-h-[140px]">
                                            <FileImage className="text-slate-300 mb-2" size={32} />
                                            <p className="text-[11px] font-semibold text-slate-400">No banner selected</p>
                                            <p className="text-[9px] text-slate-400 mt-0.5">Upload a local file or paste an online image URL</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <InputLabel value="Upload Image File" />
                                    <input
                                        type="file"
                                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                                        onChange={(e) => setData('image_file', e.target.files[0])}
                                        accept="image/*"
                                    />
                                    <InputError message={errors.image_file} />
                                </div>

                                <div className="flex items-center justify-between text-slate-300 py-1">
                                    <hr className="w-full border-slate-200" />
                                    <span className="text-[10px] uppercase font-bold text-slate-400 px-3">Or</span>
                                    <hr className="w-full border-slate-200" />
                                </div>

                                <div>
                                    <InputLabel value="Image URL" />
                                    <TextInput
                                        type="text"
                                        placeholder="https://example.com/banner.png"
                                        value={data.image_url}
                                        onChange={(e) => setData('image_url', e.target.value)}
                                    />
                                    <InputError message={errors.image_url} />
                                </div>
                            </div>
                        </div>

                        {/* Guidelines Card */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-800">
                            <div className="p-6">
                                <h4 className="text-[12px] font-bold mb-6 flex items-center gap-2.5 text-[#008060]">
                                    <div className="w-6 h-6 bg-[#008060]/10 flex items-center justify-center rounded-[1px]">
                                        <Info size={14} />
                                    </div>
                                    Offer Guidelines
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        'Use high resolution WebP banners for fast rendering.',
                                        'Provide detailed terms like payment options and EMI.',
                                        'Clearly separate online deals from physical outlet ones.',
                                        'Specify exact start and end dates to avoid customer confusion.'
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
}
