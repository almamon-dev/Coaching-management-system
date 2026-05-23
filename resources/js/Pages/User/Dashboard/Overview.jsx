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

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Orders', value: stats.total_orders, icon: Package, color: 'text-[#3749bb]', bg: 'bg-[#3749bb]/5' },
                        { label: 'Wishlist', value: stats.wishlist_count, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-55' },
                        { label: 'Reward Points', value: stats.points, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                        { label: 'Pending Orders', value: stats.pending_orders, icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-[1px] border border-slate-200 shadow-sm flex items-center gap-4 group transition-all hover:border-[#008060]/30">
                            <div className={`w-12 h-12 ${stat.bg === 'bg-rose-55' ? 'bg-rose-50' : stat.bg} ${stat.color} rounded-[1px] flex items-center justify-center`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 mb-0.5">{stat.label}</p>
                                <p className="text-xl font-bold text-[#081621]">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[15px] font-bold text-[#081621] flex items-center gap-2">
                                <Clock size={16} className="text-[#008060]" />
                                Recent Orders
                            </h3>
                            <button className="text-[11px] font-bold text-[#3749bb] hover:underline">View All</button>
                        </div>
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm overflow-hidden text-[13px]">
                            {recent_orders.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3 text-[11px] font-bold text-slate-500">Order ID</th>
                                            <th className="px-6 py-3 text-[11px] font-bold text-slate-500">Date</th>
                                            <th className="px-6 py-3 text-[11px] font-bold text-slate-500">Amount</th>
                                            <th className="px-6 py-3 text-[11px] font-bold text-slate-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recent_orders.map((order, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-[#3749bb]">{order.id}</td>
                                                <td className="px-6 py-4 text-slate-600">{order.date}</td>
                                                <td className="px-6 py-4 font-bold text-[#081621]">৳{order.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                                        order.status === 'Delivered' ? "bg-green-50 text-green-700 border border-green-100" :
                                                        order.status === 'Pending' ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                                                        "bg-blue-50 text-blue-700 border border-blue-100"
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-14 h-14 bg-slate-50 rounded-[1px] flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Package size={28} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 text-[13px] font-medium">You haven't placed any orders yet.</p>
                                    <Link href="/" className="mt-4 px-6 py-2 bg-[#3749bb] text-white text-[11px] font-bold rounded-[1px] hover:bg-[#2e3d9e] transition-all shadow-lg shadow-[#3749bb]/10 inline-block">
                                        Start Shopping
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Info Sidebar */}
                    <div className="space-y-6">
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
                                <Link href={route('profile.edit')} className="w-full h-[34px] flex items-center justify-center gap-2 border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all rounded-[1px] uppercase tracking-wider mt-2">
                                    <Settings size={12} /> Edit Profile
                                </Link>
                            </div>
                        </div>

                        {/* Primary Address */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm overflow-hidden text-[13px]">
                            <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-[11px] font-bold text-[#081621] uppercase tracking-wider flex items-center gap-2">
                                    <MapPin size={12} className="text-slate-400" />
                                    Address
                                </h3>
                                <Link href={route('user.addresses')} className="text-[11px] font-bold text-[#3749bb] hover:underline uppercase tracking-wider">Manage</Link>
                            </div>
                             <div className="p-5">
                                 <div className="text-slate-500 leading-relaxed">
                                     {primary_address ? (
                                         <div className="space-y-1">
                                             <p className="font-bold text-[#081621] mb-1">{primary_address.type} Address</p>
                                             <p>{primary_address.address}</p>
                                             <p>{primary_address.area}, {primary_address.city} - {primary_address.post_code}</p>
                                         </div>
                                     ) : (
                                         <p>No address set yet. Please add one to speed up checkout.</p>
                                     )}
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default Overview;
