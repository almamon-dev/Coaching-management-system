import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: '',
        image: null,
        status: 'published',
        sort_order: 0,
        is_featured: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.galleries.store'));
    };

    return (
        <AdminLayout>
            <Head title="Create Gallery Item" />
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.galleries.index')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={18} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Add Gallery Item</h1>
                        <p className="text-[13px] text-[#6d7175] mt-0.5 font-medium">Upload a new photo for campus life and activities</p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Title *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                            placeholder="e.g. Annual Sports Day"
                        />
                        {errors.title && <p className="text-red-500 text-[11px] mt-1">{errors.title}</p>}
                    </div>

                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Category</label>
                        <input
                            type="text"
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                            placeholder="e.g. Sports, Culture, Academics"
                        />
                        {errors.category && <p className="text-red-500 text-[11px] mt-1">{errors.category}</p>}
                    </div>

                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Status *</label>
                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                        >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-[11px] mt-1">{errors.status}</p>}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Sort Order</label>
                        <input
                            type="number"
                            value={data.sort_order}
                            onChange={e => setData('sort_order', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                        />
                        {errors.sort_order && <p className="text-red-500 text-[11px] mt-1">{errors.sort_order}</p>}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Gallery Image *</label>
                        <input
                            type="file"
                            onChange={e => setData('image', e.target.files[0])}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                            accept="image/*"
                        />
                        {errors.image && <p className="text-red-500 text-[11px] mt-1">{errors.image}</p>}
                    </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
                    <Link href={route('admin.galleries.index')}>
                        <button type="button" className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-[3px] hover:bg-slate-50 transition-colors shadow-sm">
                            Cancel
                        </button>
                    </Link>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="px-4 py-2 text-[13px] font-medium text-white bg-[#008060] rounded-[3px] hover:bg-[#006e52] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                    >
                        <Save size={14} /> Save Item
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
