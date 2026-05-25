import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

/**
 * ProductPaymentOptions Component
 * Renders the Payment and Warranty information box (Grogin style).
 */
const ProductPaymentOptions = () => {
    return (
        <div className="bg-white rounded-md p-6 border border-slate-200 flex flex-col gap-5">
            <div className="flex gap-4">
                <div className="mt-1">
                    <CreditCard size={20} className="text-slate-400" />
                </div>
                <div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                        <strong className="text-slate-800">Payment.</strong> Payment upon receipt of goods, Payment by card in the department, Google Pay, Online card, -5% discount in case of payment
                    </p>
                </div>
            </div>
            
            <div className="w-full h-px bg-slate-200"></div>

            <div className="flex gap-4">
                <div className="mt-1">
                    <ShieldCheck size={20} className="text-slate-400" />
                </div>
                <div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                        <strong className="text-slate-800">Warranty.</strong> The Consumer Protection Act does not provide for the return of this product of proper quality.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductPaymentOptions;
