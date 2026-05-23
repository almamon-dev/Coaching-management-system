import React from 'react';
import { Clock, Eye, FileText, Truck } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const OrderRow = ({ order }) => {
    return (
        <tr className="group hover:bg-[#f6f6f7] transition-colors h-[52px]">
            <td className="px-5 py-2">
                <Link
                    href={route('user.orders.track', order.id)}
                    className="font-bold text-[#008060] hover:underline transition-colors leading-none"
                >
                    #{order.id}
                </Link>
            </td>
            <td className="px-5 py-2">
                <div className="flex items-center gap-1.5 text-[#6d7175] text-[11px] font-bold">
                    <Clock size={11} className="text-slate-400" />
                    <span>{order.date}</span>
                </div>
            </td>
            <td className="px-5 py-2 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-[3px] bg-slate-50 border border-[#ebebeb] text-[10px] text-slate-600 font-bold">
                    {order.items_count} {order.items_count === 1 ? 'Item' : 'Items'}
                </span>
            </td>
            <td className="px-5 py-2">
                <span className="font-bold text-[#202223] text-[13.5px]">
                    ৳{order.amount.toLocaleString()}
                </span>
            </td>
            <td className="px-5 py-2">
                <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider",
                    order.status === 'Delivered' ? "bg-green-50 text-green-700 border-green-100" :
                        order.status === 'Cancelled' ? "bg-red-50 text-red-700 border-red-100" :
                            "bg-indigo-50 text-indigo-700 border-indigo-100"
                )}>
                    <span className={cn(
                        "w-1 h-1 rounded-full",
                        order.status === 'Delivered' ? "bg-green-500" :
                            order.status === 'Cancelled' ? "bg-red-500" : "bg-indigo-500"
                    )} />
                    {order.status}
                </span>
            </td>
            <td className="px-5 py-2">
                <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider",
                    order.payment_status === 'Paid' || order.payment_status === 'Success' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        order.payment_status === 'Failed' ? "bg-rose-50 text-rose-700 border-rose-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                    <span className={cn(
                        "w-1 h-1 rounded-full",
                        order.payment_status === 'Paid' || order.payment_status === 'Success' ? "bg-emerald-500" :
                            order.payment_status === 'Failed' ? "bg-rose-500" : "bg-amber-500"
                    )} />
                    {order.payment_status}
                </span>
            </td>
            <td className="px-5 py-2 text-right">
                <div className="flex items-center justify-end gap-1.5">
                    {/* Live tracking button styled in administrative primary green */}
                    <Link
                        href={route('user.orders.track', order.id)}
                        className="h-[28px] px-3 flex items-center justify-center gap-1.5 bg-[#008060] text-white rounded-[3px] hover:bg-[#006e52] transition-all shadow-sm text-[10px] font-bold active:scale-95"
                        title="Live Tracking"
                    >
                        <Truck size={12} strokeWidth={2.5} />
                        Track
                    </Link>
                    {/* Invoice Download styled in secondary light action style */}
                    <a
                        href={route('checkout.invoice', order.id)}
                        className="h-[28px] w-[28px] flex items-center justify-center bg-white text-[#6d7175] rounded-[3px] hover:bg-slate-50 border border-slate-200 hover:border-[#008060] hover:text-[#008060] transition-all shadow-xs"
                        title="Download Invoice"
                    >
                        <FileText size={14} />
                    </a>
                    {/* View Details Button styled to match list view triggers */}
                    <Link
                        href={route('user.orders.track', order.id)}
                        className="h-[28px] w-[28px] flex items-center justify-center bg-white text-[#6d7175] rounded-[3px] hover:bg-slate-50 border border-slate-200 hover:border-[#008060] hover:text-[#008060] transition-all shadow-xs"
                        title="View Details"
                    >
                        <Eye size={14} />
                    </Link>
                </div>
            </td>
        </tr>
    );
};

export default OrderRow;
