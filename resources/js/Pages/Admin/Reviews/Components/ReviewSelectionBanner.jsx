import React from 'react';
import { Trash2, X } from 'lucide-react';
import { router } from '@inertiajs/react';

const ReviewSelectionBanner = ({ selectedCount, onClear, onBulkDelete }) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#081621] text-white px-6 py-3.5 rounded-[2px] shadow-2xl flex items-center gap-8 border border-white/10 min-w-[400px]">
                <div className="flex items-center gap-3 border-r border-white/20 pr-8">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#ef4a23] text-white text-[11px] font-black rounded-full">
                        {selectedCount}
                    </span>
                    <span className="text-[13px] font-bold tracking-wide uppercase">Reviews Selected</span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onBulkDelete}
                        className="flex items-center gap-2 text-[12px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
                    >
                        <Trash2 size={16} />
                        Delete All
                    </button>
                    
                    <button
                        onClick={onClear}
                        className="flex items-center gap-2 text-[12px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest border-l border-white/20 pl-4"
                    >
                        <X size={16} />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewSelectionBanner;
