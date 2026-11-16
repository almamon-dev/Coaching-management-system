import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { Plus, Calendar, Clock, Users, X, BookOpen, UserCheck, Edit2, Trash2 } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import InputError from '@/Components/Form/InputError';

export default function BatchIndex({ batches = [], courses = [], teachers = [] }) {
    const { settings } = usePage().props;
    const coachingMode = settings?.coaching_mode || 'single';
    const isMultiTeacher = coachingMode === 'multi';

    const [showModal, setShowModal] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        course_id: courses[0]?.id || '',
        teacher_id: teachers[0]?.id || '',
        room: 'Room 101',
        start_date: '',
        end_date: '',
        class_days: 'Sun, Tue, Thu',
        class_time: '10:00 AM - 11:30 AM',
        max_students: 40,
        status: 'active',
    });

    const openCreateModal = () => {
        setEditingBatch(null);
        reset();
        setData({
            name: '',
            course_id: courses[0]?.id || '',
            teacher_id: teachers[0]?.id || '',
            room: 'Room 101',
            start_date: '',
            end_date: '',
            class_days: 'Sun, Tue, Thu',
            class_time: '10:00 AM - 11:30 AM',
            max_students: 40,
            status: 'active',
        });
        setShowModal(true);
    };

    const openEditModal = (batch) => {
        setEditingBatch(batch);
        setData({
            name: batch.name || '',
            course_id: batch.course_id || '',
            teacher_id: batch.teacher_id || '',
            room: batch.room || 'Room 101',
            start_date: batch.start_date || '',
            end_date: batch.end_date || '',
            class_days: batch.class_days || '',
            class_time: batch.class_time || '',
            max_students: batch.max_students || 40,
            status: batch.status || 'active',
        });
        setShowModal(true);
    };

    const handleDeleteBatch = (id, name) => {
        if (confirm(`Are you sure you want to delete batch "${name}"?`)) {
            router.delete(route('admin.batches.destroy', id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBatch) {
            put(route('admin.batches.update', editingBatch.id), {
                onSuccess: () => { reset(); setShowModal(false); setEditingBatch(null); }
            });
        } else {
            post(route('admin.batches.store'), {
                onSuccess: () => { reset(); setShowModal(false); }
            });
        }
    };

    const subjectOptions = courses.map(c => ({
        id: c.id,
        name: `${c.title} (${c.code})`
    }));

    const teacherOptions = [
        { id: '', name: 'Select Instructor (Optional)' },
        ...teachers.map(t => ({
            id: t.id,
            name: `${t.name} (${t.specialization || t.teacher_id})`
        }))
    ];

    const statusOptions = [
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
        { id: 'upcoming', name: 'Upcoming' },
        { id: 'completed', name: 'Completed' },
    ];

    const filteredBatches = selectedSubjectFilter === 'all'
        ? batches
        : batches.filter(b => String(b.course_id) === String(selectedSubjectFilter));

    return (
        <AdminLayout>
            <Head title="Batch Management" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Batch Management</h1>
                    <p className="text-sm text-slate-500">
                        {isMultiTeacher
                            ? 'Create coaching batches by Subject, assign instructors, rooms & class schedules.'
                            : 'Organize your student batches by Subject, class days & time slots.'}
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer shrink-0"
                >
                    <Plus size={16} /> Create Batch
                </button>
            </div>

            {/* SUBJECT FILTER PILLS */}
            {courses.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setSelectedSubjectFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            selectedSubjectFilter === 'all'
                                ? 'bg-[#16a34a] text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                        }`}
                    >
                        All Subjects ({batches.length})
                    </button>
                    {courses.map((c) => {
                        const count = batches.filter(b => String(b.course_id) === String(c.id)).length;
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setSelectedSubjectFilter(String(c.id))}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    String(selectedSubjectFilter) === String(c.id)
                                        ? 'bg-[#16a34a] text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                                }`}
                            >
                                {c.title} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBatches.map((b) => (
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
                                {isMultiTeacher && (
                                    <div className="flex items-center gap-2">
                                        <UserCheck size={14} className="text-indigo-600" />
                                        <span className="text-slate-500">Instructor:</span>
                                        <span className="font-bold text-indigo-700">{b.teacher?.name || 'Not Assigned'}</span>
                                    </div>
                                )}
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

                        <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                            <Link
                                href={route('admin.students.index', { batch_id: b.id })}
                                className="font-bold text-[#16a34a] hover:underline"
                            >
                                Students ({b.students_count || 0}) →
                            </Link>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => openEditModal(b)}
                                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <Edit2 size={12} /> Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteBatch(b.id, b.name)}
                                    className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 font-semibold px-2 py-0.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE / EDIT BATCH MODAL */}
            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80 overflow-visible relative my-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">
                                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
                            </h3>
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

                            {isMultiTeacher && (
                                <div>
                                    <InputLabel htmlFor="teacher_id" value="Assign Teacher" />
                                    <SelectInput
                                        value={data.teacher_id}
                                        onChange={(e) => setData('teacher_id', e.target ? e.target.value : e)}
                                        options={teacherOptions}
                                        placeholder="Select Teacher"
                                    />
                                    <InputError message={errors.teacher_id} className="mt-1" />
                                </div>
                            )}

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
                                    {processing ? 'Saving...' : (editingBatch ? 'Save Changes' : 'Save Batch')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
