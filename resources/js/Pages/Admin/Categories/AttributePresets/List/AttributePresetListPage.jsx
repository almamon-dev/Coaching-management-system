import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, ArrowLeft, Sparkles } from 'lucide-react';
import AttributePresetTable from '../Components/AttributePresetTable';
import AttributePresetToolbar from '../Components/AttributePresetToolbar';
import AttributePresetStats from '../Components/AttributePresetStats';
import AttributePresetPagination from '../Components/AttributePresetPagination';
import AttributePresetSelectionBanner from '../Components/AttributePresetSelectionBanner';
import AttributePresetBulkActionBar from '../Components/AttributePresetBulkActionBar';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

export default function Index({ auth, presets, filters, stats }) {
    // --- Column Management ---
    const allColumns = [
        { id: 'name', label: 'Preset Name' },
        { id: 'slug', label: 'Slug' },
        { id: 'fields', label: 'Fields' },
        { id: 'created_at', label: 'Created At' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'name', 'slug', 'fields', 'created_at'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        id: null,
        name: '',
        isBulk: false
    });
    const [processingDelete, setProcessingDelete] = useState(false);

    // --- Loading Overlay Logic ---
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
        return () => { unbindStart(); unbindFinish(); };
    }, []);

    // --- Debounced Search ---
    useEffect(() => {
        const timer = setTimeout(() => {
            // Ensure we compare with an empty string if filters.search is null/undefined
            const currentSearch = filters?.search || "";
            if (search !== currentSearch) {
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        router.get(route('admin.categories.attribute-presets.index'), {
            ...filters,
            [key]: value,
            page: 1
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (e) => {
        handleFilterChange('per_page', e.target.value);
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.categories.attribute-presets.index'), {}, { 
            replace: true, 
            preserveScroll: true,
            preserveState: true
        });
    };

    // --- Selection Logic ---
    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(presets.data.map(p => p.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    // --- Delete Logic ---
    const handleDeleteClick = (id, name) => {
        setDeleteModal({ show: true, id, name, isBulk: false });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? (presets?.total || 0) : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            name: `${count} presets`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);
        if (deleteModal.isBulk) {
            router.delete(route('admin.categories.attribute-presets.bulk-destroy'), {
                data: {
                    ids: selectAllAcrossPages ? [] : selectedIds,
                    all: selectAllAcrossPages,
                    ...filters
                },
                onSuccess: () => {
                    handleClearSelection();
                    setDeleteModal({ show: false, id: null, name: '', isBulk: false });
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        } else {
            router.delete(route('admin.categories.attribute-presets.destroy', deleteModal.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                    setDeleteModal({ show: false, id: null, name: '', isBulk: false });
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Attribute Presets" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">

                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Attribute Presets</h1>
                        <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage reusable attribute templates for product categories</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route('admin.categories.attribute-presets.create')}
                        className="h-[38px] px-5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Plus size={14} /> Add Preset
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden relative">
                <AttributePresetStats
                    stats={stats}
                    activeTab="all"
                    onTabChange={() => { }}
                />

                {selectedIds.length > 0 && (
                    <AttributePresetBulkActionBar
                        selectedCount={selectedIds.length}
                        onClear={handleClearSelection}
                        onBulkDelete={handleBulkDeleteClick}
                        totalCount={presets?.total || 0}
                        perPageCount={presets?.data?.length || 0}
                        selectAllAcrossPages={selectAllAcrossPages}
                        onSelectAllAcrossPages={handleSelectAllAcrossPages}
                        showOnlySelected={showOnlySelected}
                        setShowOnlySelected={setShowOnlySelected}
                    />
                )}

                <AttributePresetToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters || {}}
                    handleFilterChange={handleFilterChange}
                    onReset={handleReset}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    totalCount={presets?.total || 0}
                    perPageCount={presets?.data?.length || 0}
                    handleClearSelection={handleClearSelection}
                    handleBulkDeleteClick={handleBulkDeleteClick}
                    handleSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                />

                <AttributePresetSelectionBanner
                    selectedIds={selectedIds}
                    perPageCount={presets?.data?.length || 0}
                    handleClearSelection={handleClearSelection}
                />

                <AttributePresetTable
                    presets={presets || { data: [] }}
                    selectedIds={selectedIds}
                    toggleSelect={toggleSelect}
                    toggleSelectAll={toggleSelectAll}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                />

                <AttributePresetPagination
                    presets={presets || { data: [] }}
                    filters={filters || {}}
                    onPerPageChange={handlePerPageChange}
                    onPageChange={handlePageChange}
                />
            </div>

            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, id: null, name: '', isBulk: false })}
                onConfirm={handleConfirmDelete}
                title={deleteModal.isBulk ? "Bulk Delete Presets" : "Delete Preset"}
                message={`Are you sure you want to delete ${deleteModal.name}? This action cannot be undone.`}
                processing={processingDelete}
            />
        </AdminLayout>
    );
}
