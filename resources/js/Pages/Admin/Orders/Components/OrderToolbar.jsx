import React, { useState } from 'react';
import { Search, RotateCcw, X, Filter, Download, Printer, CreditCard } from 'lucide-react';
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import { cn } from '@/lib/utils';
import OrderBulkActionBar from './OrderBulkActionBar';
import ColumnManager from './ColumnManager';

const OrderToolbar = ({
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
    onBulkStatusUpdate
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const activeFilterCount = [
        filters?.payment_method && filters.payment_method !== 'all',
        filters?.payment_status && filters.payment_status !== 'all',
        filters?.status && filters.status !== 'all',
    ].filter(Boolean).length;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {/* Bulk Action Bar Overlay (Floating Design) */}
            {selectedIds.length > 0 && (
                <OrderBulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    selectAllAcrossPages={selectAllAcrossPages}
                    onClear={handleClearSelection}
                    onBulkDelete={handleBulkDeleteClick}
                    onSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    onBulkStatusUpdate={onBulkStatusUpdate}
                    filters={filters}
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
                        placeholder="Search order #, customer..."
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* --- Filters & Actions Group --- */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">

                        {/* Export Button */}
                        <button className="h-[36px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f6f6f7] transition-all flex items-center gap-1.5 shadow-sm">
                            <Download size={14} className="text-[#6d7175]" /> Export
                        </button>
                        {/* Filters Toggle */}
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
                <div className="px-3 pb-3 pt-1 bg-[#f9fafb] border-t border-[#ebebeb]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <CreditCard size={11} />
                                Payment Method
                            </label>
                            <SelectInput
                                value={filters?.payment_method || 'all'}
                                onChange={(e) => handleFilterChange('payment_method', e.target.value)}
                                options={[
                                    { id: 'all', name: 'All Methods' },
                                    { id: 'COD', name: 'Cash on Delivery' },
                                    { id: 'Stripe', name: 'Stripe' },
                                    { id: 'Bkash', name: 'bKash' },
                                    { id: 'Nagad', name: 'Nagad' },
                                ]}
                                className="bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <CreditCard size={11} />
                                Payment Status
                            </label>
                            <SelectInput
                                value={filters?.payment_status || 'all'}
                                onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                                options={[
                                    { id: 'all', name: 'All Status' },
                                    { id: 'paid', name: 'Paid' },
                                    { id: 'unpaid', name: 'Unpaid' },
                                    { id: 'refunded', name: 'Refunded' },
                                ]}
                                className="bg-white shadow-sm"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <Filter size={11} />
                                Delivery Status
                            </label>
                            <SelectInput
                                value={filters?.status || 'all'}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                options={[
                                    { id: 'all', name: 'All Status' },
                                    { id: 'pending', name: 'Pending' },
                                    { id: 'processing', name: 'Processing' },
                                    { id: 'shipped', name: 'Shipped' },
                                    { id: 'delivered', name: 'Delivered' },
                                    { id: 'cancelled', name: 'Cancelled' },
                                ]}
                                className="bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderToolbar;
