/**
 * CategoryCreatePage Component
 * 
 * Interface for creating new product categories.
 * Supports hierarchical parent assignment and image uploads.
 */
import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

// Icons
import {
    Plus, ArrowLeft, Upload, Save, X, ShieldCheck,
    CheckCircle2, ImageIcon, Layers, ChevronRight, Send
} from "lucide-react";

// Shared Components
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Notify from '@/Utils/Notify';

const CategoryCreatePage = ({ auth, categories }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: {
            en: "",
            bn: ""
        },
        slug: "",
        parent_id: "",
        is_active: true,
        image: null,
    });

    const [preview, setPreview] = useState(null);

    // Auto-generate slug from English name
    useEffect(() => {
        const slug = data.name.en
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
        setData("slug", slug);
    }, [data.name.en]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.categories.store"), {
            onSuccess: () => Notify.success('Successfully saved!', 'The new category is now available.'),
            onError: () => Notify.error('Failed!', 'Please check the form for errors.'),
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Add New Category" />

            <div className="min-h-screen">
                {/* 1. Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#081621]">Add New Category</h1>
                        <p className="text-[#666666] text-sm mt-1 font-medium">Create a new product category for your store catalog.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.categories.index")}
                            className="h-[38px] px-5 bg-white border border-slate-200 rounded-[3px] text-[#666666] font-bold text-[12px] flex items-center gap-2 hover:border-slate-300 transition-all shadow-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            form="category-form"
                            disabled={processing}
                            className="h-[38px] px-5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#006e52] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? <Plus className="animate-spin" size={16} /> : <Send size={16} />}
                            Publish Category
                        </button>
                    </div>
                </div>

                <form id="category-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
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
                                        <InputLabel value="Category Name (English)" />
                                        <TextInput
                                            type="text"
                                            value={data.name.en}
                                            onChange={(e) => setData("name", { ...data.name, en: e.target.value })}
                                            className="w-full"
                                            placeholder="e.g. Electronics, Fashion"
                                        />
                                        <InputError message={errors['name.en']} />
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel value="Category Name (Bangla)" />
                                        <TextInput
                                            type="text"
                                            value={data.name.bn}
                                            onChange={(e) => setData("name", { ...data.name, bn: e.target.value })}
                                            className="w-full"
                                            placeholder="উদা: ইলেকট্রনিক্স"
                                        />
                                        <InputError message={errors['name.bn']} />
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel value="URL Slug" />
                                        <TextInput
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData("slug", e.target.value)}
                                            className="w-full bg-slate-50/50"
                                            placeholder="category-url-slug"
                                        />
                                        <InputError message={errors.slug} />
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <InputLabel value="Parent Category" />
                                        <SelectInput
                                            value={data.parent_id}
                                            onChange={e => setData('parent_id', e.target.value)}
                                            className="w-full"
                                        >
                                            <option value="">None (Root Category)</option>
                                            {categories.filter(c => !c.parent_id).flatMap(root => [
                                                <option key={root.id} value={root.id}>{root.name}</option>,
                                                ...categories.filter(sub => sub.parent_id === root.id).flatMap(child => [
                                                    <option key={child.id} value={child.id}>└─ {child.name}</option>,
                                                    ...categories.filter(subSub => subSub.parent_id === child.id).map(grandChild => (
                                                        <option key={grandChild.id} value={grandChild.id}>&nbsp;&nbsp;&nbsp;└─ {grandChild.name}</option>
                                                    ))
                                                ])
                                            ])}
                                        </SelectInput>
                                        <InputError message={errors.parent_id} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Visibility & Status</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                onClick={() => setData('is_active', !data.is_active)}
                                                className={`w-10 h-5 rounded-full transition-all relative ${data.is_active ? 'bg-[#008060]' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${data.is_active ? 'left-5.5' : 'left-0.5'}`} style={{ left: data.is_active ? '22px' : '2px' }} />
                                            </div>
                                            <span className="text-[13px] font-bold text-[#081621]">Active Status</span>
                                        </label>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium tracking-tight">When inactive, this category and its products will be hidden from the store frontend.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image & Actions (Col 9-12) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Image Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <ImageIcon size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Category Image / Icon</h3>
                            </div>
                            <div className="p-6">
                                <div className="w-full h-[240px] bg-slate-50 rounded-[1px] border border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#008060] transition-all shadow-sm">
                                    {preview ? (
                                        <div className="relative w-full h-full p-4">
                                            <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                                            <button
                                                type="button"
                                                onClick={() => { setPreview(null); setData('image', null) }}
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
                                            <span className="text-[10px] text-slate-400 mt-1 font-medium tracking-tight">Supports JPG, PNG, WebP, SVG</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                                <InputError message={errors.image} className="mt-2 text-center" />
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default CategoryCreatePage;
