import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus } from 'lucide-react';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import Notify from '@/Utils/Notify';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';

import VariantToolbar from './Components/VariantToolbar';
import VariantTable from './Components/VariantTable';
import VariantStats from './Components/VariantStats';
import VariantPagination from './Components/VariantPagination';

export default function VariantsIndex({ auth, variants, filters, stats }) {
    // --- Column Management ---
    const allColumns = [
        { id: 'variant', label: 'Variant Details' },
        { id: 'type', label: 'Input Type' },
        { id: 'options', label: 'Predefined Options' },
        { id: 'status', label: 'Status' },
    ];

    const [visibleColumns, setVisibleColumns] = useState(['variant', 'type', 'options', 'status']);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const totalCount = variants.total || 0;
    const perPageCount = variants.data?.length || 0;

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAddingVariant, setIsAddingVariant] = useState(false);
    const [newVariant, setNewVariant] = useState({ name: '', type: 'select' });

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        id: null,
        title: '',
        message: '',
        isBulk: false
    });
    const [processingDelete, setProcessingDelete] = useState(false);

    useEffect(() => {
        const start = (event) => {
            const isSamePage = new URL(event.detail.visit.url, window.location.origin).pathname === window.location.pathname;
            if (event.detail.visit.method === 'get' && !event.detail.visit.prefetch && !event.detail.visit.bg && isSamePage) {
                setIsProcessing(true);
            }
        };
        const finish = () => setIsProcessing(false);

        const unbindStart = router.on('start', start);
        const unbindFinish = router.on('finish', finish);

        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = filters?.search || "";
            if (search !== currentSearch) {
                setIsProcessing(true);
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.variants.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        const base = { page: 1 };
        const tabFilters = {
            all: { ...base },
            active: { ...base, status: 'active' },
            inactive: { ...base, status: 'inactive' }
        };
        router.get(route('admin.variants.index'), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.variants.index'), {}, {
            replace: true,
            preserveScroll: true,
            preserveState: true
        });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (e) => {
        handleFilterChange('per_page', e.target.value);
    };

    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(variants.data.map(item => item.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(variants.data.map(item => item.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteModal({
            show: true,
            id,
            title: 'Delete Variant',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            title: 'Bulk Delete Variants',
            message: `Are you sure you want to delete ${count} variants? This will permanently remove them from the system.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.delete(route("admin.variants.bulk-destroy"), {
                data: {
                    ids: selectAllAcrossPages ? [] : selectedIds,
                    all: selectAllAcrossPages,
                    ...filters
                },
                onSuccess: () => {
                    handleClearSelection();
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Selected variants deleted');
                },
                onError: () => setProcessingDelete(false)
            });
        } else {
            router.delete(route("admin.variants.destroy", deleteModal.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Variant deleted');
                },
                onError: () => setProcessingDelete(false)
            });
        }
    };

    const handleMarkAsStatus = (value) => {
        router.post(route("admin.variants.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            is_active: value,
            ...filters
        }, {
            onSuccess: () => {
                handleClearSelection();
                Notify.success('Status updated');
            }
        });
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayData = {
        ...variants,
        data: showOnlySelected
            ? (selectAllAcrossPages ? variants.data : variants.data.filter(p => selectedIds.includes(p.id)))
            : variants.data
    };

    const handleCreateVariant = () => {
        if (!newVariant.name) return;
        router.post(route('admin.variants.store'), newVariant, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddingVariant(false);
                setNewVariant({ name: '', type: 'select' });
                Notify.success('Variant created successfully');
            }
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Variant Management" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Variant Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Organize and manage global product variants and predefined options</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAddingVariant(true)}
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm shadow-[#008060]/10"
                    >
                        <Plus size={14} /> Add Variant
                    </button>
                </div>
            </div>

            {isAddingVariant && (
                <div className="mb-6 bg-white rounded-[8px] border border-[#ebebeb] shadow-sm p-5 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 w-full">
                            <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Variant Name</label>
                            <TextInput 
                                value={newVariant.name}
                                onChange={e => setNewVariant({ ...newVariant, name: e.target.value })}
                                placeholder="e.g. Weight, Size, Color"
                            />
                        </div>
                        <div className="w-full md:w-56">
                            <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Input Type</label>
                            <SelectInput 
                                value={newVariant.type}
                                onChange={e => setNewVariant({ ...newVariant, type: e.target.value })}
                                showSearch={false}
                                options={[
                                    { id: 'select', name: 'Dropdown Select' },
                                    { id: 'radio', name: 'Radio Buttons' }
                                ]}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                            <button onClick={handleCreateVariant} className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] text-[12px] font-bold hover:bg-[#006e52]">
                                Save Variant
                            </button>
                            <button onClick={() => setIsAddingVariant(false)} className="h-[36px] px-3 border border-[#d1d1d1] text-[#202223] rounded-[4px] hover:bg-[#f6f6f7]">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[8px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                <VariantStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                <VariantToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    handleClearSelection={handleClearSelection}
                    handleBulkDeleteClick={handleBulkDeleteClick}
                    handleSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    handleMarkAsStatus={handleMarkAsStatus}
                />

                <VariantTable
                    variants={displayData}
                    filters={filters}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    activeTab={activeTab}
                    visibleColumns={visibleColumns}
                    stats={stats}
                />

                <VariantPagination
                    variants={variants}
                    filters={filters}
                    total={stats ? (stats[activeTab === 'all' ? 'total' : activeTab] ?? stats.total ?? 0) : 0}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>

            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal(prev => ({ ...prev, show: false }))}
                onConfirm={handleConfirmDelete}
                title={deleteModal.title}
                message={deleteModal.message}
                processing={processingDelete}
            />
        </AdminLayout>
    );
}
