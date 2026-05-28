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

import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

const CategoryDiscountPage = ({ auth, discounts, categories }) => {
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        discount_type: 'percentage',
        discount_value: '',
        start_date: '',
        end_date: '',
        target_type: 'category',
        target_id: '',
        status: 1,
    });

    const openCreate = () => {
        setEditingDiscount(null);
        reset();
        setIsCreateOpen(true);
    };

    const openEdit = (discount) => {
        setEditingDiscount(discount);
        setData({
            name: discount.name,
            discount_type: discount.discount_type,
            discount_value: discount.discount_value,
            start_date: discount.start_date ? discount.start_date.split('T')[0] : '',
            end_date: discount.end_date ? discount.end_date.split('T')[0] : '',
            target_type: discount.target_type,
            target_id: discount.target_id || '',
            status: discount.status ? 1 : 0,
        });
        setIsCreateOpen(true);
    };

    const closeCreate = () => {
        setIsCreateOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingDiscount) {
            put(route('admin.category-discounts.update', editingDiscount.id), {
                onSuccess: () => closeCreate(),
            });
        } else {
            post(route('admin.category-discounts.store'), {
                onSuccess: () => closeCreate(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this discount?")) {
            destroy(route('admin.category-discounts.destroy', id));
        }
    };

    const handleStatusToggle = (discount) => {
        put(route('admin.category-discounts.status', discount.id), {
            status: !discount.status
        });
    };

    const activeCount = discounts.filter(d => d.status).length;
    const scheduledCount = discounts.filter(d => new Date(d.start_date) > new Date()).length;
    
    const filteredDiscounts = discounts.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Category Discounts" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[24px] font-bold text-slate-800 tracking-tight">Category Based Discounts</h1>
                    <p className="text-slate-500 text-[14px] font-medium mt-0.5">Apply bulk discounts to specific product categories.</p>
                </div>
                <button onClick={openCreate} className="h-11 bg-[#ef4a23] text-white px-6 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:bg-[#d83d1a] transition-all flex items-center gap-2">
                    <Plus size={20} /> Create New Discount
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard label="Active Campaigns" value={activeCount} icon={<Percent className="text-emerald-600" />} bgColor="bg-emerald-50" />
                <StatCard label="Scheduled" value={scheduledCount} icon={<Calendar className="text-blue-600" />} bgColor="bg-blue-50" />
                <StatCard label="Total Global Campaigns" value={discounts.length} icon={<Filter className="text-purple-600" />} bgColor="bg-purple-50" />
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
                            {filteredDiscounts.map((discount) => (
                                <tr key={discount.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-900">{discount.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[12px] bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-bold uppercase tracking-wider">{discount.discount_type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-[#ef4a23]">
                                        {discount.discount_type === 'percentage' ? `${discount.discount_value}%` : `৳${discount.discount_value}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">
                                            {discount.start_date ? new Date(discount.start_date).toLocaleDateString() : 'Always'} to {discount.end_date ? new Date(discount.end_date).toLocaleDateString() : 'Forever'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={Boolean(discount.status)} onChange={() => handleStatusToggle(discount)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(discount)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(discount.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
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

            <Modal show={isCreateOpen} onClose={closeCreate} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">{editingDiscount ? 'Edit Discount' : 'Create Global Discount'}</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full h-11 border border-slate-200 rounded-lg px-4" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                                <select value={data.discount_type} onChange={e => setData('discount_type', e.target.value)} className="w-full h-11 border border-slate-200 rounded-lg px-4">
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                                <input type="number" step="0.01" value={data.discount_value} onChange={e => setData('discount_value', e.target.value)} className="w-full h-11 border border-slate-200 rounded-lg px-4" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className="w-full h-11 border border-slate-200 rounded-lg px-4" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className="w-full h-11 border border-slate-200 rounded-lg px-4" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Target Type</label>
                            <select value={data.target_type} onChange={e => setData('target_type', e.target.value)} className="w-full h-11 border border-slate-200 rounded-lg px-4">
                                <option value="all">All Products</option>
                                <option value="category">Specific Category</option>
                            </select>
                        </div>
                        {data.target_type === 'category' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Category</label>
                                <select value={data.target_id} onChange={e => setData('target_id', e.target.value)} className="w-full h-11 border border-slate-200 rounded-lg px-4" required>
                                    <option value="">Choose a category...</option>
                                    {categories?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeCreate} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-[#ef4a23] text-white font-bold rounded-lg shadow-md shadow-orange-200 hover:bg-[#d83d1a] transition-all disabled:opacity-50">
                            {editingDiscount ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
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
