import React from 'react';
import { Search, RotateCw, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import ColumnManager from './ColumnManager';

export default function Toolbar({
    searchQuery = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    advancedFilters,
    showAdvanced = false,
    setShowAdvanced,
    onResetFilters,
    isFiltered = false,
    onRefresh,
    isRefreshing = false,
    columns = [],
    visibleColumns = [],
    toggleColumn,
    onResetColumns,
}) {
    const hasActiveFilter = Boolean(searchQuery) || isFiltered;

    return (
        <div className="px-3.5 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            {/* Search Input (CarrierDirect exact 32px rounded-[3px] look) */}
            <div className="relative w-full sm:w-[320px] max-w-full">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175] pointer-events-none z-10"
                    size={14}
                />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full h-[32px] pl-9 pr-8 border border-slate-200/80 rounded-[3px] text-[12px] font-medium bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#16a34a] focus:ring-0 transition-colors shadow-none"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange && onSearchChange('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        title="Clear search"
                    >
                        <X size={13} />
                    </button>
                )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
                {advancedFilters && (
                    <div className="flex items-center gap-1.5">
                        {(showAdvanced || hasActiveFilter) && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (onResetFilters) {
                                        onResetFilters();
                                    } else {
                                        onSearchChange && onSearchChange('');
                                        setShowAdvanced && setShowAdvanced(false);
                                    }
                                }}
                                className="h-[32px] px-2.5 rounded-[3px] border border-slate-200/80 text-[12px] font-bold flex items-center gap-1.5 bg-slate-50/50 text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-[#16a34a] transition-all outline-none shadow-none cursor-pointer group"
                                title="Clear All Filters"
                            >
                                <RotateCcw
                                    size={13}
                                    className="group-hover:rotate-[-45deg] transition-transform text-slate-500 group-hover:text-[#16a34a]"
                                />
                                <span>Clear</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowAdvanced && setShowAdvanced(!showAdvanced)}
                            className={`h-[32px] px-2.5 sm:px-3 rounded-[3px] border text-[12px] font-bold flex items-center gap-1.5 transition-all outline-none shadow-none cursor-pointer ${
                                showAdvanced || hasActiveFilter
                                    ? 'bg-emerald-50 border-emerald-200 text-[#16a34a]'
                                    : 'bg-slate-50/50 border-slate-200/80 text-slate-700 hover:bg-slate-100/60 hover:border-slate-300'
                            }`}
                        >
                            <SlidersHorizontal
                                size={14}
                                className={showAdvanced || hasActiveFilter ? 'text-[#16a34a]' : 'text-slate-500'}
                            />
                            <span>Filters</span>
                            {(showAdvanced || hasActiveFilter) && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] ml-0.5" />
                            )}
                        </button>
                    </div>
                )}

                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="h-[32px] w-[32px] flex items-center justify-center rounded-[3px] border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all cursor-pointer"
                        title="Refresh table"
                    >
                        <RotateCw
                            size={14}
                            className={isRefreshing ? 'animate-spin text-[#16a34a]' : 'text-slate-600'}
                        />
                    </button>
                )}

                {columns && visibleColumns && (
                    <ColumnManager
                        columns={columns}
                        visibleColumns={visibleColumns}
                        toggleColumn={toggleColumn}
                        onResetColumns={onResetColumns}
                    />
                )}
            </div>
        </div>
    );
}
