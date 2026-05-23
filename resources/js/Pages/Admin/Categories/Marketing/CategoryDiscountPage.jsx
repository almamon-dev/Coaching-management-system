/**
 * CategoryDiscountPage Component
 * 
 * Marketing interface for managing category-wide discounts and campaigns.
 * Features campaign overview stats and a detailed discount schedule table.
 */
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { 
    Plus, Search, Edit2, Trash2, Percent, 
    Calendar, CheckCircle2, MoreHorizontal, Filter
} from 'lucide-react';

const CategoryDiscountPage = ({ auth }) => {
    const [search, setSearch] = useState("");

    // Static data for design preview
    const mockDiscounts = [
        { id: 1, category: "Electronics", discount_type: "Percentage", value: "15%", start_date: "2024-05-01", end_date: "2024-05-31", status: 1 },
        { id: 2, category: "Fashion", discount_type: "Fixed", value: "$20", start_date: "2024-06-10", end_date: "2024-06-20", status: 1 },
        { id: 3, category: "Home & Garden", discount_type: "Percentage", value: "10%", start_date: "2024-04-15", end_date: "2024-04-30", status: 0 },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Category Discounts" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[24px] font-bold text-slate-800 tracking-tight">Category Based Discounts</h1>
                    <p className="text-slate-500 text-[14px] font-medium mt-0.5">Apply bulk discounts to specific product categories.</p>
                </div>
                <button className="h-11 bg-[#ef4a23] text-white px-6 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:bg-[#d83d1a] transition-all flex items-center gap-2">
                    <Plus size={20} /> Create New Discount
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard label="Active Campaigns" value="2" icon={<Percent className="text-emerald-600" />} bgColor="bg-emerald-50" />
                <StatCard label="Scheduled" value="1" icon={<Calendar className="text-blue-600" />} bgColor="bg-blue-50" />
                <StatCard label="Total Categories Discounted" value="5" icon={<Filter className="text-purple-600" />} bgColor="bg-purple-50" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            placeholder="Search by category name..." 
                            className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#ef4a23] outline-none transition-all" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Discount Type</th>
                                <th className="px-6 py-4 text-center">Value</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockDiscounts.map((discount) => (
                                <tr key={discount.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-900">{discount.category}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[12px] bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-bold uppercase tracking-wider">{discount.discount_type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-[#ef4a23]">{discount.value}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">{discount.start_date} to {discount.end_date}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={discount.status === 1} className="sr-only peer" readOnly />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <button className="p-2 text-slate-400 group-hover:hidden">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({ label, value, icon, bgColor }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
            {React.cloneElement(icon, { size: 22 })}
        </div>
        <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        </div>
    </div>
);

export default CategoryDiscountPage;
