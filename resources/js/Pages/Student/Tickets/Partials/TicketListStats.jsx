import React from 'react';
import { MessageSquare, Clock, CheckCircle, ShieldAlert } from 'lucide-react';

/**
 * Component: TicketListStats
 * 
 * High-density dashboard stats cards displaying overall support queue metrics.
 */
export default function TicketListStats({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* All Tickets */}
            <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex items-center gap-4 group transition-all hover:border-[#008060]/30">
                <div className="w-12 h-12 bg-slate-50 rounded-[3px] border border-[#ebebeb] flex items-center justify-center text-slate-400">
                    <MessageSquare size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold text-[#6d7175] uppercase block tracking-wider">Total Filed</span>
                    <span className="text-xl font-bold text-[#202223] tabular-nums mt-0.5 block">{stats.all}</span>
                </div>
            </div>

            {/* Open Tickets */}
            <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex items-center gap-4 group transition-all hover:border-[#008060]/30">
                <div className="w-12 h-12 bg-blue-50 rounded-[3px] border border-blue-100 flex items-center justify-center text-blue-500">
                    <Clock size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold text-[#6d7175] uppercase block tracking-wider">Active Queue</span>
                    <span className="text-xl font-bold text-blue-600 tabular-nums mt-0.5 block">{stats.open}</span>
                </div>
            </div>

            {/* Resolved Tickets */}
            <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex items-center gap-4 group transition-all hover:border-[#008060]/30">
                <div className="w-12 h-12 bg-emerald-50 rounded-[3px] border border-emerald-100 flex items-center justify-center text-emerald-500">
                    <CheckCircle size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold text-[#6d7175] uppercase block tracking-wider">Resolved</span>
                    <span className="text-xl font-bold text-emerald-600 tabular-nums mt-0.5 block">{stats.resolved}</span>
                </div>
            </div>

            {/* Closed Tickets */}
            <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex items-center gap-4 group transition-all hover:border-[#008060]/30">
                <div className="w-12 h-12 bg-slate-100 rounded-[3px] border border-[#ebebeb] flex items-center justify-center text-slate-500">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold text-[#6d7175] uppercase block tracking-wider">Closed</span>
                    <span className="text-xl font-bold text-[#202223] tabular-nums mt-0.5 block">{stats.closed}</span>
                </div>
            </div>
        </div>
    );
}
