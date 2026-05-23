import React from 'react';
import { Search, RotateCcw, X } from 'lucide-react';
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import ColumnManager from "./ColumnManager";
import OfferBulkActionBar from "./OfferBulkActionBar";
import { cn } from '@/lib/utils';

const OfferToolbar = ({
    search,
    setSearch,
    filters,
    handleFilterChange,
    handleReset,
    allColumns,
    visibleColumns,
    toggleColumn,
    selectedIds,
    selectAllAcrossPages,
    totalCount,
    perPageCount,
    handleClearSelection,
    handleBulkDeleteClick,
    handleSelectAllAcrossPages,
    showOnlySelected,
    setShowOnlySelected,
    onMarkAsStatus
}) => {
    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {/* Bulk Action Bar Overlay (Floating Design) */}
            {selectedIds.length > 0 && (
                <OfferBulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    selectAllAcrossPages={selectAllAcrossPages}
                    onClear={handleClearSelection}
                    onBulkDelete={handleBulkDeleteClick}
                    onSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    onMarkAsStatus={onMarkAsStatus}
                />
            )}

            <div className={cn(
                "p-3 flex items-center justify-between gap-4 transition-opacity duration-200",
                selectedIds.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                {/* --- Search Box --- */}
                <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search offers..."
                        className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none"
                    />
                    {search && (
                        <button 
                            onClick={() => setSearch("")} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* --- Filters Group --- */}
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <div className="flex items-center gap-1.5">
                        {/* Store Type Filter */}
                        <SelectInput
                            value={filters?.store_type || 'all'}
                            onChange={(e) => handleFilterChange('store_type', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Locations' },
                                { id: 'Online', name: 'Online Only' },
                                { id: 'All Outlet', name: 'All Outlet' }
                            ]}
                            className="h-[32px] text-[12px] font-medium border-[#d1d1d1] rounded-[3px] w-[150px] shadow-none focus:border-[#008060] focus:ring-0"
                        />

                        {/* Status Filter */}
                        <SelectInput
                            value={filters?.status || 'all'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Status' },
                                { id: '1', name: 'Active' },
                                { id: '0', name: 'Inactive' }
                            ]}
                            className="h-[32px] text-[12px] font-medium border-[#d1d1d1] rounded-[3px] w-[130px] shadow-none focus:border-[#008060] focus:ring-0"
                        />

                        {/* Reset All Filters Button */}
                        <button 
                            onClick={handleReset} 
                            className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group shadow-none active:scale-95" 
                            title="Reset Filters"
                        >
                            <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                        </button>

                        <div className="w-[1px] h-4 bg-[#ebebeb] mx-1" />

                        {/* Column Management */}
                        <ColumnManager
                            columns={allColumns}
                            visibleColumns={visibleColumns}
                            toggleColumn={toggleColumn}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferToolbar;
