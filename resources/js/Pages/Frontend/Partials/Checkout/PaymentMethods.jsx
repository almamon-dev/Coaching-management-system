import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { CreditCard } from 'lucide-react';

const PaymentMethods = ({ formData, setFormData }) => {
    const methods = [
        { id: 'cash', label: 'Cash on Delivery' },
        { id: 'stripe', label: 'Online Payment' },
        { id: 'pos', label: 'POS on Delivery' },
    ];

    return (
        <div className="space-y-4">
            <p className="text-[14px] text-slate-500 mb-2">Select a payment method</p>
            
            <RadioGroup 
                value={formData.paymentMethod} 
                onValueChange={(val) => setFormData('paymentMethod', val)}
                className="space-y-2.5"
            >
                {methods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3 group cursor-pointer">
                        <RadioGroupItem 
                            value={method.id} 
                            id={`payment-${method.id}`} 
                            className="border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5]"
                        />
                        <label 
                            htmlFor={`payment-${method.id}`}
                            className={`text-[14px] cursor-pointer transition-all ${
                                formData.paymentMethod === method.id 
                                ? 'text-[#081621] font-bold' 
                                : 'text-slate-600 group-hover:text-slate-900'
                            }`}
                        >
                            {method.label}
                        </label>
                    </div>
                ))}
            </RadioGroup>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[13px] font-bold text-[#081621] mb-4">We Accept :</p>
                <div className="flex flex-wrap gap-2 items-center opacity-80">
                    <img src="https://www.startech.com.bd/catalog/view/theme/starship/assets/images/payment-methods.png" alt="Payments" className="h-7" />
                </div>
            </div>
        </div>
    );
};

export default PaymentMethods;
