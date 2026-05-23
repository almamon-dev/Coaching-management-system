import React, { useState } from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { 
    Mail, 
    Server, 
    Key, 
    User, 
    Eye, 
    EyeOff,
    ShieldCheck,
    Settings2,
    AtSign,
    Globe,
    Building2,
    Info
} from 'lucide-react';

export default function EmailSettings({ settings }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        mail_mailer: settings.mail_mailer || 'smtp',
        mail_host: settings.mail_host || '',
        mail_port: settings.mail_port || '',
        mail_username: settings.mail_username || '',
        mail_password: settings.mail_password || '',
        mail_encryption: settings.mail_encryption || 'tls',
        mail_from_address: settings.mail_from_address || '',
        mail_from_name: settings.mail_from_name || '',
    });

    const driverOptions = [
        { id: 'smtp', name: 'SMTP' },
        { id: 'mailgun', name: 'Mailgun' },
        { id: 'postmark', name: 'Postmark' },
        { id: 'ses', name: 'Amazon SES' }
    ];

    const encryptionOptions = [
        { id: 'tls', name: 'TLS' },
        { id: 'ssl', name: 'SSL' },
        { id: 'none', name: 'NONE' }
    ];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('admin.settings.system.email.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout 
            title="Email Configuration" 
            subtitle="Configure SMTP servers and automated email protocols for the system."
            processing={processing}
            onSave={handleSubmit}
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Main SMTP Configuration */}
                <div className="lg:col-span-2 space-y-6">
                    {/* SMTP Credentials Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Server size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">SMTP Credentials</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Server connection and authentication details.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">SMTP Host</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Globe size={16} />
                                    </div>
                                    <TextInput 
                                        value={data.mail_host}
                                        onChange={e => setData('mail_host', e.target.value)}
                                        placeholder="e.g. smtp.mailtrap.io"
                                        className="pl-10 rounded-[4px] font-mono text-[12px]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Port</label>
                                <TextInput 
                                    value={data.mail_port}
                                    onChange={e => setData('mail_port', e.target.value)}
                                    placeholder="e.g. 587"
                                    className="rounded-[4px] font-mono text-[12px]"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <User size={16} />
                                    </div>
                                    <TextInput 
                                        value={data.mail_username}
                                        onChange={e => setData('mail_username', e.target.value)}
                                        placeholder="Enter SMTP username"
                                        className="pl-10 rounded-[4px] font-mono text-[12px]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Key size={16} />
                                    </div>
                                    <TextInput 
                                        type={showPassword ? "text" : "password"}
                                        value={data.mail_password}
                                        onChange={e => setData('mail_password', e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 rounded-[4px] font-mono text-[12px]"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sender Identity Section */}
                    <div className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <AtSign size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Sender Identity</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Default "From" address and name for system emails.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">From Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Mail size={16} />
                                    </div>
                                    <TextInput 
                                        type="email"
                                        value={data.mail_from_address}
                                        onChange={e => setData('mail_from_address', e.target.value)}
                                        placeholder="no-reply@yourbrand.com"
                                        className="pl-10 rounded-[4px]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">From Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Building2 size={16} />
                                    </div>
                                    <TextInput 
                                        value={data.mail_from_name}
                                        onChange={e => setData('mail_from_name', e.target.value)}
                                        placeholder="Your Brand Name"
                                        className="pl-10 rounded-[4px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Driver & Security */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-50/50 rounded-[6px] border border-slate-100 p-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#008060] border border-slate-100">
                                <Settings2 size={18} />
                            </div>
                            <h2 className="text-[14px] font-bold text-slate-900">Mail System</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Mail Driver Selection */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-700 tracking-tight">Mail driver</label>
                                <SelectInput 
                                    value={data.mail_mailer}
                                    onChange={e => setData('mail_mailer', e.target.value)}
                                    options={driverOptions}
                                    className="rounded-[4px]"
                                />

                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck size={16} className="text-[#008060]" />
                                    <label className="text-[12px] font-bold text-slate-700 tracking-tight">Encryption</label>
                                </div>
                                <SelectInput 
                                    value={data.mail_encryption}
                                    onChange={e => setData('mail_encryption', e.target.value)}
                                    options={encryptionOptions}
                                    className="rounded-[4px]"
                                />
                            </div>
                        </div>

                        {/* Security Note */}

                    </div>
                </div>
            </form>
        </SettingsLayout>
    );
}
