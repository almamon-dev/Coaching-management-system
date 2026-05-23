import React from 'react';

/**
 * Component: TicketDetailsSidebar
 * 
 * Renders the right-side informational sidebar panel containing ticket urgency, 
 * category, assignment agents, and log timestamps in a super clean minimalist style.
 */
export default function TicketDetailsSidebar({
    ticket,
    getPriorityBadgeClass
}) {
    return (
        <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-5 space-y-4">
            
            {/* Minimalist Sidebar Title */}
            <div className="border-b border-slate-100 pb-3">
                <h3 className="text-[12px] font-bold text-slate-800">
                    Ticket Overview
                </h3>
            </div>

            {/* Sidebar Fields */}
            <div className="space-y-4 text-[12px] font-semibold">
                
                {/* Support Track ID */}
                <div>
                    <span className="text-slate-400 text-[11px] block">Support Track ID</span>
                    <span className="font-bold text-slate-800 mt-1 block">#{ticket.ticket_id}</span>
                </div>

                {/* Urgency */}
                <div>
                    <span className="text-slate-400 text-[11px] block">Urgency Priority</span>
                    <span className={`px-2 py-0.5 border rounded-[2px] text-[9.5px] font-bold capitalize tracking-tight mt-1.5 inline-block ${getPriorityBadgeClass(ticket.priority)}`}>
                        {ticket.priority}
                    </span>
                </div>

                {/* Category */}
                <div>
                    <span className="text-slate-400 text-[11px] block">Inquiry Category</span>
                    <span className="font-bold text-slate-800 mt-1 block">{ticket.category}</span>
                </div>

                {/* Assigned Support Agent */}
                <div>
                    <span className="text-slate-400 text-[11px] block">Assigned Agent</span>
                    {ticket.assignee ? (
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#e4f1ef] border border-[#d6ebe7] flex items-center justify-center text-[9px] font-bold text-[#008060] shrink-0 shadow-xs">
                                {ticket.assignee.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-800">{ticket.assignee.name}</span>
                        </div>
                    ) : (
                        <span className="text-slate-400 font-medium italic mt-1 block">Queue Hub (Pending Agent)</span>
                    )}
                </div>

                {/* Last Activity */}
                <div className="pt-3 border-t border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Last Activity</span>
                    <span className="text-slate-600 font-bold mt-1 block">
                        {new Date(ticket.updated_at).toLocaleString(undefined, { 
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                    </span>
                </div>

            </div>
        </div>
    );
}
