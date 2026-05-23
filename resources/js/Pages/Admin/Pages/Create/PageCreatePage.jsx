/**
 * PageCreatePage Component
 * 
 * Interface for producing new dynamic storefront content pages.
 * Integrates visual RichTextEditor and SEO meta tags configuration.
 */
import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

// Icons
import {
    ArrowLeft, ShieldCheck, CheckCircle2, Send, Globe, FileText
} from "lucide-react";

// Shared Components
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import RichTextEditor from "@/Components/RichTextEditor";
import Notify from '@/Utils/Notify';

export default function PageCreatePage({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
        meta_title: "",
        meta_description: "",
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.pages.store"), {
            onSuccess: () => Notify.success('Success', 'The page has been created successfully.'),
            onError: () => Notify.error('Failed', 'Please check the form for errors.'),
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Add New Page" />

            <div className="min-h-screen">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                       
                        <h1 className="text-2xl font-bold text-[#081621]">Add New Page</h1>
                        <p className="text-[#666666] text-sm mt-1 font-medium">Design and structure static pages, rules, or custom policy details.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.pages.index")}
                            className="h-[38px] px-5 bg-white border border-slate-200 rounded-[3px] text-[#666666] font-bold text-[12px] flex items-center gap-2 hover:border-slate-300 transition-all shadow-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            form="page-create-form"
                            disabled={processing}
                            className="h-[38px] px-5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#006e52] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                        >
                            <Send size={16} />
                            Publish Page
                        </button>
                    </div>
                </div>

                <form id="page-create-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    {/* Left Column: Editor & SEO (Col 1-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Editor Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <FileText size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Page Content</h3>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-1">
                                    <InputLabel value="Page Title" required />
                                    <TextInput
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        className="w-full"
                                        placeholder="e.g. Terms of Service, Return Policy, Store Locator"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-1">
                                    <InputLabel value="Page Body Editor" required />
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={(val) => setData("content", val)}
                                        placeholder="Type or format your page content here..."
                                    />
                                    <InputError message={errors.content} />
                                </div>
                            </div>
                        </div>

                        {/* Search Engine Optimization (SEO) */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Globe size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Search Engine Settings (SEO)</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-1">
                                    <InputLabel value="Meta Title Tag" />
                                    <TextInput
                                        type="text"
                                        value={data.meta_title}
                                        onChange={(e) => setData("meta_title", e.target.value)}
                                        className="w-full"
                                        placeholder="e.g. Terms of Service | GadgetZone"
                                    />
                                    <InputError message={errors.meta_title} />
                                </div>

                                <div className="space-y-1">
                                    <InputLabel value="Meta Description Tag" />
                                    <textarea
                                        value={data.meta_description}
                                        onChange={(e) => setData("meta_description", e.target.value)}
                                        rows="3"
                                        className="w-full p-4 bg-white border border-slate-200 rounded-[1px] text-[13.5px] text-[#081621] focus:border-[#008060] focus:ring-4 focus:ring-[#008060]/5 outline-none transition-all shadow-sm leading-relaxed"
                                        placeholder="Insert a short description summary of this page to display in search result snippets..."
                                    />
                                    <InputError message={errors.meta_description} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Publish Control Sidebar (Col 9-12) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Visibility card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Visibility</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <InputLabel value="Publish Status" />
                                    <div className="flex p-1 bg-slate-100 rounded-[3px] border border-slate-200 w-fit">
                                        <button 
                                            type="button"
                                            onClick={() => setData('is_active', true)}
                                            className={`px-5 py-1.5 rounded-[2px] text-[11px] font-extrabold uppercase tracking-wide transition-all ${data.is_active ? 'bg-white text-[#008060] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Active Page
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setData('is_active', false)}
                                            className={`px-5 py-1.5 rounded-[2px] text-[11px] font-extrabold uppercase tracking-wide transition-all ${!data.is_active ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Draft Hidden
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                    Draft pages cannot be viewed publicly and will display a 404 Not Found error on the storefront.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
