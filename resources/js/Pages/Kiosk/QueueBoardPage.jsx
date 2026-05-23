import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Clock, ArrowLeft, Smartphone, Wrench, ChevronRight, Play, Users } from 'lucide-react';
import axios from 'axios';

const QueueBoardPage = () => {
    const [serving, setServing] = useState([]);
    const [waiting, setWaiting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState(new Date());

    const fetchQueueState = async () => {
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
        }
    };

    useEffect(() => {
        fetchQueueState();
        const stateInterval = setInterval(fetchQueueState, 5000);
        const clockInterval = setInterval(() => setTime(new Date()), 1000);

        return () => {
            clearInterval(stateInterval);
            clearInterval(clockInterval);
        };
    }, []);

    const nextTicket = waiting.length > 0 ? waiting[0] : null;
    const hasWaiting = waiting.length > 0;

    return (
        <div className="min-h-screen bg-[#f6f6f7] text-[#202223] flex flex-col justify-between p-4 sm:p-8 select-none relative overflow-hidden font-sans">
            <Head title="Lobby Live Serving Board - Self-Service Shop Kiosk" />

            {/* --- Standard Kiosk Header (Full Width) --- */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebebeb] pb-4 relative z-10 w-full max-w-6xl mx-auto">
                <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://www.startech.com.bd/image/catalog/logo.png"
                            alt="Star Tech Logo"
                            className="h-8 sm:h-9 w-auto"
                        />
                        <div className="border-l border-[#ebebeb] pl-3.5">
                            <h1 className="text-[14px] sm:text-[15px] font-extrabold tracking-tight text-[#202223] leading-none">Service Hub</h1>
                            <p className="text-[#008060] text-[9px] sm:text-[9.5px] font-extrabold tracking-wider mt-1">Self-Service Touchscreen Kiosk</p>
                        </div>
                    </div>

                    {/* Time (visible on mobile in header bar) */}
                    <div className="sm:hidden text-[11px] text-[#6d7175] font-bold bg-white px-2.5 py-1 rounded-[6px] flex items-center gap-1 border border-[#ebebeb]">
                        <Clock size={12} className="text-[#008060]" />
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <Link
                        href="/kiosk"
                        className="h-[34px] sm:h-[36px] px-3.5 rounded-[6px] bg-white hover:bg-[#f4f6f8] border border-[#babfc3] text-[11.5px] sm:text-[12px] font-bold flex items-center gap-1.5 text-[#202223] transition-all active:scale-[0.98]"
                    >
                        <ArrowLeft size={13} />
                        Back to Kiosk
                    </Link>
                    <div className="hidden sm:flex text-[12px] text-[#6d7175] font-bold bg-white px-3 py-1.5 rounded-[6px] items-center gap-1.5 border border-[#ebebeb]">
                        <Clock size={13} className="text-[#008060]" />
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </header>

            {/* --- Main Workspace (Full-Width TV Display Grid) --- */}
            <main className="flex-1 flex items-center justify-center w-full relative z-10 py-6 sm:py-8">
                {loading ? (
                    <div className="w-full max-w-6xl bg-white border border-[#ebebeb] p-24 text-center text-[#6d7175] text-[13px] rounded-[6px] shadow-sm">
                        Syncing live lobby database...
                    </div>
                ) : (
                    <div className={hasWaiting ? "w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-left" : "w-full max-w-6xl mx-auto text-left"}>

                        {/* --- LEFT & CENTER COLUMN: Counter Desks (2/3 width or 100% full width) --- */}
                        <div className={hasWaiting ? "md:col-span-2 space-y-4 flex flex-col justify-between" : "w-full space-y-4 flex flex-col"}>
                            <div className="flex items-center gap-1.5 px-0.5">
                                <Play size={13} className="text-[#008060] fill-[#008060]" />
                                <h3 className="text-[11.5px] font-extrabold text-[#6d7175] tracking-wider">Active Counter Desks</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                                {serving.map((desk) => {
                                    const isIdle = desk.status === 'idle' || desk.token === 'FREE';
                                    return (
                                        <div
                                            key={desk.counter}
                                            className={`bg-white border p-6 rounded-[6px] shadow-xs flex flex-col justify-between transition-all ${isIdle
                                                    ? 'border-[#ebebeb] bg-[#f9fafb]'
                                                    : desk.status === 'pending'
                                                        ? 'border-amber-200 ring-2 ring-amber-500/5'
                                                        : 'border-[#b3e0d5] ring-2 ring-[#008060]/5'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[12px] font-black text-[#6d7175]">{desk.counter}</span>
                                                <span
                                                    className={`text-[8.5px] font-bold tracking-wider px-2 py-0.5 rounded-[4px] border ${isIdle
                                                            ? 'bg-slate-50 text-slate-400 border-slate-200/65'
                                                            : desk.status === 'pending'
                                                                ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'
                                                                : 'bg-[#e4f1ef] text-[#008060] border-[#b3e0d5] animate-pulse'
                                                        }`}
                                                >
                                                    {isIdle ? 'Idle' : (desk.status === 'pending' ? 'Calling' : 'Serving')}
                                                </span>
                                            </div>

                                            <div className="my-8 space-y-2">
                                                {isIdle ? (
                                                    <div className="space-y-1">
                                                        <div className="text-[36px] font-black text-slate-200 tracking-tight leading-none">OPEN</div>
                                                        <p className="text-[10.5px] text-slate-400">Ready for walk-in</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className={`text-[46px] font-black tracking-tight leading-none ${desk.status === 'pending' ? 'text-amber-500' : 'text-[#008060]'}`}>
                                                            {desk.token}
                                                        </div>
                                                        <div className="text-[9.5px] font-black text-[#6d7175] bg-[#f4f6f8] px-2 py-0.5 rounded-[4px] border border-[#ebebeb] inline-block">
                                                            {desk.ticket}
                                                        </div>
                                                        <div className="text-[13px] font-extrabold text-slate-800 truncate pt-1">
                                                            {desk.customer}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border-t border-[#f4f6f8] pt-3 text-[10px] font-bold text-[#6d7175] flex items-center justify-between">
                                                <span>Tech Desk</span>
                                                {!isIdle && (
                                                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${desk.status === 'pending' ? 'bg-amber-500' : 'bg-[#008060]'}`}></span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: Waiting List sidebar (1/3 width, conditionally rendered) --- */}
                        {hasWaiting && (
                            <div className="space-y-4 flex flex-col justify-between">
                                <div className="flex items-center gap-1.5 px-0.5">
                                    <Users size={13} className="text-[#6d7175]" />
                                    <h3 className="text-[11.5px] font-extrabold text-[#6d7175] tracking-wider">Lobby Queue Line</h3>
                                </div>

                                <div className="bg-white border border-[#ebebeb] rounded-[6px] p-5 shadow-xs flex flex-col h-full justify-between min-h-[360px] md:min-h-0 flex-1">

                                    {/* High UX Up Next Callout */}
                                    <div className="bg-[#e4f1ef]/40 border border-[#b3e0d5] p-3.5 rounded-[6px] text-left">
                                        <span className="text-[8.5px] font-extrabold text-[#008060] tracking-wider block mb-1">Up Next in Lobby</span>
                                        {nextTicket ? (
                                            <div className="flex items-center justify-between gap-2 mt-1.5">
                                                <div>
                                                    <div className="text-[24px] font-black text-slate-900 leading-none">{nextTicket.token}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 block truncate max-w-[120px]">{nextTicket.customer}</div>
                                                    <div className="text-[9.5px] font-black text-[#008060] mt-1.5 tracking-wide">
                                                        Go to: {nextTicket.counter || 'Service Desk'}
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-black bg-[#008060] text-white px-2 py-1 rounded-[4px] shrink-0 shadow-xs h-fit">
                                                    {nextTicket.ticket}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 text-[11px] font-semibold py-1.5">
                                                Lobby queue is clear
                                            </div>
                                        )}
                                    </div>

                                    {/* Compact Waiting Feed */}
                                    <div className="flex-1 my-3 overflow-hidden flex flex-col justify-between">
                                        <div className="flex justify-between items-center mb-2.5">
                                            <span className="text-[10px] font-extrabold text-[#6d7175] tracking-wider">Upcoming Line</span>
                                            <span className="text-[9.5px] font-extrabold text-[#008060] bg-[#e4f1ef] px-2 py-0.5 rounded-[4px] border border-[#b3e0d5]">
                                                {waiting.length - 1} waiting
                                            </span>
                                        </div>

                                        <div className="flex-1 overflow-y-auto pr-0.5 custom-scrollbar max-h-[220px] md:max-h-[280px]">
                                            {waiting.slice(1).length > 0 ? (
                                                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-1.5">
                                                    {waiting.slice(1, 13).map((ticket, index) => (
                                                        <div
                                                            key={ticket.token}
                                                            className="bg-[#f6f6f7] border border-[#ebebeb] p-2.5 rounded-[4px] flex flex-col items-center justify-center text-center hover:border-[#babfc3] transition-colors"
                                                        >
                                                            <span className="font-extrabold text-slate-800 text-[12.5px] leading-none">
                                                                {ticket.token}
                                                            </span>
                                                            <span className="text-[8.5px] text-[#008060] font-black mt-1.5 truncate max-w-full">
                                                                {ticket.counter ? (ticket.counter.includes('Counter') ? ticket.counter.replace('Counter ', 'C') : ticket.counter) : 'Desk'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center text-slate-400 text-[11px] font-semibold py-8">
                                                    No other waiting clients
                                                </div>
                                            )}
                                        </div>

                                        {waiting.length - 1 > 12 && (
                                            <div className="text-center text-[9px] text-[#6d7175] font-extrabold mt-2 py-1 bg-[#f4f6f8] border border-[#ebebeb] rounded-[4px] animate-pulse">
                                                + {waiting.length - 1 - 12} more waiting in lobby
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-[#f4f6f8] pt-3 text-[10px] text-[#6d7175] font-medium leading-tight text-center">
                                        Please proceed when your Counter is called.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- Standard Kiosk Footer (Full Width) --- */}
            <footer className="text-center text-[11.5px] text-[#6d7175] border-t border-[#ebebeb] pt-4 relative z-10 flex flex-col md:flex-row md:justify-between items-center gap-2 w-full max-w-6xl mx-auto">
                <p>© {new Date().getFullYear()} Star Tech Service Center. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[#008060] font-semibold"><Smartphone size={12} /> Fast Check-In</span>
                    <span className="flex items-center gap-1.5 text-[#008060] font-semibold"><Wrench size={12} /> Instant Diagnostics</span>
                </div>
            </footer>
        </div>
    );
};

export default QueueBoardPage;
