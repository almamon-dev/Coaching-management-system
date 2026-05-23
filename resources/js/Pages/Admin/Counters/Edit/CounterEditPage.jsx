/**
 * CounterEditPage Component
 * 
 * Interface for modifying existing counter desks.
 * Mirrors the premium Category layout with standard visual cards.
 */
import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { 
    Plus, ArrowLeft, Save, ShieldCheck, CheckCircle2, Monitor, Send 
} from "lucide-react";

// Shared Components
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Notify from '@/Utils/Notify';

const CounterEditPage = ({ auth, counter }) => {
    const { data, setData, patch, processing, errors } = useForm({
        name: counter.name || "",
        description: counter.description || "",
        is_active: counter.is_active === 1 || counter.is_active === true || counter.is_active === '1',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.counters.update", counter.id), {
            onSuccess: () => Notify.success('Successfully updated!', 'The counter desk was updated successfully.'),
            onError: () => Notify.error('Failed!', 'Please check the form for errors.'),
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Edit Counter Desk" />

            <div className="min-h-screen">
                {/* 1. Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#081621]">Edit Counter Desk</h1>
                        <p className="text-[#666666] text-sm mt-1 font-medium">Modify settings for walk-in serving desk and active kiosk queues.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.counters.index")}
                            className="h-[38px] px-5 bg-white border border-slate-200 rounded-[3px] text-[#666666] font-bold text-[12px] flex items-center gap-2 hover:border-slate-300 transition-all shadow-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            form="counter-form"
                            disabled={processing}
                            className="h-[38px] px-5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#006e52] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? <Plus className="animate-spin" size={16} /> : <Send size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>

                <form id="counter-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    {/* Left Column: Form Fields (Col 1-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* General Info Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">General Information</h3>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <InputLabel value="Desk / Counter Name" />
                                        <TextInput
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. Counter 4, VIP Desk"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-1">
                                        <InputLabel value="Description / Location" />
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            className="w-full p-2.5 text-[12px] font-medium border border-slate-200 focus:border-[#008060] rounded-[3px] shadow-none outline-none focus:ring-0"
                                            placeholder="Provide description of counter desk or its location (e.g. Lobby level, next to payment counter)"
                                            rows={4}
                                        />
                                        <InputError message={errors.description} />
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
                                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm`} style={{ left: data.is_active ? '22px' : '2px' }} />
                                            </div>
                                            <span className="text-[13px] font-bold text-[#081621]">Active Status</span>
                                        </label>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium tracking-tight">Offline counter desks are excluded from walk-in check-in round-robin allocations.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual Indicator Card (Col 9-12) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Monitor size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Counter Overview</h3>
                            </div>
                            <div className="p-6 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full border border-slate-150 flex items-center justify-center text-slate-400 mx-auto mb-4">
                                    <Monitor size={36} />
                                </div>
                                <h4 className="text-[14px] font-bold text-slate-800">{data.name || "Counter Name"}</h4>
                                <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                                    {data.is_active ? "🟢 Active Serving" : "⚪ Offline / Closed"}
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default CounterEditPage;
