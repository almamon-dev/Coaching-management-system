import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import InputLabel from '@/Components/Form/InputLabel';

const DeliveryMethods = ({ formData, setFormData }) => {
    const methods = [
        { id: 'home', label: 'Home Delivery', price: 200 },
        { id: 'express', label: 'Request Express', price: 300 },
    ];

    return (
        <div className="space-y-4">
            <p className="text-[14px] text-slate-500 mb-2">Select a delivery method</p>

            <RadioGroup
                value={formData.deliveryMethod}
                onValueChange={(val) => setFormData('deliveryMethod', val)}
                className="space-y-2"
            >
                {methods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={`delivery-${method.id}`} />
                        <label
                            htmlFor={`delivery-${method.id}`}
                            className={`text-[14px] cursor-pointer transition-all ${formData.deliveryMethod === method.id
                                    ? 'text-[#081621] font-bold'
                                    : 'text-slate-700 hover:text-slate-900'
                                }`}
                        >
                            {method.label} - {method.price} Tk
                        </label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default DeliveryMethods;
