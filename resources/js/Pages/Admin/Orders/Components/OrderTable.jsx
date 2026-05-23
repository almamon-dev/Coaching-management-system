import React from 'react';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import OrderRow from './OrderRow';
import OrderSkeleton from './OrderSkeleton';

const OrderTable = ({ 
    orders, 
    filters, 
    selectedIds, 
    selectAllAcrossPages, 
    toggleSelectAll, 
    toggleSelect, 
    handleDelete, 
    isProcessing, 
    expectedCount,
    visibleColumns = ['order', 'customer', 'items', 'amount', 'status', 'payment']
}) => {
    const isAllOnPageSelected = orders.data.length > 0 && orders.data.every(order => selectedIds.includes(order.id));
    const activeColCount = visibleColumns.length + 2; // +2 for checkbox and actions

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1250px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[18px] h-[18px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                    selectAllAcrossPages || isAllOnPageSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]"
                                )}
                            >
                                {selectAllAcrossPages || isAllOnPageSelected ? (
                                    <Check size={12} strokeWidth={4} className="text-white" />
                                ) : selectedIds.length > 0 ? (
                                    <div className="w-2.5 h-[1.5px] bg-slate-500"></div>
                                ) : null}
                            </div>
                        </th>

                        {visibleColumns.includes('order') && <th className="px-4 py-2 w-[140px]">Order</th>}
                        {visibleColumns.includes('date') && <th className="px-4 py-2 w-[160px]">Date <span className="text-[10px]">↓</span></th>}
                        {visibleColumns.includes('customer') && <th className="px-4 py-2 w-[180px]">Customer</th>}
                        {visibleColumns.includes('total') && <th className="px-4 py-2 w-[110px]">Total</th>}
                        {visibleColumns.includes('payment_status') && <th className="px-4 py-2 w-[130px]">Payment status</th>}
                        {visibleColumns.includes('items_count') && <th className="px-4 py-2 w-[100px]">Items</th>}
                        {visibleColumns.includes('delivery_status') && <th className="px-4 py-2 w-[140px]">Delivery status</th>}
                        {visibleColumns.includes('payment_method') && <th className="px-4 py-2 w-[150px]">Payment method</th>}

                        <th className="px-6 py-2 w-[160px] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] bg-white">
                    {isProcessing && (orders.data?.length || 0) > 0 ? (
                        Array.from({ length: orders.data.length }).map((_, i) => (
                            <OrderSkeleton key={i} visibleColumns={visibleColumns} />
                        ))
                    ) : orders.data.length > 0 ? (
                        orders.data.map((order) => (
                            <OrderRow
                                key={order.id}
                                order={order}
                                isSelected={selectAllAcrossPages || selectedIds.includes(order.id)}
                                toggleSelect={toggleSelect}
                                handleDelete={handleDelete}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={activeColCount} className="px-7 py-24 text-center">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-[16px] font-bold text-[#202223]">No orders found</p>
                                <p className="text-[13px] text-[#6d7175] mt-1">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
