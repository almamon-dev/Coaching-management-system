import React, { useState } from 'react';
import { Search, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { cn } from '@/lib/utils';
import RepairBulkActionBar from './RepairBulkActionBar';
import ColumnManager from './ColumnManager';

const RepairToolbar = ({
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
    technicians,
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
        filters?.technician_id && filters.technician_id !== 'all',
        filters?.status && filters.status !== 'all',
    ].filter(Boolean).length;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30 select-none">
            {/* Bulk Action Bar Overlay (Floating Design) */}
            {selectedIds.length > 0 && (
                <RepairBulkActionBar
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

                {/* --- Search Box --- */}
                <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search ticket, customer name, brand..."
                        className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* --- Filters Group --- */}
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
                <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 animate-in slide-in-from-top-1 duration-150 border-t border-[#ebebeb] pt-3 bg-[#f9fafb]">
                    <div>
                        <label className="text-[11px] font-bold text-[#6d7175] mb-1 block uppercase tracking-tight">Assignee Technician</label>
                        <SelectInput
                            value={filters?.technician_id || 'all'}
                            onChange={(e) => handleFilterChange('technician_id', e.target.value)}
                            options={[{ id: 'all', name: 'All Technicians' }, ...technicians.map(t => ({ id: t.id, name: t.name }))]}
                            className="h-[32px] text-[12px] font-medium border-[#d1d1d1] rounded-[3px]"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-bold text-[#6d7175] mb-1 block uppercase tracking-tight">Status</label>
                        <SelectInput
                            value={filters?.status || 'all'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Statuses' },
                                { id: 'pending', name: 'Pending Approval' },
                                { id: 'approved', name: 'Device Received' },
                                { id: 'diagnosing', name: 'In Diagnostics' },
                                { id: 'awaiting_quote', name: 'Awaiting Quote' },
                                { id: 'repairing', name: 'Repairing' },
                                { id: 'testing', name: 'Testing QC' },
                                { id: 'ready', name: 'Ready for Collection' },
                                { id: 'completed', name: 'Completed & Closed' },
                                { id: 'cancelled', name: 'Cancelled' }
                            ]}
                            className="h-[32px] text-[12px] font-medium border-[#d1d1d1] rounded-[3px]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepairToolbar;
