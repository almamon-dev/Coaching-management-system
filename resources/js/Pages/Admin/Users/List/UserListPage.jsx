/**
 * UserListPage Component
 * 
 * Standardized, high-performance interface for managing system staff.
 * Features modular components, advanced search debouncing, and bulk status/delete actions.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { Plus } from 'lucide-react';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

// Local Components
import UserTable from '../Components/UserTable';
import UserToolbar from '../Components/UserToolbar';
import UserStats from '../Components/UserStats';
import UserPagination from '../Components/UserPagination';
import Notify from '@/Utils/Notify';

const UserListPage = ({ auth, users, filters, stats, roles }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'name', label: 'Staff Member' },
        { id: 'email', label: 'Email Details' },
        { id: 'roles', label: 'System Roles' },
        { id: 'status', label: 'Access State' },
        { id: 'created_at', label: 'Created Date' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'name', 'email', 'roles', 'status', 'created_at'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // Calculate total items and items on current page for selection logic
    const totalCount = users.meta?.total || users.total || 0;
    const perPageCount = users.data?.length || 0;

    // Master admin details
    const masterAdminEmail = 'admin@getitmoving.com';

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [selectedIds, setSelectedIds] = useState([]); // Selected IDs on current page
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false); // Global selection flag
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        user: null,
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
                setIsProcessing(true); // Trigger skeleton/loader
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.users.index'), newFilters, {
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
            inactive: { ...base, status: 'disabled' },
        };
        router.get(route('admin.users.index'), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.users.index'), {}, {
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

    // Filter out protected accounts (master admin & logged-in self) from selection
    const availableBulkUsers = useMemo(() => {
        return users.data.filter(u => u.email !== masterAdminEmail && u.id !== auth.user.id);
    }, [users.data, auth.user.id]);

    const availableBulkIds = useMemo(() => {
        return availableBulkUsers.map(u => u.id);
    }, [availableBulkUsers]);

    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(availableBulkIds);
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(availableBulkIds);
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleDeleteClick = (user) => {
        if (user.email === masterAdminEmail || user.id === auth.user.id) {
            Notify.error('Action Blocked', 'You cannot delete this protected account.');
            return;
        }

        setDeleteModal({
            show: true,
            user,
            title: 'Delete Staff User',
            message: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            user: null,
            title: 'Bulk Delete Staff',
            message: `Are you sure you want to delete ${count} staff members? This will permanently remove them from the system.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.post(route("admin.users.bulk-destroy"), {
                ids: selectedIds
            }, {
                onSuccess: () => {
                    handleClearSelection();
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Staff Deleted', 'Selected staff members have been removed.');
                },
                onError: () => {
                    setProcessingDelete(false);
                    Notify.error('Action Failed', 'Could not delete staff members.');
                }
            });
        } else {
            router.delete(route("admin.users.destroy", deleteModal.user.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.user.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Staff Deleted', 'Staff member account has been deleted.');
                },
                onError: () => {
                    setProcessingDelete(false);
                    Notify.error('Action Failed', 'Could not delete staff member.');
                }
            });
        }
    };

    const handleMarkAsStatus = (value) => {
        // Submit status update for selected users (if they are not protected)
        router.post(route("admin.users.bulk-update-status"), {
            ids: selectedIds,
            status: value
        }, {
            onSuccess: () => {
                handleClearSelection();
                Notify.success('Status Updated', 'Selected staff members status has been updated.');
            },
            onError: () => Notify.error('Action Failed', 'Could not update status.')
        });
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayUsers = useMemo(() => {
        return {
            ...users,
            data: showOnlySelected
                ? users.data.filter(p => selectedIds.includes(p.id))
                : users.data
        };
    }, [users, showOnlySelected, selectedIds]);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Staff & User Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Staff Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Configure administrator credentials and granular Spatie role mappings</p>
                </div>
                <Link
                    href={route('admin.users.create')}
                    prefetch
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                    <Plus size={14} /> Add Staff Member
                </Link>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {/* Stats Overview */}
                <UserStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Search, Bulk Actions, and Filters */}
                <UserToolbar
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
                    roles={roles}
                    handleBulkDeleteClick={handleBulkDeleteClick}
                    handleSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    handleMarkAsStatus={handleMarkAsStatus}
                />

                {/* Main Data Table */}
                <UserTable
                    users={displayUsers}
                    filters={filters}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    activeTab={activeTab}
                    stats={stats}
                    visibleColumns={visibleColumns}
                    auth={auth}
                />

                {/* Pagination Controls */}
                <UserPagination
                    users={users}
                    filters={filters}
                    total={stats ? (stats[activeTab === 'all' ? 'all' : activeTab] ?? stats.all ?? 0) : 0}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* Premium Delete Confirmation Modal */}
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
};

export default UserListPage;
