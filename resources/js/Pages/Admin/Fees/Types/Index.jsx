import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2, Search, X, SlidersHorizontal, RotateCcw, AlertTriangle, Check, ChevronDown } from 'lucide-react';
import Modal from '@/Components/Modal/Modal';
import Notify from '@/Utils/Notify';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import ColumnManager from '../../AcademicClasses/Components/ColumnManager';
import AcademicClassStats from '../../AcademicClasses/Components/AcademicClassStats';
import SortableHeader from '@/Components/Table/SortableHeader';

const FeeTypeToolbar = ({ search, setSearch, handleReset, showAdvanced, setShowAdvanced, columns, visibleColumns, toggleColumn, selectedIds, handleClearSelection, handleBulkDelete, filters }) => {
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
                    placeholder="Search fee types..."
                    className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none w-full"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors bg-transparent border-none cursor-pointer">
                        <X size={14} />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-1.5 relative">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`h-[32px] px-3 rounded-[3px] border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer outline-none ${showAdvanced ? 'bg-[#e4f1ef] border-[#008060] text-[#008060]' : 'bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]'}`}
                >
                    <SlidersHorizontal size={14} /> Filters
                </button>
                
                {showAdvanced && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowAdvanced(false)} />
                        <div className="absolute top-full right-0 mt-1 w-[250px] bg-white border border-[#d1d1d1] rounded-[4px] shadow-lg z-40 p-3 animate-in fade-in slide-in-from-top-2">
                            <div className="mb-3">
                                <label className="block text-[11px] font-bold text-[#6d7175] uppercase tracking-wider mb-1">Status</label>
                                <SelectInput
                                    value={filters?.status || 'all'}
                                    onChange={(e) => {
                                        router.get(route('admin.fee-types.index'), { ...filters, status: e.target.value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
                                    }}
                                    showSearch={false}
                                    options={[
                                        { id: 'all', name: 'All Statuses' },
                                        { id: 'active', name: 'Active' },
                                        { id: 'inactive', name: 'Inactive' }
                                    ]}
                                    className="w-full h-[32px] text-[12px]"
                                />
                            </div>
                        </div>
                    </>
                )}

                <button onClick={handleReset} className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer" title="Reset Filters">
                    <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                </button>
                <div className="w-[1px] h-4 bg-[#ebebeb] mx-1" />
                <ColumnManager columns={columns} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
            </div>
        </div>
    </div>
)};

