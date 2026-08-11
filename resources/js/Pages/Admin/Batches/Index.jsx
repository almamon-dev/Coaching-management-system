import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Calendar, Clock, Users, X, BookOpen } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import InputError from '@/Components/Form/InputError';

export default function BatchIndex({ batches = [], courses = [] }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        course_id: courses[0]?.id || '',
        room: 'Room 101',
        start_date: '',
        end_date: '',
        class_days: 'Sun, Tue, Thu',
        class_time: '10:00 AM - 11:30 AM',
        max_students: 40,
        status: 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.batches.store'), {
            onSuccess: () => { reset(); setShowModal(false); }
        });
    };

    const subjectOptions = courses.map(c => ({
        id: c.id,
        name: `${c.title} (${c.code})`
    }));

    const statusOptions = [
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
        { id: 'upcoming', name: 'Upcoming' },
        { id: 'completed', name: 'Completed' },
    ];

    return (
        <AdminLayout>
            <Head title="Batch Management" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Batch Management</h1>
                    <p className="text-sm text-slate-500">Create coaching student batches by Subject, assign room & class schedules.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                >
                    <Plus size={16} /> Create Batch
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {batches.map((b) => (
                    <div key={b.id} className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm space-y-3.5 flex flex-col justify-between hover:border-emerald-300 transition-all">
                        <div>
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[11px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    <BookOpen size={12} /> {b.course?.title || 'Subject'}
                                </span>
                                <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${b.status === 'active' ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                    {b.status}
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">{b.name}</h3>

                            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3.5 mt-3">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-[#16a34a]" />
                                    <span className="text-slate-500">Class Days:</span>
                                    <span className="font-bold text-slate-800">{b.class_days || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-[#16a34a]" />
                                    <span className="text-slate-500">Class Time:</span>
                                    <span className="font-bold text-slate-800">{b.class_time || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-[#16a34a]" />
                                    <span className="text-slate-500">Enrolled Students:</span>
                                    <span className="font-bold text-[#16a34a]">{b.students_count || 0} / {b.max_students} Students</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE BATCH MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Create New Batch</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Batch Name *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. HSC Alpha Physics Morning"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="course_id" value="Subject *" />
                                <SelectInput
                                    value={data.course_id}
                                    onChange={(e) => setData('course_id', e.target ? e.target.value : e)}
                                    options={subjectOptions}
                                    placeholder="Select Subject"
                                />
                                <InputError message={errors.course_id} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="class_days" value="Class Days" />
                                    <TextInput
                                        id="class_days"
                                        type="text"
                                        value={data.class_days}
                                        onChange={(e) => setData('class_days', e.target.value)}
                                        placeholder="Sun, Tue, Thu"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="class_time" value="Class Time" />
                                    <TextInput
                                        id="class_time"
                                        type="text"
                                        value={data.class_time}
                                        onChange={(e) => setData('class_time', e.target.value)}
                                        placeholder="10:00 AM - 11:30 AM"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="max_students" value="Max Student Limit" />
                                    <TextInput
                                        id="max_students"
                                        type="number"
                                        value={data.max_students}
                                        onChange={(e) => setData('max_students', e.target.value)}
                                        placeholder="40"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <SelectInput
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target ? e.target.value : e)}
                                        options={statusOptions}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] cursor-pointer shadow-sm"
                                >
                                    Save Batch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
