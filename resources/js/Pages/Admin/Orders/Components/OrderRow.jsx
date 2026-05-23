import React from 'react';
import { Eye, Clock, CreditCard, User, Package, Check, Trash2, Mail, Phone } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const OrderRow = ({ order, isSelected, toggleSelect, handleDelete, visibleColumns = ['order', 'customer', 'items', 'amount', 'status', 'payment'] }) => {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-[#fff4e5] text-[#b98900] border-[#ffe2b5]',
            processing: 'bg-[#e4f1ef] text-[#008060] border-[#aee9d1]',
            shipped: 'bg-[#f0f1f7] text-[#5c6ac4] border-[#e1e3ea]',
            delivered: 'bg-[#e4f1ef] text-[#008060] border-[#aee9d1]',
            cancelled: 'bg-[#fbeae5] text-[#bf0711] border-[#f9d3d0]',
        };
        return colors[status] || 'bg-[#f6f6f7] text-[#6d7175] border-[#ebebeb]';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            paid: 'bg-[#e4f1ef] text-[#008060] border-[#aee9d1]',
            unpaid: 'bg-[#fff4e5] text-[#b98900] border-[#ffe2b5]',
            refunded: 'bg-[#f0f1f7] text-[#5c6ac4] border-[#e1e3ea]',
        };
        return colors[status] || 'bg-[#f6f6f7] text-[#6d7175] border-[#ebebeb]';
    };

    return (
        <tr className="group bg-white hover:bg-[#f8f9fa] transition-colors border-b border-[#ebebeb] last:border-0 h-[48px]">
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => toggleSelect(order.id)}
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

            {visibleColumns.includes('order') && (
                <td className="px-4 py-2">
                    <Link
                        href={route('admin.orders.show', order.id)}
                        prefetch
                        className="text-[12px] font-bold text-[#202223] hover:underline"
                    >
                        #{order.order_number}
                    </Link>
                </td>
            )}

            {visibleColumns.includes('date') && (
                <td className="px-4 py-2">
                    <span className="text-[12px] text-[#202223] font-medium">
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {new Date(order.created_at).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                </td>
            )}

            {visibleColumns.includes('customer') && (
                <td className="px-4 py-2">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold text-[#005bd3] hover:underline cursor-pointer truncate">
                            {order.shipping_name || order.user?.name || 'Guest Customer'}
                        </span>
                        <span className="text-[11px] text-[#6d7175] font-normal truncate">
                            {order.shipping_email || order.user?.email || 'No email provided'}
                        </span>
                    </div>
                </td>
            )}


            {visibleColumns.includes('total') && (
                <td className="px-4 py-2 text-[12px] text-[#202223] font-bold">
                    ৳{Number(order.total_amount).toLocaleString()}
                </td>
            )}

            {visibleColumns.includes('payment_status') && (
                <td className="px-4 py-2">
                    <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight uppercase border",
                        order.payment?.status === 'paid'
                            ? "bg-[#e3f1df] text-[#008060] border-[#aee9d1]"
                            : "bg-[#fff4e5] text-[#b98900] border-[#ffe2b3]"
                    )}>
                        {order.payment?.status || 'unpaid'}
                    </span>
                </td>
            )}

            {visibleColumns.includes('items_count') && (
                <td className="px-4 py-2 text-[12px] text-[#202223] font-medium">
                    {order.items_count ?? (order.items?.length || 0)} item{(order.items_count ?? order.items?.length) > 1 ? 's' : ''}
                </td>
            )}

            {visibleColumns.includes('delivery_status') && (
                <td className="px-4 py-2">
                    <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-tight",
                        order.status === 'delivered' ? "bg-[#e3f1df] text-[#008060] border-[#aee9d1]" :
                            order.status === 'shipped' ? "bg-[#e4f1ef] text-[#005bd3] border-[#a2c1f9]" :
                                order.status === 'cancelled' ? "bg-[#fff0f0] text-[#bf0711] border-[#f9dada]" :
                                    "bg-[#f6f6f7] text-[#6d7175] border-[#d1d1d1]"
                    )}>
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            order.status === 'delivered' ? "bg-[#008060]" :
                                order.status === 'shipped' ? "bg-[#005bd3]" :
                                    order.status === 'cancelled' ? "bg-[#bf0711]" :
                                        "bg-[#6d7175]"
                        )} />
                        {order.status}
                    </div>
                </td>
            )}

            {visibleColumns.includes('payment_method') && (
                <td className="px-4 py-2">
                    <span className="text-[10px] bg-[#f1f1f1] text-[#6d7175] px-1.5 py-0.5 rounded-[3px] font-bold uppercase tracking-tight inline-block">
                        {order.payment?.payment_method || 'N/A'}
                    </span>
                </td>
            )}

            <td className="px-6 py-2 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route("admin.orders.show", order.id)}
                        prefetch
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#8c8c8c] text-white rounded-[2px] hover:bg-[#595959] transition-all"
                        title="View Details"
                    >
                        <Eye size={12} />
                    </Link>
                    <button
                        onClick={() => handleDelete(order.id, order.order_number)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Order"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};
export default OrderRow;
