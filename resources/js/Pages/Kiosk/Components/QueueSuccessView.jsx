import React from 'react';
import { CheckCircle, MapPin, Printer } from 'lucide-react';

const QueueSuccessView = ({ ticketDetails, countdown, handleGoHome }) => {
    return (
        <div className="w-full max-w-md mx-auto space-y-6 text-center bg-white border border-[#ebebeb] p-5 sm:p-8 rounded-[6px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] relative animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#e4f1ef] text-[#008060] flex items-center justify-center mx-auto mb-1 animate-bounce border border-[#b3e0d5]">
                <CheckCircle size={32} />
            </div>

            <div className="space-y-1">
                <h2 className="text-[13px] font-bold text-[#008060] tracking-wider">Welcome, {ticketDetails.customer_name}</h2>
                <p className="text-[12.5px] text-[#6d7175]">Your Walk-in Queue support token has been generated!</p>
            </div>

            {/* Thermal style ticket card */}
            <div className="bg-[#f4f6f8] border border-[#ebebeb] p-4 sm:p-6 rounded-[6px] space-y-4 shadow-inner relative overflow-hidden">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-[#008060]">Queue Token Number</span>
                    <div className="text-[44px] sm:text-[52px] font-black tracking-tight leading-none text-[#202223]">{ticketDetails.token_number}</div>
                </div>

                <div className="border-t border-[#ebebeb] pt-4 flex items-center justify-center gap-2.5">
                    <MapPin size={20} className="text-[#008060]" />
                    <div className="text-left">
                        <span className="text-[9px] font-bold text-[#6d7175] block">Please Proceed To</span>
                        <span className="text-[18px] font-black text-[#008060] leading-tight">{ticketDetails.counter_name}</span>
                    </div>
                </div>

                {ticketDetails.brand && (
                    <div className="border-t border-[#ebebeb] pt-3 text-[12px] text-[#6d7175]">
                        Device: <span className="font-bold text-[#202223]">{ticketDetails.brand} {ticketDetails.model_name}</span>
                    </div>
                )}
            </div>

            <div className="p-3.5 bg-[#f4f6f8] border border-[#ebebeb] rounded-[6px] text-[#6d7175] text-[12.5px] leading-relaxed">
                Please walk over to <span className="font-extrabold text-[#008060]">{ticketDetails.counter_name}</span> now. The counter technician has received your ticket and is waiting.
            </div>

            <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-white hover:bg-[#f4f6f8] border border-[#babfc3] text-[13px] font-bold text-[#202223] rounded-[6px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm"
            >
                <Printer size={15} />
                Print Token Receipt (Thermal)
            </button>

            <div className="pt-1 text-[11px] text-[#6d7175] flex items-center justify-center gap-2">
                <span>Resets in {countdown}s</span>
                <button
                    onClick={handleGoHome}
                    className="text-[#008060] hover:text-[#006e52] font-bold underline"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default QueueSuccessView;
