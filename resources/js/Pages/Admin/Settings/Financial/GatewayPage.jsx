import React, { useState } from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/Form/TextInput';
import {
    CreditCard,
    Eye,
    EyeOff,
    Copy,
    Check,
    Globe,
    Info,
    ShieldCheck,
    ChevronRight,
    CircleDot,
    Circle
} from 'lucide-react';

export default function FinancialGateway({ settings }) {
    const [activeGateway, setActiveGateway] = useState('stripe');
    const [showSecret, setShowSecret] = useState(false);
    const [showWebhook, setShowWebhook] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        // Stripe
        stripe_mode: settings.stripe_mode || 'test',
        stripe_key: settings.stripe_key || '',
        stripe_secret: settings.stripe_secret || '',
        stripe_webhook_secret: settings.stripe_webhook_secret || '',
        stripe_status: settings.stripe_status ?? true,

        // PayPal (Placeholders for multi-gateway support)
        paypal_mode: settings.paypal_mode || 'sandbox',
        paypal_client_id: settings.paypal_client_id || '',
        paypal_secret: settings.paypal_secret || '',
        paypal_status: settings.paypal_status ?? false,

        // SSLCommerz (Popular for BD)
        sslcommerz_mode: settings.sslcommerz_mode || 'sandbox',
        sslcommerz_store_id: settings.sslcommerz_store_id || '',
        sslcommerz_store_password: settings.sslcommerz_store_password || '',
        sslcommerz_status: settings.sslcommerz_status ?? false,
    });

    const gateways = [
        { id: 'stripe', name: 'Stripe', icon: CreditCard, color: '#635bff', status: data.stripe_status },
        { id: 'paypal', name: 'PayPal', icon: Globe, color: '#003087', status: data.paypal_status },
        { id: 'sslcommerz', name: 'SSLCommerz', icon: ShieldCheck, color: '#ff5c00', status: data.sslcommerz_status },
    ];

    const handleCopy = (text, field) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout
            title="Payment Gateways"
            subtitle="Configure multiple secure payment processors for your store."
            processing={processing}
            onSave={handleSubmit}
        >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Gateway Selection Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="p-4 bg-slate-50/50 rounded-[4px] border border-slate-100 mb-4">
                        <h3 className="text-[14px] font-bold text-slate-500">Available Gateways</h3>
                    </div>
                    {gateways.map((gw) => (
                        <button
                            key={gw.id}
                            type="button"
                            onClick={() => setActiveGateway(gw.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-[4px] border transition-all duration-300 ${activeGateway === gw.id
                                ? 'bg-white border-[#008060] shadow-md translate-x-1'
                                : 'bg-white border-slate-100 hover:border-slate-200 text-slate-500'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded flex items-center justify-center text-white`} style={{ backgroundColor: gw.color }}>
                                    <gw.icon size={16} />
                                </div>
                                <div className="text-left">
                                    <p className={`text-[13px] font-bold leading-none ${activeGateway === gw.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {gw.name}
                                    </p>
                                    <span className={`text-[9px] font-medium tracking-tight ${gw.status ? 'text-emerald-500' : 'text-slate-300'}`}>
                                        {gw.status ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={14} className={activeGateway === gw.id ? 'text-[#008060]' : 'text-slate-300'} />
                        </button>
                    ))}


                </div>

                {/* Active Gateway Configuration */}
                <div className="lg:col-span-3">
                    {activeGateway === 'stripe' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between pb-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#635bff] flex items-center justify-center text-white shadow-lg">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-[16px] font-bold text-slate-900">Stripe Integration</h2>
                                        <p className="text-[12px] text-slate-500 font-medium">Accept credit cards and wallet payments globally.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-[4px] border border-slate-100">
                                        <span className={`text-[10px] font-bold ${data.stripe_mode === 'live' ? 'text-emerald-600' : 'text-orange-500'}`}>
                                            {data.stripe_mode} mode
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setData('stripe_mode', data.stripe_mode === 'live' ? 'test' : 'live')}
                                            className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${data.stripe_mode === 'live' ? 'bg-[#008060]' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${data.stripe_mode === 'live' ? 'left-[22px]' : 'left-[2px]'}`} />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('stripe_status', !data.stripe_status)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[11px] font-bold transition-all ${data.stripe_status ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-200'
                                            }`}
                                    >
                                        {data.stripe_status ? <CircleDot size={14} /> : <Circle size={14} />}
                                        {data.stripe_status ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">Public Key</label>
                                    <div className="relative">
                                        <TextInput
                                            value={data.stripe_key}
                                            onChange={e => setData('stripe_key', e.target.value)}
                                            placeholder="pk_test_..."
                                            className="font-mono text-[12px] pr-12 bg-slate-50/30 rounded-[4px]"
                                        />
                                        <button type="button" onClick={() => handleCopy(data.stripe_key, 's_key')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#008060]">
                                            {copiedField === 's_key' ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">Secret Key</label>
                                    <div className="relative">
                                        <TextInput
                                            type={showSecret ? "text" : "password"}
                                            value={data.stripe_secret}
                                            onChange={e => setData('stripe_secret', e.target.value)}
                                            placeholder="sk_test_..."
                                            className="font-mono text-[12px] pr-20 bg-slate-50/30 rounded-[4px]"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-3">
                                            <button type="button" onClick={() => handleCopy(data.stripe_secret, 's_secret')} className="text-slate-400 hover:text-[#008060]">
                                                {copiedField === 's_secret' ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                            <button type="button" onClick={() => setShowSecret(!showSecret)} className="text-slate-400 hover:text-slate-600">
                                                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">Webhook Secret</label>
                                    <div className="relative">
                                        <TextInput
                                            type={showWebhook ? "text" : "password"}
                                            value={data.stripe_webhook_secret}
                                            onChange={e => setData('stripe_webhook_secret', e.target.value)}
                                            placeholder="whsec_..."
                                            className="font-mono text-[12px] pr-20 bg-slate-50/30 rounded-[4px]"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-3">
                                            <button type="button" onClick={() => handleCopy(data.stripe_webhook_secret, 's_wh')} className="text-slate-400 hover:text-[#008060]">
                                                {copiedField === 's_wh' ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                            <button type="button" onClick={() => setShowWebhook(!showWebhook)} className="text-slate-400 hover:text-slate-600">
                                                {showWebhook ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeGateway === 'paypal' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between pb-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#003087] flex items-center justify-center text-white shadow-lg">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-[16px] font-bold text-slate-900">PayPal Express</h2>
                                        <p className="text-[12px] text-slate-500 font-medium">Standard checkout experience for international customers.</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('paypal_status', !data.paypal_status)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[11px] font-bold transition-all ${data.paypal_status ? 'bg-[#003087]/10 text-[#003087] border border-[#003087]/20' : 'bg-slate-50 text-slate-400 border border-slate-200'
                                        }`}
                                >
                                    {data.paypal_status ? <CircleDot size={14} /> : <Circle size={14} />}
                                    {data.paypal_status ? 'Active' : 'Inactive'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">Client ID</label>
                                    <TextInput
                                        value={data.paypal_client_id}
                                        onChange={e => setData('paypal_client_id', e.target.value)}
                                        placeholder="Enter PayPal Client ID"
                                        className="font-mono text-[12px] bg-slate-50/30 rounded-[4px]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">Secret Key</label>
                                    <TextInput
                                        type="password"
                                        value={data.paypal_secret}
                                        onChange={e => setData('paypal_secret', e.target.value)}
                                        placeholder="Enter PayPal Secret Key"
                                        className="font-mono text-[12px] bg-slate-50/30 rounded-[4px]"
                                    />
                                </div>

                            </div>
                        </div>
                    )}

                    {activeGateway === 'sslcommerz' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between pb-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#ff5c00] flex items-center justify-center text-white shadow-lg">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-[16px] font-bold text-slate-900">SSLCommerz (Bangladesh)</h2>
                                        <p className="text-[12px] text-slate-500 font-medium">Accept bKash, Nagad, Rocket and local debit/credit cards.</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('sslcommerz_status', !data.sslcommerz_status)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[11px] font-bold transition-all ${data.sslcommerz_status ? 'bg-[#ff5c00]/10 text-[#ff5c00] border border-[#ff5c00]/20' : 'bg-slate-50 text-slate-400 border border-slate-200'
                                        }`}
                                >
                                    {data.sslcommerz_status ? <CircleDot size={14} /> : <Circle size={14} />}
                                    {data.sslcommerz_status ? 'Active' : 'Inactive'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">Store ID</label>
                                    <TextInput
                                        value={data.sslcommerz_store_id}
                                        onChange={e => setData('sslcommerz_store_id', e.target.value)}
                                        placeholder="Enter SSLCommerz Store ID"
                                        className="font-mono text-[12px] bg-slate-50/30 rounded-[4px]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">Store Password</label>
                                    <TextInput
                                        type="password"
                                        value={data.sslcommerz_store_password}
                                        onChange={e => setData('sslcommerz_store_password', e.target.value)}
                                        placeholder="Enter SSLCommerz Store Password"
                                        className="font-mono text-[12px] bg-slate-50/30 rounded-[4px]"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[4px] border border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-600">Sandbox / test mode</span>
                                    <button
                                        type="button"
                                        onClick={() => setData('sslcommerz_mode', data.sslcommerz_mode === 'sandbox' ? 'live' : 'sandbox')}
                                        className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${data.sslcommerz_mode === 'live' ? 'bg-[#ff5c00]' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${data.sslcommerz_mode === 'live' ? 'left-[22px]' : 'left-[2px]'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SettingsLayout>
    );
}
