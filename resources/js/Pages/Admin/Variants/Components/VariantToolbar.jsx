import React, { useState } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import TextInput from "@/Components/TextInput";
import VariantBulkActionBar from './VariantBulkActionBar';
import ColumnManager from '../../Categories/Components/ColumnManager';

const VariantToolbar = ({
    search, setSearch,
    selectedIds, selectAllAcrossPages,
    totalCount, perPageCount, handleClearSelection,
    handleBulkDeleteClick, handleSelectAllAcrossPages,
    showOnlySelected, setShowOnlySelected,
    allColumns, visibleColumns, toggleColumn,
    handleMarkAsStatus, handleReset
}) => {
    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {selectedIds.length > 0 && (
                <VariantBulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    selectAllAcrossPages={selectAllAcrossPages}
                    onClear={handleClearSelection}
                    onBulkDelete={handleBulkDeleteClick}
                    onSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    onMarkAsStatus={handleMarkAsStatus}
                />
            )}

            <div className={cn(
                "p-3 flex items-center justify-between gap-4 transition-opacity duration-200",
                selectedIds.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                {/* Search Box */}
                <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search variants..."
                        className="pl-9 pr-9 w-full"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-1 justify-end">
                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="h-[36px] w-[36px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[4px] hover:bg-[#f6f6f7] transition-all group shadow-sm"
                        title="Reset Search"
                    >
                        <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    </button>
                    {/* Column Management */}
                    <ColumnManager
                        columns={allColumns}
                        visibleColumns={visibleColumns}
                        toggleColumn={toggleColumn}
                    />
                </div>
            </div>
        </div>
    );
};

export default VariantToolbar;
