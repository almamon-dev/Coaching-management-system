import React from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import { 
    Shield, 
    Lock, 
    Smartphone, 
    Monitor, 
    LogOut, 
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';

export default function Security({ sessions = [] }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        patch(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                }
                if (errors.current_password) {
                    reset('current_password');
                }
            },
        });
    };

    return (
        <SettingsLayout
            title="Account Security"
            subtitle="Manage your password, two-factor authentication and active sessions."
            processing={processing}
            onSave={updatePassword}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Password & 2FA */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Change Password Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Lock size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Update Password</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Current Password</label>
                                <TextInput
                                    type="password"
                                    value={data.current_password}
                                    onChange={e => setData('current_password', e.target.value)}
                                    placeholder="••••••••"
                                    className="h-[36px] rounded-[4px]"
                                />
                                {errors.current_password && <p className="text-rose-500 text-[11px] font-medium">{errors.current_password}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">New Password</label>
                                    <TextInput
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="h-[36px] rounded-[4px]"
                                    />
                                    {errors.password && <p className="text-rose-500 text-[11px] font-medium">{errors.password}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-700">Confirm Password</label>
                                    <TextInput
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        className="h-[36px] rounded-[4px]"
                                    />
                                    {errors.password_confirmation && <p className="text-rose-500 text-[11px] font-medium">{errors.password_confirmation}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Smartphone size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Two-Factor Authentication</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Add additional security to your account using two-factor authentication.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/50 rounded-[4px] border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#008060]">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900">2FA is currently disabled</p>
                                    <p className="text-[11px] text-slate-500">Security recommendation: Enable 2FA to protect your account.</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                className="h-[32px] px-4 bg-[#008060] text-white text-[12px] font-bold rounded-[4px] hover:bg-[#006e52] transition-colors"
                            >
                                Enable
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sessions */}
                <div className="space-y-4">
                    <div className="p-4 bg-white rounded-[4px] border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Monitor size={16} className="text-[#008060]" />
                                <h3 className="text-[13px] font-bold text-slate-900">Browser Sessions</h3>
                            </div>
                            <button className="text-[10px] font-bold text-rose-500 hover:underline">Logout All</button>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition-colors">
                                <Monitor size={18} className="text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-[12px] font-bold text-slate-900">Windows - Chrome</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        <p className="text-[10px] text-slate-500 font-medium">This device (192.168.1.1)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition-colors opacity-60">
                                <Smartphone size={18} className="text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-[12px] font-bold text-slate-900">iPhone - Safari</p>
                                    <p className="text-[10px] text-slate-500 font-medium">London, UK • 2 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-rose-50/30 rounded-[4px] border border-rose-100 space-y-3">
                        <div className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle size={16} />
                            <h3 className="text-[13px] font-bold">Delete Account</h3>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                            Once your account is deleted, all of its resources and data will be permanently deleted.
                        </p>
                        <button className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline">
                            Delete Account permanently
                        </button>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
