import React from 'react';

const OrderSkeleton = ({ visibleColumns = ['order', 'customer', 'items', 'amount', 'status', 'payment'] }) => {
    return (
        <tr className="animate-pulse border-b border-[#f1f1f1] last:border-0 h-[48px]">
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="w-[17px] h-[17px] bg-slate-100 border-[1.5px] border-[#d1d1d1] rounded-[3px]"></div>
            </td>

            {visibleColumns.includes('order') && (
                <td className="px-4 py-2 w-[140px]">
                    <div className="h-4 w-16 bg-slate-100 rounded-[2px]"></div>
                </td>
            )}

            {visibleColumns.includes('date') && (
                <td className="px-4 py-2 w-[160px]">
                    <div className="h-3.5 w-32 bg-slate-100 rounded-[2px]"></div>
                </td>
            )}

            {visibleColumns.includes('customer') && (
                <td className="px-4 py-2 w-[180px]">
                    <div className="flex flex-col gap-1">
                        <div className="h-3.5 w-28 bg-slate-100 rounded-[2px]"></div>
                        <div className="h-2.5 w-20 bg-slate-50 rounded-[2px]"></div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('total') && (
                <td className="px-4 py-2 w-[110px]">
                    <div className="h-4 w-20 bg-slate-100 rounded-[2px]"></div>
                </td>
            )}

            {visibleColumns.includes('payment_status') && (
                <td className="px-4 py-2 w-[130px]">
                    <div className="h-5 w-16 bg-slate-50 border border-[#ebebeb] rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('items_count') && (
                <td className="px-4 py-2 w-[100px]">
                    <div className="h-3.5 w-16 bg-slate-100 rounded-[2px]"></div>
                </td>
            )}

            {visibleColumns.includes('delivery_status') && (
                <td className="px-4 py-2 w-[140px]">
                    <div className="h-6 w-24 bg-slate-50 border border-[#ebebeb] rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('payment_method') && (
                <td className="px-4 py-2 w-[150px]">
                    <div className="h-3.5 w-24 bg-slate-100 rounded-[2px]"></div>
                </td>
            )}

            <td className="px-6 py-2 text-right w-[160px]">
                <div className="flex items-center justify-end gap-1.5">
                    <div className="w-[28px] h-[28px] bg-slate-100 border border-[#ebebeb] rounded-[2px]"></div>
                    <div className="w-[28px] h-[28px] bg-slate-100 border border-[#ebebeb] rounded-[2px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default OrderSkeleton;
