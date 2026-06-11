import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2, Search, X, SlidersHorizontal, RotateCcw, AlertTriangle } from 'lucide-react';
import Modal from '@/Components/Modal';
import Notify from '@/Utils/Notify';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import ColumnManager from '../AcademicClasses/Components/ColumnManager';
import AcademicClassStats from '../AcademicClasses/Components/AcademicClassStats';

import { ChevronDown, Check } from 'lucide-react';

const RoutineToolbar = ({ search, setSearch, handleReset, showAdvanced, setShowAdvanced, columns, visibleColumns, toggleColumn, selectedIds, handleClearSelection, handleBulkDelete }) => {
    const [showSelectionMenu, setShowSelectionMenu] = useState(false);
    return (
    <div className="border-b border-[#ebebeb] bg-white relative z-30">
        {selectedIds.length > 0 && (
            <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-3 animate-in slide-in-from-top-1 duration-200 shadow-sm border-b border-[#ebebeb]">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div 
                            onClick={() => setShowSelectionMenu(!showSelectionMenu)}
                            className="flex items-center gap-2 px-2.5 h-[36px] bg-[#f1f1f1] border border-[#d1d1d1] rounded-[4px] cursor-pointer hover:bg-[#ebebeb] transition-colors"
                        >
                            <div className="w-[17px] h-[17px] bg-[#008060] border-[#008060] rounded-[3px] flex items-center justify-center">
                                <Check size={11} strokeWidth={4} className="text-white" />
                            </div>
                            <span className="text-[13px] font-bold text-[#202223]">
                                {selectedIds.length} selected
                            </span>
                            <ChevronDown size={14} className={`text-[#6d7175] transition-transform ${showSelectionMenu ? "rotate-180" : ""}`} />
                        </div>
                        {showSelectionMenu && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setShowSelectionMenu(false)} />
                                <div className="absolute top-full left-0 mt-1 w-auto min-w-full bg-white border border-[#d1d1d1] rounded-[4px] shadow-lg z-40 py-1 animate-in fade-in zoom-in-95 duration-100">
                                    <button 
                                        onClick={() => { handleClearSelection(); setShowSelectionMenu(false); }}
                                        className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] text-[#202223] transition-colors whitespace-nowrap"
                                    >
                                        Deselect all
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="h-4 w-[1px] bg-[#d1d1d1] mx-1" />
                    <button onClick={handleBulkDelete} className="h-[36px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#bf0711] hover:bg-[#fbeae5] transition-all flex items-center gap-1.5 shadow-sm">
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleClearSelection} className="p-1.5 text-[#6d7175] hover:text-[#202223] transition-colors border-l border-[#ebebeb] pl-3"><X size={16} /></button>
                </div>
            </div>
        )}
        <div className={`p-3 flex items-center justify-between gap-4 transition-opacity duration-200 ${selectedIds.length > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                <TextInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search routine..."
                    className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none w-full"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors bg-transparent border-none cursor-pointer">
                        <X size={14} />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-1.5">
                <button onClick={handleReset} className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer" title="Reset Filters">
                    <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                </button>
                <div className="w-[1px] h-4 bg-[#ebebeb] mx-1" />
                <ColumnManager columns={columns} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
            </div>
        </div>
    </div>
)};

const RoutinePagination = ({ paginator, perPage, handlePerPageChange }) => {
    const fromIdx = paginator?.meta?.from || paginator?.from || 0;
    const toIdx = paginator?.meta?.to || paginator?.to || 0;
    const total = paginator?.meta?.total || paginator?.total || 0;
    
    const prevUrl = paginator?.meta?.links?.find(l => l.label.includes('Previous'))?.url || paginator?.prev_page_url || paginator?.links?.prev;
    const nextUrl = paginator?.meta?.links?.find(l => l.label.includes('Next'))?.url || paginator?.next_page_url || paginator?.links?.next;

    return (
        <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white">
            <div className="flex items-center gap-2">
                <div className="w-[75px]">
                    <SelectInput
                        value={perPage}
                        onChange={(e) => handlePerPageChange(e.target.value)}
                        showSearch={false}
                        direction="up"
                        options={[{ id: '10', name: '10' }, { id: '15', name: '15' }, { id: '30', name: '30' }, { id: '50', name: '50' }]}
                        className="[&_button]:h-[30px] [&_button]:py-0 min-w-0"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#081621] font-bold tabular-nums">
                    {total > 0 ? `${fromIdx} - ${toIdx} of ${total}` : '0 - 0'}
                </span>
                <div className="flex gap-1">
                    <Link
                        href={prevUrl || '#'}
                        preserveState preserveScroll
                        as="button" disabled={!prevUrl}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <span className="text-[14px]">‹</span>
                    </Link>
                    <Link
                        href={nextUrl || '#'}
                        preserveState preserveScroll
                        as="button" disabled={!nextUrl}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <span className="text-[14px]">›</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Index({ auth, routines, classes, sections, subjects, teachers, filters, stats }) {
    const allColumns = [
        { id: 'class_section', label: 'Class & Section' },
        { id: 'subject', label: 'Subject' },
        { id: 'teacher', label: 'Teacher' },
        { id: 'timing', label: 'Day & Time' },
        { id: 'room', label: 'Room' },
        { id: 'created_at', label: 'Created At' },
        { id: 'updated_at', label: 'Updated At' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(['class_section', 'subject', 'teacher', 'timing', 'room', 'created_at', 'updated_at']);
    const toggleColumn = (id) => setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    const [search, setSearch] = useState(filters?.search || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        academic_class_id: '',
        section_id: '',
        subject_id: '',
        teacher_id: '',
        day: 'Monday',
        start_time: '',
        end_time: '',
        room_number: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.class_routines.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handlePerPageChange = (val) => {
        router.get(route('admin.class_routines.index'), { ...filters, per_page: val, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        router.get(route('admin.class_routines.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const availableIds = routines?.data?.map(s => s.id) || [];
    const isAllSelected = selectedIds.length === availableIds.length && availableIds.length > 0;
    
    const toggleSelectAll = () => {
        if (selectedIds.length > 0) setSelectedIds([]);
        else setSelectedIds(availableIds);
    };
    
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.length} routines?`)) {
            Notify.error('Not Implemented', 'Bulk delete backend route needs to be added.');
        }
    };

    const openModal = (routine = null) => {
        clearErrors();
        if (routine) {
            setEditingRoutine(routine);
            setData({
                academic_class_id: routine.academic_class_id,
                section_id: routine.section_id,
                subject_id: routine.subject_id,
                teacher_id: routine.teacher_id || '',
                day: routine.day,
                start_time: routine.start_time.substring(0,5),
                end_time: routine.end_time.substring(0,5),
                room_number: routine.room_number || '',
            });
        } else {
            setEditingRoutine(null);
            reset();
            setData('day', 'Monday');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRoutine(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingRoutine) {
            put(route('admin.class_routines.update', editingRoutine.id), {
                onSuccess: () => { closeModal(); Notify.success('Updated', 'Routine updated successfully.'); },
            });
        } else {
            post(route('admin.class_routines.store'), {
                onSuccess: () => { closeModal(); Notify.success('Created', 'Routine created successfully.'); },
            });
        }
    };

    const deleteRoutine = (routine) => {
        if (confirm(`Are you sure you want to delete this routine?`)) {
            router.delete(route('admin.class_routines.destroy', routine.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(id => id !== routine.id));
                    Notify.success('Deleted', 'Routine deleted successfully.');
                },
            });
        }
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        let hours = parseInt(h);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${m} ${ampm}`;
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Class Routine" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Class Routine</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage daily schedules, subjects, and teacher assignments.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} /> Add Routine
                </button>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {stats && <AcademicClassStats stats={stats} />}
                <RoutineToolbar 
                    search={search} setSearch={setSearch} handleReset={handleReset}
                    showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
                    columns={allColumns} visibleColumns={visibleColumns} toggleColumn={toggleColumn}
                    selectedIds={selectedIds} handleClearSelection={() => setSelectedIds([])} handleBulkDelete={handleBulkDelete}
                />

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-[#ebebeb]">
                                <th className="py-3 px-4 w-[48px] text-center select-none">
                                    <div onClick={toggleSelectAll} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isAllSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1]'}`}>
                                        {isAllSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                                    </div>
                                </th>
                                {visibleColumns.includes('class_section') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Class & Section</th>}
                                {visibleColumns.includes('subject') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Subject</th>}
                                {visibleColumns.includes('teacher') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Teacher</th>}
                                {visibleColumns.includes('timing') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Day & Time</th>}
                                {visibleColumns.includes('room') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Room</th>}
                                {visibleColumns.includes('created_at') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Created At</th>}
                                {visibleColumns.includes('updated_at') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Updated At</th>}
                                <th className="py-3 px-4 text-[12px] font-bold text-slate-700 text-right w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb]">
                            {routines?.data?.map((routine) => {
                                const isSelected = selectedIds.includes(routine.id);
                                return (
                                    <tr key={routine.id} className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-[#f0f9f7]/20' : ''}`}>
                                        <td className="py-2 px-4 text-center select-none">
                                            <div onClick={() => toggleSelect(routine.id)} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1] hover:border-slate-400'}`}>
                                                {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                                            </div>
                                        </td>
                                        {visibleColumns.includes('class_section') && (
                                            <td className="py-2 px-4 text-[13px] font-bold text-slate-800">
                                                {routine.academic_class?.name} - <span className="text-[#008060]">{routine.section?.name}</span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('subject') && (
                                            <td className="py-2 px-4 text-[13px] font-medium text-slate-700">
                                                {routine.subject?.name}
                                                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{routine.subject?.code}</div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('teacher') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                {routine.teacher?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                            </td>
                                        )}
                                        {visibleColumns.includes('timing') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-700">
                                                <div className="font-bold mb-0.5">{routine.day}</div>
                                                <div className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block border border-slate-200">
                                                    {formatTime(routine.start_time)} - {formatTime(routine.end_time)}
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('room') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600 font-medium">
                                                {routine.room_number || '-'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('created_at') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                {routine.created_at ? new Date(routine.created_at).toLocaleDateString() : '-'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('updated_at') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                {routine.updated_at ? new Date(routine.updated_at).toLocaleDateString() : '-'}
                                            </td>
                                        )}
                                        <td className="py-2 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openModal(routine)} className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all">
                                                    <SquarePen size={12} />
                                                </button>
                                                <button onClick={() => deleteRoutine(routine)} className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322]">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!routines?.data || routines.data.length === 0) && (
                                <tr>
                                    <td colSpan={visibleColumns.length + 2} className="p-12 text-center text-slate-400 bg-white">
                                        <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                        <h5 className="text-[13.5px] font-bold text-slate-700">No routines found</h5>
                                        <p className="text-[12px] text-[#6d7175] mt-0.5">Start by scheduling a class.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <RoutinePagination paginator={routines} perPage={filters?.per_page || 10} handlePerPageChange={handlePerPageChange} />
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-[16px] font-bold text-slate-800 mb-4">
                        {editingRoutine ? 'Edit Class Routine' : 'Add Class Routine'}
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Class <span className="text-red-500">*</span></label>
                                <select
                                    value={data.academic_class_id}
                                    onChange={e => setData('academic_class_id', e.target.value)}
                                    className="w-full border border-slate-300 rounded-[3px] text-[13px] h-[36px] px-3 bg-white"
                                >
                                    <option value="">Select a Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.academic_class_id && <p className="text-[11px] text-red-500 mt-1">{errors.academic_class_id}</p>}
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Section <span className="text-red-500">*</span></label>
                                <select
                                    value={data.section_id}
                                    onChange={e => setData('section_id', e.target.value)}
                                    className="w-full border border-slate-300 rounded-[3px] text-[13px] h-[36px] px-3 bg-white"
                                >
                                    <option value="">Select a Section</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.name} ({s.academic_class?.name})</option>)}
                                </select>
                                {errors.section_id && <p className="text-[11px] text-red-500 mt-1">{errors.section_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                                <select
                                    value={data.subject_id}
                                    onChange={e => setData('subject_id', e.target.value)}
                                    className="w-full border border-slate-300 rounded-[3px] text-[13px] h-[36px] px-3 bg-white"
                                >
                                    <option value="">Select a Subject</option>
                                    {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>)}
                                </select>
                                {errors.subject_id && <p className="text-[11px] text-red-500 mt-1">{errors.subject_id}</p>}
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Teacher</label>
                                <select
                                    value={data.teacher_id}
                                    onChange={e => setData('teacher_id', e.target.value)}
                                    className="w-full border border-slate-300 rounded-[3px] text-[13px] h-[36px] px-3 bg-white"
                                >
                                    <option value="">No Teacher Assigned</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                {errors.teacher_id && <p className="text-[11px] text-red-500 mt-1">{errors.teacher_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Day <span className="text-red-500">*</span></label>
                                <select
                                    value={data.day}
                                    onChange={e => setData('day', e.target.value)}
                                    className="w-full border border-slate-300 rounded-[3px] text-[13px] h-[36px] px-3 bg-white"
                                >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                {errors.day && <p className="text-[11px] text-red-500 mt-1">{errors.day}</p>}
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                                <TextInput
                                    type="time"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    className="w-full text-[13px] h-[36px]"
                                />
                                {errors.start_time && <p className="text-[11px] text-red-500 mt-1">{errors.start_time}</p>}
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">End Time <span className="text-red-500">*</span></label>
                                <TextInput
                                    type="time"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    className="w-full text-[13px] h-[36px]"
                                />
                                {errors.end_time && <p className="text-[11px] text-red-500 mt-1">{errors.end_time}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Room Number</label>
                            <TextInput
                                value={data.room_number}
                                onChange={e => setData('room_number', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="e.g. 101, Lab-2"
                            />
                            {errors.room_number && <p className="text-[11px] text-red-500 mt-1">{errors.room_number}</p>}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-[3px] text-[12px] font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-70 cursor-pointer"
                            >
                                {editingRoutine ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
