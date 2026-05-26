import React, { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

const PricingTab = ({ data, setData }) => {
    const [hasDiscount, setHasDiscount] = useState(parseFloat(data.discount_price) > 0);
    const [discountType, setDiscountType] = useState(data.discount_end_date ? 'limited' : 'lifetime');

    const handleDiscountToggle = (e) => {
        const checked = e.target.checked;
        setHasDiscount(checked);
        if (!checked) {
            setData('discount_price', '');
            setTimeout(() => setData('discount_value', ''), 10);
        }
    };

    const handleTypeChange = (type) => {
        setDiscountType(type);
        if (type === 'lifetime') {
            setData('discount_start_date', '');
            setData('discount_end_date', '');
        }
    };

    useEffect(() => {
        if (!hasDiscount) return;
        if (data.discount_value && data.price) {
            const price = parseFloat(data.price) || 0;
            const discountVal = parseFloat(data.discount_value) || 0;
            let finalPrice = price;

            if (data.discount_type === 'percentage') {
                finalPrice = price - (price * discountVal / 100);
            } else {
                finalPrice = price - discountVal;
            }

            finalPrice = Math.max(0, finalPrice).toFixed(2);
            
            if (parseFloat(data.discount_price) !== parseFloat(finalPrice)) {
                setData('discount_price', finalPrice);
            }
        }
    }, [data.price, data.discount_type, data.discount_value, hasDiscount]);

    return (
        <div className="space-y-8 ">
            <div className="border-b border-[#f6f6f7] pb-3">
                <h3 className="text-[14px] font-bold text-[#202223] mb-1">Pricing</h3>
                <p className="text-[12px] text-[#6d7175]">Set your product's retail price and configure discounts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div className="space-y-1.5">
                    <InputLabel value="Regular Price (৳)" className="text-[13px] font-medium text-[#202223]" />
                    <TextInput
                        type="number"
                        value={data.price}
                        onChange={e => setData("price", e.target.value)}
                        className="w-full h-[36px] text-[13px]"
                        placeholder="0.00"
                    />
                </div>

                {/* Discount Toggle Switch */}
                <div className="p-2 px-3 bg-[#f9fafb] border border-[#ebebeb] rounded-[4px] flex items-center justify-between group h-[36px] mt-auto mb-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-[#202223]">Enable Discount</span>
                        <span className="text-[10px] text-[#6d7175] font-medium hidden sm:inline">(Offer a sale price)</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-[0.75] origin-right">
                        <input type="checkbox" checked={hasDiscount} onChange={handleDiscountToggle} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#ebebeb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008060]"></div>
                    </label>
                </div>

                {hasDiscount && (
                    <div className="col-span-2 bg-[#f9fafb] border border-[#ebebeb] rounded-[4px] p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-1.5">
                            <InputLabel value="Discount Amount" className="text-[13px] font-medium text-[#202223]" />
                            <div className="flex">
                                <select
                                    value={data.discount_type}  
                                    onChange={e => setData('discount_type', e.target.value)}
                                    className="h-[36px] border-slate-200 bg-slate-50 text-[13px] text-[#202223] focus:border-[#008060] focus:ring-[#008060] rounded-l-[4px] border-r-0 outline-none"
                                >
                                    <option value="percentage">% Percent</option>
                                    <option value="fixed">৳ Fixed</option>
                                </select>
                                <TextInput
                                    type="number"
                                    value={data.discount_value}
                                    onChange={e => setData("discount_value", e.target.value)}
                                    className="w-full h-[36px] text-[13px] border-slate-200 focus:border-[#008060] focus:ring-[#008060] rounded-l-none"
                                    placeholder="0"
                                />
                            </div>
                            {data.discount_price && data.discount_value && (
                                <p className="text-[11px] text-[#008060] font-medium mt-1 pl-1">
                                    Final Customer Price: <span className="font-bold">৳{parseFloat(data.discount_price).toLocaleString()}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 mt-auto mb-1">
                            <InputLabel value="Discount Duration" className="text-[13px] font-bold text-[#202223]" />
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="discount_type" 
                                        value="lifetime" 
                                        checked={discountType === 'lifetime'} 
                                        onChange={() => handleTypeChange('lifetime')}
                                        className="text-[#008060] focus:ring-[#008060]"
                                    />
                                    <span className="text-[13px] text-[#202223]">Lifetime</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="discount_type" 
                                        value="limited" 
                                        checked={discountType === 'limited'} 
                                        onChange={() => handleTypeChange('limited')}
                                        className="text-[#008060] focus:ring-[#008060]"
                                    />
                                    <span className="text-[13px] text-[#202223]">Limited Time</span>
                                </label>
                            </div>
                        </div>

                        {discountType === 'limited' && (
                            <>
                                <div className="space-y-1.5 mt-2">
                                    <InputLabel value="Discount Start Date" className="text-[13px] font-medium text-[#202223]" />
                                    <TextInput
                                        type="datetime-local"
                                        value={data.discount_start_date || ''}
                                        onChange={e => setData("discount_start_date", e.target.value)}
                                        className="w-full h-[36px] text-[13px] border-slate-200 focus:border-[#008060] focus:ring-[#008060]"
                                    />
                                </div>
                                <div className="space-y-1.5 mt-2">
                                    <InputLabel value="Discount End Date" className="text-[13px] font-medium text-[#202223]" />
                                    <TextInput
                                        type="datetime-local"
                                        value={data.discount_end_date || ''}
                                        onChange={e => setData("discount_end_date", e.target.value)}
                                        className="w-full h-[36px] text-[13px] border-slate-200 focus:border-[#008060] focus:ring-[#008060]"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingTab;
