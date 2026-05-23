import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const SelectionBanner = ({ 
    selectedIds, 
    totalCount, 
    perPageCount, 
    selectAllAcrossPages, 
    handleSelectAllAcrossPages, 
    handleClearSelection 
}) => {
    const isAllPageSelected = selectedIds.length === perPageCount && perPageCount > 0;

    if (!selectAllAcrossPages && !isAllPageSelected) return null;

    return (
        <div className="bg-[#f4f6f8] border-b border-[#ebebeb] py-2 px-4 flex items-center justify-center animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-3 text-[13px] text-[#202223]">
                <div className="w-5 h-5 bg-[#e4f1ef] rounded-full flex items-center justify-center border border-[#d1e9e5]">
                    <Check size={12} className="text-[#008060] stroke-[3]" />
                </div>
                <div className="flex items-center gap-1.5">
                    {!selectAllAcrossPages ? (
                        <>
                            <span>All <span className="font-bold">{selectedIds.length}</span> items on this page are selected.</span>
                            {totalCount > perPageCount && (
                                <button 
                                    onClick={handleSelectAllAcrossPages}
                                    className="ml-1 font-bold text-[#008060] hover:underline decoration-1 underline-offset-4"
                                >
                                    Select all {totalCount} products
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <span>All <span className="font-bold text-[#008060]">{totalCount}</span> products in your database are selected.</span>
                            <button 
                                onClick={handleClearSelection}
                                className="ml-2 font-bold text-[#6d7175] hover:text-[#202223] underline decoration-1 underline-offset-4"
                            >
                                Clear selection
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectionBanner;
