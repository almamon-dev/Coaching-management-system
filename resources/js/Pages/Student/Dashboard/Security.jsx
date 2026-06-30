import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { Lock, Shield, Smartphone, History, Monitor } from 'lucide-react';
 
const Security = ({ auth, two_factor_enabled, last_login }) => {
    return (
        <StudentLayout user={auth.user}>
            <Head title="Security Settings" />
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-[1px] border border-slate-200 shadow-sm">
                    <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">Security Settings</h1>
                    <p className="text-slate-400 text-[11px] font-medium mt-1">Manage your account protection and login history</p>
                </div>
 
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 2FA Section */}
                    <div className="bg-white p-6 rounded-[1px] border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#008060]/5 rounded-[1px] flex items-center justify-center text-[#008060]">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-[#081621]">Two-Factor Authentication</h3>
                                <p className="text-[11px] text-slate-400">Add an extra layer of security to your account</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[1px] border border-slate-100">
                            <div className="flex items-center gap-3">
                                <Smartphone size={18} className="text-slate-400" />
                                <span className="text-[13px] font-bold text-[#081621]">Authentication App</span>
                            </div>
                            <button className={`h-8 px-4 rounded-[1px] text-[11px] font-bold uppercase tracking-wider ${two_factor_enabled ? 'bg-slate-200 text-slate-600' : 'bg-[#3749bb] text-white hover:bg-[#2e3d9e]'}`}>
                                {two_factor_enabled ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    </div>
 
                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-[1px] border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-slate-50 rounded-[1px] border border-slate-100 flex items-center justify-center text-slate-400">
                                <History size={20} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-[#081621]">Recent Login Activity</h3>
                                <p className="text-[11px] text-slate-400">Your most recent account accesses</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-[13px]">
                                <Monitor size={16} className="text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-bold text-[#081621]">{last_login.device}</p>
                                    <p className="text-slate-500 text-[11px]">{last_login.date} • IP: {last_login.ip}</p>
                                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1 inline-block">Current Session</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
 
                {/* Password Management */}
                <div className="bg-white p-6 rounded-[1px] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-[1px] border border-slate-100 flex items-center justify-center text-slate-400">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-[#081621]">Account Password</h3>
                                <p className="text-[11px] text-slate-400">It's a good idea to use a strong password that you're not using elsewhere</p>
                            </div>
                        </div>
                        <button className="h-[34px] px-4 border border-slate-200 text-slate-600 rounded-[1px] text-[11px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-all">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};
 
export default Security;
