import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { UserCheck, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

export default function TeacherIndex({ teachers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        qualification: '',
        designation: '',
        specialization: '',
        address: '',
        notes: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.teachers.index'), { search }, { preserveState: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.teachers.store'), {
            onSuccess: () => {
                reset();
                setShowModal(false);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Teacher Management" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Management</h1>
                    <p className="text-sm text-slate-500">Manage coaching instructors, qualifications, specializations & batch assignments.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm"
                >
                    <Plus size={16} /> Add Teacher
                </button>
            </div>

            {/* SEARCH */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search teacher by name, ID, phone, specialization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg">Search</button>
            </form>

            {/* TEACHERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.data.length > 0 ? (
                    teachers.data.map((t) => (
                        <div key={t.id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{t.teacher_id}</span>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                        {t.status}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
                                <p className="text-xs text-slate-500">{t.designation || 'Instructor'}</p>

                                <div className="mt-4 space-y-1 text-xs text-slate-600 border-t pt-3">
                                    <div><span className="font-semibold text-slate-700">Specialization:</span> {t.specialization || 'N/A'}</div>
                                    <div><span className="font-semibold text-slate-700">Qualification:</span> {t.qualification || 'N/A'}</div>
                                    <div><span className="font-semibold text-slate-700">Phone:</span> {t.phone}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t pt-3">
                                <span className="text-xs text-slate-500 font-medium">{t.batches?.length || 0} Batches Assigned</span>
                                <Link
                                    href={route('admin.teachers.show', t.id)}
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                                >
                                    <Eye size={14} /> Profile
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white p-8 rounded-xl border text-center text-slate-500">
                        No teachers found.
                    </div>
                )}
            </div>

            {/* ADD TEACHER MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Add New Teacher</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification</label>
                                    <input
                                        type="text"
                                        value={data.qualification}
                                        onChange={(e) => setData('qualification', e.target.value)}
                                        placeholder="e.g. M.Sc in Physics"
                                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                                    <input
                                        type="text"
                                        value={data.specialization}
                                        onChange={(e) => setData('specialization', e.target.value)}
                                        placeholder="e.g. Physics & Math"
                                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg">Save Teacher</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
