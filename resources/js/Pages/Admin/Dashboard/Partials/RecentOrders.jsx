import React from 'react';
import {
    Smartphone,
    Headphones,
    Gamepad2,
    ChevronRight,
    Eye
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const RecentOrders = ({ orders }) => {
    return (
        <div className="rounded-[8px] border border-[#ebebeb] bg-white text-[#202223] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="p-4 border-b border-[#ebebeb] flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-[#202223] text-[15px]">Recent Orders</h3>
                    <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Latest customer transactions</p>
                </div>
                <Link 
                    href="#" 
                    className="text-[#008060] text-[12px] font-bold hover:underline flex items-center gap-1"
                >
                    View All <ChevronRight size={14} />
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                    <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                        <tr>
                            <th className="px-4 py-2.5 w-[120px]">Order ID</th>
                            <th className="px-4 py-2.5 w-[180px]">Customer</th>
                            <th className="px-4 py-2.5 w-[300px]">Product Summary</th>
                            <th className="px-4 py-2.5 w-[100px] text-center">Amount</th>
                            <th className="px-4 py-2.5 w-[120px] text-center">Status</th>
                            <th className="px-4 py-2.5 w-[120px] text-center">Date</th>
                            <th className="px-6 py-2.5 w-[100px] text-right text-[#202223]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebebeb]">
                        {orders?.map((order, idx) => (
                            <tr key={idx} className="hover:bg-[#f6f6f7] transition-colors group h-[48px]">
                                <td className="px-4 py-1">
                                    <span className="text-[12px] font-bold text-[#008060]">#{order.order_id}</span>
                                </td>
                                <td className="px-4 py-1">
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-bold text-[#202223]">{order.customer}</span>
                                        <span className="text-[10px] text-[#6d7175] font-medium tracking-tight">Standard Customer</span>
                                    </div>
                                </td>
                                <td className="px-4 py-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-[4px] bg-[#f7f7f7] flex-shrink-0 flex items-center justify-center border border-[#ebebeb]">
                                            {order.product?.toLowerCase().includes('headphone') || order.product?.toLowerCase().includes('audio') ? <Headphones size={14} className="text-[#bababa]" /> :
                                                order.product?.toLowerCase().includes('game') || order.product?.toLowerCase().includes('razer') ? <Gamepad2 size={14} className="text-[#bababa]" /> :
                                                    <Smartphone size={14} className="text-[#bababa]" />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[12px] font-bold text-[#202223] truncate" title={order.product}>
                                                {order.product}
                                            </span>
                                            <span className="text-[10px] text-[#6d7175] font-medium tracking-tight truncate">{order.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-1 text-center">
                                    <span className="text-[12px] font-bold text-[#202223]">৳{order.amount?.toFixed(2)}</span>
                                </td>
                                <td className="px-4 py-1 text-center whitespace-nowrap">
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-tight border",
                                        order.status === 'Delivered' ? 'bg-[#e4f1ef] text-[#008060] border border-[#d1e9e5]' :
                                        order.status === 'Processing' ? 'bg-[#e1f0ff] text-[#005bd3] border border-[#c6e3ff]' :
                                        'bg-[#fff4e5] text-[#965e00] border border-[#ffe9cc]'
                                    )}>
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full mr-1.5",
                                            order.status === 'Delivered' ? 'bg-[#008060]' :
                                            order.status === 'Processing' ? 'bg-[#005bd3]' :
                                            'bg-[#965e00]'
                                        )} />
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-1 text-center whitespace-nowrap">
                                    <span className="text-[11px] text-[#6d7175] font-bold tracking-tight">
                                        {order.date}
                                    </span>
                                </td>
                                <td className="px-6 py-1 text-right">
                                    <Link
                                        href="#"
                                        className="h-[26px] w-[26px] inline-flex items-center justify-center bg-[#f1f1f1] text-[#202223] rounded-[2px] border border-[#ebebeb] hover:bg-white hover:border-[#008060] hover:text-[#008060] transition-all"
                                        title="View Details"
                                    >
                                        <Eye size={12} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
