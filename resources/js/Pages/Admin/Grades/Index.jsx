import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2, Search, X, RotateCcw, AlertTriangle, Check } from 'lucide-react';
import Modal from '@/Components/Modal/Modal';
import Notify from '@/Utils/Notify';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';
import ColumnManager from '../AcademicClasses/Components/ColumnManager';
import SelectInput from '@/Components/Form/SelectInput';
import TextInput from '@/Components/Form/TextInput';

const GradePagination = ({ paginator, perPage, handlePerPageChange }) => {
    const fromIdx = paginator?.meta?.from || paginator?.from || 0;
    const toIdx = paginator?.meta?.to || paginator?.to || 0;
    const total = paginator?.meta?.total || paginator?.total || 0;
    
    const prevUrl = paginator?.meta?.links?.find(l => l.label.includes('Previous'))?.url || paginator?.prev_page_url || paginator?.links?.prev;
    const nextUrl = paginator?.meta?.links?.find(l => l.label.includes('Next'))?.url || paginator?.next_page_url || paginator?.links?.next;

    return (
        <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white rounded-b-[4px]">
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

export default function Index({ auth, grades, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    
    // Modal Management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        action: null,
    });

    const defaultColumns = [
        { id: 'grade_name', label: 'Grade Name', visible: true },
        { id: 'grade_point', label: 'Grade Point', visible: true },
        { id: 'mark_range', label: 'Mark Range', visible: true },
        { id: 'remarks', label: 'Remarks', visible: true },
        { id: 'actions', label: 'Actions', visible: true, disableToggle: true },
    ];
    const [columns, setColumns] = useState(defaultColumns);
    const visibleColumns = columns.filter(c => c.visible).map(c => c.id);

    const toggleColumn = (columnId) => {
        setColumns(columns.map(c => c.id === columnId ? { ...c, visible: !c.visible } : c));
    };

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        grade_point: '',
        min_mark: '',
        max_mark: '',
        remarks: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.grades.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleReset = () => {
        setSearch('');
        router.get(route('admin.grades.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePerPageChange = (newPerPage) => {
        router.get(route('admin.grades.index'), { ...filters, per_page: newPerPage }, { preserveState: true, replace: true, preserveScroll: true });
    };

    // Form Logic
    const openModal = (grade = null) => {
        clearErrors();
        if (grade) {
            setEditingGrade(grade);
            setData({
                name: grade.name,
                grade_point: grade.grade_point,
                min_mark: grade.min_mark,
                max_mark: grade.max_mark,
                remarks: grade.remarks || '',
            });
        } else {
            setEditingGrade(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingGrade(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingGrade) {
            put(route('admin.grades.update', editingGrade.id), {
                onSuccess: () => { closeModal(); Notify.success('Updated', 'Grade updated successfully.'); },
            });
        } else {
            post(route('admin.grades.store'), {
                onSuccess: () => { closeModal(); Notify.success('Created', 'Grade created successfully.'); },
            });
        }
    };

    const deleteGrade = (grade) => {
        setConfirmModal({
            show: true,
            title: 'Delete Grade',
            message: `Are you sure you want to delete ${grade.name}? This action cannot be undone.`,
            action: () => {
                router.delete(route('admin.grades.destroy', grade.id), {
                    onSuccess: () => {
                        Notify.success('Deleted', 'Grade deleted successfully.');
                        setSelectedIds(selectedIds.filter(id => id !== grade.id));
                        setConfirmModal({ show: false, title: '', message: '', action: null });
                    },
                });
            }
        });
    };

    const handleBulkDelete = () => {
        setConfirmModal({
            show: true,
            title: 'Bulk Delete Grades',
            message: `Are you sure you want to delete ${selectedIds.length} selected grades? This action cannot be undone.`,
            action: () => {
                router.post(route('admin.grades.bulk-destroy'), { ids: selectedIds }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSelectedIds([]);
                        Notify.success('Deleted', 'Selected grades deleted successfully.');
                        setConfirmModal({ show: false, title: '', message: '', action: null });
                    }
                });
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(grades?.data?.map(g => g.id) || []);
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

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Grade Setup" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Grade Setup</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage examination grading scale.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} /> Add Grade
                </button>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <div className="border-b border-[#ebebeb] bg-white relative z-30">
                    {selectedIds.length > 0 && (
                        <div className="absolute inset-0 bg-white z-40 flex items-center justify-between px-4 h-full animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center bg-[#008060] text-white text-[12px] font-bold h-[22px] px-2 rounded-[3px] shadow-sm">
                                        {selectedIds.length}
                                    </span>
                                    <span className="text-[13px] font-bold text-[#202223]">
                                        {selectedIds.length === 1 ? 'grade selected' : 'grades selected'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleBulkDelete} className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#d82c0d] rounded-[3px] text-[12px] font-bold hover:bg-[#fff5f5] hover:border-[#d82c0d] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer outline-none">
                                    <Trash2 size={14} />
                                    Delete grades
                                </button>
                                <button onClick={() => setSelectedIds([])} className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:bg-[#f6f6f7] transition-all cursor-pointer outline-none" title="Clear selection">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                    <div className={`p-3 flex items-center justify-between gap-4 transition-opacity duration-200 ${selectedIds.length > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className="relative w-[320px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                            <TextInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search grades..."
                                className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none w-full"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors bg-transparent border-none cursor-pointer">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ColumnManager columns={columns} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
                            <button onClick={handleReset} className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer" title="Reset Filters">
                                <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-[#ebebeb]">
                                <th className="py-3 px-4 w-[40px] text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={grades?.data?.length > 0 && selectedIds.length === grades.data.length}
                                        onChange={handleSelectAll}
                                        className="rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060]"
                                    />
                                </th>
                                {visibleColumns.includes('grade_name') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Grade Name</th>}
                                {visibleColumns.includes('grade_point') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Grade Point (GPA)</th>}
                                {visibleColumns.includes('mark_range') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Mark Range</th>}
                                {visibleColumns.includes('remarks') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Remarks</th>}
                                {visibleColumns.includes('actions') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700 text-right w-[120px]">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb]">
                            {grades?.data?.map((grade) => (
                                <tr key={grade.id} className={`hover:bg-slate-50/40 transition-colors ${selectedIds.includes(grade.id) ? 'bg-emerald-50/20' : ''}`}>
                                    <td className="py-2 px-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.includes(grade.id)}
                                            onChange={() => handleSelectOne(grade.id)}
                                            className="rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060]"
                                        />
                                    </td>
                                    {visibleColumns.includes('grade_name') && (
                                        <td className="py-2 px-4 text-[13px] font-bold text-slate-800">
                                            {grade.name}
                                        </td>
                                    )}
                                    {visibleColumns.includes('grade_point') && (
                                        <td className="py-2 px-4 text-[13px] text-[#008060] font-bold">
                                            {grade.grade_point}
                                        </td>
                                    )}
                                    {visibleColumns.includes('mark_range') && (
                                        <td className="py-2 px-4 text-[13px] text-slate-600 font-medium">
                                            {grade.min_mark} - {grade.max_mark}
                                        </td>
                                    )}
                                    {visibleColumns.includes('remarks') && (
                                        <td className="py-2 px-4 text-[13px] text-slate-600">
                                            {grade.remarks || '-'}
                                        </td>
                                    )}
                                    {visibleColumns.includes('actions') && (
                                        <td className="py-2 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openModal(grade)} className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all">
                                                    <SquarePen size={12} />
                                                </button>
                                                <button onClick={() => deleteGrade(grade)} className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {(!grades?.data || grades.data.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400 bg-white">
                                        <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                        <h5 className="text-[13.5px] font-bold text-slate-700">No grades found</h5>
                                        <p className="text-[12px] text-[#6d7175] mt-0.5">Start by creating a grading scale.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <GradePagination 
                    paginator={grades} 
                    perPage={filters?.per_page || 10} 
                    handlePerPageChange={handlePerPageChange} 
                />
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-[16px] font-bold text-slate-800 mb-4">
                        {editingGrade ? 'Edit Grade' : 'Add Grade'}
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Grade Name (e.g. A+) <span className="text-red-500">*</span></label>
                            <TextInput
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="Enter grade name"
                            />
                            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Grade Point (e.g. 5.00) <span className="text-red-500">*</span></label>
                            <TextInput
                                type="number"
                                step="0.01"
                                value={data.grade_point}
                                onChange={e => setData('grade_point', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="Enter GPA point"
                            />
                            {errors.grade_point && <p className="text-[11px] text-red-500 mt-1">{errors.grade_point}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Min Mark <span className="text-red-500">*</span></label>
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    value={data.min_mark}
                                    onChange={e => setData('min_mark', e.target.value)}
                                    className="w-full text-[13px] h-[36px]"
                                    placeholder="e.g. 80"
                                />
                                {errors.min_mark && <p className="text-[11px] text-red-500 mt-1">{errors.min_mark}</p>}
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Max Mark <span className="text-red-500">*</span></label>
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    value={data.max_mark}
                                    onChange={e => setData('max_mark', e.target.value)}
                                    className="w-full text-[13px] h-[36px]"
                                    placeholder="e.g. 100"
                                />
                                {errors.max_mark && <p className="text-[11px] text-red-500 mt-1">{errors.max_mark}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Remarks</label>
                            <TextInput
                                value={data.remarks}
                                onChange={e => setData('remarks', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="e.g. Excellent, Pass, Fail"
                            />
                            {errors.remarks && <p className="text-[11px] text-red-500 mt-1">{errors.remarks}</p>}
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
                                {editingGrade ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            
            <DeleteConfirmModal
                show={confirmModal.show}
                onClose={() => setConfirmModal({ show: false, title: '', message: '', action: null })}
                onConfirm={confirmModal.action}
                title={confirmModal.title}
                message={confirmModal.message}
                processing={processing}
            />
        </AdminLayout>
    );
}
