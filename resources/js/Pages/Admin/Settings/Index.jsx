import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, Building, UserCheck, Users } from 'lucide-react';

export default function SettingsIndex({ settings }) {
    const { data, setData, post, processing } = useForm({
        coaching_mode: settings.coaching_mode || 'single',
        center_name: settings.center_name || 'Ullash Coaching Center',
        center_tagline: settings.center_tagline || 'Excellence in Coaching & Learning',
        phone: settings.phone || '+880 1711-000000',
        email: settings.email || 'info@ullashcoaching.com',
        address: settings.address || 'House 42, Road 11, Block E, Banani, Dhaka',
        currency_symbol: settings.currency_symbol || '৳',
        academic_year: settings.academic_year || '2026',
        receipt_footer_note: settings.receipt_footer_note || 'Thank you for choosing Ullash Coaching Center.',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="Center Branding & System Settings" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Coaching Center Branding & Settings</h1>
                    <p className="text-sm text-slate-500">Configure operation mode (Single vs Multi-Teacher), center branding & receipt notes.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm max-w-3xl space-y-6 text-xs">
                {/* COACHING MODE SWITCH SECTION */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-3 flex items-center gap-2">
                        <UserCheck className="text-emerald-600" size={18} /> Coaching Operation Mode
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setData('coaching_mode', 'single')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                data.coaching_mode === 'single'
                                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                            <div className="flex items-center gap-2.5 mb-1.5">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    data.coaching_mode === 'single' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    <UserCheck size={16} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">Single Teacher Mode</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Ideal when one teacher teaches multiple subjects & batches. Hides multi-teacher assignment clutter and focuses on Subjects & Batches.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setData('coaching_mode', 'multi')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                data.coaching_mode === 'multi'
                                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                            <div className="flex items-center gap-2.5 mb-1.5">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    data.coaching_mode === 'multi' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    <Users size={16} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">Multi-Teacher Mode</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Full coaching institute mode with Teacher Management, instructor assignment per batch/routine, and role permissions.
                            </p>
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
                        <Building className="text-emerald-600" size={18} /> General Branding
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Center Name *</label>
                            <input
                                type="text"
                                value={data.center_name}
                                onChange={(e) => setData('center_name', e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Center Tagline</label>
                            <input
                                type="text"
                                value={data.center_tagline}
                                onChange={(e) => setData('center_tagline', e.target.value)}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block font-semibold text-slate-700 mb-1">Center Address *</label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Currency Symbol *</label>
                            <input
                                type="text"
                                value={data.currency_symbol}
                                onChange={(e) => setData('currency_symbol', e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Academic Year *</label>
                            <input
                                type="text"
                                value={data.academic_year}
                                onChange={(e) => setData('academic_year', e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block font-semibold text-slate-700 mb-1">Print Receipt Footer Note</label>
                            <textarea
                                value={data.receipt_footer_note}
                                onChange={(e) => setData('receipt_footer_note', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <button type="submit" disabled={processing} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 cursor-pointer">
                        <Save size={16} /> Save Branding & Settings
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
