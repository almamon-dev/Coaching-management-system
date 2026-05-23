/**
 * BrandEditPage Component
 * 
 * Interface for modifying existing manufacturer or brand partner profiles.
 * Supports metadata updates and logo replacement.
 */
import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

// Icons
import {
    Plus, ArrowLeft, Upload, Save, X, ShieldCheck,
    CheckCircle2, ImageIcon
} from "lucide-react";

// Shared Components
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Notify from '@/Utils/Notify';

const BrandEditPage = ({ auth, brand }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: brand.data.name,
        slug: brand.data.slug,
        description: brand.data.description || "",
        status: brand.data.status,
        is_featured: brand.data.is_featured,
        logo: null,
        _method: "PUT", // For spoofing PUT request with file upload
    });

    const [preview, setPreview] = useState(brand.data.logo ? `/storage/${brand.data.logo}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.brands.update", brand.data.id), {
            onSuccess: () => Notify.success('Successfully saved!', 'Brand profile changes have been saved.'),
            onError: () => Notify.error('Failed!', 'Please check the form for errors.'),
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Edit Brand - ${brand.data.name}`} />

            <div className="min-h-screen">
                {/* 1. Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#081621]">Edit Brand: <span className="text-[#008060]">{brand.data.name}</span></h1>
                        <p className="text-[#666666] text-sm mt-1 font-medium">Update brand profile details and visibility settings.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.brands.index")}
                            className="h-[38px] px-5 bg-white border border-slate-200 rounded-[3px] text-[#666666] font-bold text-[12px] flex items-center gap-2 hover:border-slate-300 transition-all shadow-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            form="brand-edit-form"
                            disabled={processing}
                            className="h-[38px] px-5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#006e52] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? <Plus className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>

                <form id="brand-edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    {/* Left Column: Form Fields (Col 1-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* General Info Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">General Information</h3>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <InputLabel value="Brand Name" required />
                                        <TextInput
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. Samsung, Apple, Sony"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel value="URL Slug" required />
                                        <TextInput
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData("slug", e.target.value)}
                                            className="w-full bg-slate-50/50"
                                            placeholder="brand-url-slug"
                                        />
                                        <InputError message={errors.slug} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <InputLabel value="Description / About Brand" />
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        rows="5"
                                        className="w-full p-4 bg-white border border-slate-200 rounded-[1px] text-[14px] text-[#081621] focus:border-[#008060] focus:ring-4 focus:ring-[#008060]/5 outline-none transition-all font-medium shadow-sm leading-relaxed"
                                        placeholder="Enter brand background, history, or vision..."
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>
                        </div>

                        {/* Visibility & Promotion Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Visibility & Promotion</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <InputLabel value="Brand Status" />
                                        <div className="flex p-1 bg-slate-100 rounded-[1px] w-fit">
                                            <button 
                                                type="button"
                                                onClick={() => setData('status', 1)}
                                                className={`px-8 py-2 rounded-[1px] text-[12px] font-bold transition-all ${data.status === 1 ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Active
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setData('status', 0)}
                                                className={`px-8 py-2 rounded-[1px] text-[12px] font-bold transition-all ${data.status === 0 ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Inactive
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-slate-400 font-medium">Inactive brands will be hidden from the storefront.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Promotion" />
                                        <label className={`flex items-center justify-between p-4 rounded-[1px] border cursor-pointer transition-all ${data.is_featured ? 'bg-emerald-50 border-[#008060]/20' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-[1px] flex items-center justify-center ${data.is_featured ? 'bg-[#008060] text-white' : 'bg-slate-50 text-slate-300'}`}>
                                                    <ShieldCheck size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-[#081621]">Featured Brand</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">Homepage showcase</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setData('is_featured', !data.is_featured)}
                                                className={`w-10 h-5 rounded-full transition-all relative ${data.is_featured ? 'bg-[#008060]' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${data.is_featured ? 'left-5.5' : 'left-0.5'}`} style={{ left: data.is_featured ? '22px' : '2px' }} />
                                            </div>
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={data.is_featured}
                                                onChange={(e) => setData('is_featured', e.target.checked)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Logo & Actions (Col 9-12) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Logo Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <ImageIcon size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Brand Logo</h3>
                            </div>
                            <div className="p-6">
                                <div className="w-full h-[240px] bg-slate-50 rounded-[1px] border border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#008060] transition-all shadow-sm">
                                    {preview ? (
                                        <div className="relative w-full h-full p-4">
                                            <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                                            <button
                                                type="button"
                                                onClick={() => { setPreview(null); setData('logo', null) }}
                                                className="absolute top-2 right-2 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all border border-slate-100"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center p-6 text-center">
                                            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-300 mb-3 group-hover:scale-105 group-hover:text-[#008060] transition-all border border-slate-100">
                                                <Upload size={20} />
                                            </div>
                                            <span className="text-[12px] font-bold text-[#081621]">Click to Upload</span>
                                            <span className="text-[10px] text-slate-400 mt-1 font-medium tracking-tight">Supports PNG, JPG (MAX 2MB)</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                                <InputError message={errors.logo} className="mt-2 text-center" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default BrandEditPage;
