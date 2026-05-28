/**
 * PageEditPage Component
 * 
 * Interface for modifying dynamic site pages and policy documents.
 * Integrates visual RichTextEditor and SEO meta tagging.
 */
import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

// Icons
import {
    ArrowLeft, ShieldCheck, CheckCircle2, Save, Info, Globe, FileText
} from "lucide-react";

// Shared Components
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import RichTextEditor from "@/Components/RichTextEditor";
import Notify from '@/Utils/Notify';

export default function PageEditPage({ auth, page }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: page.title,
        content: page.content,
        meta_title: page.meta_title || "",
        meta_description: page.meta_description || "",
        is_active: !!page.is_active,
    });

    const isSystemPage = ['our-story', 'careers', 'privacy-policy', 'terms-and-conditions'].includes(page.slug);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.pages.update", page.id), {
            onSuccess: () => Notify.success('Success', 'The page has been updated successfully.'),
            onError: () => Notify.error('Failed', 'Please check the form for errors.'),
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Edit Page - ${page.title}`} />

            <div className="min-h-screen">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                       
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-[#081621]">Edit Page: <span className="text-[#008060]">{page.title}</span></h1>
                            {isSystemPage && (
                                <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-650 text-[9px] font-extrabold  border border-slate-200/50">
                                    System Page
                                </span>
                            )}
                        </div>
                        <p className="text-[#666666] text-sm mt-1 font-medium">Update page content, publish settings, and search engine metadata.</p>
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
                            form="page-edit-form"
                            disabled={processing}
                            className="h-[38px] px-5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#006e52] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                        >
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                </div>

                {isSystemPage && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[1px] flex gap-3 text-[13px] text-amber-850 leading-relaxed animate-in fade-in duration-200">
                        <Info size={18} className="shrink-0 text-amber-600 mt-0.5" />
                        <div>
                            <span className="font-bold">System Route Link Locked:</span> This page corresponds to a core storefront route (<code className="bg-amber-100/70 px-1.5 py-0.5 rounded font-mono text-[12px]">/info/{page.slug}</code>). Its link cannot be changed to prevent broken layout paths. You can modify the title and body content freely.
                        </div>
                    </div>
                )}

                <form id="page-edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
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
                                        placeholder="e.g. Return Policy, About Us, Terms of Service"
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

                        {/* Audit Details */}
                        <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest mt-4 font-bold">
                            Last updated: <span className="text-slate-600">
                                {page.updated_at ? new Date(page.updated_at).toLocaleString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                }) : 'Never'}
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
