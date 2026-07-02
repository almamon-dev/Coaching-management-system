import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2, Search, X, SlidersHorizontal, RotateCcw, AlertTriangle, Check, ChevronDown } from 'lucide-react';
import Modal from '@/Components/Modal/Modal';
import Notify from '@/Utils/Notify';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import ColumnManager from '../../AcademicClasses/Components/ColumnManager';
import SortableHeader from '@/Components/Table/SortableHeader';

const FeeGroupToolbar = ({ search, setSearch, handleReset, showAdvanced, setShowAdvanced, columns, visibleColumns, toggleColumn, selectedIds, handleClearSelection, handleBulkDelete, filters }) => {
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
                    placeholder="Search fee groups..."
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
                                        router.get(route('admin.fee-groups.index'), { ...filters, status: e.target.value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
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

const FeeGroupPagination = ({ paginator, perPage, handlePerPageChange }) => {
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

export default function Index({ auth, feeGroups, feeTypes, academicClasses, filters }) {
    // Column Management
    const allColumns = [
        { id: 'name', label: 'Group Name' },
        { id: 'class_name', label: 'Class Name' },
        { id: 'description', label: 'Description' },
        { id: 'total_amount', label: 'Total Amount' },
        { id: 'status', label: 'Status' },
        { id: 'created_at', label: 'Created At' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(['name', 'class_name', 'description', 'total_amount', 'status', 'created_at']);
    const toggleColumn = (id) => setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    // Data Management
    const [search, setSearch] = useState(filters?.search || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    
    // Modal Management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        academic_class_id: '',
        description: '',
        is_active: true,
        items: []
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.fee-groups.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handlePerPageChange = (val) => {
        router.get(route('admin.fee-groups.index'), { ...filters, per_page: val, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        router.get(route('admin.fee-groups.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    // Selection Logic
    const availableIds = feeGroups?.data?.map(s => s.id) || [];
    const isAllSelected = selectedIds.length === availableIds.length && availableIds.length > 0;
    
    const toggleSelectAll = () => {
        if (selectedIds.length > 0) setSelectedIds([]);
        else setSelectedIds(availableIds);
    };
    
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.length} fee groups?`)) {
            Notify.error('Not Implemented', 'Bulk delete backend route needs to be added.');
        }
    };

    // Form Logic
    const openModal = (group = null) => {
        clearErrors();
        if (group) {
            setEditingGroup(group);
            setData({
                name: group.name || '',
                academic_class_id: group.academic_class_id || '',
                description: group.description || '',
                is_active: !!group.is_active,
                items: group.items.map(i => ({ fee_type_id: i.fee_type_id, amount: parseFloat(i.amount) }))
            });
        } else {
            setEditingGroup(null);
            reset();
            setData('name', '');
            setData('academic_class_id', '');
            setData('is_active', true);
            setData('items', [{ fee_type_id: '', amount: 0 }]); // One empty item by default
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingGroup(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Validate items before submitting
        if (data.items.length === 0) {
            Notify.error('Error', 'Please add at least one fee type to this group.');
            return;
        }

        if (editingGroup) {
            put(route('admin.fee-groups.update', editingGroup.id), {
                onSuccess: () => { closeModal(); Notify.success('Updated', 'Fee Group updated successfully.'); },
            });
        } else {
            post(route('admin.fee-groups.store'), {
                onSuccess: () => { closeModal(); Notify.success('Created', 'Fee Group created successfully.'); },
            });
        }
    };

    const deleteFeeGroup = (group) => {
        const className = group.academic_class ? group.academic_class.name : 'this class';
        if (confirm(`Are you sure you want to delete fee group for ${className}?`)) {
            router.delete(route('admin.fee-groups.destroy', group.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(id => id !== group.id));
                    Notify.success('Deleted', 'Fee Group deleted successfully.');
                },
            });
        }
    };

    // Dynamic Items Management
    const addItem = () => {
        setData('items', [...data.items, { fee_type_id: '', amount: 0 }]);
    };

    const removeItem = (idx) => {
        setData('items', data.items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx, field, value) => {
        const newItems = [...data.items];
        newItems[idx][field] = value;
        setData('items', newItems);
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Fee Groups" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Fee Setup (Groups)</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Create fee packages for different classes by assigning amounts.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} /> Create Fee Group
                </button>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <FeeGroupToolbar 
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
                                {visibleColumns.includes('name') && <SortableHeader label="Group Name" field="name" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-groups.index', params: filters }} />}
                                {visibleColumns.includes('class_name') && <th className="px-4 py-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] uppercase tracking-wider first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Class Name</th>}
                                {visibleColumns.includes('description') && <SortableHeader label="Description" field="description" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-groups.index', params: filters }} />}
                                {visibleColumns.includes('total_amount') && <th className="px-4 py-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] uppercase tracking-wider text-right first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Total Amount</th>}
                                {visibleColumns.includes('status') && <SortableHeader label="Status" field="is_active" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-groups.index', params: filters }} />}
                                {visibleColumns.includes('created_at') && <SortableHeader label="Created At" field="created_at" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-groups.index', params: filters }} />}
                                <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] text-right w-[100px] rounded-tr-[6px] uppercase tracking-wider bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb]">
                            {feeGroups?.data?.map((group) => {
                                const isSelected = selectedIds.includes(group.id);
                                const totalAmount = group.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
                                
                                return (
                                    <tr key={group.id} className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-[#f0f9f7]/20' : ''}`}>
                                        <td className="py-2 px-4 text-center select-none">
                                            <div onClick={() => toggleSelect(group.id)} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1] hover:border-slate-400'}`}>
                                                {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                                            </div>
                                        </td>
                                        {visibleColumns.includes('name') && (
                                            <td className="py-2 px-4 text-[13px] font-bold text-slate-800">
                                                {group.name}
                                                <div className="text-[11px] font-medium text-slate-500 mt-0.5">{group.items.length} fees assigned</div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('class_name') && (
                                            <td className="py-2 px-4 text-[13px] font-medium text-slate-700">
                                                {group.academic_class ? group.academic_class.name : 'Unknown Class'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('description') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600 truncate max-w-[250px]" title={group.description}>
                                                {group.description || '-'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('total_amount') && (
                                            <td className="py-2 px-4 text-[13px] font-bold text-emerald-600">
                                                {totalAmount.toFixed(2)} BDT
                                            </td>
                                        )}
                                        {visibleColumns.includes('status') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${group.is_active ? 'bg-[#e4f1ef] text-[#008060] border-[#008060]/20' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                    {group.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('created_at') && (
                                            <td className="py-2 px-4 text-[13px] text-slate-600">
                                                {new Date(group.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        )}
                                        <td className="py-2 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openModal(group)} className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all">
                                                    <SquarePen size={12} />
                                                </button>
                                                <button onClick={() => deleteFeeGroup(group)} className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322]">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!feeGroups?.data || feeGroups.data.length === 0) && (
                                <tr>
                                    <td colSpan={visibleColumns.length + 2} className="p-12 text-center text-slate-400 bg-white">
                                        <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                        <h5 className="text-[13.5px] font-bold text-slate-700">No fee groups found</h5>
                                        <p className="text-[12px] text-[#6d7175] mt-0.5">Start by creating a fee package for a class.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <FeeGroupPagination paginator={feeGroups} perPage={filters?.per_page || 10} handlePerPageChange={handlePerPageChange} />
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                        <h2 className="text-[15px] font-bold text-slate-800">
                            {editingGroup ? 'Edit Fee Package' : 'Create Fee Package'}
                        </h2>
                        <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                    </div>
                    
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Group Name <span className="text-red-500">*</span></label>
                                <TextInput
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full text-[13px] h-[32px]"
                                    placeholder="e.g. Science Monthly Fees"
                                />
                                {errors.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Academic Class <span className="text-red-500">*</span></label>
                                <select
                                    value={data.academic_class_id}
                                    onChange={e => setData('academic_class_id', e.target.value)}
                                    className="w-full text-[13px] border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] h-[32px] bg-white text-slate-700 py-0"
                                >
                                    <option value="">Select Class...</option>
                                    {academicClasses?.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                                {errors.academic_class_id && <p className="text-[11px] text-red-500 mt-0.5">{errors.academic_class_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Description</label>
                                <TextInput
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full text-[13px] h-[32px]"
                                    placeholder="Optional details..."
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Status</label>
                                <label className="flex items-center gap-2 cursor-pointer h-[32px]">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="rounded border-slate-300 text-[#008060] focus:ring-[#008060]"
                                    />
                                    <span className="text-[13px] text-slate-700">Active package</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
                                <label className="block text-[12px] uppercase tracking-wider font-bold text-slate-700">Assigned Fees & Amounts</label>
                                <button type="button" onClick={addItem} className="text-[11px] font-bold text-white bg-[#008060] px-2.5 py-1.5 rounded flex items-center gap-1 hover:bg-[#006e52] shadow-sm transition-colors">
                                    <Plus size={12} /> Add Fee Row
                                </button>
                            </div>

                            <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                                {data.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 items-start bg-slate-50 p-1.5 rounded border border-slate-100 animate-in fade-in slide-in-from-left-2">
                                        <div className="flex-1">
                                            <select
                                                value={item.fee_type_id}
                                                onChange={(e) => updateItem(idx, 'fee_type_id', e.target.value)}
                                                className="w-full text-[12px] font-medium border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[2px] h-[28px] py-0 bg-white text-slate-700"
                                            >
                                                <option value="">Select Fee Type...</option>
                                                {feeTypes.map(type => (
                                                    <option key={type.id} value={type.id}>{type.name} - ({type.category})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-[120px] relative">
                                            <TextInput
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.amount}
                                                onChange={(e) => updateItem(idx, 'amount', e.target.value)}
                                                className="w-full text-[12px] font-bold h-[28px] pr-8 text-right rounded-[2px] py-0"
                                                placeholder="0.00"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">BDT</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeItem(idx)}
                                            className="h-[28px] w-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-[2px] transition-colors bg-white border border-slate-200"
                                            title="Remove Row"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}

                                {data.items.length === 0 && (
                                    <div className="text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-[3px]">
                                        <p className="text-[11px] font-medium text-slate-500">No fees added to this package yet.</p>
                                    </div>
                                )}
                            </div>
                            
                            {data.items.length > 0 && (
                                <div className="mt-2 text-right pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <span className="text-[12px] uppercase tracking-wider font-bold text-slate-500">Total Group Amount: </span>
                                    <span className="text-[16px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        {data.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)} BDT
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-100">
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
                                {editingGroup ? 'Update Package' : 'Save Package'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
