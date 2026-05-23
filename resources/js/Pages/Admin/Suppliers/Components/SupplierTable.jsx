import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import SupplierSkeleton from './SupplierSkeleton';
import SupplierRow from './SupplierRow';

/**
 * SupplierTable Component
 * The main data grid for displaying suppliers with selection support.
 */
const SupplierTable = ({
    suppliers,
    selectedIds = [],
    toggleSelect,
    toggleSelectAll,
    handleDelete,
    isProcessing = false,
    visibleColumns = [],
    activeTab = 'all',
    stats = {}
}) => {
    const isAllSelected = suppliers.data.length > 0 && selectedIds.length === suppliers.data.length;
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < suppliers.data.length;

    // Map 'all' tab to 'total' key in stats
    const tabCount = activeTab === 'all' ? stats?.total : stats?.[activeTab];
    const shouldShowSkeletons = isProcessing && (tabCount > 0 || tabCount === undefined);

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[11px] font-semibold uppercase tracking-wider border-b border-[#ebebeb]">
                    <tr>
                        {/* Checkbox Header */}
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                    isAllSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]",
                                    isSomeSelected && !isAllSelected && "bg-[#008060] border-[#008060]"
                                )}
                            >
                                {isAllSelected && <Check size={11} strokeWidth={4} className="text-white" />}
                                {isSomeSelected && !isAllSelected && <div className="w-2 h-[2px] bg-white rounded-full" />}
                            </div>
                        </th>

                        {visibleColumns.includes('supplier') && <th className="px-4 py-2.5 w-[250px]">Supplier Info</th>}
                        {visibleColumns.includes('contact') && <th className="px-4 py-2.5 w-[180px]">Contact Person</th>}
                        {visibleColumns.includes('brands') && <th className="px-4 py-2.5 w-[220px]">Associated Brands</th>}
                        {visibleColumns.includes('phone') && <th className="px-4 py-2.5 w-[140px] text-center">Phone</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 w-[120px] text-center">Status</th>}
                        {visibleColumns.includes('created_at') && <th className="px-4 py-2.5 w-[140px] text-center">Joined Date</th>}
                        <th className="px-6 py-2.5 w-[120px] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {shouldShowSkeletons ? (
                        Array.from({ length: suppliers.data.length || 5 }).map((_, i) => (
                            <SupplierSkeleton key={i} visibleColumns={visibleColumns} />
                        ))
                    ) : suppliers.data.length > 0 ? (
                        suppliers.data.map((supplier) => (
                            <SupplierRow
                                key={supplier.id}
                                supplier={supplier}
                                isSelected={selectedIds.includes(supplier.id)}
                                toggleSelect={toggleSelect}
                                handleDelete={handleDelete}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-4 py-24 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-[#f6f6f7] rounded-full flex items-center justify-center mb-4">
                                        <div className="w-8 h-8 border-2 border-[#bababa] rounded-[4px] border-dashed" />
                                    </div>
                                    <p className="text-[16px] font-bold text-[#202223]">No suppliers found</p>
                                    <p className="text-[13px] text-[#6d7175]">Try adjusting your search or filter criteria.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SupplierTable;
