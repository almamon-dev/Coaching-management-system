import React from 'react';
import { Truck, ShieldCheck, Banknote } from 'lucide-react';

/**
 * ProductPaymentOptions Component
 * Renders the Delivery, Payment, and Return information box in a compact style.
 */
const ProductPaymentOptions = () => {
    return (
        <div className="bg-slate-50 rounded p-4 border border-slate-200 flex flex-col gap-3">
            <div className="flex gap-3 items-start">
                <Truck size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[12px] text-slate-600 leading-tight">
                        <strong className="text-slate-800">Home Delivery:</strong> Delivery within 1-2 hours depending on location. Free delivery on orders over ৳500.
                    </p>
                </div>
            </div>
            
            <div className="flex gap-3 items-start">
                <Banknote size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[12px] text-slate-600 leading-tight">
                        <strong className="text-slate-800">Payment:</strong> Cash on Delivery, bKash, Nagad, and Credit/Debit Cards accepted.
                    </p>
                </div>
            </div>
            
            <div className="flex gap-3 items-start">
                <ShieldCheck size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[12px] text-slate-600 leading-tight">
                        <strong className="text-slate-800">Return Policy:</strong> Return fresh items within 2 hours if not satisfied. Other items within 3 days.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductPaymentOptions;
