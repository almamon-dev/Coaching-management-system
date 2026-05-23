import React from 'react';
import { Trash2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const PaymentCard = ({ card }) => {
    return (
        <div className="relative group flex flex-col">
            {/* Card Background (Ultra-Minimalist Matte Black) */}
            <div className={cn(
                "relative w-full h-48 rounded-[4px] p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all group-hover:scale-[1.02] group-hover:shadow-[#008060]/10",
                card.type === 'Visa' ? "bg-gradient-to-br from-[#1a1c22] to-[#0c0e12]" : "bg-gradient-to-br from-[#1a1c22] to-[#0c0e12]"
            )}>
                {/* Background Patterns (Subtle) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_100%)]"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col gap-4">
                        {/* Chip */}
                        <div className="w-10 h-7 rounded-[4px] bg-gradient-to-br from-yellow-200/80 via-yellow-400/50 to-yellow-600/80 border border-yellow-300/20 relative overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[1px] opacity-30">
                                {[...Array(9)].map((_, i) => <div key={i} className="border border-black/20"></div>)}
                            </div>
                        </div>
                        {/* Contactless Icon */}
                        <div className="flex gap-[2px] opacity-40">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-[1px] h-3 bg-white" style={{ height: `${6 + (i * 2)}px` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="text-right">
                        {card.type === 'Visa' ? (
                            <div className="flex flex-col items-end">
                                <span className="text-[18px] font-black italic tracking-tighter text-blue-400">VISA</span>
                                {card.is_default && <ShieldCheck size={14} className="text-[#008060] mt-2" />}
                            </div>
                        ) : (
                            <div className="flex flex-col items-end">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-[#EB001B] opacity-90"></div>
                                    <div className="w-6 h-6 rounded-full bg-[#F79E1B] opacity-90"></div>
                                </div>
                                <p className="text-[8px] font-bold text-white/40 tracking-wide mt-1">Mastercard</p>
                                {card.is_default && <ShieldCheck size={14} className="text-[#008060] mt-2" />}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <p className="text-[18px] font-bold font-mono text-white/90 drop-shadow-md">
                        {card.number}
                    </p>
                    <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-white/50">{card.type}</p>
                            <p className="text-[11px] font-bold text-white/80">{card.holder}</p>
                        </div>
                        <div className="text-right space-y-0.5">
                            <p className="text-[8px] font-bold text-white/30">Expires</p>
                            <p className="text-[11px] font-bold text-white/80">{card.expiry}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Overlay */}
            <div className="mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-[1px] border",
                        card.is_default ? "text-[#008060] border-[#008060]/20 bg-[#008060]/5" : "text-slate-400 border-slate-200"
                    )}>
                        {card.is_default ? 'Primary' : 'Secondary'}
                    </span>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-[10px] font-bold group/btn">
                    <Trash2 size={12} className="group-hover/btn:scale-110 transition-transform" /> Remove
                </button>
            </div>
        </div>
    );
};

export default PaymentCard;
