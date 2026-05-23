import React, { useState } from 'react';
import { Search, RotateCcw, Trash2, X, SlidersHorizontal } from 'lucide-react';
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { cn } from '@/lib/utils';
import QuestionBulkActionBar from './QuestionBulkActionBar';
import ColumnManager from './ColumnManager';

const QuestionToolbar = ({
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
    handleBulkStatusUpdate
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const activeFilterCount = [
        filters?.status && filters.status !== 'all',
        filters?.date_range && filters.date_range !== 'all',
    ].filter(Boolean).length;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {/* Bulk Action Bar Overlay (Floating Design) */}
            {selectedIds.length > 0 && (
                <QuestionBulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    selectAllAcrossPages={selectAllAcrossPages}
                    onClear={handleClearSelection}
                    onBulkDelete={handleBulkDeleteClick}
                    onSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    onBulkStatusUpdate={handleBulkStatusUpdate}
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
                        placeholder="Search questions..."
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* --- Filters & Settings Group --- */}
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <div className="flex items-center gap-1.5">
                        {/* Filters Toggle */}
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

                        {/* Reset Button */}
                        <button
                            onClick={handleReset}
                            className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group"
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

            {/* Advanced Filters Drawer */}
            {showAdvanced && (
                <div className="px-3 pb-3 pt-1 animate-in slide-in-from-top-2 duration-200 bg-[#f9fafb] border-t border-[#ebebeb]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-1">
                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 block uppercase tracking-wider">Status</label>
                            <SelectInput
                                value={filters?.status || 'all'}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                options={[
                                    { id: 'all', name: 'All Status' },
                                    { id: 'pending', name: 'Pending Reply' },
                                    { id: 'answered', name: 'Answered' }
                                ]}
                                className="rounded-[4px] h-[36px] text-[12px] font-medium border-[#d1d1d1] bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 block uppercase tracking-wider">Date Range</label>
                            <SelectInput
                                value={filters?.date_range || 'all'}
                                onChange={(e) => handleFilterChange('date_range', e.target.value)}
                                options={[
                                    { id: 'all', name: 'Anytime' },
                                    { id: 'today', name: 'Today' },
                                    { id: 'yesterday', name: 'Yesterday' },
                                    { id: '7days', name: 'Last 7 Days' },
                                    { id: '30days', name: 'Last 30 Days' }
                                ]}
                                className="rounded-[4px] h-[36px] text-[12px] font-medium border-[#d1d1d1] bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionToolbar;
