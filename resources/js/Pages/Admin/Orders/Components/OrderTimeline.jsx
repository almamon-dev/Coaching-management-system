import React from 'react';
import { Package, Truck, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const OrderTimeline = ({ order }) => {
    const steps = [
        { id: 'pending', label: 'Pending', icon: <Clock size={16} /> },
        { id: 'processing', label: 'Processing', icon: <Package size={16} /> },
        { id: 'shipped', label: 'Shipped', icon: <Truck size={16} /> },
        { id: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={16} /> },
    ];

    const currentIndex = steps.findIndex(s => s.id === order.status);
    
    return (
        <div className="space-y-4">
            {/* Progress Card */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ebebeb] flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#202223]">Order Fulfillment</h3>
                    <div className="px-2 py-0.5 bg-[#e3f1df] text-[#008060] text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-tight">
                        <ShieldCheck size={10} /> Live Updates
                    </div>
                </div>

                <div className="p-6">
                    <div className="relative">
                        {/* Background Line */}
                        <div className="absolute top-[20px] left-[5%] right-[5%] h-[2px] bg-[#f1f1f1]" />
                        
                        {/* Active Progress Line */}
                        <div 
                            className="absolute top-[20px] left-[5%] h-[2px] bg-[#008060] transition-all duration-700 ease-in-out" 
                            style={{ width: `${(currentIndex / (steps.length - 1)) * 90}%` }}
                        />

                        <div className="flex justify-between relative z-10">
                            {steps.map((step, idx) => {
                                const isCompleted = idx <= currentIndex;
                                const isActive = idx === currentIndex;
                                
                                return (
                                    <div key={step.id} className="flex flex-col items-center w-[20%]">
                                        <div className={cn(
                                            "w-[40px] h-[40px] rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm",
                                            isCompleted ? "bg-[#008060] border-[#008060] text-white" : "bg-white border-[#ebebeb] text-[#bababa]"
                                        )}>
                                            {React.cloneElement(step.icon, { size: 18, strokeWidth: isCompleted ? 2.5 : 2 })}
                                        </div>
                                        <div className="mt-3 text-center">
                                            <p className={cn(
                                                "text-[11px] font-bold uppercase tracking-wider mb-0.5",
                                                isCompleted ? "text-[#202223]" : "text-[#6d7175]"
                                            )}>
                                                {step.label}
                                            </p>
                                            <p className={cn(
                                                "text-[10px] font-medium",
                                                isActive ? "text-[#008060] font-bold" : "text-[#bababa]"
                                            )}>
                                                {isActive ? 'In Progress' : isCompleted ? 'Completed' : 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity History Card */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ebebeb]">
                    <h3 className="text-[14px] font-bold text-[#202223]">Activity Log</h3>
                </div>
                
                <div className="p-4">
                    <div className="space-y-5 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#f1f1f1]">
                        {/* Placed Log */}
                        <div className="flex items-start gap-3.5 relative z-10">
                            <div className="w-[32px] h-[32px] bg-white border-2 border-[#008060] text-[#008060] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                <Clock size={14} strokeWidth={2.5} />
                            </div>
                            <div className="flex-grow pt-0.5">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[13px] font-bold text-[#202223]">Order Placed</p>
                                    <span className="text-[10px] text-[#6d7175] font-bold tabular-nums bg-[#f6f6f7] px-1.5 py-0.5 rounded-[4px]">
                                        {new Date(order.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </span>
                                </div>
                                <p className="text-[12px] text-[#6d7175] mt-1 leading-relaxed">
                                    The order was successfully created and verified by the system.
                                </p>
                            </div>
                        </div>

                        {/* Status Change Log (Dynamic placeholder) */}
                        {order.status !== 'pending' && (
                             <div className="flex items-start gap-3.5 relative z-10">
                                <div className="w-[32px] h-[32px] bg-white border-2 border-[#005bd3] text-[#005bd3] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                    <Package size={14} strokeWidth={2.5} />
                                </div>
                                <div className="flex-grow pt-0.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-[13px] font-bold text-[#202223]">Status Updated to {order.status}</p>
                                        <span className="text-[10px] text-[#6d7175] font-bold tabular-nums bg-[#f6f6f7] px-1.5 py-0.5 rounded-[4px]">
                                            Just now
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-[#6d7175] mt-1 leading-relaxed">
                                        Fulfillment status changed to <span className="font-bold text-[#202223] capitalize">{order.status}</span>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTimeline;
