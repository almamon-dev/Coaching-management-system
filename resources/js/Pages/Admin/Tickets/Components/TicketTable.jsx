import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Search, UserPlus, ArrowRight } from 'lucide-react';
import StatusDropdown from '@/Components/StatusDropdown';

const TicketTable = ({ tickets, visibleColumns = [] }) => {
    // Priority badges colors matching the sharp bento tag fill
    const getPriorityBadgeClass = (level) => {
        switch (level) {
            case "urgent":
                return "bg-rose-50 text-rose-700 border-rose-100";
            case "high":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "medium":
                return "bg-sky-50 text-sky-700 border-sky-100";
            case "low":
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    // Category icons mapping
    const getCategoryIcon = (cat) => {
        switch (cat) {
            case "Refund":
                return "💸";
            case "Order Issue":
                return "📦";
            case "Technical":
                return "💻";
            default:
                return "🎫";
        }
    };

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        {visibleColumns.includes('ticket_id') && <th className="px-6 py-2.5 w-[100px]">Ticket ID</th>}
                        {visibleColumns.includes('customer') && <th className="px-6 py-2.5 w-[200px]">Customer</th>}
                        {visibleColumns.includes('subject') && <th className="px-6 py-2.5 w-[260px]">Issue Details</th>}
                        {visibleColumns.includes('priority') && <th className="px-6 py-2.5 text-center w-[100px]">Urgency</th>}
                        {visibleColumns.includes('status') && <th className="px-6 py-2.5 text-center w-[130px]">Status</th>}
                        {visibleColumns.includes('agent') && <th className="px-6 py-2.5 w-[160px]">Assigned Agent</th>}
                        {visibleColumns.includes('last_activity') && <th className="px-6 py-2.5 w-[150px]">Last Activity</th>}
                        <th className="px-6 py-2.5 text-right w-[100px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] bg-white">
                    {tickets.data?.length > 0 ? (
                        tickets.data.map((ticket) => (
                            <tr key={ticket.id} className="group transition-colors hover:bg-[#f6f6f7]">
                                {/* Ticket ID */}
                                {visibleColumns.includes('ticket_id') && (
                                    <td className="px-6 py-3.5 whitespace-nowrap">
                                        <Link 
                                            href={route("admin.tickets.show", ticket.id)}
                                            className="text-[12.5px] font-bold text-[#008060] hover:underline"
                                        >
                                            #{ticket.ticket_id}
                                        </Link>
                                    </td>
                                )}

                                {/* Customer */}
                                {visibleColumns.includes('customer') && (
                                    <td className="px-6 py-3.5">
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[12.5px] font-bold text-[#202223] truncate">{ticket.customer?.name}</span>
                                            <span className="text-[10px] text-[#6d7175] font-medium leading-none mt-0.5 truncate">{ticket.customer?.email}</span>
                                        </div>
                                    </td>
                                )}

                                {/* Issue details */}
                                {visibleColumns.includes('subject') && (
                                    <td className="px-6 py-3.5">
                                        <div className="flex flex-col max-w-[280px]">
                                            <span className="text-[12.5px] font-bold text-[#202223] truncate group-hover:text-[#008060] transition-colors leading-tight">
                                                {ticket.subject}
                                            </span>
                                            <span className="text-[10px] text-[#6d7175] font-bold tracking-tight mt-1 flex items-center gap-1 leading-none">
                                                <span>{getCategoryIcon(ticket.category)}</span>
                                                {ticket.category}
                                            </span>
                                        </div>
                                    </td>
                                )}

                                {/* Urgency Priority */}
                                {visibleColumns.includes('priority') && (
                                    <td className="px-6 py-3.5 text-center whitespace-nowrap">
                                        <span className={`px-2 py-0.5 border rounded-[2px] text-[10px] font-bold uppercase tracking-tight ${getPriorityBadgeClass(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                )}

                                {/* Status - Interactive Live StatusDropdown */}
                                {visibleColumns.includes('status') && (
                                    <td className="px-6 py-3.5 text-center whitespace-nowrap">
                                        <StatusDropdown
                                            value={ticket.status}
                                            options={[
                                                { label: 'Open', value: 'open', color: 'text-blue-700', dot: 'bg-blue-600', bg: 'bg-blue-50 border border-blue-150' },
                                                { label: 'In Progress', value: 'in_progress', color: 'text-yellow-800', dot: 'bg-yellow-600', bg: 'bg-yellow-50 border border-yellow-150' },
                                                { label: 'Resolved', value: 'resolved', color: 'text-emerald-700', dot: 'bg-emerald-600', bg: 'bg-emerald-50 border border-emerald-150' },
                                                { label: 'Closed', value: 'closed', color: 'text-slate-500', dot: 'bg-slate-500', bg: 'bg-slate-100 border border-slate-200' }
                                            ]}
                                            onChange={(newStatus) => {
                                                router.patch(route('admin.tickets.status', ticket.id), {
                                                    status: newStatus
                                                }, { preserveScroll: true });
                                            }}
                                        />
                                    </td>
                                )}

                                {/* Assigned Agent */}
                                {visibleColumns.includes('agent') && (
                                    <td className="px-6 py-3.5 whitespace-nowrap">
                                        {ticket.assignee ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5.5 h-5.5 rounded-[1px] bg-slate-50 flex items-center justify-center text-[10px] font-bold text-[#008060] uppercase border border-slate-200">
                                                    {ticket.assignee.name.charAt(0)}
                                                </div>
                                                <span className="text-[12.5px] font-bold text-[#202223]">{ticket.assignee.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-[#6d7175] font-bold flex items-center gap-1">
                                                <UserPlus size={11} className="text-slate-400" />
                                                Unassigned
                                            </span>
                                        )}
                                    </td>
                                )}

                                {/* Last Activity */}
                                {visibleColumns.includes('last_activity') && (
                                    <td className="px-6 py-3.5 whitespace-nowrap text-[#6d7175] text-[11px]">
                                        {new Date(ticket.updated_at).toLocaleDateString(undefined, { 
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                )}

                                {/* Action */}
                                <td className="px-6 py-3.5 whitespace-nowrap text-right">
                                    <Link 
                                        href={route("admin.tickets.show", ticket.id)}
                                        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-[3px] text-[12px] font-bold text-[#6d7175] hover:text-[#008060] hover:border-[#008060] transition-all shadow-sm"
                                    >
                                        Respond
                                        <ArrowRight size={11} />
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 1} className="px-7 py-24 text-center text-[#727586]">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-lg font-bold">No support tickets found</p>
                                <p className="text-sm">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TicketTable;
