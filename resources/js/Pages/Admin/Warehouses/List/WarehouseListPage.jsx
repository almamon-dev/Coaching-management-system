import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import WarehouseToolbar from '../Components/WarehouseToolbar';
import WarehouseTable from '../Components/WarehouseTable';
import WarehouseStats from '../Components/WarehouseStats';
import WarehouseModal from '../Components/WarehouseModal';
import WarehousePagination from '../Components/WarehousePagination';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import { cn } from '@/lib/utils';

const Index = ({ auth, warehouses, filters, stats }) => {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState(filters.status || 'all');
    const [showOnlySelected, setShowOnlySelected] = useState(false);

    // Column Management
    const allColumns = [
        { id: 'warehouse', label: 'Warehouse Info' },
        { id: 'address', label: 'Address / Location' },
        { id: 'phone', label: 'Contact Phone' },
        { id: 'status', label: 'Status' },
        { id: 'date', label: 'Created Date' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(allColumns.map(c => c.id));

    const toggleColumn = (id) => {
        setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

    // Handle Search with debounce logic simulation (or use effect)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || "")) {
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Track Inertia processing
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

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.warehouses.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.warehouses.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Selection Handlers
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === warehouses.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(warehouses.data.map(w => w.id));
        }
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setShowOnlySelected(false);
    };

    // Action Handlers
    const handleCreateClick = () => {
        setEditingWarehouse(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (warehouse) => {
        setEditingWarehouse(warehouse);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteModal({ isOpen: true, id, name });
    };

    const confirmDelete = () => {
        router.delete(route('admin.warehouses.destroy', deleteModal.id), {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, id: null, name: '' });
                setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
            }
        });
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} warehouses?`)) {
            router.post(route('admin.warehouses.bulk-destroy'), { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, { ...filters }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const displayWarehouses = {
        ...warehouses,
        data: showOnlySelected 
            ? warehouses.data.filter(w => selectedIds.includes(w.id))
            : warehouses.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Warehouse Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Warehouse Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage stock levels across multiple physical locations</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCreateClick}
                        className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                    >
                        <Plus size={14} /> Add Warehouse
                    </button>
                </div>
            </div>

            {/* Stats Tabs */}
            <WarehouseStats 
                stats={stats} 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    handleFilterChange('status', tab);
                }} 
            />

            {/* Content Card */}
            <div className="bg-white border-x border-b border-[#ebebeb] rounded-b-[4px] shadow-sm overflow-visible">
                <WarehouseToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    totalCount={warehouses.total}
                    perPageCount={warehouses.per_page}
                    selectedIds={selectedIds}
                    handleClearSelection={handleClearSelection}
                    handleBulkDeleteClick={handleBulkDelete}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                />

                <WarehouseTable
                    warehouses={displayWarehouses}
                    selectedIds={selectedIds}
                    toggleSelect={toggleSelect}
                    toggleSelectAll={toggleSelectAll}
                    handleDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                    activeTab={activeTab}
                    stats={stats}
                />

                {/* Pagination */}
                <WarehousePagination
                    warehouses={warehouses}
                    filters={filters}
                    handlePerPageChange={(e) => handleFilterChange('per_page', e.target.value)}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* Modals */}
            <WarehouseModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                warehouse={editingWarehouse} 
            />

            <DeleteConfirmModal
                show={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Warehouse"
                message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
            />
        </AdminLayout>
    );
};

export default Index;
