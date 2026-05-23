import React from 'react';
import { cn } from '@/lib/utils';

/**
 * TransactionSkeleton Component
 * Animated skeleton rows for the transaction history table.
 */
const TransactionSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse h-[52px]">
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="w-[17px] h-[17px] bg-slate-100 rounded-[3px]" />
            </td>

            {visibleColumns.includes('transaction_id') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[4px] bg-slate-100" />
                        <div className="h-3 bg-slate-100 rounded w-24" />
                    </div>
                </td>
            )}

            {visibleColumns.includes('order_id') && (
                <td className="px-4 py-1">
                    <div className="h-3 bg-slate-100 rounded w-16" />
                </td>
            )}

            {visibleColumns.includes('customer') && (
                <td className="px-4 py-1">
                    <div className="flex flex-col gap-1.5">
                        <div className="h-3 bg-slate-100 rounded w-28" />
                        <div className="h-2 bg-slate-50 rounded w-20" />
                    </div>
                </td>
            )}

            {visibleColumns.includes('payment_method') && (
                <td className="px-4 py-1">
                    <div className="h-4 bg-slate-100 rounded w-20 mx-auto" />
                </td>
            )}

            {visibleColumns.includes('amount') && (
                <td className="px-4 py-1 text-center">
                    <div className="h-3 bg-slate-100 rounded w-12 mx-auto" />
                </td>
            )}

            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    <div className="h-5 bg-slate-100 rounded-full w-20 mx-auto" />
                </td>
            )}

            {visibleColumns.includes('date') && (
                <td className="px-4 py-1 text-center">
                    <div className="flex flex-col gap-1 items-center">
                        <div className="h-3 bg-slate-100 rounded w-16" />
                        <div className="h-2 bg-slate-50 rounded w-12" />
                    </div>
                </td>
            )}

            <td className="px-6 py-1 text-right">
                <div className="h-[26px] w-[26px] bg-slate-100 rounded-[2px] ml-auto" />
            </td>
        </tr>
    );
};

export default TransactionSkeleton;
