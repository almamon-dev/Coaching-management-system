import React from 'react';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { Plus, Undo2, Save, Loader2,  } from 'lucide-react';
import { cn } from '@/lib/utils';

const ClassificationTab = ({
    data, setData,
    brands, categories,
    isAddingBrand, setIsAddingBrand,
    isAddingCategory, setIsAddingCategory,
    newBrandName, setNewBrandName,
    newCategoryName, setNewCategoryName,
    parentCategoryId, setParentCategoryId,
    handleQuickAddBrand, handleQuickAddCategory,
    isSavingQuick
}) => {
    // Helper function to flatten hierarchical categories for the select input
    const flattenCategories = (cats, prefix = '') => {
        let items = [];
        if (!cats) return items;
        cats.forEach(cat => {
            items.push({ id: cat.id, name: prefix + cat.name });
            if (cat.children && cat.children.length > 0) {
                items = [...items, ...flattenCategories(cat.children, prefix + cat.name + ' > ')];
            }
        });
        return items;
    };

    const flatCategories = flattenCategories(categories);
    return (
        <div className="space-y-8 ">
            {/* Standard Header Section */}
            <div className="border-b border-[#f6f6f7] pb-3">
                <h3 className="text-[14px] font-bold text-[#202223] mb-1">Classification</h3>
                <p className="text-[12px] text-[#6d7175]">Organize your product by assigning it to a brand and category hierarchy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Brand Selection Card */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <InputLabel value="Brand Selection" className="text-[13px] font-medium text-[#202223]" />
                        <button
                            type="button"
                            onClick={() => setIsAddingBrand(!isAddingBrand)}
                            className="text-[11px] font-bold text-[#008060] hover:underline flex items-center gap-1"
                        >
                            {isAddingBrand ? <Undo2 size={12} /> : <Plus size={12} />}
                            {isAddingBrand ? 'Cancel' : 'Quick Add'}
                        </button>
                    </div>

                    <div className="relative">
                        {!isAddingBrand ? (
                            <SelectInput
                                value={data.brand_id}
                                onChange={e => setData('brand_id', e.target.value)}
                                className="w-full h-[36px] text-[13px]"
                            >
                                <option value="">Select brand</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </SelectInput>
                        ) : (
                            <div className="flex gap-1.5 p-1 bg-[#f9fafb] border border-[#ebebeb] rounded-[4px] h-[42px]">
                                <TextInput
                                    value={newBrandName}
                                    onChange={e => setNewBrandName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleQuickAddBrand()}
                                    placeholder="Brand name..."
                                    className="flex-1 border-none bg-transparent h-full text-[13px] focus:ring-0"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleQuickAddBrand}
                                    disabled={isSavingQuick || !newBrandName}
                                    className="px-4 bg-[#008060] text-white rounded-[2px] flex items-center gap-2 hover:bg-[#006e52] active:scale-95 transition-all disabled:opacity-50 font-bold text-[11px]"
                                >
                                    {isSavingQuick ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Selection Card - Hierarchical View */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <InputLabel value="Category Hierarchy" className="text-[13px] font-medium text-[#202223]" />
                        <button
                            type="button"
                            onClick={() => {
                                if (!isAddingCategory) {
                                    const parentId = data.sub_category_id || data.category_id || '';
                                    setParentCategoryId(parentId);
                                }
                                setIsAddingCategory(!isAddingCategory);
                            }}
                            className="text-[11px] font-bold text-[#008060] hover:underline flex items-center gap-1"
                        >
                            {isAddingCategory ? <Undo2 size={12} /> : <Plus size={12} />}
                            {isAddingCategory ? 'Cancel' : 'Quick Add'}
                        </button>
                    </div>

                    {!isAddingCategory ? (
                        <div className="relative ml-2 pb-2">
                            <div className="absolute left-0 top-4 bottom-8 w-[1.5px] bg-[#f1f2f4]" />
                            
                            <div className="space-y-6">
                                {/* Level 1: Main */}
                                <div className="relative flex items-center pl-6">
                                    <div className="absolute left-[-4.5px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-white border-2 border-[#d1d1d1] flex items-center justify-center z-10">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", data.category_id ? 'bg-[#008060]' : 'bg-[#d1d1d1]')} />
                                    </div>
                                    <div className="flex-1">
                                        <SelectInput
                                            value={data.category_id}
                                            onChange={e => setData(prev => ({...prev, category_id: e.target.value, sub_category_id: '', sub_sub_category_id: ''}))}
                                            className="w-full h-[36px] text-[13px]"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.filter(c => !c.parent_id).map(cat => (
                                                <option key={cat.id} value={cat.id} data-image={cat.image}>{cat.name}</option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                </div>

                                {/* Level 2: Sub */}
                                {data.category_id && (
                                    <div className="relative flex items-center pl-6">
                                        <div className="absolute left-[-4.5px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-white border-2 border-[#d1d1d1] flex items-center justify-center z-10">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", data.sub_category_id ? 'bg-[#008060]' : 'bg-[#d1d1d1]')} />
                                        </div>
                                        <div className="flex-1">
                                            <SelectInput
                                                value={data.sub_category_id}
                                                onChange={e => setData(prev => ({...prev, sub_category_id: e.target.value, sub_sub_category_id: ''}))}
                                                className="w-full h-[36px] text-[13px]"
                                            >
                                                <option value="">2. Sub Category</option>
                                                {categories.find(c => c.id == data.category_id)?.children?.map(sub => (
                                                    <option key={sub.id} value={sub.id} data-image={sub.image}>{sub.name}</option>
                                                ))}
                                            </SelectInput>
                                        </div>
                                    </div>
                                )}

                                {/* Level 3: Sub-Sub */}
                                {data.sub_category_id && (
                                    <div className="relative flex items-center pl-6">
                                        <div className="absolute left-[-4.5px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-white border-2 border-[#d1d1d1] flex items-center justify-center z-10">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", data.sub_sub_category_id ? 'bg-[#008060]' : 'bg-[#d1d1d1]')} />
                                        </div>
                                        <div className="flex-1">
                                            <SelectInput
                                                value={data.sub_sub_category_id}
                                                onChange={e => setData('sub_sub_category_id', e.target.value)}
                                                className="w-full h-[36px] text-[13px]"
                                            >
                                                <option value="">3. Sub-Sub Category</option>
                                                {categories
                                                    .find(c => c.id == data.category_id)
                                                    ?.children?.find(s => s.id == data.sub_category_id)
                                                    ?.children?.map(ss => (
                                                        <option key={ss.id} value={ss.id} data-image={ss.image}>{ss.name}</option>
                                                    ))}
                                            </SelectInput>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                             <div className="flex gap-1.5 p-1 bg-[#f9fafb] border border-[#ebebeb] rounded-[4px] h-[42px]">
                                <TextInput
                                    value={newCategoryName}
                                    onChange={e => setNewCategoryName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleQuickAddCategory()}
                                    placeholder="Category Name..."
                                    className="flex-1 border-none bg-transparent h-full text-[13px] focus:ring-0"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleQuickAddCategory}
                                    disabled={isSavingQuick || !newCategoryName}
                                    className="px-4 bg-[#008060] text-white rounded-[2px] flex items-center gap-2 hover:bg-[#006e52] active:scale-95 transition-all disabled:opacity-50 font-bold text-[11px]"
                                >
                                    {isSavingQuick ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save
                                </button>
                             </div>
                             <p className="mt-2 text-[11px] text-[#6d7175] font-medium flex items-center gap-1.5 pl-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#008060]" />
                                Parent: <span className="text-[#202223] font-bold">{flatCategories.find(c => c.id == parentCategoryId)?.name || 'Main Catalog'}</span>
                             </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassificationTab;
