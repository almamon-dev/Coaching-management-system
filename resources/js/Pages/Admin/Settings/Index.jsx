import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Settings, Save, Building } from 'lucide-react';

export default function SettingsIndex({ settings }) {
    const { data, setData, post, processing } = useForm({
        center_name: settings.center_name || 'Apex Coaching & Learning Center',
        center_tagline: settings.center_tagline || 'Excellence in Education',
        phone: settings.phone || '+880 1711-000000',
        email: settings.email || 'info@apexcoaching.bd',
        address: settings.address || 'House 42, Road 11, Block E, Banani, Dhaka',
        currency_symbol: settings.currency_symbol || '৳',
        academic_year: settings.academic_year || '2026',
        receipt_footer_note: settings.receipt_footer_note || 'Thank you for choosing Apex Coaching Center.',
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
                    <p className="text-sm text-slate-500">Configure center details, contact info, Bangladeshi currency symbol & printable receipt notes.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm max-w-3xl space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
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

                <div className="pt-4 border-t flex justify-end">
                    <button type="submit" disabled={processing} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2">
                        <Save size={16} /> Save Branding & Settings
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
