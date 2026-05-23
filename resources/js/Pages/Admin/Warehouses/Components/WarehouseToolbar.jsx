import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import WarehouseBulkActionBar from './WarehouseBulkActionBar';
import WarehouseColumnManager from './WarehouseColumnManager';
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";

const WarehouseToolbar = ({
    search,
    setSearch,
    filters,
    handleFilterChange,
    handleReset,
    totalCount,
    perPageCount,
    selectedIds = [],
    handleClearSelection,
    handleBulkDeleteClick,
    showOnlySelected,
    setShowOnlySelected,
    allColumns,
    visibleColumns,
    toggleColumn
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const activeFilterCount = [
        filters?.status && filters.status !== 'all',
    ].filter(Boolean).length;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {/* Bulk Action Bar Overlay */}
            {selectedIds.length > 0 && (
                <WarehouseBulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    onClear={handleClearSelection}
                    onBulkDelete={handleBulkDeleteClick}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                />
            )}

            <div className={cn(
                "p-3 flex items-center justify-between gap-4 transition-opacity duration-200",
                selectedIds.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                {/* Search Box */}
                <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search warehouses..."
                        className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060]">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filters & Settings Group */}
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={cn(
                            "h-[32px] px-3 rounded-[3px] border text-[12px] font-bold flex items-center gap-1.5 transition-all",
                            showAdvanced || activeFilterCount > 0
                                ? "bg-[#e4f1ef] border-[#008060] text-[#008060]"
                                : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]"
                        )}
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#008060] text-white text-[10px] font-bold leading-none">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleReset}
                        className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group"
                        title="Reset Filters"
                    >
                        <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    </button>
                </div>
            </div>

            {/* Advanced Filters Drawer */}
            {showAdvanced && (
                <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 animate-in slide-in-from-top-1 duration-150 border-t border-[#ebebeb] pt-3 bg-[#f9fafb]">
                    <div>
                        <label className="text-[11px] font-bold text-[#6d7175] mb-1 block uppercase tracking-tight">Status</label>
                        <SelectInput
                            value={filters?.status || 'all'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Status' },
                                { id: 'active', name: 'Active' },
                                { id: 'inactive', name: 'Inactive' }
                            ]}
                            className="h-[32px] text-[12px] font-medium border-[#d1d1d1] rounded-[3px]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarehouseToolbar;
