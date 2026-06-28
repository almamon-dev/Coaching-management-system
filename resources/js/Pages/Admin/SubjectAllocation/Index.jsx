import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SelectInput from '@/Components/Form/SelectInput';
import Notify from '@/Utils/Notify';
import { Save, AlertTriangle, BookOpen, User, Trash2, Search, X, Check, SlidersHorizontal, RotateCcw, Edit } from 'lucide-react';
import ColumnManager from '../AcademicClasses/Components/ColumnManager';

const MasterAllocationPagination = ({ paginator, perPage, handlePerPageChange }) => {
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

export default function Index({ auth, classes, sections, subjects, teachers, allocations, all_allocations, filters }) {
    const { data, setData, post, processing } = useForm({
        class_id: filters?.class_id || '',
        section_id: filters?.section_id || '',
        allocations: allocations || {}
    });

    const handleClassChange = (classId) => {
        setData('class_id', classId);
        setData('section_id', '');
        router.get(route('admin.subject-allocation.index'), { class_id: classId }, { preserveState: true, replace: true });
    };

    const handleSectionChange = (sectionId) => {
        setData('section_id', sectionId);
        router.get(route('admin.subject-allocation.index'), { class_id: data.class_id, section_id: sectionId }, { preserveState: true, replace: true });
    };

    const [activeTab, setActiveTab] = useState('allocate');
    const [assignments, setAssignments] = useState([]);
    
    // Master List States
    const [search, setSearch] = useState(filters?.search || '');
    const [teacherFilter, setTeacherFilter] = useState(filters?.teacher_id || '');
    const [selectedIds, setSelectedIds] = useState([]);
    
    const defaultColumns = [
        { id: 'class_name', label: 'Class', visible: true },
        { id: 'section_name', label: 'Section', visible: true },
        { id: 'subject_name', label: 'Subject', visible: true },
        { id: 'teacher_name', label: 'Assigned Teacher', visible: true },
        { id: 'actions', label: 'Actions', visible: true, disableToggle: true },
    ];
    const [columns, setColumns] = useState(defaultColumns);
    const visibleColumns = columns.filter(c => c.visible).map(c => c.id);

    const toggleColumn = (columnId) => {
        setColumns(columns.map(c => c.id === columnId ? { ...c, visible: !c.visible } : c));
    };

    const handlePerPageChange = (newPerPage) => {
        router.get(route('admin.subject-allocation.index'), { ...filters, per_page: newPerPage }, { preserveState: true, replace: true, preserveScroll: true });
    };

    useEffect(() => {
        if (activeTab !== 'master_list') return;
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters?.search || '') || teacherFilter !== (filters?.teacher_id || '')) {
                router.get(route('admin.subject-allocation.index'), { ...filters, search, teacher_id: teacherFilter }, { preserveState: true, replace: true, preserveScroll: true });
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, teacherFilter]);

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} allocations?`)) {
            router.post(route('admin.subject-allocation.bulk-delete'), { ids: selectedIds }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    Notify.success('Deleted', 'Allocations deleted successfully.');
                }
            });
        }
    };

    const handleDeleteSingle = (id) => {
        if (confirm('Are you sure you want to delete this allocation?')) {
            router.delete(route('admin.subject-allocation.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
                    Notify.success('Deleted', 'Allocation deleted successfully.');
                }
            });
        }
    };
    
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(all_allocations?.data?.map(a => a.id) || []);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleEditAllocation = (alloc) => {
        setActiveTab('allocate');
        setData('class_id', alloc.academic_class_id);
        setData('section_id', alloc.section_id);
        
        router.get(route('admin.subject-allocation.index'), { 
            class_id: alloc.academic_class_id, 
            section_id: alloc.section_id 
        }, { 
            preserveState: true, 
            replace: true,
            preserveScroll: true
        });
    };

    // Update form allocations when props change
    useEffect(() => {
        const initialAssignments = Object.keys(allocations || {}).map(subjectId => ({
            id: Math.random().toString(36).substr(2, 9),
            subject_id: subjectId,
            teacher_id: allocations[subjectId]
        }));
        setAssignments(initialAssignments);
    }, [allocations]);

    const handleAddAssignment = () => {
        setAssignments([...assignments, { id: Math.random().toString(36).substr(2, 9), subject_id: '', teacher_id: '' }]);
    };

    const handleRemoveAssignment = (id) => {
        setAssignments(assignments.filter(a => a.id !== id));
    };

    const handleAssignmentChange = (id, field, value) => {
        setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    const handleAddAllSubjects = () => {
        const selectedSubjectIds = assignments.map(a => a.subject_id).filter(Boolean);
        const newAssignments = subjects
            .filter(subject => !selectedSubjectIds.includes(subject.id.toString()))
            .map(subject => ({
                id: Math.random().toString(36).substr(2, 9),
                subject_id: subject.id.toString(),
                teacher_id: ''
            }));
        
        if (newAssignments.length > 0) {
            setAssignments([...assignments, ...newAssignments]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Transform array back to object
        const finalAllocations = {};
        assignments.forEach(a => {
            if (a.subject_id && a.teacher_id) {
                finalAllocations[a.subject_id] = a.teacher_id;
            }
        });

        setData('allocations', finalAllocations);
    };

    // Use another useEffect to post after setData if needed, or just post directly
    // Let's rewrite submit to post directly without needing an extra render cycle
    const handleSave = () => {
        const finalAllocations = {};
        assignments.forEach(a => {
            if (a.subject_id && a.teacher_id) {
                finalAllocations[a.subject_id] = a.teacher_id;
            }
        });

        router.post(route('admin.subject-allocation.store'), {
            class_id: data.class_id, 
            section_id: data.section_id, 
            allocations: finalAllocations 
        }, {
            onSuccess: () => Notify.success('Saved', 'Subject allocations updated successfully.'),
            preserveScroll: true
        });
    };

    const hasSelection = data.class_id && data.section_id;

    // Get selected subject IDs to disable them in other dropdowns
    const selectedSubjectIds = assignments.map(a => a.subject_id).filter(Boolean);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Subject Allocation" />

            <div className="mb-6">
                <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Subject Allocation</h1>
                <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Assign teachers to specific subjects for each class and section.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Sidebar */}
                <div className="w-full md:w-[240px] flex-shrink-0">
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] py-2 flex flex-col">
                        <button
                            onClick={() => setActiveTab('allocate')}
                            className={`flex items-center gap-3 px-4 py-3 text-[13px] font-bold transition-colors w-full text-left border-l-[3px] ${activeTab === 'allocate' ? 'bg-[#e4f1ef]/50 text-[#008060] border-[#008060]' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
                        >
                            <BookOpen size={16} />
                            Allocate Subjects
                        </button>
                        <button
                            onClick={() => setActiveTab('master_list')}
                            className={`flex items-center gap-3 px-4 py-3 text-[13px] font-bold transition-colors w-full text-left border-l-[3px] ${activeTab === 'master_list' ? 'bg-[#e4f1ef]/50 text-[#008060] border-[#008060]' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
                        >
                            <User size={16} />
                            Master Allocations
                        </button>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'allocate' && (
                        <div className="space-y-6">
                            {/* Filters Card */}
                            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Select Class <span className="text-red-500">*</span></label>
                                        <SelectInput
                                            value={data.class_id}
                                            onChange={(e) => handleClassChange(e.target.value)}
                                            options={[{ id: '', name: 'Select a Class' }, ...classes.map(c => ({ id: c.id, name: c.name }))]}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Select Section <span className="text-red-500">*</span></label>
                                        <SelectInput
                                            value={data.section_id}
                                            onChange={(e) => handleSectionChange(e.target.value)}
                                            options={[{ id: '', name: 'Select a Section' }, ...sections.map(s => ({ id: s.id, name: s.name }))]}
                                            disabled={!data.class_id}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Allocation Table */}
                            {hasSelection ? (
                                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex flex-col">
                                    <div className="p-4 border-b border-[#ebebeb] bg-slate-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-blue-700 font-semibold text-[13px]">
                                            <BookOpen size={16} />
                                            <span>Assigned Subjects</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleAddAllSubjects}
                                                className="px-3 py-1.5 bg-white text-slate-700 border border-[#d1d1d1] rounded-[3px] text-[12px] font-bold hover:bg-slate-50 transition-colors"
                                            >
                                                All Subjects
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleAddAssignment}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-[3px] text-[12px] font-bold hover:bg-blue-100 transition-colors"
                                            >
                                                + Add Subject
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="overflow-visible">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50/50 border-b border-[#ebebeb]">
                                                        <th className="py-2.5 px-4 text-[12px] font-bold text-slate-700">Subject</th>
                                                        <th className="py-2.5 px-4 text-[12px] font-bold text-slate-700 w-[350px]">Assigned Teacher</th>
                                                        <th className="py-2.5 px-4 text-[12px] font-bold text-slate-700 w-[60px] text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#ebebeb]">
                                                    {assignments.map((assignment, index) => (
                                                        <tr key={assignment.id} className="hover:bg-slate-50/40 transition-colors">
                                                            <td className="py-2 px-4">
                                                                <SelectInput
                                                                    value={assignment.subject_id}
                                                                    onChange={(e) => handleAssignmentChange(assignment.id, 'subject_id', e.target.value)}
                                                                    options={[{ id: '', name: '-- Select Subject --' }, ...subjects
                                                                        .filter(subject => !selectedSubjectIds.includes(subject.id.toString()) || assignment.subject_id === subject.id.toString())
                                                                        .map(subject => ({ id: subject.id.toString(), name: `${subject.name} (${subject.code})` }))
                                                                    ]}
                                                                />
                                                            </td>
                                                            <td className="py-2 px-4">
                                                                <SelectInput
                                                                    value={assignment.teacher_id}
                                                                    onChange={(e) => handleAssignmentChange(assignment.id, 'teacher_id', e.target.value)}
                                                                    disabled={!assignment.subject_id}
                                                                    options={[{ id: '', name: '-- Select Teacher --' }, ...teachers
                                                                        .map(t => ({ id: t.id.toString(), name: t.name }))
                                                                    ]}
                                                                />
                                                            </td>
                                                            <td className="py-2 px-4 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveAssignment(assignment.id)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-[3px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors mx-auto"
                                                                    title="Remove Subject"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {assignments.length === 0 && (
                                                        <tr>
                                                            <td colSpan="3" className="p-10 text-center text-slate-400">
                                                                <p className="text-[13px] mb-2">No subjects assigned yet.</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleAddAssignment}
                                                                    className="text-blue-600 font-semibold hover:underline"
                                                                >
                                                                    Add the first subject
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-[#ebebeb] bg-slate-50 flex justify-end rounded-b-[4px]">
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={processing}
                                            className="px-6 py-2 bg-[#008060] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                                        >
                                            <Save size={14} />
                                            Save Allocations
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-16 text-center">
                                    <AlertTriangle className="mx-auto mb-3 text-slate-300" size={40} />
                                    <h2 className="text-[15px] font-bold text-slate-700 mb-1">No Class/Section Selected</h2>
                                    <p className="text-[13px] text-slate-500 max-w-sm mx-auto">Please select both a class and a section from the filters above to assign subject teachers.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'master_list' && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                                <div className="p-4 border-b border-[#ebebeb] bg-slate-50/50 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-[15px] font-bold text-slate-800">Master Allocations</h2>
                                        <p className="text-[12px] text-slate-500 mt-0.5">View all assigned teachers across all classes and sections.</p>
                                    </div>
                                </div>
                                
                                {/* Toolbar */}
                                <div className="border-b border-[#ebebeb] bg-white relative z-10 flex flex-col">
                                    {selectedIds.length > 0 && (
                                        <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-4 h-full border-b border-[#ebebeb]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 px-2.5 h-[32px] bg-[#f1f1f1] border border-[#d1d1d1] rounded-[4px]">
                                                    <div className="w-[15px] h-[15px] bg-[#008060] rounded-[3px] flex items-center justify-center">
                                                        <Check size={10} strokeWidth={4} className="text-white" />
                                                    </div>
                                                    <span className="text-[12px] font-bold text-[#202223]">
                                                        {selectedIds.length} selected
                                                    </span>
                                                </div>
                                                <div className="h-4 w-[1px] bg-[#d1d1d1]" />
                                                <button onClick={handleBulkDelete} className="h-[32px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#bf0711] hover:bg-[#fbeae5] transition-all flex items-center gap-1.5 shadow-sm">
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                            <button onClick={() => setSelectedIds([])} className="p-1.5 text-[#6d7175] hover:text-[#202223] transition-colors"><X size={16} /></button>
                                        </div>
                                    )}
                                    
                                    <div className={`p-4 flex items-center justify-between gap-4 transition-opacity duration-200 ${selectedIds.length > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                        <div className="flex items-center gap-3 w-full max-w-2xl">
                                            <div className="relative w-full max-w-sm">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder="Search by subject, teacher or class..."
                                                    className="h-[32px] pl-9 pr-9 border border-[#d1d1d1] focus:border-[#008060] focus:ring-1 focus:ring-[#008060] rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-sm w-full outline-none"
                                                />
                                                {search && (
                                                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="w-[200px]">
                                                <SelectInput
                                                    value={teacherFilter}
                                                    onChange={(e) => setTeacherFilter(e.target.value)}
                                                    options={[{ id: '', name: 'All Teachers' }, ...teachers.map(t => ({ id: t.id.toString(), name: t.name }))]}
                                                    className="h-[32px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ColumnManager columns={columns} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto custom-scrollbar h-auto">
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-[#ebebeb]">
                                                <th className="py-3 px-4 w-[40px] text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={all_allocations?.data?.length > 0 && selectedIds.length === all_allocations.data.length}
                                                        onChange={handleSelectAll}
                                                        className="rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060]"
                                                    />
                                                </th>
                                                {visibleColumns.includes('class_name') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Class</th>}
                                                {visibleColumns.includes('section_name') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Section</th>}
                                                {visibleColumns.includes('subject_name') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Subject</th>}
                                                {visibleColumns.includes('teacher_name') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Assigned Teacher</th>}
                                                {visibleColumns.includes('actions') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700 w-[60px] text-center">Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#ebebeb]">
                                            {all_allocations?.data?.map((alloc) => (
                                                <tr key={alloc.id} className={`hover:bg-slate-50/40 transition-colors ${selectedIds.includes(alloc.id) ? 'bg-emerald-50/20' : ''}`}>
                                                    <td className="py-2 px-4 text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedIds.includes(alloc.id)}
                                                            onChange={() => handleSelectOne(alloc.id)}
                                                            className="rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060]"
                                                        />
                                                    </td>
                                                    {visibleColumns.includes('class_name') && (
                                                        <td className="py-2 px-4 text-[13px] font-bold text-slate-800">
                                                            {alloc.class_name}
                                                        </td>
                                                    )}
                                                    {visibleColumns.includes('section_name') && (
                                                        <td className="py-2 px-4 text-[13px] font-bold text-slate-700">
                                                            <span className="bg-[#e4f1ef] text-[#008060] px-2 py-0.5 rounded border border-[#008060]/20">
                                                                {alloc.section_name}
                                                            </span>
                                                        </td>
                                                    )}
                                                    {visibleColumns.includes('subject_name') && (
                                                        <td className="py-2 px-4 text-[13px] text-slate-600">
                                                            {alloc.subject_name} <span className="text-[11px] text-slate-400">({alloc.subject_code})</span>
                                                        </td>
                                                    )}
                                                    {visibleColumns.includes('teacher_name') && (
                                                        <td className="py-2 px-4 text-[13px] text-blue-700 font-medium">
                                                            {alloc.teacher_name}
                                                        </td>
                                                    )}
                                                    {visibleColumns.includes('actions') && (
                                                        <td className="py-2 px-4 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button
                                                                    onClick={() => handleEditAllocation(alloc)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-[3px] text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                                    title="Edit Allocation"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteSingle(alloc.id)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-[3px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                                    title="Delete Allocation"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                            {(!all_allocations?.data || all_allocations.data.length === 0) && (
                                                <tr>
                                                    <td colSpan={visibleColumns.length + 1} className="p-12 text-center text-slate-400">
                                                        <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                                        <h5 className="text-[13.5px] font-bold text-slate-700">No allocations found</h5>
                                                        <p className="text-[12px] text-[#6d7175] mt-0.5">Start by assigning teachers to subjects.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <MasterAllocationPagination 
                                    paginator={all_allocations} 
                                    perPage={filters?.per_page || 15} 
                                    handlePerPageChange={handlePerPageChange} 
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