const FeeTypePagination = ({ paginator, perPage, handlePerPageChange }) => {
    const fromIdx = paginator?.from || 0;
    const toIdx = paginator?.to || 0;
    const total = paginator?.total || 0;
    
    const prevUrl = paginator?.prev_page_url;
    const nextUrl = paginator?.next_page_url;

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

export default function Index({ auth, feeTypes, filters, stats }) {
    // Column Management
    const allColumns = [
        { id: 'name', label: 'Fee Name' },
        { id: 'code', label: 'Fee Code' },
        { id: 'category', label: 'Category' },
        { id: 'description', label: 'Description' },
        { id: 'status', label: 'Status' },
        { id: 'created_at', label: 'Created At' }
    ];
    const [visibleColumns, setVisibleColumns] = useState(['name', 'code', 'category', 'description', 'status', 'created_at']);
    const toggleColumn = (id) => setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    // Data Management
    const [search, setSearch] = useState(filters?.search || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    
    // Modal Management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        category: '',
        name: '',
        code: '',
        description: '',
        is_active: true,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.fee-types.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handlePerPageChange = (val) => {
        router.get(route('admin.fee-types.index'), { ...filters, per_page: val, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        router.get(route('admin.fee-types.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleTabChange = (tab) => {
        router.get(route('admin.fee-types.index'), { ...filters, status: tab === 'all' ? null : tab, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    // Selection Logic
    const availableIds = feeTypes?.data?.map(s => s.id) || [];
    const isAllSelected = selectedIds.length === availableIds.length && availableIds.length > 0;
    
    const toggleSelectAll = () => {
        if (selectedIds.length > 0) setSelectedIds([]);
        else setSelectedIds(availableIds);
    };
    
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.length} fee types?`)) {
            Notify.error('Not Implemented', 'Bulk delete backend route needs to be added.');
        }
    };

    // Form Logic
    const openModal = (fee = null) => {
        clearErrors();
        if (fee) {
            setEditingFee(fee);
            setData({
                category: fee.category || '',
                name: fee.name,
                code: fee.code,
                description: fee.description || '',
                is_active: !!fee.is_active,
            });
        } else {
            setEditingFee(null);
            reset();
            setData('is_active', true);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFee(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingFee) {
            put(route('admin.fee-types.update', editingFee.id), {
                onSuccess: () => { closeModal(); Notify.success('Updated', 'Fee Type updated successfully.'); },
            });
        } else {
            post(route('admin.fee-types.store'), {
                onSuccess: () => { closeModal(); Notify.success('Created', 'Fee Type created successfully.'); },
            });
        }
    };

    const deleteFeeType = (fee) => {
        if (confirm(`Are you sure you want to delete fee type ${fee.name}?`)) {
            router.delete(route('admin.fee-types.destroy', fee.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(id => id !== fee.id));
                    Notify.success('Deleted', 'Fee Type deleted successfully.');
                },
            });
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Fee Types" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Fee Types & Heads</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage all kinds of fees applicable in the institution.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} /> Add Fee Type
                </button>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {stats && <AcademicClassStats stats={stats} activeTab={filters?.status || 'all'} onTabChange={handleTabChange} />}
                <FeeTypeToolbar 
                    search={search} setSearch={setSearch} handleReset={handleReset}
                    showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
                    columns={allColumns} visibleColumns={visibleColumns} toggleColumn={toggleColumn}
                    selectedIds={selectedIds} handleClearSelection={() => setSelectedIds([])} handleBulkDelete={handleBulkDelete}
                    filters={filters}
                />

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f4f6f8]">
                                <th className="py-3 px-4 w-[48px] text-center select-none rounded-tl-[6px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">
                                    <div onClick={toggleSelectAll} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isAllSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1]'}`}>
                                        {isAllSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                                    </div>
                                </th>
                                {visibleColumns.includes('name') && <SortableHeader label="Fee Name" field="name" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-types.index', params: filters }} />}
                                {visibleColumns.includes('code') && <SortableHeader label="Code" field="code" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-types.index', params: filters }} />}
                                {visibleColumns.includes('category') && <SortableHeader label="Category" field="category" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-types.index', params: filters }} />}
                                {visibleColumns.includes('description') && <th className="px-4 py-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] uppercase tracking-wider first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Description</th>}
                                {visibleColumns.includes('status') && <SortableHeader label="Status" field="is_active" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-types.index', params: filters }} />}
                                {visibleColumns.includes('created_at') && <SortableHeader label="Created At" field="created_at" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-types.index', params: filters }} />}
                                <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] text-right w-[100px] rounded-tr-[6px] uppercase tracking-wider bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb]">
                            {feeTypes?.data?.map((fee) => {
                                const isSelected = selectedIds.includes(fee.id);
                                return (
                                    <tr key={fee.id} className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-[#f0f9f7]/20' : ''}`}>
                                        <td className="py-2 px-4 text-center select-none">
                                            <div onClick={() => toggleSelect(fee.id)} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1] hover:border-slate-400'}`}>
                                                {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                                            </div>
                                        </td>
                                        {visibleColumns.includes('name') && (
                                            <td className="py-2 px-4 text-[13px] font-bold text-slate-800">
                                                {fee.name}
                                            </td>
                                        )}
                                        {visibleColumns.includes('code') && (
                                            <td className="py-2 px-4 text-[12px] font-medium text-slate-500">
                                                {fee.code}
                                            </td>
                                        )}
                                        {visibleColumns.includes('category') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    {fee.category}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('description') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600 truncate max-w-[250px]" title={fee.description}>
                                                {fee.description || '-'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('status') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${fee.is_active ? 'bg-[#e4f1ef] text-[#008060] border-[#008060]/20' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                    {fee.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('created_at') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                {new Date(fee.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        )}
                                        <td className="py-2 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openModal(fee)} className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all">
                                                    <SquarePen size={12} />
                                                </button>
                                                <button onClick={() => deleteFeeType(fee)} className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322]">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!feeTypes?.data || feeTypes.data.length === 0) && (
                                <tr>
                                    <td colSpan={visibleColumns.length + 2} className="p-12 text-center text-slate-400 bg-white">
                                        <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                        <h5 className="text-[13.5px] font-bold text-slate-700">No fee types found</h5>
                                        <p className="text-[12px] text-[#6d7175] mt-0.5">Start by adding a new fee type.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <FeeTypePagination paginator={feeTypes} perPage={filters?.per_page || 10} handlePerPageChange={handlePerPageChange} />
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-[16px] font-bold text-slate-800 mb-4">
                        {editingFee ? 'Edit Fee Type' : 'Add Fee Type'}
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                            <TextInput
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="e.g. Academic Fees"
                            />
                            {errors.category && <p className="text-[11px] text-red-500 mt-1">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Fee Name <span className="text-red-500">*</span></label>
                            <TextInput
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="e.g. Tuition Fee"
                            />
                            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Fee Code (Unique) <span className="text-red-500">*</span></label>
                            <TextInput
                                value={data.code}
                                onChange={e => setData('code', e.target.value.toUpperCase())}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="e.g. TUITION_FEE"
                            />
                            {errors.code && <p className="text-[11px] text-red-500 mt-1">{errors.code}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full text-[13px] border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] p-2"
                                rows="3"
                                placeholder="Enter description..."
                            ></textarea>
                            {errors.description && <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Status</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded border-slate-300 text-[#008060] focus:ring-[#008060]"
                                />
                                <span className="text-[13px] text-slate-700">Active</span>
                            </label>
                            {errors.is_active && <p className="text-[11px] text-red-500 mt-1">{errors.is_active}</p>}
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
                                {editingFee ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
