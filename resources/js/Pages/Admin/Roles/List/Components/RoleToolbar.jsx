/**
 * RoleToolbar Component
 * 
 * High-performance filter bar styled exactly like CategoryToolbar.
 * Renders search box, SlidersHorizontal toggle, reset button, divider,
 * ColumnManager, and advanced drawer selectors.
 */
import React, { useState } from 'react';
import { Search, RotateCcw, Trash2, X, SlidersHorizontal, Users, Key } from 'lucide-react';
import TextInput from "@/Components/Form/TextInput";
import SelectInput from "@/Components/Form/SelectInput";
import { cn } from '@/lib/utils';
import ColumnManager from './ColumnManager';

const RoleToolbar = ({
    search,
    setSearch,
    filters,
    handleFilterChange,
    handleReset,
    selectedIds,
    perPageCount,
    handleClearSelection,
    handleBulkDeleteClick,

    // Column Management Props
    allColumns,
    visibleColumns,
    toggleColumn
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const isSelected = selectedIds.length > 0;

    const activeFilterCount = [
        filters?.operators && filters.operators !== 'all',
        filters?.permissions && filters.permissions !== 'all',
        filters?.sort_by && filters.sort_by !== 'latest'
    ].filter(Boolean).length;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {/* Contextual Bulk Action Bar Overlay */}
            {isSelected && (
                <div className="absolute inset-0 bg-[#f4f6f8] px-4 py-2 flex items-center justify-between z-10 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-bold text-slate-700">
                            {selectedIds.length} of {perPageCount} roles selected on this page
                        </span>
                        <button
                            onClick={handleClearSelection}
                            className="text-[12px] font-bold text-[#008060] hover:text-[#006e52] hover:underline transition-all"
                        >
                            Deselect all
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBulkDeleteClick}
                            className="h-[32px] px-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-[4px] flex items-center gap-1.5 active:scale-95 transition-all font-bold text-[11px] shadow-sm normal-case whitespace-nowrap cursor-pointer"
                        >
                            <Trash2 size={13} /> Delete Selected
                        </button>
                    </div>
                </div>
            )}

            <div className={cn(
                "p-3 flex items-center justify-between gap-4 transition-opacity duration-200",
                isSelected ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                {/* --- Search Box --- */}
                <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search roles..."
                        className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none bg-white"
                    />
                    {search && (
                        <button 
                            onClick={() => setSearch("")} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors cursor-pointer"
                        >
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
                                "h-[32px] px-3 rounded-[3px] border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
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
                            className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer shadow-sm" 
                            title="Reset Filters"
                        >
                            <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                        </button>

                        {/* Divider */}
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
                <div className="px-3 pb-3 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-1 duration-150 border-t border-[#ebebeb] bg-[#f9fafb]">
                    {/* Operators Filter */}
                    <div>
                        <label className="text-[11px] font-bold text-[#6d7175] mb-1 block uppercase tracking-tight">Assigned Operators</label>
                        <SelectInput
                            value={filters?.operators || 'all'}
                            onChange={(e) => handleFilterChange('operators', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Roles' },
                                { id: 'some', name: 'Has Operators' },
                                { id: 'none', name: 'No Operators' }
                            ]}
                            className="h-[32px] text-[12px] font-medium border-[#d1d1d1] rounded-[3px] bg-white shadow-sm"
                        />
                    </div>

                    {/* Permissions Filter */}
                    <div>
                        <label className="text-[11px] font-bold text-[#6d7175] mb-1 block uppercase tracking-tight">Permissions Count</label>
                        <SelectInput
                            value={filters?.permissions || 'all'}
                            onChange={(e) => handleFilterChange('permissions', e.target.value)}
                            options={[
                                { id: 'all', name: 'All Roles' },
                                { id: 'some', name: 'Has Permissions' },
                                { id: 'none', name: 'No Permissions' }
                            ]}
                            className="h-[32px] text-[12px] font-medium border-[#d1d1d1] rounded-[3px] bg-white shadow-sm"
                        />
                    </div>

                    {/* Sorting */}
                    <div>
                        <label className="text-[11px] font-bold text-[#6d7175] mb-1 block uppercase tracking-tight">Sort By</label>
                        <SelectInput
                            value={filters?.sort_by || 'latest'}
                            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                            options={[
                                { id: 'latest', name: 'Newest First' },
                                { id: 'oldest', name: 'Oldest First' },
                                { id: 'name_az', name: 'Name: A-Z' },
                                { id: 'name_za', name: 'Name: Z-A' },
                                { id: 'users_high', name: 'Operators: High to Low' },
                                { id: 'users_low', name: 'Operators: Low to High' },
                                { id: 'permissions_high', name: 'Permissions: High to Low' },
                                { id: 'permissions_low', name: 'Permissions: Low to High' }
                            ]}
                            className="h-[32px] text-[12px] font-medium border-[#d1d1d1] rounded-[3px] bg-white shadow-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleToolbar;
