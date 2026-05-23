import React, { useState } from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import {
    HardDrive,
    Cloud,
    Key,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Server,
    Globe,
    Folder,
} from 'lucide-react';

export default function StoragePage({ settings }) {
    const [showSecret, setShowSecret] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        storage_driver: settings.storage_driver || 'local',
        r2_account_id: settings.r2_account_id || '',
        r2_access_key_id: settings.r2_access_key_id || '',
        r2_secret_access_key: settings.r2_secret_access_key || '',
        r2_bucket: settings.r2_bucket || '',
        r2_url: settings.r2_url || '',
    });

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('admin.settings.system.storage.update'), { preserveScroll: true });
    };

    const isR2 = data.storage_driver === 'r2';

    const fieldClass = "w-full h-9 border border-[#d1d1d1] rounded-[4px] px-3 text-[13px] font-mono text-[#202223] focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none transition-all";

    return (
        <SettingsLayout
            title="Storage Configuration"
            subtitle="Configure where uploaded files and product images are stored."
            processing={processing}
            onSave={handleSubmit}
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left — main config */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Driver selector */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <HardDrive size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Storage Driver</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Choose where files are saved.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {/* Local */}
                            <button
                                type="button"
                                onClick={() => setData('storage_driver', 'local')}
                                className={`flex items-center gap-3 p-4 rounded-[6px] border-2 text-left transition-all ${
                                    data.storage_driver === 'local'
                                        ? 'border-[#008060] bg-emerald-50/40'
                                        : 'border-[#ebebeb] hover:border-[#d1d1d1] bg-white'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${data.storage_driver === 'local' ? 'bg-[#008060] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <Server size={18} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#202223]">Local Server</p>
                                    <p className="text-[11px] text-slate-500">Files stored on this server</p>
                                </div>
                                {data.storage_driver === 'local' && <CheckCircle2 size={16} className="ml-auto text-[#008060]" />}
                            </button>

                            {/* Cloudflare R2 */}
                            <button
                                type="button"
                                onClick={() => setData('storage_driver', 'r2')}
                                className={`flex items-center gap-3 p-4 rounded-[6px] border-2 text-left transition-all ${
                                    data.storage_driver === 'r2'
                                        ? 'border-[#008060] bg-emerald-50/40'
                                        : 'border-[#ebebeb] hover:border-[#d1d1d1] bg-white'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${data.storage_driver === 'r2' ? 'bg-[#F48120] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <Cloud size={18} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#202223]">Cloudflare R2</p>
                                    <p className="text-[11px] text-slate-500">Free 10GB · No egress fees</p>
                                </div>
                                {data.storage_driver === 'r2' && <CheckCircle2 size={16} className="ml-auto text-[#008060]" />}
                            </button>
                        </div>
                    </div>

                    {/* R2 Fields — only shown when R2 is selected */}
                    {isR2 && (
                        <div className="space-y-5 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#F48120]">
                                    <Cloud size={18} />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-bold text-slate-900">Cloudflare R2 Credentials</h2>
                                    <p className="text-[12px] text-slate-500 font-medium">
                                        Get these from{' '}
                                        <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-[#008060] font-bold inline-flex items-center gap-0.5 hover:underline">
                                            Cloudflare Dashboard <ExternalLink size={11} />
                                        </a>
                                        {' '}→ R2 Storage
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Account ID */}
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
                                        <Globe size={13} /> Account ID
                                    </label>
                                    <TextInput
                                        value={data.r2_account_id}
                                        onChange={e => setData('r2_account_id', e.target.value)}
                                        placeholder="e.g. a1b2c3d4e5f6..."
                                        className="rounded-[4px] font-mono text-[12px]"
                                    />
                                    <p className="text-[11px] text-slate-400">Found in Cloudflare → Workers & Pages → Overview (right sidebar)</p>
                                </div>

                                {/* Bucket Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
                                        <Folder size={13} /> Bucket Name
                                    </label>
                                    <TextInput
                                        value={data.r2_bucket}
                                        onChange={e => setData('r2_bucket', e.target.value)}
                                        placeholder="e.g. gadget-media"
                                        className="rounded-[4px] font-mono text-[12px]"
                                    />
                                </div>

                                {/* Public URL */}
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
                                        <Globe size={13} /> Public URL
                                    </label>
                                    <TextInput
                                        value={data.r2_url}
                                        onChange={e => setData('r2_url', e.target.value)}
                                        placeholder="https://pub-xxxx.r2.dev"
                                        className="rounded-[4px] font-mono text-[12px]"
                                    />
                                    <p className="text-[11px] text-slate-400">Enable public access on the R2 bucket first</p>
                                </div>

                                {/* Access Key */}
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
                                        <Key size={13} /> Access Key ID
                                    </label>
                                    <TextInput
                                        value={data.r2_access_key_id}
                                        onChange={e => setData('r2_access_key_id', e.target.value)}
                                        placeholder="R2 Access Key ID"
                                        className="rounded-[4px] font-mono text-[12px]"
                                    />
                                </div>

                                {/* Secret Key */}
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
                                        <Key size={13} /> Secret Access Key
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            type={showSecret ? 'text' : 'password'}
                                            value={data.r2_secret_access_key}
                                            onChange={e => setData('r2_secret_access_key', e.target.value)}
                                            placeholder="••••••••••••••••"
                                            className="pr-10 rounded-[4px] font-mono text-[12px]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecret(!showSecret)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right — info panel */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Status Card */}
                    <div className="bg-slate-50/50 rounded-[6px] border border-slate-100 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isR2 ? 'bg-[#F48120]' : 'bg-[#008060]'}`} />
                            <span className="text-[13px] font-bold text-slate-800">
                                {isR2 ? 'Cloudflare R2' : 'Local Storage'} Selected
                            </span>
                        </div>
                        <p className="text-[12px] text-slate-500 leading-relaxed">
                            {isR2
                                ? 'Images will be stored in your Cloudflare R2 bucket and served via their global CDN. Free 10GB, zero egress fees.'
                                : 'Images are stored on this server\'s disk in storage/app/public. Good for development. Not recommended for production.'}
                        </p>
                    </div>

                    {/* How to get R2 keys */}
                    {isR2 && (
                        <div className="bg-orange-50/50 rounded-[6px] border border-orange-100 p-4 space-y-2">
                            <div className="flex items-center gap-2 text-[#F48120]">
                                <AlertCircle size={15} />
                                <span className="text-[12px] font-bold">How to get R2 keys</span>
                            </div>
                            <ol className="text-[11px] text-slate-600 space-y-1 list-decimal pl-4">
                                <li>Go to <strong>dash.cloudflare.com</strong></li>
                                <li>Click <strong>R2 Storage</strong></li>
                                <li>Create a bucket (e.g. gadget-media)</li>
                                <li>Go to <strong>Manage R2 API tokens</strong></li>
                                <li>Create token with <strong>Object Read & Write</strong></li>
                                <li>Copy Access Key ID & Secret</li>
                                <li>Enable <strong>Public access</strong> on the bucket</li>
                            </ol>
                        </div>
                    )}
                </div>
            </form>
        </SettingsLayout>
    );
}
