import React from 'react';
import { Search, RotateCcw, Trash2, X, SlidersHorizontal, Filter, Layers, Tag, Activity, Banknote, Archive } from 'lucide-react';
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import ColumnManager from './ColumnManager';
import BulkActionBar from './BulkActionBar';

const ProductToolbar = ({
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
    categories,
    brands,

    // Column Management
    allColumns,
    visibleColumns,
    toggleColumn,
    hideArchived,
    setHideArchived,
    onMarkAsStatus
}) => {
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const activeFilterCount = [
        filters?.category_id && filters.category_id !== 'all',
        filters?.sub_category_id && filters.sub_category_id !== 'all',
        filters?.sub_sub_category_id && filters.sub_sub_category_id !== 'all',
        filters?.brand_id && filters.brand_id !== 'all',
        filters?.status && filters.status !== 'all',
        filters?.min_price,
        filters?.max_price,
        filters?.sort_by && filters.sort_by !== 'latest'
    ].filter(Boolean).length;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {/* Bulk Action Bar Overlay */}
            {selectedIds.length > 0 && (
                <BulkActionBar
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
                "p-2.5 flex items-center justify-between gap-3 transition-opacity duration-200",
                selectedIds.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>

                <div className="relative flex-1 max-w-[400px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#bababa] hover:text-[#202223] transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={cn(
                                "h-[36px] px-3 rounded-[4px] border text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm",
                                showAdvanced || activeFilterCount > 0
                                    ? "bg-[#f1f1f1] border-[#d1d1d1] text-[#202223]"
                                    : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]"
                            )}
                        >
                            <Filter size={14} className="text-[#6d7175]" />
                            More Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-[#ebebeb] text-[#202223] w-4 h-4 text-[10px] rounded-full flex items-center justify-center ml-1 font-bold border border-[#d1d1d1]">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <button onClick={handleReset} className="h-[36px] w-[36px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[4px] hover:bg-[#f6f6f7] transition-all group shadow-sm" title="Reset Filters">
                            <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                        </button>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <Layers size={11} />
                                Category
                            </label>
                            <SelectInput
                                value={filters?.category_id || 'all'}
                                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                                options={[
                                    { id: 'all', name: 'All Categories' },
                                    ...(categories?.map(c => ({ id: c.id, name: c.name })) || [])
                                ]}
                                className="bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <Tag size={11} />
                                Brand
                            </label>
                            <SelectInput
                                value={filters?.brand_id || 'all'}
                                onChange={(e) => handleFilterChange('brand_id', e.target.value)}
                                options={[
                                    { id: 'all', name: 'All Brands' },
                                    ...(brands?.map(b => ({ id: b.id, name: b.name })) || [])
                                ]}
                                className="bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <Activity size={11} />
                                Status
                            </label>
                            <SelectInput
                                value={filters?.status || 'all'}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                options={[
                                    { id: 'all', name: 'All Status' },
                                    { id: '1', name: 'In Stock' },
                                    { id: '2', name: 'Out of Stock' },
                                    { id: '3', name: 'Pre Order' },
                                    { id: '4', name: 'Up Coming' },
                                ]}
                                className="bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <Banknote size={11} />
                                Min Price
                            </label>
                            <TextInput
                                type="number"
                                value={filters?.min_price || ''}
                                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                placeholder="0.00"
                                className="bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <Banknote size={11} />
                                Max Price
                            </label>
                            <TextInput
                                type="number"
                                value={filters?.max_price || ''}
                                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                placeholder="Max"
                                className="bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <RotateCcw size={11} />
                                Sort By
                            </label>
                            <SelectInput
                                value={filters?.sort_by || 'latest'}
                                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                options={[
                                    { id: 'latest', name: 'Newest First' },
                                    { id: 'price_low', name: 'Price: Low to High' },
                                    { id: 'price_high', name: 'Price: High to Low' },
                                    { id: 'name_az', name: 'Name: A-Z' },
                                    { id: 'stock_low', name: 'Stock: Low to High' },
                                    { id: 'stock_high', name: 'Stock: High to Low' },
                                ]}
                                className="bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1 flex flex-col justify-end">
                            <label className="flex items-center gap-2 cursor-pointer select-none h-[36px] px-2 bg-white border border-[#d1d1d1] rounded-[4px] hover:bg-slate-50 transition-all shadow-sm">
                                <input
                                    type="checkbox"
                                    checked={hideArchived}
                                    onChange={() => setHideArchived(!hideArchived)}
                                    className="w-3.5 h-3.5 rounded border-[#d1d1d1] text-[#008060] focus:ring-[#008060]"
                                />
                                <span className="text-[11px] font-bold text-[#202223] flex items-center gap-1.5">
                                    <Archive size={11} className="text-[#6d7175]" />
                                    Hide archived
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductToolbar;
