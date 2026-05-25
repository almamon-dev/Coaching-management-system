import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Globe,
    Building2,
    Mail,
    CreditCard,
    Palette,
    Languages,
    Hash,
    Save,
    Loader2,
    ChevronRight,
    Settings,
    Shield,
    HardDrive,
    Truck
} from 'lucide-react';

export default function SettingsLayout({ title, subtitle, children, processing = false, onSave = null }) {
    const { url } = usePage();

    const tabs = [
        {
            id: 'website',
            label: 'Website System',
            icon: Globe,
            href: route('admin.settings.website.system'),
            active: url.includes('/settings/website/system')
        },
        {
            id: 'company',
            label: 'Company Profile',
            icon: Building2,
            href: route('admin.settings.website.company'),
            active: url.includes('/settings/website/company')
        },
        {
            id: 'email',
            label: 'Email Configuration',
            icon: Mail,
            href: route('admin.settings.system.email'),
            active: url.includes('/settings/system/email')
        },
        {
            id: 'gateway',
            label: 'Payment Gateways',
            icon: CreditCard,
            href: route('admin.settings.financial.gateway'),
            active: url.includes('/settings/financial/gateway')
        },
        {
            id: 'localization',
            label: 'Localization',
            icon: Languages,
            href: route('admin.settings.website.localization'),
            active: url.includes('/settings/website/localization')
        },
        {
            id: 'appearance',
            label: 'Appearance',
            icon: Palette,
            href: route('admin.settings.website.appearance'),
            active: url.includes('/settings/website/appearance')
        },
        {
            id: 'prefixes',
            label: 'Prefixes',
            icon: Hash,
            href: route('admin.settings.website.prefixes'),
            active: url.includes('/settings/website/prefixes')
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
            href: route('admin.settings.general.security'),
            active: url.includes('/settings/general/security')
        },
        {
            id: 'storage',
            label: 'Storage',
            icon: HardDrive,
            href: route('admin.settings.system.storage'),
            active: url.includes('/settings/system/storage')
        },
        {
            id: 'shipping',
            label: 'Shipping & Delivery',
            icon: Truck,
            href: route('admin.logistics.configuration.index'),
            active: url.includes('/logistics/configuration')
        },
    ];

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="min-h-screen">
                {/* Product Style Header (Matching ProductFormHeader.jsx) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">{title}</h1>
                        <p className="text-[#008060] text-[13px] mt-0.5 font-bold">{subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.dashboard")}
                            className="h-[36px] px-5 bg-white border border-[#d1d1d1] rounded-[4px] text-[#202223] font-bold text-[12px] flex items-center gap-2 hover:bg-[#f6f6f7] transition-all shadow-sm"
                        >
                            Cancel
                        </Link>
                        {onSave && (
                            <button
                                type="button"
                                onClick={onSave}
                                disabled={processing}
                                className={`h-[36px] px-6 rounded-[4px] text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 ${!processing
                                    ? 'bg-[#008060] text-white hover:bg-[#006e52]'
                                    : 'bg-[#ebebeb] text-[#6d7175]/50 cursor-not-allowed shadow-none border border-[#d1d1d1]'
                                    }`}
                            >
                                {processing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Grid (Matching Create.jsx) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-20">
                    {/* Sidebar Tabs (3/12) */}
                    <div className="lg:col-span-3 space-y-1">
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm overflow-hidden sticky top-8">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`w-full flex items-center justify-between px-5 py-3 text-[13px] font-bold transition-all border-b border-[#f6f6f7] last:border-0 ${tab.active
                                        ? 'bg-[#f4f6f8] text-[#008060] border-l-[3px] border-l-[#008060]'
                                        : 'text-[#6d7175] hover:bg-[#f6f6f7] hover:text-[#202223]'
                                        }`}
                                
                                >
                                    <div className="flex items-center gap-3">
                                        <tab.icon size={16} className={tab.active ? 'text-[#008060]' : 'text-[#6d7175]'} />
                                        {tab.label}
                                    </div>
                                    {tab.active && <ChevronRight size={14} className="text-[#008060]" />}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Content Area (9/12) */}
                    <div className="lg:col-span-9 space-y-6">
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm h-auto relative overflow-hidden">
                            <div className="p-5">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
