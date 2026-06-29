import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Headset, Plus } from 'lucide-react';

// Custom Hooks
import { useTicketList } from './Hooks/useTicketList';

// Partials
import TicketListStats from './Partials/TicketListStats';
import TicketListTable from './Partials/TicketListTable';

/**
 * Page Component: TicketListPage
 * 
 * Orchestrates the main listing grid for customer support tickets.
 * Leverages separation of concerns by delegating operations to useTicketList hook 
 * and specific UI subcomponents in the Partials subfolder.
 */
const TicketListPage = ({ auth, tickets, stats }) => {
    const {
        getPriorityBadgeClass,
        getStatusBadgeClass,
        formatTicketDate
    } = useTicketList();

    return (
        <UserLayout user={auth?.user}>
            <Head title="My Support Tickets" />

            <div className="space-y-6">
                {/* --- Page Header Section --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                            <Headset className="text-[#008060]" size={22} />
                            Support Tickets
                        </h1>
                        <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">
                            Need help? Track your tickets or open a new support request below.
                        </p>
                    </div>
                    <Link
                        href={route('dashboard.tickets.create')}
                        className="h-[38px] px-5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0 active:scale-95"
                    >
                        <Plus size={15} />
                        Open New Ticket
                    </Link>
                </div>

                {/* --- Stats Cards Grid --- */}
                <TicketListStats stats={stats} />

                {/* --- Tickets Grid Table --- */}
                <TicketListTable
                    tickets={tickets}
                    getPriorityBadgeClass={getPriorityBadgeClass}
                    getStatusBadgeClass={getStatusBadgeClass}
                    formatTicketDate={formatTicketDate}
                />
            </div>
        </UserLayout>
    );
};

export default TicketListPage;
