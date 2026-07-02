import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2, Search, X, SlidersHorizontal, RotateCcw, AlertTriangle } from 'lucide-react';
import Modal from '@/Components/Modal/Modal';
import Notify from '@/Utils/Notify';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import ColumnManager from '../AcademicClasses/Components/ColumnManager';
import SubjectStats from './Components/SubjectStats';

import { ChevronDown, Check } from 'lucide-react';

const SubjectToolbar = ({ search, setSearch, handleReset, showAdvanced, setShowAdvanced, columns, visibleColumns, toggleColumn, selectedIds, handleClearSelection, handleBulkDelete }) => {
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
                    placeholder="Search subjects by name or code..."
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

const SubjectPagination = ({ paginator, perPage, handlePerPageChange }) => {
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

export default function Index({ auth, subjects, filters, stats }) {
    // Column Management
    const allColumns = [
        { id: 'name', label: 'Subject Name' },
        { id: 'code', label: 'Subject Code' },
        { id: 'group', label: 'Group' },
        { id: 'type', label: 'Type' },
        { id: 'created_at', label: 'Created At' },
        { id: 'updated_at', label: 'Updated At' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(['name', 'code', 'group', 'type', 'created_at', 'updated_at']);
    const toggleColumn = (id) => setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    // Data Management
    const [search, setSearch] = useState(filters?.search || '');
    const [activeGroup, setActiveGroup] = useState(filters?.group || 'all');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    
    // Modal Management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        group: 'Common',
        type: 'theory',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.subjects.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleTabChange = (group) => {
        setActiveGroup(group);
        router.get(route('admin.subjects.index'), { ...filters, group, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePerPageChange = (val) => {
        router.get(route('admin.subjects.index'), { ...filters, per_page: val, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setActiveGroup('all');
        router.get(route('admin.subjects.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    // Selection Logic
    const availableIds = subjects?.data?.map(s => s.id) || [];
    const isAllSelected = selectedIds.length === availableIds.length && availableIds.length > 0;
    
    const toggleSelectAll = () => {
        if (selectedIds.length > 0) setSelectedIds([]);
        else setSelectedIds(availableIds);
    };
    
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.length} subjects?`)) {
            Notify.error('Not Implemented', 'Bulk delete backend route needs to be added.');
        }
    };

    // Form Logic
    const openModal = (subject = null) => {
        clearErrors();
        if (subject) {
            setEditingSubject(subject);
            setData({
                name: subject.name,
                code: subject.code,
                group: subject.group || '',
                type: subject.type,
            });
        } else {
            setEditingSubject(null);
            reset();
            setData('type', 'theory');
            setData('group', 'Common');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSubject(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingSubject) {
            put(route('admin.subjects.update', editingSubject.id), {
                onSuccess: () => { closeModal(); Notify.success('Updated', 'Subject updated successfully.'); },
            });
        } else {
            post(route('admin.subjects.store'), {
                onSuccess: () => { closeModal(); Notify.success('Created', 'Subject created successfully.'); },
            });
        }
    };

    const deleteSubject = (subject) => {
        if (confirm(`Are you sure you want to delete subject ${subject.name}?`)) {
            router.delete(route('admin.subjects.destroy', subject.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(id => id !== subject.id));
                    Notify.success('Deleted', 'Subject deleted successfully.');
                },
            });
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Subjects" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Subject Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage academic subjects, codes, and type.</p>
                </div>
                <div className="flex items-center gap-2">
                   
                    <button
                        onClick={() => openModal()}
                        className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={14} /> Add Subject
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {stats && <SubjectStats stats={stats} activeTab={activeGroup} onTabChange={handleTabChange} />}
                <SubjectToolbar 
                    search={search} setSearch={setSearch} handleReset={handleReset}
                    showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
                    columns={allColumns} visibleColumns={visibleColumns} toggleColumn={toggleColumn}
                    selectedIds={selectedIds} handleClearSelection={() => setSelectedIds([])} handleBulkDelete={handleBulkDelete}
                />

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f4f6f8]">
                                <th className="py-3 px-4 w-[48px] text-center select-none text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">
                                    <div onClick={toggleSelectAll} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isAllSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1]'}`}>
                                        {isAllSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                                    </div>
                                </th>
                                {visibleColumns.includes('name') && <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Subject Name</th>}
                                {visibleColumns.includes('code') && <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Subject Code</th>}
                                {visibleColumns.includes('group') && <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Group</th>}
                                {visibleColumns.includes('type') && <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Type</th>}
                                {visibleColumns.includes('created_at') && <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Created At</th>}
                                {visibleColumns.includes('updated_at') && <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Updated At</th>}
                                <th className="py-3 px-4 text-[12px] font-bold text-right w-[120px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb]">
                            {subjects?.data?.map((subject) => {
                                const isSelected = selectedIds.includes(subject.id);
                                return (
                                    <tr key={subject.id} className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-[#f0f9f7]/20' : ''}`}>
                                        <td className="py-2 px-4 text-center select-none">
                                            <div onClick={() => toggleSelect(subject.id)} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1] hover:border-slate-400'}`}>
                                                {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                                            </div>
                                        </td>
                                        {visibleColumns.includes('name') && (
                                            <td className="py-2 px-4 text-[13px] font-bold text-slate-800">
                                                {subject.name}
                                            </td>
                                        )}
                                        {visibleColumns.includes('code') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600 font-mono">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                    {subject.code}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('group') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold">
                                                    {subject.group || '-'}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('type') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${subject.type === 'theory' ? 'bg-[#e4f1ef] text-[#008060] border-[#008060]/20' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                    {subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('created_at') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                {subject.created_at ? new Date(subject.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('updated_at') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                {subject.updated_at ? new Date(subject.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                            </td>
                                        )}
                                        <td className="py-2 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openModal(subject)} className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all">
                                                    <SquarePen size={12} />
                                                </button>
                                                <button onClick={() => deleteSubject(subject)} className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322]">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!subjects?.data || subjects.data.length === 0) && (
                                <tr>
                                    <td colSpan={visibleColumns.length + 2} className="p-12 text-center text-slate-400 bg-white">
                                        <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                        <h5 className="text-[13.5px] font-bold text-slate-700">No subjects found</h5>
                                        <p className="text-[12px] text-[#6d7175] mt-0.5">Start by creating a new subject.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <SubjectPagination paginator={subjects} perPage={filters?.per_page || 10} handlePerPageChange={handlePerPageChange} />
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-[16px] font-bold text-slate-800 mb-4">
                        {editingSubject ? 'Edit Subject' : 'Add Subject'}
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Subject Name <span className="text-red-500">*</span></label>
                            <TextInput
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="e.g. Mathematics"
                            />
                            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Group / Department <span className="text-red-500">*</span></label>
                            <select
                                value={data.group}
                                onChange={e => setData('group', e.target.value)}
                                className="w-full border border-slate-300 rounded-[3px] text-[13px] h-[36px] px-3 bg-white"
                            >
                                <option value="Common">Common (All Groups)</option>
                                <option value="Science">Science</option>
                                <option value="Business Studies">Business Studies</option>
                                <option value="Humanities">Humanities</option>
                                <option value="Optional">Optional</option>
                            </select>
                            {errors.group && <p className="text-[11px] text-red-500 mt-1">{errors.group}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Subject Code <span className="text-red-500">*</span></label>
                                <TextInput
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    className="w-full text-[13px] h-[36px]"
                                    placeholder="e.g. MAT-101"
                                />
                                {errors.code && <p className="text-[11px] text-red-500 mt-1">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Subject Type <span className="text-red-500">*</span></label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full border border-slate-300 rounded-[3px] text-[13px] h-[36px] px-3 bg-white"
                                >
                                    <option value="theory">Theory</option>
                                    <option value="practical">Practical</option>
                                </select>
                                {errors.type && <p className="text-[11px] text-red-500 mt-1">{errors.type}</p>}
                            </div>
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
                                {editingSubject ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
