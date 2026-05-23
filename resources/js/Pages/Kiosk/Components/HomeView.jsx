import React from 'react';
import { Wrench, ShieldCheck, Search, Printer, Package, FileText, Monitor } from 'lucide-react';

const HomeView = ({ handleModeChange, activeServing = [] }) => {
    return (
        <div className="w-full max-w-4xl px-4 sm:px-0 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            <div className="text-center space-y-2 px-2">
                <h2 className="text-[24px] sm:text-[30px] font-black tracking-tight text-[#202223]">Self-Service Hub</h2>
                <p className="text-[#6d7175] text-[13px] sm:text-[14.5px] font-medium max-w-lg mx-auto">Tap any service below on the touchscreen to immediately check in, browse items, or query repair statuses.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {/* Card A: Quick Token */}
                <div
                    onClick={() => handleModeChange('token')}
                    className="bg-white border border-[#ebebeb] hover:border-[#008060] p-5 sm:p-6 rounded-[6px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group flex flex-col justify-between h-[155px] sm:h-[170px] shadow-sm"
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[#f4f6f8] text-[#6d7175] group-hover:bg-[#e4f1ef] group-hover:text-[#008060] flex items-center justify-center transition-all border border-[#ebebeb]">
                        <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <div>
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#202223]">Get Walk-in Token</h3>
                        <p className="text-[11px] sm:text-[12px] text-[#6d7175] mt-1 leading-tight">Get an instant queue ticket token and proceed to service desks.</p>
                    </div>
                </div>

                {/* Card B: Pre-register repair */}
                <div
                    onClick={() => handleModeChange('pre-register')}
                    className="bg-white border border-[#ebebeb] hover:border-[#008060] p-5 sm:p-6 rounded-[6px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group flex flex-col justify-between h-[155px] sm:h-[170px] shadow-sm"
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[#f4f6f8] text-[#6d7175] group-hover:bg-[#e4f1ef] group-hover:text-[#008060] flex items-center justify-center transition-all border border-[#ebebeb]">
                        <Wrench size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <div>
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#202223]">Pre-Register Repair</h3>
                        <p className="text-[11px] sm:text-[12px] text-[#6d7175] mt-1 leading-tight">Enter your device details beforehand to save consultation counter time.</p>
                    </div>
                </div>

                {/* Card C: Check Repair Status */}
                <div
                    onClick={() => handleModeChange('status')}
                    className="bg-white border border-[#ebebeb] hover:border-[#008060] p-5 sm:p-6 rounded-[6px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group flex flex-col justify-between h-[155px] sm:h-[170px] shadow-sm"
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[#f4f6f8] text-[#6d7175] group-hover:bg-[#e4f1ef] group-hover:text-[#008060] flex items-center justify-center transition-all border border-[#ebebeb]">
                        <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <div>
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#202223]">Check Repair Status</h3>
                        <p className="text-[11px] sm:text-[12px] text-[#6d7175] mt-1 leading-tight">Input ticket number or phone to view live engineering progress.</p>
                    </div>
                </div>

                {/* Card D: Warranty Check */}
                <div
                    onClick={() => handleModeChange('warranty')}
                    className="bg-white border border-[#ebebeb] hover:border-[#008060] p-5 sm:p-6 rounded-[6px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group flex flex-col justify-between h-[155px] sm:h-[170px] shadow-sm"
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[#f4f6f8] text-[#6d7175] group-hover:bg-[#e4f1ef] group-hover:text-[#008060] flex items-center justify-center transition-all border border-[#ebebeb]">
                        <ShieldCheck size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <div>
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#202223]">Check Device Warranty</h3>
                        <p className="text-[11px] sm:text-[12px] text-[#6d7175] mt-1 leading-tight">Check active coverage ends by typing your device serial number.</p>
                    </div>
                </div>

                {/* Card E: Browse Products */}
                <div
                    onClick={() => handleModeChange('products')}
                    className="bg-white border border-[#ebebeb] hover:border-[#008060] p-5 sm:p-6 rounded-[6px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group flex flex-col justify-between h-[155px] sm:h-[170px] shadow-sm"
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[#f4f6f8] text-[#6d7175] group-hover:bg-[#e4f1ef] group-hover:text-[#008060] flex items-center justify-center transition-all border border-[#ebebeb]">
                        <Package size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <div>
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#202223]">Explore Hot Products</h3>
                        <p className="text-[11px] sm:text-[12px] text-[#6d7175] mt-1 leading-tight">Browse active store arrivals, technical specifications, and current prices.</p>
                    </div>
                </div>

                {/* Card F: View/Print Invoices */}
                <div
                    onClick={() => handleModeChange('invoice')}
                    className="bg-white border border-[#ebebeb] hover:border-[#008060] p-5 sm:p-6 rounded-[6px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group flex flex-col justify-between h-[155px] sm:h-[170px] shadow-sm"
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-[#f4f6f8] text-[#6d7175] group-hover:bg-[#e4f1ef] group-hover:text-[#008060] flex items-center justify-center transition-all border border-[#ebebeb]">
                        <Printer size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <div>
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#202223]">View & Print Invoice</h3>
                        <p className="text-[11px] sm:text-[12px] text-[#6d7175] mt-1 leading-tight">Retrieve completed tickets to print A4 or thermal invoice receipts.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeView;
