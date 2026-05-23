import React from 'react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Undo2 } from 'lucide-react';

const GeneralTab = ({
    data, setData, errors,
    generateSKU
}) => {

    return (
        <div className="space-y-8 ">
            {/* Basic Info Section */}
            <div className="space-y-4">
                <div className="border-b border-[#f6f6f7] pb-3">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-1">Basic Information</h3>
                    <p className="text-[12px] text-[#6d7175]">Configure the essential details of your product including name and SKU.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1.5 flex flex-col">
                        <div className="flex items-center h-[17px]">
                            <InputLabel value="Product Name" className="text-[13px] font-medium text-[#202223]" />
                        </div>
                        <TextInput
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full h-[32px] text-[12px]"
                            placeholder="e.g. iPhone 15 Pro Max"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                        <div className="flex items-center justify-between h-[17px]">
                            <InputLabel value="Product SKU" className="text-[13px] font-medium text-[#202223]" />
                            <button
                                type="button"
                                onClick={() => setData('sku', generateSKU())}
                                className="text-[#008060] hover:underline flex items-center gap-1 text-[11px] font-bold"
                            >
                                <Undo2 size={11} /> Regenerate SKU
                            </button>
                        </div>
                        <TextInput
                            type="text"
                            value={data.sku}
                            onChange={e => setData('sku', e.target.value)}
                            className="w-full h-[32px] text-[12px]"
                            placeholder="SKU-12345678"
                        />
                        <InputError message={errors.sku} />
                    </div>

                    <div className="space-y-1.5">
                        <InputLabel value="Warranty Information" className="text-[13px] font-medium text-[#202223]" />
                        <TextInput
                            type="text"
                            value={data.warranty}
                            onChange={e => setData('warranty', e.target.value)}
                            className="w-full h-[32px] text-[12px]"
                            placeholder="e.g. 1 Year, Lifetime"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <InputLabel value="Stock Quantity" className="text-[13px] font-medium text-[#202223]" />
                        <TextInput
                            type="number"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="w-full h-[32px] text-[12px]"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            {/* Status Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#f6f6f7] pb-2">
                    <h3 className="text-[13px] font-bold text-[#202223]">Status & Visibility</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1.5">
                        <InputLabel value="Inventory Status" className="text-[13px] font-medium text-[#202223]" />
                        <SelectInput value={data.status} onChange={val => setData('status', val)} className="w-full h-[32px] text-[12px]">
                            <option value={1}>In Stock</option>
                            <option value={2}>Out of Stock</option>
                            <option value={3}>Pre Order</option>
                            <option value={4}>Upcoming</option>
                        </SelectInput>
                    </div>
                    <div className="p-2 px-3 bg-[#f9fafb] border border-[#ebebeb] rounded-[4px] flex items-center justify-between group h-[32px] mt-auto">
                        <span className="text-[12px] font-bold text-[#202223]">Featured Product</span>
                        <label className="relative inline-flex items-center cursor-pointer scale-[0.65] origin-right">
                            <input type="checkbox" checked={data.is_featured} onChange={e => setData('is_featured', e.target.checked ? 1 : 0)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-[#ebebeb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008060]"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralTab;
