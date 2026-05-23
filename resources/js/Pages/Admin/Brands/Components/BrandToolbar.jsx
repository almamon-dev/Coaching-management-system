import React, { useState } from 'react';
import { Search, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { cn } from '@/lib/utils';
import BrandBulkActionBar from './BrandBulkActionBar';
import BrandColumnManager from './BrandColumnManager';

const BrandToolbar = ({
    search,
    setSearch,
    filters,
    handleFilterChange,
    handleReset,
    selectedIds,
    selectAllAcrossPages,
    totalCount,
    perPageCount,
    handleClearSelection,
    handleBulkDeleteClick,
    handleSelectAllAcrossPages,
    showOnlySelected,
    setShowOnlySelected,
    allColumns,
    visibleColumns,
    toggleColumn,
    handleMarkAsStatus
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const activeFilterCount = [
        filters?.status && filters.status !== 'all',
        filters?.has_logo && filters.has_logo !== 'all',
        filters?.is_featured && filters.is_featured !== 'all',
    ].filter(Boolean).length;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {/* Bulk Action Bar Overlay (Floating Design) */}
            {selectedIds.length > 0 && (
                <BrandBulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    selectAllAcrossPages={selectAllAcrossPages}
                    onClear={handleClearSelection}
                    onBulkDelete={handleBulkDeleteClick}
                    onSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    onBulkStatusUpdate={handleMarkAsStatus}
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
                        placeholder="Search brands..."
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* --- Filters Group --- */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                    <div className="flex items-center gap-2">
                        {/* Filters Toggle */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={cn(
                                "h-[36px] px-3 rounded-[4px] border text-[12px] font-bold flex items-center gap-1.5 transition-all",
                                showAdvanced || activeFilterCount > 0
                                    ? "bg-[#f1f1f1] border-[#d1d1d1] text-[#202223] shadow-sm"
                                    : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7] shadow-sm"
                            )}
                        >
                            <SlidersHorizontal size={14} className="text-[#6d7175]" />
                            More Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-[#ebebeb] text-[#202223] w-4 h-4 text-[10px] rounded-full flex items-center justify-center ml-1 font-bold border border-[#d1d1d1]">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {/* Reset Button */}
                        <button
                            onClick={handleReset}
                            className="h-[36px] w-[36px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[4px] hover:bg-[#f6f6f7] transition-all group shadow-sm"
                            title="Reset Filters"
                        >
                            <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                        </button>
                        {/* Column Management */}
                        <BrandColumnManager
                            columns={allColumns}
                            visibleColumns={visibleColumns}
                            toggleColumn={toggleColumn}
                        />
                    </div>
                </div>
            </div>

            {/* Advanced Filters Drawer */}
            {showAdvanced && (
                <div className="px-3 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in slide-in-from-top-1 duration-150 border-t border-[#ebebeb] bg-[#f9fafb]">
                    <div>
                        <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 block uppercase tracking-wider">Status</label>
                        <SelectInput
                            value={filters?.status || 'all'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Status' },
                                { id: 'active', name: 'Active' },
                                { id: 'inactive', name: 'Inactive' }
                            ]}
                            className="bg-white shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 block uppercase tracking-wider">Logo</label>
                        <SelectInput
                            value={filters?.has_logo || 'all'}
                            onChange={(e) => handleFilterChange('has_logo', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Brands' },
                                { id: '1', name: 'With Logo' },
                                { id: '0', name: 'No Logo' }
                            ]}
                            className="bg-white shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 block uppercase tracking-wider">Placement</label>
                        <SelectInput
                            value={filters?.is_featured || 'all'}
                            onChange={(e) => handleFilterChange('is_featured', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Brands' },
                                { id: '1', name: 'Featured' },
                                { id: '0', name: 'Standard' }
                            ]}
                            className="bg-white shadow-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandToolbar;
