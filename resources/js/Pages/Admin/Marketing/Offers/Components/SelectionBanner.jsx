import React from 'react';
import { Check } from 'lucide-react';

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
        <div className="bg-[#fff9f0] border-b border-[#ffe9cc] py-2.5 px-4 flex items-center justify-center animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex items-center gap-2 text-[13px] text-[#8c6d1f]">
                <div className="w-5 h-5 bg-[#8c6d1f]/10 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-[#8c6d1f]" />
                </div>
                <div className="flex items-center">
                    {!selectAllAcrossPages ? (
                        <>
                            <span>All <span className="font-bold">{selectedIds.length}</span> items on this page are selected.</span>
                            {totalCount > perPageCount && (
                                <button 
                                    onClick={handleSelectAllAcrossPages}
                                    className="ml-2 font-bold text-[#008060] hover:underline decoration-2 underline-offset-2"
                                >
                                    Select all {totalCount} Offers
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <span>All <span className="font-bold text-[#008060]">{totalCount}</span> offers in your database are selected.</span>
                            <button 
                                onClick={handleClearSelection}
                                className="ml-2 font-bold text-[#8c6d1f] underline hover:text-[#5c4a14] decoration-2 underline-offset-2"
                            >
                                Clear Selection
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectionBanner;
