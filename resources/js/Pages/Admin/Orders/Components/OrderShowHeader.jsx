import React from 'react';
import { ArrowLeft, ChevronRight, Printer, Trash2, CreditCard, Package } from 'lucide-react';
import { Link } from '@inertiajs/react';
import SelectInput from '@/Components/SelectInput';
import { cn } from '@/lib/utils';

const OrderShowHeader = ({ order, onStatusUpdate, processing }) => {
    const statusOptions = [
        { id: 'pending', name: 'Pending' },
        { id: 'processing', name: 'Processing' },
        { id: 'shipped', name: 'Shipped' },
        { id: 'delivered', name: 'Delivered' },
        { id: 'cancelled', name: 'Cancelled' },
    ];

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
            <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6d7175] mb-2.5">
                    <Link href={route('admin.orders.index')} className="hover:text-[#005bd3] transition-colors flex items-center gap-1">
                        <ArrowLeft size={12} strokeWidth={3} />
                        Orders
                    </Link>
                    <ChevronRight size={12} className="text-[#bababa]" strokeWidth={3} />
                    <span className="text-[#202223]">Order #{order.order_number}</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <h1 className="text-[22px] font-bold text-[#202223] tracking-tight">Order #{order.order_number}</h1>
                    <div className="flex items-center gap-2">
                        {/* Delivery Status Badge */}
                        <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-tight",
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

                        {/* Payment Status Badge */}
                        <span className={cn(
                            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight uppercase border",
                            order.payment?.status === 'paid' 
                                ? "bg-[#e3f1df] text-[#008060] border-[#aee9d1]" 
                                : "bg-[#fff4e5] text-[#b98900] border-[#ffe2b3]"
                        )}>
                            {order.payment?.status || 'unpaid'}
                            <span className="ml-1 opacity-80">({order.payment_method || 'Online'})</span>
                        </span>
                    </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-[#6d7175]">
                    <span className="font-medium">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.created_at).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                    <span className="w-1 h-1 rounded-full bg-[#bababa]" />
                    <span className="font-medium">Order from Web Store</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    onClick={() => window.print()}
                    className="h-[36px] px-3 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] text-[12px] font-bold hover:bg-[#f6f6f7] transition-all flex items-center gap-1.5 shadow-sm"
                >
                    <Printer size={14} className="text-[#6d7175]" /> Print
                </button>

                <div className="w-[140px]">
                    <SelectInput
                        value={order.status}
                        onChange={(e) => onStatusUpdate(e.target.value)}
                        showSearch={false}
                        options={statusOptions}
                        disabled={processing}
                        className="[&_button]:h-[36px] [&_button]:font-bold [&_button]:text-[12px] [&_button]:shadow-sm"
                    />
                </div>
                
                <button className="h-[36px] w-[36px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#bf0711] rounded-[4px] hover:bg-[#fbeae5] transition-all shadow-sm">
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
};

export default OrderShowHeader;
