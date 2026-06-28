import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2, Search, X, SlidersHorizontal, RotateCcw, AlertTriangle, Printer } from 'lucide-react';
import Modal from '@/Components/Modal';
import Notify from '@/Utils/Notify';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import ColumnManager from '../AcademicClasses/Components/ColumnManager';
import { ChevronDown, Check, Filter } from 'lucide-react';

const RoutineStats = ({ stats }) => (
    <div className="flex items-center border-b border-[#ebebeb] px-4 overflow-x-auto scrollbar-hide bg-white">
        <div className="relative py-3.5 px-3 text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 min-w-fit border-none bg-transparent text-[#008060] font-bold">
            <span>Total Routines</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full font-bold bg-[#e4f1ef] text-[#008060]">{stats.all ?? 0}</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008060] rounded-t-full" />
        </div>
        <div className="relative py-3.5 px-3 text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 min-w-fit border-none bg-transparent text-[#6d7175]">
            <span>Today's Classes</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full font-bold bg-[#f1f1f1] text-[#6d7175]">{stats.today ?? 0}</span>
        </div>
        <div className="relative py-3.5 px-3 text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 min-w-fit border-none bg-transparent text-[#6d7175]">
            <span>Teachers Engaged</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full font-bold bg-[#f1f1f1] text-[#6d7175]">{stats.teachers ?? 0}</span>
        </div>
    </div>
);

const RoutineToolbar = ({ search, setSearch, filters, setFilters, classes, sections, teachers, handleReset, showAdvanced, setShowAdvanced, columns, visibleColumns, toggleColumn, selectedIds, handleClearSelection, handleBulkDelete }) => {
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
        <div className={`p-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 transition-opacity duration-200 ${selectedIds.length > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 w-full xl:w-auto flex-1">
                <div className="relative w-full sm:w-[280px] shrink-0">
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
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto mt-2 xl:mt-0">
                <SelectInput
                    value={filters.class_id || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, class_id: e.target.value, section_id: '' }))}
                    options={[{ id: '', name: 'All Classes' }, ...classes.map(c => ({ id: c.id, name: c.name }))]}
                    className="h-[32px] text-[12px] w-[calc(50%-4px)] sm:w-[140px] rounded-[3px] border-[#d1d1d1]"
                    showSearch={false}
                />
                <SelectInput
                    value={filters.section_id || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, section_id: e.target.value }))}
                    options={[{ id: '', name: 'All Sections' }, ...(filters.class_id ? sections.filter(s => s.academic_class_id == filters.class_id).map(s => ({ id: s.id, name: s.name })) : [])]}
                    className="h-[32px] text-[12px] w-[calc(50%-4px)] sm:w-[140px] rounded-[3px] border-[#d1d1d1]"
                    disabled={!filters.class_id}
                    showSearch={false}
                />
                <SelectInput
                    value={filters.teacher_id || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, teacher_id: e.target.value }))}
                    options={[{ id: '', name: 'All Teachers' }, ...teachers.map(t => ({ id: t.id, name: t.name }))]}
                    className="h-[32px] text-[12px] w-[calc(50%-4px)] sm:w-[150px] rounded-[3px] border-[#d1d1d1]"
                    showSearch={false}
                />
                <SelectInput
                    value={filters.day || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, day: e.target.value }))}
                    options={[{ id: '', name: 'All Days' }, ...['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => ({ id: d, name: d }))]}
                    className="h-[32px] text-[12px] w-[calc(50%-4px)] sm:w-[130px] rounded-[3px] border-[#d1d1d1]"
                    showSearch={false}
                />
            </div>
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

export default function Index({ auth, routines, classes, sections, subjects, teachers, filters, stats, allocations }) {
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
    const [activeFilters, setActiveFilters] = useState({
        class_id: filters?.class_id || '',
        section_id: filters?.section_id || '',
        teacher_id: filters?.teacher_id || '',
        day: filters?.day || '',
    });
    
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null);

    // Print Modal State
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [printFilterType, setPrintFilterType] = useState('class'); // 'class' or 'teacher'
    const [printClassId, setPrintClassId] = useState('');
    const [printSectionId, setPrintSectionId] = useState('');
    const [printTeacherId, setPrintTeacherId] = useState('');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        academic_class_id: '',
        section_id: '',
        subject_id: '',
        teacher_id: '',
        day: 'Saturday',
        start_time: '',
        end_time: '',
        room_number: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                search !== (filters?.search || '') ||
                activeFilters.class_id !== (filters?.class_id || '') ||
                activeFilters.section_id !== (filters?.section_id || '') ||
                activeFilters.teacher_id !== (filters?.teacher_id || '') ||
                activeFilters.day !== (filters?.day || '')
            ) {
                router.get(route('admin.class_routines.index'), { 
                    ...filters, 
                    search, 
                    ...activeFilters,
                    page: 1 
                }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, activeFilters]);

    // Auto-select teacher based on subject allocation
    useEffect(() => {
        if (data.academic_class_id && data.section_id && data.subject_id && !editingRoutine) {
            const allocation = allocations?.find(a => 
                a.academic_class_id == data.academic_class_id &&
                a.section_id == data.section_id &&
                a.subject_id == data.subject_id
            );
            if (allocation && data.teacher_id !== allocation.user_id) {
                setData('teacher_id', allocation.user_id);
            }
        }
    }, [data.academic_class_id, data.section_id, data.subject_id]);

    const handlePerPageChange = (val) => {
        router.get(route('admin.class_routines.index'), { ...filters, per_page: val, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setActiveFilters({ class_id: '', section_id: '', teacher_id: '', day: '' });
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
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsPrintModalOpen(true)}
                        className="px-4 py-1.5 bg-white border border-[#d1d1d1] text-[#202223] rounded-[3px] font-bold text-[12px] hover:bg-[#f6f6f7] transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Printer size={14} /> Print Routine
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={14} /> Add Routine
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {stats && <RoutineStats stats={stats} />}
                <RoutineToolbar 
                    search={search} setSearch={setSearch} 
                    filters={activeFilters} setFilters={setActiveFilters}
                    classes={classes} sections={sections} teachers={teachers}
                    handleReset={handleReset}
                    showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
                    columns={allColumns} visibleColumns={visibleColumns} toggleColumn={toggleColumn}
                    selectedIds={selectedIds} handleClearSelection={() => setSelectedIds([])} handleBulkDelete={handleBulkDelete}
                />

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-[#ebebeb]">
                                <th className="py-2 px-3 w-[48px] text-center select-none">
                                    <div onClick={toggleSelectAll} className={`w-[15px] h-[15px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isAllSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1]'}`}>
                                        {isAllSelected && <Check size={10} strokeWidth={3} className="text-white" />}
                                    </div>
                                </th>
                                {visibleColumns.includes('class_section') && <th className="py-2 px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider">Class & Section</th>}
                                {visibleColumns.includes('subject') && <th className="py-2 px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider">Subject</th>}
                                {visibleColumns.includes('teacher') && <th className="py-2 px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider">Teacher</th>}
                                {visibleColumns.includes('timing') && <th className="py-2 px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider">Day & Time</th>}
                                {visibleColumns.includes('room') && <th className="py-2 px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider">Room</th>}
                                {visibleColumns.includes('created_at') && <th className="py-2 px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider">Created At</th>}
                                {visibleColumns.includes('updated_at') && <th className="py-2 px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider">Updated At</th>}
                                <th className="py-2 px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider text-right w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb]">
                            {routines?.data?.map((routine) => {
                                const isSelected = selectedIds.includes(routine.id);
                                return (
                                    <tr key={routine.id} className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-[#f0f9f7]/20' : ''}`}>
                                        <td className="py-1.5 px-3 text-center select-none">
                                            <div onClick={() => toggleSelect(routine.id)} className={`w-[15px] h-[15px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1] hover:border-slate-400'}`}>
                                                {isSelected && <Check size={10} strokeWidth={3} className="text-white" />}
                                            </div>
                                        </td>
                                        {visibleColumns.includes('class_section') && (
                                            <td className="py-1.5 px-3 text-[12px] font-bold text-slate-800">
                                                {routine.academic_class?.name} - <span className="text-[#008060]">{routine.section?.name}</span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('subject') && (
                                            <td className="py-1.5 px-3 text-[12px] font-medium text-slate-700">
                                                {routine.subject?.name}
                                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{routine.subject?.code}</div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('teacher') && (
                                            <td className="py-1.5 px-3 text-[12px] text-slate-600">
                                                {routine.teacher?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                            </td>
                                        )}
                                        {visibleColumns.includes('timing') && (
                                            <td className="py-1.5 px-3 text-[12px] text-slate-700">
                                                <div className="font-bold mb-0.5">{routine.day}</div>
                                                <div className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block border border-slate-200">
                                                    {formatTime(routine.start_time)} - {formatTime(routine.end_time)}
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('room') && (
                                            <td className="py-1.5 px-3 text-[12px] text-slate-600 font-medium">
                                                {routine.room_number || '-'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('created_at') && (
                                            <td className="py-1.5 px-3 text-[11px] text-slate-500">
                                                {routine.created_at ? new Date(routine.created_at).toLocaleDateString() : '-'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('updated_at') && (
                                            <td className="py-1.5 px-3 text-[11px] text-slate-500">
                                                {routine.updated_at ? new Date(routine.updated_at).toLocaleDateString() : '-'}
                                            </td>
                                        )}
                                        <td className="py-1.5 px-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openModal(routine)} className="h-[24px] w-[24px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all">
                                                    <SquarePen size={11} />
                                                </button>
                                                <button onClick={() => deleteRoutine(routine)} className="h-[24px] w-[24px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322]">
                                                    <Trash2 size={11} />
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
                                <SelectInput
                                    value={data.academic_class_id}
                                    onChange={e => setData('academic_class_id', e.target.value)}
                                    options={[{ id: '', name: 'Select a Class' }, ...classes.map(c => ({ id: c.id, name: c.name }))]}
                                    className="w-full h-[36px]"
                                />
                                {errors.academic_class_id && <p className="text-[11px] text-red-500 mt-1">{errors.academic_class_id}</p>}
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Section <span className="text-red-500">*</span></label>
                                <SelectInput
                                    value={data.section_id}
                                    onChange={e => setData('section_id', e.target.value)}
                                    options={[
                                        { id: '', name: data.academic_class_id ? 'Select a Section' : 'Select a Class First' }, 
                                        ...sections.filter(s => s.academic_class_id == data.academic_class_id).map(s => ({ id: s.id, name: s.name }))
                                    ]}
                                    disabled={!data.academic_class_id}
                                    className="w-full h-[36px]"
                                />
                                {errors.section_id && <p className="text-[11px] text-red-500 mt-1">{errors.section_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                                <SelectInput
                                    value={data.subject_id}
                                    onChange={e => setData('subject_id', e.target.value)}
                                    options={[{ id: '', name: 'Select a Subject' }, ...subjects.map(sub => ({ id: sub.id, name: `${sub.name} (${sub.code})` }))]}
                                    className="w-full h-[36px]"
                                    showSearch={true}
                                />
                                {errors.subject_id && <p className="text-[11px] text-red-500 mt-1">{errors.subject_id}</p>}
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Teacher</label>
                                <SelectInput
                                    value={data.teacher_id}
                                    onChange={e => setData('teacher_id', e.target.value)}
                                    options={[{ id: '', name: 'No Teacher Assigned' }, ...teachers.map(t => ({ id: t.id, name: t.name }))]}
                                    className="w-full h-[36px]"
                                    showSearch={true}
                                />
                                {errors.teacher_id && <p className="text-[11px] text-red-500 mt-1">{errors.teacher_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Day <span className="text-red-500">*</span></label>
                                <SelectInput
                                    value={data.day}
                                    onChange={e => setData('day', e.target.value)}
                                    options={['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => ({ id: d, name: d }))}
                                    className="w-full h-[36px]"
                                    showSearch={false}
                                />
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
            <Modal show={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-[16px] font-bold text-[#202223]">Print Class Routine</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4 mb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="printType" 
                                    checked={printFilterType === 'class'} 
                                    onChange={() => setPrintFilterType('class')}
                                    className="text-[#008060] focus:ring-[#008060]"
                                />
                                <span className="text-[13px] font-medium text-slate-700">By Class & Section</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="printType" 
                                    checked={printFilterType === 'teacher'} 
                                    onChange={() => setPrintFilterType('teacher')}
                                    className="text-[#008060] focus:ring-[#008060]"
                                />
                                <span className="text-[13px] font-medium text-slate-700">By Teacher</span>
                            </label>
                        </div>

                        {printFilterType === 'class' ? (
                            <>
                                <div>
                                    <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Class</label>
                                    <SelectInput
                                        value={printClassId}
                                        onChange={(e) => {
                                            setPrintClassId(e.target.value);
                                            setPrintSectionId('');
                                        }}
                                        options={[{ id: '', name: 'Select Class' }, ...classes.map(c => ({ id: c.id.toString(), name: c.name }))]}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Section</label>
                                    <SelectInput
                                        value={printSectionId}
                                        onChange={(e) => setPrintSectionId(e.target.value)}
                                        options={[{ id: '', name: 'Select Section' }, ...(printClassId ? sections.filter(s => s.academic_class_id.toString() === printClassId).map(s => ({ id: s.id.toString(), name: s.name })) : [])]}
                                        className="w-full"
                                        disabled={!printClassId}
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Teacher</label>
                                <SelectInput
                                    value={printTeacherId}
                                    onChange={(e) => setPrintTeacherId(e.target.value)}
                                    options={[{ id: '', name: 'Select Teacher' }, ...teachers.map(t => ({ id: t.id.toString(), name: t.name }))]}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#ebebeb]">
                        <button
                            type="button"
                            onClick={() => setIsPrintModalOpen(false)}
                            className="px-4 py-2 text-[13px] font-medium text-[#202223] border border-[#d1d1d1] rounded-[4px] hover:bg-[#f6f6f7] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                let url = '';
                                if (printFilterType === 'class' && printClassId && printSectionId) {
                                    url = route('admin.class_routines.print', { class_id: printClassId, section_id: printSectionId });
                                } else if (printFilterType === 'teacher' && printTeacherId) {
                                    url = route('admin.class_routines.print', { teacher_id: printTeacherId });
                                }
                                
                                if (url) {
                                    window.open(url, '_blank');
                                    setIsPrintModalOpen(false);
                                } else {
                                    Notify.error('Incomplete Selection', 'Please select all required fields to print.');
                                }
                            }}
                            className="px-4 py-2 bg-[#008060] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#006e52] transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Printer size={14} />
                            View & Print
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
