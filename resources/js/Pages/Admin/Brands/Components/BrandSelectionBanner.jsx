import React from 'react';
import { Check } from 'lucide-react';

const BrandSelectionBanner = ({ 
    selectedIds = [], 
    totalCount = 0, 
    perPageCount = 0, 
    selectAllAcrossPages = false, 
    handleSelectAllAcrossPages = () => {}, 
    handleClearSelection = () => {} 
}) => {
    const isAllPageSelected = selectedIds?.length === perPageCount && perPageCount > 0;

    if (!selectAllAcrossPages && !isAllPageSelected) return null;

    return (
        <div className="bg-[#e4f1ef] border-b border-[#aee9d1] py-2.5 px-4 flex items-center justify-center animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex items-center gap-2 text-[13px] text-[#008060]">
                <div className="w-5 h-5 bg-white/70 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-[#008060]" />
                </div>
                <p>
                    {!selectAllAcrossPages ? (
                        <>
                            All <span className="font-bold">{selectedIds?.length || 0}</span> items on this page are selected.
                            {totalCount > perPageCount && (
                                <button 
                                    onClick={handleSelectAllAcrossPages}
                                    className="ml-2 font-bold text-[#008060] hover:underline decoration-2 underline-offset-2"
                                >
                                    Select all {totalCount} Brands
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            All <span className="font-bold text-[#008060]">{totalCount}</span> brands in your database are selected.
                            <button 
                                onClick={handleClearSelection}
                                className="ml-2 font-bold text-[#008060] underline hover:text-[#006e52] decoration-2 underline-offset-2"
                            >
                                Clear Selection
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default BrandSelectionBanner;
