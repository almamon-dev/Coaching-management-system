import React from 'react';
import { Search } from 'lucide-react';
import TextInput from '@/Components/TextInput';

const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-100';
        case 'diagnosing': return 'bg-sky-50 text-sky-700 border border-sky-100';
        case 'repairing': return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
        case 'ready': return 'bg-[#e4f1ef] text-[#008060] border border-[#b3e0d5]';
        case 'delivered': return 'bg-slate-100 text-slate-700 border border-slate-200';
        case 'cancelled': return 'bg-rose-50 text-rose-700 border border-rose-100';
        default: return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
};

const StatusCheckerView = ({
    searchQuery,
    setSearchQuery,
    foundTickets,
    searching,
    error,
    handleSubmit
}) => {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 bg-white border border-[#ebebeb] p-5 sm:p-8 rounded-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] animate-in fade-in duration-150">
            <div className="text-center space-y-2">
                <h2 className="text-[22px] font-extrabold text-[#202223]">Check Live Ticket Status</h2>
                <p className="text-[#6d7175] text-[13px]">Enter your Ticket Number (REP-XXXX-XXXX) or registered Phone Number.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Search size={15} /></span>
                    <TextInput
                        type="text"
                        placeholder="REP-XXXX-XXXX or Phone Number..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 w-full text-[13.5px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 shadow-none"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={searching}
                    className="h-10 sm:h-auto px-5 bg-[#008060] hover:bg-[#006e52] text-white rounded-[6px] font-bold text-[13.5px] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {searching ? 'Checking...' : 'Check'}
                </button>
            </form>

            {error && <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-[6px] text-[12.5px] text-center font-bold">{error}</div>}

            {foundTickets.length > 0 && (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    <h3 className="text-[12px] font-bold text-[#6d7175] tracking-wider text-left">Search Results ({foundTickets.length})</h3>
                    <div className="space-y-2.5">
                        {foundTickets.map(ticket => (
                            <div key={ticket.id} className="bg-white border border-[#ebebeb] p-4 rounded-[6px] flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-left">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-[#202223] text-[14px]">{ticket.ticket_number}</span>
                                        {ticket.token_number && <span className="bg-[#f4f6f8] border border-[#ebebeb] text-[10px] text-[#6d7175] font-bold px-2 py-0.5 rounded-[4px]">Token: {ticket.token_number}</span>}
                                    </div>
                                    <div className="text-[12.5px] text-[#6d7175] mt-1">
                                        Device: <span className="font-semibold text-[#202223]">{ticket.brand ? `${ticket.brand} ${ticket.model_name}` : 'Unregistered'}</span>
                                    </div>
                                    {ticket.counter_name && (
                                        <div className="text-[11.5px] text-[#008060] font-semibold mt-0.5">
                                            Assigned Desk: {ticket.counter_name}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between gap-2.5">
                                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-[6px] ${getStatusBadge(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-[13.5px] font-black text-[#202223]">
                                        ৳ {Number(ticket.total_cost || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusCheckerView;
