import React from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const OrderItemTable = ({ items, orderStatus }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(price || 0).replace('BDT', '৳');
    };

    return (
        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm overflow-hidden mt-4">
            <div className="px-4 py-3 border-b border-[#ebebeb] flex items-center justify-between">
                <div>
                    <h3 className="text-[14px] font-bold text-[#202223]">Products</h3>
                </div>
                <div className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">
                    {items.length} {items.length > 1 ? 'Items' : 'Item'}
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f9fafb] text-[#6d7175] text-[11px] font-bold uppercase tracking-wider border-b border-[#ebebeb]">
                        <tr>
                            <th className="pl-4 pr-3 py-2.5 w-[50%]">Item Details</th>
                            <th className="px-3 py-2.5 text-center">Status</th>
                            <th className="px-3 py-2.5 text-center">Qty</th>
                            <th className="px-3 py-2.5 text-right">Price</th>
                            <th className="pl-3 pr-4 py-2.5 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f1f1]">
                        {items.map((item, i) => (
                            <tr key={i} className="hover:bg-[#f9fafb] transition-colors">
                                <td className="pl-4 pr-3 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white border border-[#ebebeb] rounded-[4px] flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1">
                                            {item.product?.primary_image?.full_url || item.product?.primaryImage?.full_url || item.product?.thumbnail || item.image ? (
                                                <img 
                                                    src={item.product?.primary_image?.full_url || item.product?.primaryImage?.full_url || item.product?.thumbnail || item.image} 
                                                    alt={item.product_name} 
                                                    className="w-full h-full object-contain" 
                                                />
                                            ) : (
                                                <Package size={20} className="text-[#bababa]" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-[#202223] text-[13px] leading-tight mb-1 truncate">{item.product_name}</div>
                                            <div className="text-[10px] text-[#6d7175] font-bold uppercase tracking-wider flex items-center gap-2">
                                                SKU: <span className="text-[#202223]">{item.product?.sku || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-center">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-tight",
                                        orderStatus === 'delivered' ? "bg-[#e3f1df] text-[#008060] border-[#aee9d1]" :
                                        orderStatus === 'shipped' ? "bg-[#e4f1ef] text-[#005bd3] border-[#a2c1f9]" :
                                        orderStatus === 'cancelled' ? "bg-[#fff0f0] text-[#bf0711] border-[#f9dada]" :
                                        "bg-[#f6f6f7] text-[#6d7175] border-[#d1d1d1]"
                                    )}>
                                        {orderStatus}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-center font-bold text-[#202223] text-[13px] tabular-nums">
                                    {item.quantity}
                                </td>
                                <td className="px-3 py-3 text-right font-medium text-[#6d7175] text-[13px] tabular-nums">
                                    {formatPrice(item.price)}
                                </td>
                                <td className="pl-3 pr-4 py-3 text-right font-bold text-[#202223] text-[13px] tabular-nums">
                                    {formatPrice(item.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Subtotal Summary */}
            <div className="bg-[#f9fafb] px-4 py-3 border-t border-[#ebebeb]">
                <div className="flex flex-col items-end gap-1.5">
                    <div className="flex justify-between w-[220px] text-[12px]">
                        <span className="text-[#6d7175] font-medium">Subtotal</span>
                        <span className="text-[#202223] font-bold">{formatPrice(items.reduce((acc, item) => acc + parseFloat(item.total), 0))}</span>
                    </div>
                    <div className="flex justify-between w-[220px] text-[12px]">
                        <span className="text-[#6d7175] font-medium">Tax</span>
                        <span className="text-[#202223] font-bold">{formatPrice(0)}</span>
                    </div>
                    <div className="h-[1px] w-[220px] bg-[#ebebeb] my-1" />
                    <div className="flex justify-between w-[220px] text-[14px]">
                        <span className="text-[#202223] font-black uppercase tracking-wider">Total</span>
                        <span className="text-[#008060] font-black">{formatPrice(items.reduce((acc, item) => acc + parseFloat(item.total), 0))}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItemTable;
