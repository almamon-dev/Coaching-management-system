import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';
import OrderRow from './OrderRow';

const OrdersTable = ({ orders }) => {
    const hasOrders = (orders?.data && orders.data.length > 0) || (Array.isArray(orders) && orders.length > 0);

    if (!hasOrders) {
        return (
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-16 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ebebeb]">
                    <Package size={36} className="text-slate-300" />
                </div>
                <h3 className="text-[18px] font-bold text-[#202223] mb-2">No Orders Found</h3>
                <p className="text-[#6d7175] text-[13px] font-medium max-w-[300px] mx-auto mb-8 leading-relaxed">
                    It looks like you haven't placed any orders yet. Start exploring our latest gadgets today!
                </p>
                <Link 
                    href="/" 
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#008060] text-white text-[12px] font-bold rounded-[3px] hover:bg-[#006e52] transition-all shadow-sm active:scale-95 uppercase tracking-wider"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px] border-collapse">
                    <thead className="bg-[#f7f7f7] border-b border-[#ebebeb] text-[#303030] text-[12px] font-semibold">
                        <tr>
                            <th className="px-5 py-3 text-[12px] font-semibold text-[#303030]">Order ID</th>
                            <th className="px-5 py-3 text-[12px] font-semibold text-[#303030]">Date</th>
                            <th className="px-5 py-3 text-[12px] font-semibold text-[#303030] text-center">Items</th>
                            <th className="px-5 py-3 text-[12px] font-semibold text-[#303030]">Total Amount</th>
                            <th className="px-5 py-3 text-[12px] font-semibold text-[#303030]">Order Status</th>
                            <th className="px-5 py-3 text-[12px] font-semibold text-[#303030]">Payment Status</th>
                            <th className="px-5 py-3 text-[12px] font-semibold text-[#303030] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebebeb] bg-white text-[12.5px] font-medium text-[#202223]">
                        {orders?.data ? (
                            orders.data.map((order) => (
                                <OrderRow key={order.id} order={order} />
                            ))
                        ) : Array.isArray(orders) ? (
                            orders.map((order) => (
                                <OrderRow key={order.id} order={order} />
                            ))
                        ) : null}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            {orders?.links && orders.links.length > 3 && (
                <div className="p-4 border-t border-[#ebebeb] flex justify-center bg-[#f7f7f7]">
                    <div className="flex items-center gap-1.5">
                        {orders.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                disabled={!link.url || link.active}
                                className={cn(
                                    "px-2.5 py-1 text-[11px] font-bold border rounded-[3px] transition-all",
                                    link.active 
                                        ? "bg-[#008060] border-[#008060] text-white shadow-xs" 
                                        : "bg-white border-[#d1d1d1] text-[#6d7175] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersTable;
