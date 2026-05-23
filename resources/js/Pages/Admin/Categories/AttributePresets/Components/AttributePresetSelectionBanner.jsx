import React from 'react';
import { Check } from 'lucide-react';

const AttributePresetSelectionBanner = ({ 
    selectedIds, 
    perPageCount, 
    handleClearSelection 
}) => {
    const isAllPageSelected = selectedIds.length === perPageCount && perPageCount > 0;

    if (!isAllPageSelected && selectedIds.length === 0) return null;

    return (
        <div className="bg-[#f4f6f8] border-b border-[#ebebeb] py-2 px-4 flex items-center justify-center animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2 text-[12px] text-[#202223]">
                <div className="w-5 h-5 bg-[#008060] rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" strokeWidth={3} />
                </div>
                <p className="font-medium">
                    <span className="font-bold">{selectedIds.length}</span> items selected on this page.
                    <button 
                        onClick={handleClearSelection}
                        className="ml-3 font-bold text-[#008060] hover:underline decoration-2 underline-offset-2 uppercase text-[10px] tracking-wider"
                    >
                        Clear Selection
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AttributePresetSelectionBanner;
