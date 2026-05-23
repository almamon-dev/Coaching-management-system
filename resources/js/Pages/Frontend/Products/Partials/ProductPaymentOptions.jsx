import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * ProductPaymentOptions Component
 * Renders the cash discount price and EMI options conditionally.
 * 
 * @param {Object} product - The product data object
 */
const ProductPaymentOptions = ({ product }) => {
    const [selected, setSelected] = useState('cash');

    const hasEmi = Boolean(product.has_emi);
    const emiDuration = product.emi_duration || 12;
    const emiPerMonth = Math.round(product.price / emiDuration);

    return (
        <div className="mb-4">
            <h3 className="text-[14px] font-bold text-[#081621] mb-5">Payment Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cash Discount Card */}
                <div 
                    onClick={() => setSelected('cash')}
                    className={cn(
                        "bg-white p-4 rounded-[1px] border-2 relative cursor-pointer group shadow-sm min-h-[100px] flex items-start gap-4 transition-all",
                        selected === 'cash' ? "border-[#3749bb]" : "border-slate-200 hover:border-slate-300"
                    )}
                >
                    <div className={cn(
                        "w-6 h-6 rounded-full shrink-0 mt-1 transition-all flex items-center justify-center",
                        selected === 'cash' ? "border-[6px] border-[#3749bb] bg-white" : "border-2 border-slate-300 bg-white"
                    )} />
                    <div>
                        <div className="text-[20px] font-bold text-[#081621] leading-none mb-1">
                            ৳{parseFloat(product.discount_price || product.price).toLocaleString()}
                        </div>
                        <div className="text-[13px] text-[#081621] font-medium">Cash Discount Price</div>
                        <div className="text-[12px] text-slate-400 mt-0.5">Online / Cash Payment</div>
                    </div>
                </div>

                {/* EMI Option Card */}
                <div 
                    onClick={() => {
                        if (hasEmi) setSelected('emi');
                    }}
                    className={cn(
                        "bg-white p-4 rounded-[1px] border-2 relative min-h-[100px] flex items-start gap-4 transition-all shadow-sm",
                        hasEmi
                            ? (selected === 'emi' ? "border-[#3749bb] cursor-pointer" : "border-slate-200 hover:border-slate-300 cursor-pointer group")
                            : "border-slate-50 opacity-50 cursor-not-allowed bg-slate-50/30"
                    )}
                >
                    <div className={cn(
                        "w-6 h-6 rounded-full shrink-0 mt-1 transition-all flex items-center justify-center",
                        !hasEmi ? "border-2 border-slate-200 bg-white" :
                        selected === 'emi' ? "border-[6px] border-[#3749bb] bg-white" : "border-2 border-slate-300 bg-white"
                    )} />
                    <div>
                        <div className="text-[20px] font-bold text-[#081621] leading-none mb-1">
                            ৳{emiPerMonth.toLocaleString()}/month
                        </div>
                        <div className="text-[13px] text-[#081621] font-medium">Regular Price: ৳{parseFloat(product.price).toLocaleString()}</div>
                        <div className="text-[12px] text-slate-400 mt-0.5">
                            {hasEmi ? `0% EMI for up to ${emiDuration} Months***` : 'EMI Not Available'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPaymentOptions;
