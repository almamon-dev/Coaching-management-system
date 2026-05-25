import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SettingsLayout from '../Settings/Layouts/SettingsLayout';
import TextInput from '@/Components/TextInput';
import { Truck, ShieldCheck, Key, Save, PackageX } from 'lucide-react';

const ShippingConfig = ({ auth, shippingMethods }) => {
    // Local state for all shipping configurations
    const [configs, setConfigs] = useState(
        shippingMethods.map(method => ({
            id: method.id,
            name: method.name,
            provider: method.provider,
            charge: method.charge,
            credentials: typeof method.api_credentials === 'string'
                ? JSON.parse(method.api_credentials || '{}')
                : (method.api_credentials || {}),
        }))
    );

    const [processingId, setProcessingId] = useState(null);

    const handleFieldChange = (idx, field, value) => {
        setConfigs(prev => {
            const next = [...prev];
            next[idx][field] = value;
            return next;
        });
    };

    const handleCredentialChange = (idx, key, value) => {
        setConfigs(prev => {
            const next = [...prev];
            next[idx].credentials = {
                ...next[idx].credentials,
                [key]: value
            };
            return next;
        });
    };

    const handleSave = (idx) => {
        const config = configs[idx];
        setProcessingId(config.id);

        router.post(route('admin.logistics.configuration.update'), {
            provider: config.provider,
            charge: config.charge,
            credentials: config.credentials
        }, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null)
        });
    };

    return (
        <SettingsLayout
            title="Shipping & Courier Configuration"
            subtitle="Manage API credentials and shipping fees for automated courier integrations"
        >
            {/* Config Panels */}
            {configs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <PackageX size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-800 tracking-tight mb-1.5">No Shipping Methods Found</h3>
                    <p className="text-[13px] text-slate-500 max-w-sm leading-relaxed">
                        You have not configured any shipping or courier integration yet. Please run the database seeder to populate default delivery methods.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {configs.map((config, idx) => (
                        <div key={config.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
                            <div>
                                {/* Panel Header */}
                                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#008060] shrink-0">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-[15px]">{config.name}</h3>
                                        <span className="text-[11px] bg-slate-200 text-slate-650 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                            {config.provider}
                                        </span>
                                    </div>
                                </div>

                                {/* Panel Inputs */}
                                <div className="p-5 space-y-4">
                                    {/* Charge Fee */}
                                    <div>
                                        <label className="block text-[11.5px] font-bold text-slate-650 mb-1.5 uppercase tracking-wider">
                                            Shipping Charge (BDT)
                                        </label>
                                        <div className="relative">
                                            <TextInput
                                                type="number"
                                                value={config.charge}
                                                onChange={(e) => handleFieldChange(idx, 'charge', e.target.value)}
                                                className="w-full pr-12"
                                                placeholder="80"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-slate-400 pointer-events-none">BDT</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4 space-y-3">
                                        <h4 className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                                            <Key size={14} className="text-slate-400" /> API Integration Details
                                        </h4>

                                        {/* Render credentials inputs based on provider */}
                                        {config.provider === 'redx' && (
                                            <>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">API Token</label>
                                                    <TextInput
                                                        type="password"
                                                        value={config.credentials.api_key || ''}
                                                        onChange={(e) => handleCredentialChange(idx, 'api_key', e.target.value)}
                                                        className="w-full rounded-[4px] font-mono text-[12px]"
                                                        placeholder="REDX API Token"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Client ID</label>
                                                    <TextInput
                                                        type="text"
                                                        value={config.credentials.client_id || ''}
                                                        onChange={(e) => handleCredentialChange(idx, 'client_id', e.target.value)}
                                                        className="w-full rounded-[4px] font-mono text-[12px]"
                                                        placeholder="Client ID Reference"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {config.provider === 'pathao' && (
                                            <>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Client ID</label>
                                                    <TextInput
                                                        type="text"
                                                        value={config.credentials.client_id || ''}
                                                        onChange={(e) => handleCredentialChange(idx, 'client_id', e.target.value)}
                                                        className="w-full rounded-[4px] font-mono text-[12px]"
                                                        placeholder="Pathao Client ID"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Client Secret</label>
                                                    <TextInput
                                                        type="password"
                                                        value={config.credentials.client_secret || ''}
                                                        onChange={(e) => handleCredentialChange(idx, 'client_secret', e.target.value)}
                                                        className="w-full rounded-[4px] font-mono text-[12px]"
                                                        placeholder="Pathao Client Secret"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {config.provider === 'steadfast' && (
                                            <>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">API Key</label>
                                                    <TextInput
                                                        type="password"
                                                        value={config.credentials.api_key || ''}
                                                        onChange={(e) => handleCredentialChange(idx, 'api_key', e.target.value)}
                                                        className="w-full rounded-[4px] font-mono text-[12px]"
                                                        placeholder="Steadfast API Key"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Secret Key</label>
                                                    <TextInput
                                                        type="password"
                                                        value={config.credentials.secret_key || ''}
                                                        onChange={(e) => handleCredentialChange(idx, 'secret_key', e.target.value)}
                                                        className="w-full rounded-[4px] font-mono text-[12px]"
                                                        placeholder="Steadfast Secret Key"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Save Action */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                    <ShieldCheck size={12} className="text-emerald-500" /> Standard encryption
                                </span>
                                <button
                                    onClick={() => handleSave(idx)}
                                    disabled={processingId === config.id}
                                    className="px-3.5 py-1.5 bg-[#008060] text-white text-[12px] font-bold rounded-sm hover:bg-[#006e52] disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm shadow-[#008060]/10"
                                >
                                    <Save size={13} />
                                    {processingId === config.id ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SettingsLayout>
    );
};

export default ShippingConfig;
