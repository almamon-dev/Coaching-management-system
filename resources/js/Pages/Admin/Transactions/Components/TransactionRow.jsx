import React from 'react';
import { Link } from '@inertiajs/react';
import { CreditCard, ExternalLink, Eye, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TransactionRow Component
 * A single row in the transaction history table with selection support.
 */
const TransactionRow = ({ transaction, isSelected, toggleSelect, handleDelete, visibleColumns = [] }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-[#e4f1ef] text-[#008060] border-[#d1e9e5]';
            case 'pending': return 'bg-[#fff4e5] text-[#965e00] border-[#ffe9cc]';
            case 'failed': return 'bg-[#fff0f0] text-[#cf1322] border-[#ffd5d5]';
            case 'refunded': return 'bg-[#f6f6f7] text-[#6d7175] border-[#ebebeb]';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    const getStatusDot = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-[#008060]';
            case 'pending': return 'bg-[#965e00]';
            case 'failed': return 'bg-[#cf1322]';
            case 'refunded': return 'bg-[#6d7175]';
            default: return 'bg-slate-400';
        }
    };

    return (
        <tr className={cn(
            "group transition-colors h-[52px]",
            isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
        )}>
            {/* Checkbox Column */}
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => toggleSelect(transaction.id)}
                    className={cn(
                        "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                        isSelected
                            ? "bg-[#008060] border-[#008060]"
                            : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                    )}
                >
                    {isSelected && <Check size={11} strokeWidth={4} className="text-white" />}
                </div>
            </td>

            {visibleColumns.includes('transaction_id') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[4px] bg-[#f7f7f7] flex items-center justify-center border border-[#ebebeb]">
                            <CreditCard size={12} className="text-[#bababa]" />
                        </div>
                        <span className="text-[12px] font-bold text-[#202223] truncate" title={transaction.transaction_id}>
                            {transaction.transaction_id || 'N/A'}
                        </span>
                    </div>
                </td>
            )}

            {visibleColumns.includes('order_id') && (
                <td className="px-4 py-1">
                    <Link 
                        href={route('admin.orders.show', transaction.order_id)}
                        className="text-[12px] font-bold text-[#005bd3] hover:underline flex items-center gap-1"
                    >
                        #{transaction.order?.order_number}
                        <ExternalLink size={10} />
                    </Link>
                </td>
            )}

            {visibleColumns.includes('customer') && (
                <td className="px-4 py-1">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold text-[#202223] truncate">{transaction.order?.user?.name || 'Guest'}</span>
                        <span className="text-[10px] text-[#6d7175] font-medium truncate">{transaction.order?.user?.email || 'N/A'}</span>
                    </div>
                </td>
            )}

            {visibleColumns.includes('payment_method') && (
                <td className="px-4 py-1 text-center">
                    <span className="text-[11px] font-bold text-[#202223] bg-[#f1f1f1] px-2 py-0.5 rounded-[2px] uppercase tracking-tight border border-[#ebebeb]">
                        {transaction.payment_method}
                    </span>
                </td>
            )}

            {visibleColumns.includes('amount') && (
                <td className="px-4 py-1 text-center">
                    <span className="text-[13px] font-bold text-[#202223]">${transaction.amount}</span>
                </td>
            )}

            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center whitespace-nowrap">
                    <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusColor(transaction.status)
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", getStatusDot(transaction.status))} />
                        {transaction.status}
                    </span>
                </td>
            )}

            {visibleColumns.includes('date') && (
                <td className="px-4 py-1 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                        <span className="text-[11px] text-[#202223] font-bold">{new Date(transaction.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] text-[#6d7175]">{new Date(transaction.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </td>
            )}

            <td className="px-6 py-1 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route('admin.orders.show', transaction.order_id)}
                        className="h-[26px] w-[26px] inline-flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all shadow-sm"
                        title="View Order Details"
                    >
                        <Eye size={12} />
                    </Link>
                    <button
                        onClick={() => handleDelete(transaction.id, transaction.transaction_id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Transaction"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TransactionRow;
