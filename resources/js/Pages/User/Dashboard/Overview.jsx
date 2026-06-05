import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { Package, Heart, Clock, MapPin, User, Settings, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const Overview = ({ auth, stats, recent_orders, primary_address }) => {
    const user = auth.user;

    return (
        <UserLayout user={user}>
            <Head title="My Account Overview" />

            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-[1px] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[1px] bg-[#008060]/5 flex items-center justify-center text-[#008060] border border-slate-100">
                            <User size={28} />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">Hello, {user.name}!</h1>
                            <p className="text-slate-400 text-[11px] font-medium mt-1">Welcome back to your dashboard overview</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 px-8">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 mb-0.5">Status</p>
                            <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">Verified</span>
                        </div>
                        <div className="text-center border-l border-slate-100 pl-8">
                            <p className="text-[10px] font-bold text-slate-400 mb-0.5">Account Type</p>
                            <span className="text-[11px] font-bold text-[#081621]">Regular User</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-6">
                    {/* Account Info Sidebar */}
                    <div className="space-y-6 max-w-2xl">
                        {/* Account Details */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm overflow-hidden text-[13px]">
                            <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
                                <h3 className="text-[11px] font-bold text-[#081621] uppercase tracking-wider flex items-center gap-2">
                                    <User size={12} className="text-slate-400" />
                                    Account Details
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Name</p>
                                    <p className="font-bold text-[#081621]">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Email</p>
                                    <p className="font-bold text-[#081621]">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Phone</p>
                                    <p className="font-bold text-[#081621]">{user.phone || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Designation</p>
                                    <p className="font-bold text-[#081621]">{user.designation || 'Not set'}</p>
                                </div>
                                <Link href={route('profile.edit')} className="w-[150px] h-[34px] flex items-center justify-center gap-2 border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all rounded-[1px] uppercase tracking-wider mt-2">
                                    <Settings size={12} /> Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default Overview;
