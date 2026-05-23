import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import WarehouseSkeleton from './WarehouseSkeleton';
import WarehouseRow from './WarehouseRow';

const WarehouseTable = ({ 
    warehouses, 
    selectedIds = [], 
    toggleSelect, 
    toggleSelectAll, 
    handleDelete,
    onEdit,
    isProcessing = false,
    visibleColumns = [],
    activeTab = 'all',
    stats = {}
}) => {
    const isAllSelected = warehouses.data.length > 0 && selectedIds.length === warehouses.data.length;
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < warehouses.data.length;

    // Smart Skeleton Logic: Only show skeletons if we are processing AND there's data to be expected
    const tabCount = activeTab === 'all' ? stats?.total : stats?.[activeTab];
    const shouldShowSkeletons = isProcessing && (tabCount > 0 || tabCount === undefined);

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[11px] font-semibold uppercase tracking-wider border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-3 w-[50px]">
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
                        {visibleColumns.includes('warehouse') && <th className="px-4 py-3 w-[300px]">Warehouse Details</th>}
                        {visibleColumns.includes('address') && <th className="px-4 py-3 min-w-[200px]">Location / Address</th>}
                        {visibleColumns.includes('phone') && <th className="px-4 py-3 w-[180px] text-center">Contact Info</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-3 w-[140px] text-center">Operation Status</th>}
                        {visibleColumns.includes('date') && <th className="px-4 py-3 w-[160px] text-center">Created At</th>}
                        <th className="px-6 py-3 w-[130px] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {shouldShowSkeletons ? (
                        Array.from({ length: warehouses.data.length || 5 }).map((_, i) => (
                            <WarehouseSkeleton key={i} visibleColumns={visibleColumns} />
                        ))
                    ) : warehouses.data.length > 0 ? (
                        warehouses.data.map((warehouse) => (
                            <WarehouseRow 
                                key={warehouse.id}
                                warehouse={warehouse}
                                isSelected={selectedIds.includes(warehouse.id)}
                                toggleSelect={toggleSelect}
                                handleDelete={handleDelete}
                                onEdit={onEdit}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-4 py-24 text-center">
                                <div className="flex flex-col items-center justify-center text-[#6d7175]">
                                    <div className="w-16 h-16 bg-[#f6f6f7] rounded-full flex items-center justify-center mb-4">
                                        <div className="w-8 h-8 border-2 border-[#bababa] rounded-[4px] border-dashed" />
                                    </div>
                                    <p className="text-[16px] font-bold text-[#202223]">No warehouses found</p>
                                    <p className="text-[13px]">Try adding a new warehouse to start managing stock locations.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default WarehouseTable;
