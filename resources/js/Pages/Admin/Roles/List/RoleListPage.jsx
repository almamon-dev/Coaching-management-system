/**
 * RoleListPage Component
 * 
 * Main interface for managing user access control tiers.
 * Features search filtering, bulk actions, and clean stats cards.
 */
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus } from 'lucide-react';

// List Components
import RoleTable from './Components/RoleTable';
import RoleToolbar from './Components/RoleToolbar';
import RoleStats from './Components/RoleStats';
import RolePagination from './Components/RolePagination';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import TextInput from '@/Components/TextInput';

const RoleListPage = ({ auth, roles, filters, stats }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'role', label: 'Role Name' },
        { id: 'operators', label: 'Operators' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'created_at', label: 'Created Date' }
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'role', 'operators', 'permissions', 'created_at'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.tab || "all");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Dynamic Permission Modal State ---
    const [isPermModalOpen, setIsPermModalOpen] = useState(false);
    const [newPermName, setNewPermName] = useState("");
    const [isPermProcessing, setIsPermProcessing] = useState(false);

    const handleCreatePermission = (e) => {
        e.preventDefault();
        
        const cleaned = newPermName.trim();
        if (!cleaned) return;

        setIsPermProcessing(true);
        router.post(route("admin.permissions.store"), {
            name: cleaned
        }, {
            onSuccess: () => {
                setNewPermName("");
                setIsPermModalOpen(false);
                setIsPermProcessing(false);
            },
            onError: (errors) => {
                setIsPermProcessing(false);
                alert(errors.name || "Failed to create permissions.");
            }
        });
    };

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        router.get(route("admin.roles.index"), { ...filters, tab: tabKey, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        id: null,
        name: '',
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
        router.get(route("admin.roles.index"), { ...filters, [key]: value, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route("admin.roles.index"), {}, { 
            replace: true,
            preserveState: true,
            preserveScroll: true
        });
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0) {
            handleClearSelection();
        } else {
            // Do not select Super Admin for safety bulk deletion
            setSelectedIds(roles.data.filter(role => role.name !== 'Super Admin').map(role => role.id));
        }
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteModal({ show: true, id, name, isBulk: false });
    };

    const handleBulkDeleteClick = () => {
        setDeleteModal({
            show: true,
            id: null,
            name: `${selectedIds.length} roles`,
            isBulk: true
        });
    };

    const confirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.delete(route("admin.roles.bulk-destroy"), {
                data: {
                    ids: selectedIds,
                },
                onSuccess: () => {
                    setDeleteModal({ show: false, id: null, name: '', isBulk: false });
                    handleClearSelection();
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        } else {
            router.delete(route("admin.roles.destroy", deleteModal.id), {
                onSuccess: () => {
                    setDeleteModal({ show: false, id: null, name: '', isBulk: false });
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        }
    };

    return (
        <>
            <Head title="Roles & Permissions" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Roles & Permissions</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Define access control tiers and assign system capabilities for your staff</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPermModalOpen(true)}
                        className="h-[36px] px-4 bg-slate-100 border border-slate-200 text-slate-800 rounded-[4px] flex items-center gap-1.5 hover:bg-slate-200 active:scale-95 transition-all font-bold text-[12px] normal-case whitespace-nowrap"
                    >
                        <Plus size={14} /> Add Permission
                    </button>
                    <Link
                        href={route("admin.roles.create")}
                        prefetch
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] flex items-center gap-1.5 hover:bg-[#006e52] active:scale-95 transition-all font-bold text-[12px] shadow-sm shadow-[#008060]/10 normal-case whitespace-nowrap"
                    >
                        <Plus size={14} /> Add Role
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Stats Overview */}
                <RoleStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Search, Bulk Actions, and Filters */}
                <RoleToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    selectedIds={selectedIds}
                    totalCount={roles.total}
                    perPageCount={roles.data?.length}
                    handleClearSelection={handleClearSelection}
                    handleBulkDeleteClick={handleBulkDeleteClick}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                />

                {/* Main Data Table */}
                <RoleTable
                    roles={roles}
                    selectedIds={selectedIds}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                />

                {/* Pagination Controls */}
                <RolePagination
                    roles={roles}
                    filters={filters}
                    total={stats ? (stats[activeTab === 'operators' ? 'with_operators' : activeTab === 'empty' ? 'without_operators' : activeTab === 'permissions' ? 'with_permissions' : activeTab === 'no_permissions' ? 'without_permissions' : 'all'] ?? stats.all ?? 0) : 0}
                    handlePerPageChange={(e) => handleFilterChange('per_page', e.target.value)}
                    handlePageChange={(url) => url && router.get(url, {}, { preserveScroll: true, preserveState: true })}
                />
            </div>

            {/* Premium Delete Confirmation Modal */}
            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, id: null, name: '', isBulk: false })}
                onConfirm={confirmDelete}
                title={deleteModal.isBulk ? "Bulk Delete Roles" : "Delete Role"}
                message={deleteModal.isBulk
                    ? `Are you sure you want to delete ${deleteModal.name}? This will permanently remove them from the system.`
                    : `Are you sure you want to delete the "${deleteModal.name}" role? This action cannot be undone.`
                }
                processing={processingDelete}
            />

            {/* Premium Create Permission Modal */}
            {isPermModalOpen && (
                <div className="fixed inset-0 z-[1000] overflow-y-auto flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] w-full max-w-[420px] shadow-lg p-6 space-y-4">
                        <div>
                            <h3 className="text-[15px] font-bold text-slate-800">Add New System Permission</h3>
                            <p className="text-[12px] text-slate-550 mt-1">Specify one or more unique permission slugs (e.g. view-products or create-users). Separate multiple items with commas.</p>
                        </div>
                        <form onSubmit={handleCreatePermission} className="space-y-4">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Permission Name(s) *</label>
                                <TextInput
                                    type="text"
                                    placeholder="Type and separate multiple items with commas"
                                    value={newPermName}
                                    onChange={(e) => setNewPermName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPermModalOpen(false);
                                        setNewPermName("");
                                    }}
                                    className="px-3.5 py-1.5 border border-slate-200 rounded-[3px] font-bold text-[12px] text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPermProcessing || !newPermName.trim()}
                                    className="px-4 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white rounded-[3px] font-bold text-[12px] transition-colors disabled:opacity-50"
                                >
                                    {isPermProcessing ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

RoleListPage.layout = page => <AdminLayout user={page.props.auth.user} children={page} />

export default RoleListPage;
