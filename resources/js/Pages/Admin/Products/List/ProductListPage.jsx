/**
 * ProductListPage Component
 * 
 * Main interface for managing the product catalog.
 * Features advanced filtering, bulk actions, and column management.
 */
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { Plus, Upload, Percent } from 'lucide-react';

// List Components
import ProductTable from './Components/ProductTable';
import ProductToolbar from './Components/ProductToolbar';
import ProductStats from './Components/ProductStats';
import ProductPagination from './Components/ProductPagination';
import ImportModal from './Components/ImportModal';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

const ProductListPage = ({ auth, products, filters, stats, categories, brands }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'product', label: 'Product' },
        { id: 'status', label: 'Status' },
        { id: 'stock', label: 'Stock' },
        { id: 'category', label: 'Category' },
        { id: 'brand', label: 'Brand' },
        { id: 'price', label: 'Price' },
        { id: 'discount_price', label: 'Discount' },
        { id: 'is_featured', label: 'Featured' },
        { id: 'view_count', label: 'Views' },
        { id: 'warranty', label: 'Warranty' },
        { id: 'created_at', label: 'Created At' },
        { id: 'updated_at', label: 'Updated At' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'product', 'status', 'stock', 'category', 'price', 'discount_price',
        'is_featured', 'brand', 'created_at'
    ]);
    const [hideArchived, setHideArchived] = useState(false);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // Calculate total items and items on current page for selection logic
    const totalCount = products.total || 0;
    const perPageCount = products.data?.length || 0;

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]); // IDs of selected rows on the current page
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false); // Global selection flag
    const [showOnlySelected, setShowOnlySelected] = useState(false); // Filter table by selected items
    const [isProcessing, setIsProcessing] = useState(false);


    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        id: null,
        name: '',
        isBulk: false
    });
    const [showImportModal, setShowImportModal] = useState(false);
    const [processingDelete, setProcessingDelete] = useState(false);

    useEffect(() => {
        const start = (event) => {
            // Only show skeleton for GET requests that are staying on the same page (Filtering, Search, Pagination)
            // This prevents the skeleton from showing when navigating away to Edit/Create pages
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
                setIsProcessing(true); // Trigger skeleton immediately for better UX
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        router.get(route("admin.products.index"), { ...filters, [key]: value, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        const base = { page: 1 };
        const tabFilters = {
            all: { ...base },
            published: { ...base, status: '1' },
            draft: { ...base, status: '0' },
            private: { ...base, status: '2' },
            noImage: { ...base, no_image: '1' },
        };
        router.get(route("admin.products.index"), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route("admin.products.index"), {}, { 
            replace: true,
            preserveState: true,
            preserveScroll: true
        });
    };

    /**
     * Toggles selection for a single product row
     */
    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    /**
     * Toggles selection for all products on the current page
     */
    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(products.data.map(product => product.id));
        }
    };

    /**
     * Activates global selection mode
     */
    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(products.data.map(product => product.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteModal({ show: true, id, name, isBulk: false });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            name: `${count} products`,
            isBulk: true
        });
    };

    const confirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.delete(route("admin.products.bulk-destroy"), {
                data: {
                    ids: selectAllAcrossPages ? [] : selectedIds,
                    all: selectAllAcrossPages,
                    search: filters?.search
                },
                onSuccess: () => {
                    setDeleteModal({ show: false, id: null, name: '', isBulk: false });
                    handleClearSelection();
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        } else {
            router.delete(route("admin.products.destroy", deleteModal.id), {
                onSuccess: () => {
                    setDeleteModal({ show: false, id: null, name: '', isBulk: false });
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        }
    };

    const displayProducts = {
        ...products,
        data: showOnlySelected
            ? (selectAllAcrossPages ? products.data : products.data.filter(p => selectedIds.includes(p.id)))
            : products.data
    };

    const handleBulkStatusChange = ({ type, value }) => {
        setIsProcessing(true);
        router.patch(route("admin.products.bulk-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            type: type, // 'stock' or 'visibility'
            status: value,
            search: filters?.search
        }, {
            onSuccess: () => {
                handleClearSelection();
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false)
        });
    };

    return (
        <>
            <Head title="Products Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Products</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage your inventory, pricing, and catalog details</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route("admin.category-discounts.index")}
                        className="h-[36px] px-4 bg-white text-[#ef4a23] border border-[#ef4a23]/30 rounded-[4px] flex items-center gap-1.5 hover:bg-[#ef4a23]/5 active:scale-95 transition-all font-bold text-[12px] shadow-sm normal-case whitespace-nowrap"
                    >
                        <Percent size={14} strokeWidth={2.5} /> Global Discounts
                    </Link>
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="h-[36px] px-4 bg-white text-slate-700 border border-[#d1d1d1] rounded-[4px] flex items-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all font-bold text-[12px] shadow-sm normal-case whitespace-nowrap"
                    >
                        <Upload size={14} /> Import CSV
                    </button>
                    <Link
                        href={route("admin.products.create")}
                        prefetch
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] flex items-center gap-1.5 hover:bg-[#006e52] active:scale-95 transition-all font-bold text-[12px] shadow-sm shadow-[#008060]/10 normal-case whitespace-nowrap"
                    >
                        <Plus size={14} /> Add Product
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[8px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {/* Stats Overview */}
                <ProductStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Search, Bulk Actions, and Filters */}
                <ProductToolbar
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
                    onMarkAsStatus={handleBulkStatusChange}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    categories={categories}
                    brands={brands}

                    // Column Management Props
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    hideArchived={hideArchived}
                    setHideArchived={setHideArchived}
                />

                {/* Main Data Table */}
                <ProductTable
                    products={displayProducts}
                    filters={filters}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}

                    // Column Management Props
                    visibleColumns={visibleColumns}
                />

                {/* Pagination Controls */}
                <ProductPagination
                    products={products}
                    filters={filters}
                    handlePerPageChange={(e) => handleFilterChange('per_page', e.target.value)}
                    handlePageChange={(url) => url && router.get(url, {}, { preserveScroll: true, preserveState: true })}
                />
            </div>

            {/* Premium Delete Confirmation Modal */}
            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, id: null, name: '', isBulk: false })}
                onConfirm={confirmDelete}
                title={deleteModal.isBulk ? "Bulk Delete Products" : "Delete Product"}
                message={deleteModal.isBulk
                    ? `Are you sure you want to delete ${deleteModal.name}? This will permanently remove them from the system.`
                    : `Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`
                }
                processing={processingDelete}
            />

            {/* Import Modal */}
            <ImportModal
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
            />

        </>
    );
};

ProductListPage.layout = page => <AdminLayout user={page.props.auth.user} children={page} />

export default ProductListPage;
