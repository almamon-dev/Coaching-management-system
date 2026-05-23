import React, { useState, useEffect } from 'react';
import { Monitor, Clock, Users, ArrowRight, Play, RefreshCw } from 'lucide-react';
import axios from 'axios';

const QueueBoardView = () => {
    const [serving, setServing] = useState([]);
    const [waiting, setWaiting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchQueueState = async (showRefresher = false) => {
        if (showRefresher) setRefreshing(true);
        try {
            const response = await axios.get(route('kiosk.queue-state'));
            if (response.data.success) {
                setServing(response.data.serving);
                setWaiting(response.data.waiting);
            }
        } catch (err) {
            console.error('Error fetching live queue state:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Poll every 8 seconds for real-time live dashboard sync
    useEffect(() => {
        fetchQueueState();
        const interval = setInterval(() => {
            fetchQueueState();
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-[#ebebeb] p-5 rounded-[6px] shadow-sm gap-4">
                <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-[6px] bg-[#e4f1ef] text-[#008060] flex items-center justify-center border border-[#b3e0d5]">
                        <Monitor size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-[17px] font-black text-[#202223] leading-none">Live Counter Queue Board</h2>
                        <p className="text-[12px] text-[#6d7175] mt-1.5 font-medium">Real-time lobby servicing dashboard for walk-in repairs.</p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3.5 w-full sm:w-auto">
                    <button
                        onClick={() => fetchQueueState(true)}
                        disabled={refreshing}
                        className="h-[34px] px-3.5 bg-white border border-[#babfc3] text-[#202223] rounded-[6px] text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#f4f6f8] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Syncing...' : 'Sync Now'}
                    </button>
                    <div className="text-[12.5px] font-extrabold text-[#008060] bg-[#e4f1ef] px-3.5 py-1.5 rounded-[6px] border border-[#b3e0d5] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#008060] animate-ping"></span>
                        LIVE SCREEN
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="bg-white border border-[#ebebeb] p-24 text-center text-[#6d7175] text-[13px] rounded-[6px]">
                    Connecting to live service queue stream...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left & Middle Column: Counters (Serving Now) */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Play size={14} className="text-[#008060] fill-[#008060]" />
                            <h3 className="text-[12.5px] font-bold text-[#6d7175] tracking-wider">Now Serving</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {serving.map((desk) => {
                                const isIdle = desk.status === 'idle';
                                return (
                                    <div
                                        key={desk.counter}
                                        className={`bg-white border p-5 rounded-[6px] shadow-sm flex flex-col justify-between h-[180px] transition-all ${isIdle
                                                ? 'border-[#ebebeb] opacity-75'
                                                : 'border-[#b3e0d5] ring-2 ring-[#008060]/5'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12.5px] font-extrabold text-[#6d7175]">{desk.counter}</span>
                                            <span
                                                className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-[4px] border ${isIdle
                                                        ? 'bg-slate-50 text-slate-500 border-slate-200'
                                                        : 'bg-[#e4f1ef] text-[#008060] border-[#b3e0d5] animate-pulse'
                                                    }`}
                                            >
                                                {isIdle ? 'Idle' : 'Active'}
                                            </span>
                                        </div>

                                        <div className="space-y-1 text-left my-3">
                                            {isIdle ? (
                                                <>
                                                    <div className="text-[34px] font-black text-slate-300 tracking-tight">OPEN</div>
                                                    <p className="text-[11.5px] text-slate-400">Ready for walk-in client</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <div className="text-[42px] font-black text-[#202223] tracking-tight leading-none">
                                                            {desk.token}
                                                        </div>
                                                        {desk.ticket && (
                                                            <div className="text-[12.5px] font-extrabold text-[#6d7175] bg-[#f4f6f8] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                                                                {desk.ticket}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-[13.5px] font-extrabold text-[#008060] mt-2 truncate">
                                                        {desk.customer}
                                                    </div>
                                                    <p className="text-[11.5px] text-[#6d7175] truncate">
                                                        Device: <span className="font-semibold text-slate-800">{desk.device}</span>
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        <div className="border-t border-[#f4f6f8] pt-3 text-[11px] font-bold text-[#6d7175] text-left flex items-center justify-between">
                                            <span>Consultation Desk</span>
                                            {!isIdle && (
                                                <span className="flex items-center gap-1 text-[#008060]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#008060] animate-ping"></span>
                                                    Serving
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Waiting Queue (Upcoming Tokens) */}
                    <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-[#6d7175]" />
                                <h3 className="text-[12.5px] font-bold text-[#6d7175] tracking-wider">Waiting Queue</h3>
                            </div>
                            <span className="bg-[#f4f6f8] border border-[#ebebeb] text-[10.5px] text-[#6d7175] font-extrabold px-2 py-0.5 rounded-[4px]">
                                {waiting.length} waiting
                            </span>
                        </div>

                        <div className="bg-white border border-[#ebebeb] rounded-[6px] p-4 shadow-sm h-[380px] flex flex-col justify-between">
                            {waiting.length > 0 ? (
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-1.5">
                                            {waiting.slice(0, 12).map((ticket, index) => (
                                                <div
                                                    key={ticket.token}
                                                    className="bg-[#f6f6f7] border border-[#ebebeb] p-2 rounded-[4px] flex flex-col items-center justify-center text-center hover:border-[#babfc3] transition-colors relative"
                                                >
                                                    {/* Tiny index indicator in top left */}
                                                    <span className="absolute top-0.5 left-1 text-[7.5px] font-extrabold text-slate-400">
                                                        {index + 1}
                                                    </span>
                                                    <span className="font-extrabold text-slate-800 text-[12.5px] leading-none mt-1">
                                                        {ticket.token}
                                                    </span>
                                                    <span className="text-[8.5px] text-[#008060] font-black mt-1 truncate max-w-full">
                                                        {ticket.counter ? (ticket.counter.includes('Counter') ? ticket.counter.replace('Counter ', 'C') : ticket.counter) : 'Desk'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {waiting.length > 12 && (
                                        <div className="text-center text-[10px] text-[#6d7175] font-extrabold mt-2 py-1 bg-[#f4f6f8] border border-[#ebebeb] rounded-[4px] animate-pulse">
                                            + {waiting.length - 12} more waiting in queue
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center text-[#6d7175] p-6 space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-[#f4f6f8] flex items-center justify-center text-[#babfc3]">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[13px] text-[#202223]">Queue is Empty</h4>
                                        <p className="text-[11px] mt-0.5">All walked-in clients have been successfully served!</p>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-[#ebebeb] pt-3 mt-3 text-[10.5px] text-[#6d7175] font-medium leading-tight">
                                Please keep your ticket printed receipt ready and proceed to your counter desk when called.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueBoardView;
