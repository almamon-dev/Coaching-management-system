import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import TransactionSkeleton from './TransactionSkeleton';
import TransactionRow from './TransactionRow';

/**
 * TransactionTable Component
 * The main data grid for displaying transaction history with selection support.
 */
const TransactionTable = ({ 
    transactions, 
    selectedIds = [], 
    toggleSelect, 
    toggleSelectAll, 
    handleDelete,
    visibleColumns = [],
    isProcessing = false
}) => {
    const isAllSelected = transactions.data.length > 0 && selectedIds.length === transactions.data.length;
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < transactions.data.length;

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
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

                        {visibleColumns.includes('transaction_id') && <th className="px-4 py-2.5 w-[180px]">Transaction ID</th>}
                        {visibleColumns.includes('order_id') && <th className="px-4 py-2.5 w-[140px]">Order ID</th>}
                        {visibleColumns.includes('customer') && <th className="px-4 py-2.5 w-[200px]">Customer</th>}
                        {visibleColumns.includes('payment_method') && <th className="px-4 py-2.5 w-[150px] text-center">Payment Method</th>}
                        {visibleColumns.includes('amount') && <th className="px-4 py-2.5 w-[120px] text-center">Amount</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 w-[130px] text-center">Status</th>}
                        {visibleColumns.includes('date') && <th className="px-4 py-2.5 w-[150px] text-center">Date</th>}
                        <th className="px-6 py-2.5 w-[100px] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {isProcessing ? (
                        Array.from({ length: transactions.data.length || 5 }).map((_, i) => (
                            <TransactionSkeleton key={i} visibleColumns={visibleColumns} />
                        ))
                    ) : transactions.data.length > 0 ? (
                        transactions.data.map((transaction) => (
                            <TransactionRow 
                                key={transaction.id}
                                transaction={transaction}
                                isSelected={selectedIds.includes(transaction.id)}
                                toggleSelect={toggleSelect}
                                handleDelete={handleDelete}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="px-4 py-24 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-[#f6f6f7] rounded-full flex items-center justify-center mb-4">
                                        <div className="w-8 h-8 border-2 border-[#bababa] rounded-[4px] border-dashed" />
                                    </div>
                                    <p className="text-[16px] font-bold text-[#202223]">No transactions found</p>
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

export default TransactionTable;
