import React from 'react';
import { Link } from '@inertiajs/react';
import { Headset, ArrowRight } from 'lucide-react';

/**
 * Component: TicketListTable
 * 
 * Renders the table grid listing of all customer support tickets, status/urgency pill labels, 
 * last-updated times, and multi-page pagination lists.
 */
export default function TicketListTable({
    tickets,
    getPriorityBadgeClass,
    getStatusBadgeClass,
    formatTicketDate
}) {
    return (
        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-[#f7f7f7] border-b border-[#ebebeb] text-[#303030] text-[12px] font-semibold">
                        <tr>
                            <th className="px-5 py-3.5">Ticket ID</th>
                            <th className="px-5 py-3.5">Category</th>
                            <th className="px-5 py-3.5">Subject</th>
                            <th className="px-5 py-3.5 text-center">Urgency</th>
                            <th className="px-5 py-3.5 text-center">Status</th>
                            <th className="px-5 py-3.5">Last Updated</th>
                            <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebebeb] bg-white text-[12.5px] font-medium text-[#202223]">
                        {tickets.data?.length > 0 ? (
                            tickets.data.map((ticket) => (
                                <tr key={ticket.id} className="group hover:bg-[#f6f6f7] transition-colors">
                                    {/* Ticket ID */}
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <Link
                                            href={route('dashboard.tickets.show', ticket.id)}
                                            className="font-bold text-[#008060] hover:underline"
                                        >
                                            #{ticket.ticket_id}
                                        </Link>
                                    </td>

                                    {/* Category */}
                                    <td className="px-5 py-4 whitespace-nowrap text-[#6d7175] font-bold">
                                        {ticket.category}
                                    </td>

                                    {/* Subject */}
                                    <td className="px-5 py-4 font-bold text-[#202223] max-w-[250px] truncate group-hover:text-[#008060] transition-colors leading-tight">
                                        {ticket.subject}
                                    </td>

                                    {/* Priority Badge */}
                                    <td className="px-5 py-4 text-center whitespace-nowrap">
                                        <span className={`px-2 py-0.5 border rounded-[2px] text-[10px] font-bold capitalize tracking-tight ${getPriorityBadgeClass(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="px-5 py-4 text-center whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold capitalize tracking-tight ${getStatusBadgeClass(ticket.status)}`}>
                                            {ticket.status.replace("_", " ")}
                                        </span>
                                    </td>

                                    {/* Last Updated */}
                                    <td className="px-5 py-4 whitespace-nowrap text-[#6d7175] text-[11px]">
                                        {formatTicketDate(ticket.updated_at)}
                                    </td>

                                    {/* Action View */}
                                    <td className="px-5 py-4 whitespace-nowrap text-right">
                                        <Link
                                            href={route('dashboard.tickets.show', ticket.id)}
                                            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-[3px] text-[12px] font-bold text-[#6d7175] hover:text-[#008060] hover:border-[#008060] transition-all shadow-sm active:scale-95"
                                        >
                                            Manage
                                            <ArrowRight size={11} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-7 py-24 text-center text-slate-400">
                                    <Headset size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                    <p className="text-sm font-bold text-[#202223]">No Support Tickets Yet</p>
                                    <p className="text-[12px] text-slate-400 mt-1">If you need help or have questions, create your first support ticket above.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {tickets.total > tickets.per_page && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#ebebeb] bg-[#f7f7f7]">
                    <span className="text-[11px] text-[#6d7175] font-bold">
                        Showing {tickets.from || 0} to {tickets.to || 0} of {tickets.total || 0} tickets
                    </span>
                    <div className="flex items-center gap-1.5">
                        {tickets.links?.map((link, i) => (
                            <Link
                                key={`pag-${i}`}
                                href={link.url || '#'}
                                preserveScroll
                                as="button"
                                disabled={!link.url || link.active}
                                className={`px-2.5 py-1 text-[11px] font-bold border rounded-[3px] transition-all ${
                                    link.active
                                        ? "bg-[#008060] border-[#008060] text-white"
                                        : "bg-white border-[#d1d1d1] text-[#6d7175] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
