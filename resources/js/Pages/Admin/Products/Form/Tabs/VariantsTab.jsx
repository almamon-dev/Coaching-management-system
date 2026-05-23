import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import { Plus, Trash2, Tag, DollarSign, Package, ChevronDown } from 'lucide-react';

const VariantsTab = ({ data, setData, globalVariants = [] }) => {
    const variants = data.variants || [];

    const addVariant = () => {
        setData('variants', [
            ...variants,
            { name: '', sku: '', price: '', stock: '' }
        ]);
    };

    const updateVariant = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setData('variants', updated);
    };

    const removeVariant = (index) => {
        setData('variants', variants.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="border-b border-[#f6f6f7] pb-3 flex items-center justify-between">
                <div>
                    <h3 className="text-[14px] font-bold text-[#202223] mb-1">Product Variants</h3>
                    <p className="text-[12px] text-[#6d7175]">
                        Add variations of this product like different weights (e.g., 250g, 500g, 1kg) or sizes. 
                        Each variant can have its own price and stock.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#202223] text-[12px] font-semibold rounded-[4px] transition-colors border border-[#d2d5d8]"
                >
                    <Plus size={14} />
                    Add Variant
                </button>
            </div>

            {/* Variants List */}
            {variants.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-[#ebebeb] rounded-[8px] bg-[#fafafa]">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#ebebeb] flex items-center justify-center mx-auto mb-3">
                        <Tag className="text-[#8c9196]" size={20} />
                    </div>
                    <h4 className="text-[13px] font-semibold text-[#202223] mb-1">No Variants Added</h4>
                    <p className="text-[12px] text-[#6d7175] mb-4 max-w-sm mx-auto">
                        This product currently has no variants. Add variants if you sell this product in different options.
                    </p>
                    <button
                        type="button"
                        onClick={addVariant}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#008060] text-white hover:bg-[#006e52] text-[13px] font-bold rounded-[4px] transition-colors"
                    >
                        <Plus size={16} />
                        Add First Variant
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {variants.map((variant, index) => (
                        <div key={index} className="flex flex-wrap lg:flex-nowrap items-start gap-4 p-4 border border-[#ebebeb] rounded-[6px] bg-[#fafafa] relative group transition-all hover:border-[#d2d5d8]">
                            
                            <div className="flex-1 min-w-[220px]">
                                <InputLabel value="Variant Name (e.g., 500g)" className="text-[12px] mb-1.5 font-bold text-[#081621]" />
                                <SelectInput
                                    value={variant.name}
                                    onChange={e => updateVariant(index, 'name', e.target.value)}
                                    icon={Tag}
                                    placeholder="Select Variant Option"
                                    className="w-full h-[36px] shadow-sm [&>button]:border-[#d2d5d8] [&>button]:shadow-sm"
                                >
                                    <option value="">Select Variant Option</option>
                                    {globalVariants.flatMap(gv => 
                                        gv.options.map(opt => (
                                            <option key={opt.id} value={`${gv.name} - ${opt.value}`}>
                                                {gv.name} - {opt.value}
                                            </option>
                                        ))
                                    )}
                                </SelectInput>
                            </div>

                            <div className="w-full sm:w-[180px]">
                                <InputLabel value="SKU (Optional)" className="text-[12px] mb-1.5 font-bold text-[#081621]" />
                                <TextInput
                                    value={variant.sku}
                                    onChange={e => updateVariant(index, 'sku', e.target.value)}
                                    placeholder="SKU-123"
                                    className="w-full h-[36px] text-[13px] bg-white shadow-sm"
                                />
                            </div>

                            <div className="w-full sm:w-[140px]">
                                <InputLabel value="Price" className="text-[12px] mb-1.5 font-bold text-[#081621]" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign size={14} className="text-[#8c9196]" />
                                    </div>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={variant.price}
                                        onChange={e => updateVariant(index, 'price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-9 h-[36px] text-[13px] bg-white shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-[140px]">
                                <InputLabel value="Stock" className="text-[12px] mb-1.5 font-bold text-[#081621]" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Package size={14} className="text-[#8c9196]" />
                                    </div>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        value={variant.stock}
                                        onChange={e => updateVariant(index, 'stock', e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-9 h-[36px] text-[13px] bg-white shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-[26px] shrink-0">
                                <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="w-[36px] h-[36px] flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-[4px] transition-all"
                                    title="Remove Variant"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VariantsTab;
