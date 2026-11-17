import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { UserCheck, Plus, Search, Eye, Edit, Trash2, X } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import SecondaryButton from '@/Components/Button/SecondaryButton';

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
                    <p className="text-xs text-slate-500 mt-0.5">Manage coaching instructors, qualifications, specializations & batch assignments.</p>
                </div>
                <PrimaryButton
                    onClick={() => setShowModal(true)}
                    className="h-[36px] text-xs gap-2 rounded-[3px]"
                >
                    <Plus size={16} /> Add Teacher
                </PrimaryButton>
            </div>

            {/* SEARCH */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <TextInput
                        placeholder="Search teacher by name, ID, phone, specialization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-[36px]"
                    />
                </div>
                <PrimaryButton type="submit" className="h-[36px] px-5 bg-slate-900 hover:bg-slate-800 text-xs rounded-[3px]">
                    Search
                </PrimaryButton>
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
            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full p-6 rounded-[4px] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Add New Teacher</h3>
                                <p className="text-[11px] text-slate-500">Provide instructor personal details and specialization.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-[3px] cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <InputLabel value="Full Name *" />
                                <TextInput
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Dr. Rafiqul Islam"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel value="Phone *" />
                                    <TextInput
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="01711-XXXXXX"
                                        required
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                                <div>
                                    <InputLabel value="Email Address" />
                                    <TextInput
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="teacher@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel value="Qualification" />
                                    <TextInput
                                        type="text"
                                        value={data.qualification}
                                        onChange={(e) => setData('qualification', e.target.value)}
                                        placeholder="e.g. M.Sc in Physics"
                                    />
                                    <InputError message={errors.qualification} />
                                </div>
                                <div>
                                    <InputLabel value="Specialization" />
                                    <TextInput
                                        type="text"
                                        value={data.specialization}
                                        onChange={(e) => setData('specialization', e.target.value)}
                                        placeholder="e.g. Physics & Math"
                                    />
                                    <InputError message={errors.specialization} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <SecondaryButton type="button" onClick={() => setShowModal(false)} className="h-[36px] text-xs">
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing} className="h-[36px] text-xs">
                                    Save Teacher
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
