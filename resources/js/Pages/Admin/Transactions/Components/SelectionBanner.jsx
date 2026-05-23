import React from 'react';

/**
 * SelectionBanner Component
 * Shows an alert when all items across all pages are selected.
 */
const SelectionBanner = ({
    selectedCount = 0,
    totalCount = 0,
    selectAllAcrossPages = false,
    onClear,
    onSelectAll
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="bg-[#f4f6f8] border-b border-[#ebebeb] px-4 py-2 flex items-center justify-center gap-2">
            {selectAllAcrossPages ? (
                <div className="text-[13px] text-[#202223] font-medium">
                    All <span className="font-bold">{totalCount}</span> transactions are selected.
                    <button
                        onClick={onClear}
                        className="ml-2 text-[#008060] font-bold hover:underline"
                    >
                        Clear selection
                    </button>
                </div>
            ) : (
                <div className="text-[13px] text-[#202223] font-medium">
                    All <span className="font-bold">{selectedCount}</span> transactions on this page are selected.
                    {selectedCount < totalCount && (
                        <button
                            onClick={onSelectAll}
                            className="ml-2 text-[#008060] font-bold hover:underline"
                        >
                            Select all {totalCount} transactions
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectionBanner;
