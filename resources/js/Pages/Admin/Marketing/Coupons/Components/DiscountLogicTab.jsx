import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Percent, DollarSign } from 'lucide-react';

const DiscountLogicTab = ({ data, setData, errors }) => {
    return (
        <div className="space-y-6 max-w-7xl">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <InputLabel value="Coupon Value Type (Discount / Balance)" />
                    <select
                        className="w-full h-[42px] px-4 bg-slate-50 border-slate-200 focus:border-[#ef4a23] focus:ring-[#ef4a23] rounded-[1px] text-[13px] font-bold"
                        value={data.discount_type}
                        onChange={e => setData('discount_type', e.target.value)}
                    >
                        <option value="fixed">Fixed Balance / Amount (৳)</option>
                        <option value="percentage">Percentage Discount (%)</option>
                    </select>
                    <InputError message={errors.discount_type} />
                </div>
                <div>
                    <InputLabel value={data.discount_type === 'percentage' ? "Coupon Value (%)" : "Coupon Balance (৳)"} />
                    <div className="relative">
                        {data.discount_type === 'percentage' ? (
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        ) : (
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        )}
                        <TextInput
                            type="number"
                            className="w-full pl-10"
                            placeholder="0.00"
                            value={data.discount_value}
                            onChange={e => setData('discount_value', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.discount_value} />
                </div>
            </div>
            <div>
                <InputLabel value="Minimum Spend Requirement (৳)" />
                <TextInput
                    type="number"
                    className="w-full"
                    placeholder="0.00"
                    value={data.min_purchase}
                    onChange={e => setData('min_purchase', e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-1 font-bold italic">The coupon becomes valid once the cart subtotal reaches this amount.</p>
                <InputError message={errors.min_purchase} />
            </div>
        </div>
    );
};

export default DiscountLogicTab;
