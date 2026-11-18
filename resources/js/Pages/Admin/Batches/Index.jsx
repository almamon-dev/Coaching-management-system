import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { Plus, Calendar, Clock, Users, X, BookOpen, UserCheck, Edit2, Trash2, Eye, Layers, AlertCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import InputError from '@/Components/Form/InputError';
import ImageUpload from '@/Components/Form/ImageUpload';

export default function BatchIndex({ batches = [], courses = [], teachers = [] }) {
    const { settings } = usePage().props;
    const coachingMode = settings?.coaching_mode || 'single';
    const isMultiTeacher = coachingMode === 'multi';

    const courseList = courses && courses.length > 0 ? courses : [];

    const [showModal, setShowModal] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        course_id: courseList[0]?.id || '',
        teacher_id: teachers[0]?.id || '',
        image: null,
        start_date: '',
        end_date: '',
        class_days: 'Sun, Tue, Thu',
        max_students: 40,
        status: 'active',
    });

    const openCreateModal = () => {
        setEditingBatch(null);
        reset();
        setData({
            name: '',
            course_id: courseList[0]?.id || '',
            teacher_id: teachers[0]?.id || '',
            image: null,
            start_date: '',
            end_date: '',
            class_days: 'Sun, Tue, Thu',
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
            image: batch.image || null,
            start_date: batch.start_date || '',
            end_date: batch.end_date || '',
            class_days: batch.class_days || '',
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
            if (data.image instanceof File) {
                router.post(route('admin.batches.update', editingBatch.id), {
                    _method: 'put',
                    ...data,
                }, {
                    onSuccess: () => { reset(); setShowModal(false); setEditingBatch(null); }
                });
            } else {
                put(route('admin.batches.update', editingBatch.id), {
                    onSuccess: () => { reset(); setShowModal(false); setEditingBatch(null); }
                });
            }
        } else {
            post(route('admin.batches.store'), {
                onSuccess: () => { reset(); setShowModal(false); }
            });
        }
    };

    const subjectOptions = courseList.map(c => ({
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
                            ? 'Create coaching batches by Subject, assign instructors & class schedules.'
                            : 'Organize your student batches by Subject & class days.'}
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
            {courseList.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setSelectedSubjectFilter('all')}
                        className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${selectedSubjectFilter === 'all'
                                ? 'bg-[#16a34a] text-white shadow-2xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                            }`}
                    >
                        All Subjects ({batches.length})
                    </button>
                    {courseList.map((c) => {
                        const count = batches.filter(b => String(b.course_id) === String(c.id)).length;
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setSelectedSubjectFilter(String(c.id))}
                                className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${String(selectedSubjectFilter) === String(c.id)
                                        ? 'bg-[#16a34a] text-white shadow-2xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                                    }`}
                            >
                                {c.title} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {/* BATCHES GRID OR EMPTY STATE */}
            {filteredBatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBatches.map((b) => (
                        <div
                            key={b.id}
                            className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-emerald-400/80 hover:shadow-xs transition-all overflow-hidden"
                        >
                            {b.image && (
                                <div className="h-32 w-full bg-slate-100 overflow-hidden relative border-b border-slate-100 shrink-0">
                                    <img
                                        src={b.image}
                                        alt={b.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    {/* Top Row: Course Tag and Status Badge */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                    <Link
                                        href={b.course_id ? route('admin.courses.show', b.course_id) : route('admin.courses.index')}
                                        className="text-[10px] font-bold text-[#16a34a] hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/70 px-2 py-0.5 rounded-[3px] inline-flex items-center gap-1.5 shadow-2xs leading-snug transition-colors cursor-pointer"
                                        title="Click to view Subject details"
                                    >
                                        <BookOpen size={11} className="shrink-0 text-[#16a34a]" />
                                        <span>{b.course?.title || 'Subject'}</span>
                                    </Link>
                                    <span className={`px-1.5 py-0.5 text-[9.5px] font-bold rounded-[3px] capitalize shrink-0 shadow-2xs mt-0.5 ${b.status === 'active'
                                            ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}>
                                        {b.status}
                                    </span>
                                </div>

                                {/* Batch Name */}
                                <Link
                                    href={route('admin.batches.show', b.id)}
                                    className="text-[13px] font-bold text-slate-900 hover:text-[#16a34a] leading-snug break-words transition-colors block"
                                    title="Click to view batch details"
                                >
                                    {b.name}
                                </Link>

                                {/* Details */}
                                <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-2.5 mt-2.5">
                                    {isMultiTeacher && (
                                        <div className="flex items-center gap-2">
                                            <UserCheck size={13} className="text-indigo-600 shrink-0" />
                                            <span className="text-slate-500 font-medium">Instructor:</span>
                                            <span className="font-semibold text-indigo-700">{b.teacher?.name || 'Not Assigned'}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar size={13} className="text-[#16a34a] shrink-0" />
                                        <span className="text-slate-500 font-medium">Class Days:</span>
                                        <span className="font-semibold text-slate-800">{b.class_days || 'Regular'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={13} className="text-[#16a34a] shrink-0" />
                                        <span className="text-slate-500 font-medium">Enrolled:</span>
                                        <span className="font-bold text-[#16a34a]">
                                            {b.students_count || 0} / {b.max_students} Students
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row Actions */}
                            <div className="pt-2.5 border-t border-slate-100 mt-2.5 flex items-center justify-between text-[11px]">
                                <Link
                                    href={route('admin.students.index', { batch_id: b.id })}
                                    className="font-bold text-[#16a34a] hover:underline"
                                    title="View enrolled students"
                                >
                                    Students ({b.students_count || 0}) →
                                </Link>
                                <div className="flex items-center gap-1.5">
                                    <Link
                                        href={route('admin.batches.show', b.id)}
                                        className="inline-flex items-center gap-1 text-slate-600 hover:text-[#16a34a] font-semibold px-2 py-0.5 rounded-[3px] hover:bg-slate-100 transition-colors cursor-pointer text-[11px]"
                                        title="View batch overview & routine"
                                    >
                                        <Eye size={11} /> View
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(b)}
                                        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold px-2 py-0.5 rounded-[3px] hover:bg-slate-100 transition-colors cursor-pointer text-[11px]"
                                    >
                                        <Edit2 size={11} /> Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteBatch(b.id, b.name)}
                                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold px-2 py-0.5 rounded-[3px] hover:bg-rose-50 transition-colors cursor-pointer text-[11px]"
                                    >
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            ) : (
                <div className="py-12 sm:py-20 text-center max-w-md mx-auto">
                    <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3.5">
                        <Layers size={26} />
                    </div>

                    {batches.length === 0 ? (
                        <>
                            <h3 className="text-base font-bold text-slate-800 mb-1">
                                No Coaching Batches Created Yet
                            </h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                                {courseList.length === 0
                                    ? 'To create a coaching batch, you need at least one subject/course first. Please create a subject before adding batches.'
                                    : 'Start organizing your coaching classes by creating your first batch with class days and student capacity.'}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                {courseList.length === 0 ? (
                                    <Link
                                        href={route('admin.courses.create')}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-2xs transition-all cursor-pointer"
                                    >
                                        <Plus size={14} /> Create First Subject
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={openCreateModal}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-2xs transition-all cursor-pointer"
                                    >
                                        <Plus size={14} /> Create Your First Batch
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-base font-bold text-slate-800 mb-1">
                                No Batches Found in This Subject
                            </h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                                There are no active batches assigned to the currently selected subject filter.
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSubjectFilter('all')}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] transition-colors cursor-pointer"
                                >
                                    Show All Batches ({batches.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] transition-colors cursor-pointer"
                                >
                                    <Plus size={14} /> Create Batch
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* CREATE / EDIT BATCH MODAL */}
            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white max-w-lg w-full p-6 rounded-[4px] shadow-xl space-y-4 border border-slate-200/80 overflow-visible relative my-auto">
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
                                {courseList.length === 0 ? (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-[3px] text-xs text-amber-800 space-y-1.5 mt-1">
                                        <div className="font-bold flex items-center gap-1.5 text-amber-900">
                                            <AlertCircle size={14} className="text-amber-600 shrink-0" />
                                            <span>No Subjects / Courses Found!</span>
                                        </div>
                                        <p className="text-[11px] text-amber-700 leading-normal">
                                            Each coaching batch must belong to a subject/course. Please create a subject first before creating a batch.
                                        </p>
                                        <Link
                                            href={route('admin.courses.create')}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16a34a] hover:underline pt-0.5"
                                        >
                                            <span>Create Subject Now</span>
                                            <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                ) : (
                                    <SelectInput
                                        value={data.course_id}
                                        onChange={(e) => setData('course_id', e.target ? e.target.value : e)}
                                        options={subjectOptions}
                                        placeholder="Select Subject"
                                    />
                                )}
                                <InputError message={errors.course_id} className="mt-1" />
                            </div>

                            {/* Batch Photo / Banner Upload */}
                            <div>
                                <InputLabel value="Batch Photo / Banner (Optional)" />
                                <ImageUpload
                                    value={data.image}
                                    onChange={(file) => setData('image', file)}
                                    placeholder="Upload batch banner or classroom photo"
                                    aspectRatio="video"
                                    error={errors.image}
                                />
                                <InputError message={errors.image} className="mt-1" />
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

                            <div>
                                <InputLabel htmlFor="class_days" value="Class Days" />
                                <TextInput
                                    id="class_days"
                                    type="text"
                                    value={data.class_days}
                                    onChange={(e) => setData('class_days', e.target.value)}
                                    placeholder="e.g. Sun, Tue, Thu"
                                />
                                <InputError message={errors.class_days} className="mt-1" />
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
                                    disabled={processing || courseList.length === 0}
                                    title={courseList.length === 0 ? 'Create a subject first' : ''}
                                    className={`px-4 py-2 font-bold text-xs rounded-[3px] shadow-sm transition-all ${
                                        courseList.length === 0
                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                            : 'bg-[#16a34a] hover:bg-[#15803d] text-white cursor-pointer'
                                    }`}
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
