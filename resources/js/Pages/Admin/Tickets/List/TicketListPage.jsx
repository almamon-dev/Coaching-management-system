import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Local Components
import TicketStats from '../Components/TicketStats';
import TicketToolbar from '../Components/TicketToolbar';
import TicketTable from '../Components/TicketTable';
import TicketPagination from '../Components/TicketPagination';

const TicketListPage = ({ auth, tickets, stats, filters }) => {
    // --- Column Visibility Management (Exactly like CategoryListPage) ---
    const allColumns = [
        { id: 'ticket_id', label: 'Ticket ID' },
        { id: 'customer', label: 'Customer' },
        { id: 'subject', label: 'Issue Details' },
        { id: 'priority', label: 'Urgency' },
        { id: 'status', label: 'Status' },
        { id: 'agent', label: 'Assigned Agent' },
        { id: 'last_activity', label: 'Last Activity' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'ticket_id', 'customer', 'subject', 'priority', 'status', 'agent', 'last_activity'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [isProcessing, setIsProcessing] = useState(false);

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

    // Debounced Search matching Category debouncer
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = filters?.search || "";
            if (search !== currentSearch) {
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.tickets.index'), newFilters, {
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
            open: { ...base, status: 'open' },
            in_progress: { ...base, status: 'in_progress' },
            resolved: { ...base, status: 'resolved' },
            closed: { ...base, status: 'closed' },
        };
        router.get(route('admin.tickets.index'), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.tickets.index'), {}, {
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

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Support Ticket Queue" />

            {/* Header Section (Exactly like CategoryListPage) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Support Tickets</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage customer service tickets and respond to purchase or technical issues.</p>
                </div>
            </div>

            {/* Main Shopify Card Wrapper (Exactly like CategoryListPage) */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {/* Stats Overview */}
                <TicketStats 
                    stats={stats} 
                    activeTab={activeTab} 
                    onTabChange={handleTabChange} 
                />

                {/* Search, Actions, and Filters */}
                <TicketToolbar 
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                />

                {/* Main Data Table */}
                <TicketTable 
                    tickets={tickets} 
                    visibleColumns={visibleColumns}
                />

                {/* Pagination Controls */}
                <TicketPagination 
                    tickets={tickets}
                    filters={filters}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>
        </AdminLayout>
    );
};

export default TicketListPage;
