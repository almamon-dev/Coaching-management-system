import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';


const PricingTab = ({ data, setData }) => {
    return (
        <div className="space-y-8 ">
            <div className="border-b border-[#f6f6f7] pb-3">
                <h3 className="text-[14px] font-bold text-[#202223] mb-1">Pricing</h3>
                <p className="text-[12px] text-[#6d7175]">Set your product's retail price and configure discount or EMI options.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                <div className="space-y-1.5">
                    <InputLabel value="Sale / Discount Price (৳)" className="text-[13px] font-medium text-[#202223]" />
                    <TextInput
                        type="number"
                        value={data.discount_price}
                        onChange={e => setData("discount_price", e.target.value)}
                        className="w-full h-[36px] text-[13px]"
                        placeholder="optional"
                    />
                </div>

                {/* EMI Toggle Switch */}
                <div className="col-span-2 p-2 px-3 bg-[#f9fafb] border border-[#ebebeb] rounded-[4px] flex items-center justify-between group h-[36px] mt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-[#202223]">Enable EMI Options</span>
                        <span className="text-[10px] text-[#6d7175] font-medium hidden sm:inline">(Monthly installments)</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-[0.75] origin-right">
                        <input type="checkbox" checked={data.has_emi} onChange={e => setData('has_emi', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#ebebeb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008060]"></div>
                    </label>
                </div>

                {data.has_emi && (
                    <>
                        <div className="space-y-1.5">
                            <InputLabel value="EMI Monthly (৳/month)" className="text-[13px] font-medium text-[#202223]" />
                            <TextInput
                                type="number"
                                value={data.emi_monthly}
                                onChange={e => setData("emi_monthly", e.target.value)}
                                className="w-full h-[36px] text-[13px]"
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel value="EMI Duration (months)" className="text-[13px] font-medium text-[#202223]" />
                            <TextInput
                                type="number"
                                value={data.emi_duration}
                                onChange={e => setData('emi_duration', e.target.value)}
                                className="w-full h-[36px] text-[13px]"
                                placeholder="12"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PricingTab;
