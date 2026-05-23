import React, { useState, useMemo, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Package, Layers, Globe, Search, X, Check, Filter, ListChecks, CheckSquare, RotateCcw, Hash, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";

const ApplicabilityTab = ({ data, setData, errors, categories = [], products = [], brands = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedParentCategories, setSelectedParentCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [selectedSubSubCategories, setSelectedSubSubCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [isHoveredId, setIsHoveredId] = useState(null);

    const selectedObjects = useMemo(() => {
        if (!data.target_ids || data.target_ids.length === 0) return [];
        const pool = data.applies_to === 'category' ? categories : products;
        return data.target_ids.map(id => pool.find(item => item.id?.toString() === id.toString())).filter(Boolean);
    }, [data.target_ids, categories, products, data.applies_to]);

    // Filter categories into parent and sub
    const parentCategories = useMemo(() => categories.filter(c => !c.parent_id), [categories]);
    const subCategories = useMemo(() => {
        if (selectedParentCategories.length === 0) return [];
        const selParentStrs = selectedParentCategories.map(id => id.toString());
        return categories.filter(c => selParentStrs.includes(c.parent_id?.toString()));
    }, [categories, selectedParentCategories]);

    const subSubCategories = useMemo(() => {
        if (selectedSubCategories.length === 0) return [];
        const selSubStrs = selectedSubCategories.map(id => id.toString());
        return categories.filter(c => selSubStrs.includes(c.parent_id?.toString()));
    }, [categories, selectedSubCategories]);

    const items = useMemo(() => (data.applies_to === 'category' ? categories : products), [data.applies_to, categories, products]);

    // Comprehensive filtering logic
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = (item.name || item.title || "").toLowerCase().includes(searchLower) ||
                (item.sku || "").toLowerCase().includes(searchLower) ||
                item.id.toString().includes(searchTerm);

            if (data.applies_to === 'product') {
                const matchesBrand = selectedBrand === 'all' ? true : item.brand_id?.toString() === selectedBrand.toString();

                let matchesCategory = true;
                const itemCategoryIds = (item.category_ids || []).map(id => id.toString());

                const selParentStrs = selectedParentCategories.map(id => id.toString());
                const selSubStrs = selectedSubCategories.map(id => id.toString());
                const selSubSubStrs = selectedSubSubCategories.map(id => id.toString());

                if (selSubSubStrs.length > 0) {
                    matchesCategory = itemCategoryIds.some(id => selSubSubStrs.includes(id));
                } else if (selSubStrs.length > 0) {
                    matchesCategory = itemCategoryIds.some(id => selSubStrs.includes(id));
                } else if (selParentStrs.length > 0) {
                    matchesCategory = itemCategoryIds.some(id => selParentStrs.includes(id));
                }

                return matchesSearch && matchesBrand && matchesCategory;
            }

            if (data.applies_to === 'category') {
                let matchesHierarchy = true;
                const selParentStrs = selectedParentCategories.map(id => id.toString());
                const selSubStrs = selectedSubCategories.map(id => id.toString());

                if (selSubStrs.length > 0) {
                    matchesHierarchy = selSubStrs.includes(item.parent_id?.toString());
                } else if (selParentStrs.length > 0) {
                    matchesHierarchy = selParentStrs.includes(item.parent_id?.toString());
                } else {
                    // Default: show only root categories in the grid if no filters active
                    matchesHierarchy = !item.parent_id;
                }
                return matchesSearch && matchesHierarchy;
            }

            return matchesSearch;
        });
    }, [items, searchTerm, selectedParentCategories, selectedSubCategories, selectedSubSubCategories, selectedBrand, data.target_ids, data.applies_to]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedParentCategories, selectedSubCategories, selectedSubSubCategories, selectedBrand, data.applies_to]);

    // Pagination Logic
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const fromItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const toItem = Math.min(currentPage * itemsPerPage, totalItems);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const toggleSelection = (id) => {
        const idStr = id.toString();
        const ids = (data.target_ids || []).map(i => i.toString());

        if (ids.includes(idStr)) {
            setData('target_ids', ids.filter(i => i !== idStr));
        } else {
            setData('target_ids', [...ids, idStr]);
        }
    };

    const selectAllVisible = () => {
        const currentIds = (data.target_ids || []).map(i => i.toString());
        const visibleIds = filteredItems.map(item => item.id.toString());
        const uniqueIds = Array.from(new Set([...currentIds, ...visibleIds]));
        setData('target_ids', uniqueIds);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Applicability type selector */}
            <div>
                <div className="mb-6">
                    <h3 className="text-[15px] font-bold text-[#081621] flex items-center gap-2">
                        Target audience and scope
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Select the scope of this discount campaign</p>
                </div>

                <div className="flex border-b border-slate-200 mb-8">
                    {[
                        { id: 'all', label: 'Global store', icon: Globe },
                        { id: 'category', label: 'By categories', icon: Layers },
                        { id: 'product', label: 'By products', icon: Package },
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setData('applies_to', item.id);
                                setData('target_ids', []);
                                setSearchTerm("");
                                setSelectedParentCategories([]);
                                setSelectedSubCategories([]);
                                setSelectedSubSubCategories([]);
                                setSelectedBrand('all');
                            }}
                            className={`flex items-center gap-2 px-6 py-4 text-[13px] font-bold border-b-2 transition-all ${data.applies_to === item.id
                                ? 'border-[#ef4a23] text-[#ef4a23]'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced filtering section */}
            {data.applies_to !== 'all' && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-white rounded-[1px] border border-slate-200 overflow-hidden shadow-sm">
                        {/* Filter bar */}
                        <div className="p-3 border-b border-slate-100 bg-slate-50/50 space-y-3.5">
                            {/* Top Row: Search and Bulk Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="relative w-full sm:w-72 md:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                                    <TextInput
                                        type="text"
                                        placeholder={data.applies_to === 'category' ? "Search category name..." : "Search name or SKU..."}
                                        className="pl-10 pr-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 z-10"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedParentCategories([]);
                                            setSelectedSubCategories([]);
                                            setSelectedSubSubCategories([]);
                                            setSearchTerm("");
                                            setSelectedBrand('all');
                                        }}
                                        className="h-[40px] px-4 bg-white border border-slate-200 text-slate-500 rounded-[1px] text-[11px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                                    >
                                        <RotateCcw size={16} />
                                        Reset Filters
                                    </button>
                                    <button type="button" onClick={selectAllVisible} className="h-[40px] px-5 bg-slate-800 text-white rounded-[1px] text-[11px] font-bold hover:bg-[#ef4a23] transition-all flex items-center gap-2 shadow-sm whitespace-nowrap">
                                        <CheckSquare size={16} />
                                        Select all items
                                    </button>

                                </div>
                            </div>

                            {/* Bottom Row: Filters */}
                            <div className="flex flex-wrap items-center gap-3">

                                {(data.applies_to === 'product' || data.applies_to === 'category') && (
                                    <>
                                        <SelectInput
                                            multiple={true}
                                            value={selectedParentCategories}
                                            onChange={(e) => {
                                                setSelectedParentCategories(e.target.value);
                                                setSelectedSubCategories([]);
                                                setSelectedSubSubCategories([]);
                                            }}
                                            placeholder="Select categories..."
                                            options={parentCategories.map(c => ({ id: c.id, name: c.name }))}
                                            className="w-[200px] h-[40px]"
                                        />

                                        {selectedParentCategories.length > 0 && (
                                            <SelectInput
                                                multiple={true}
                                                value={selectedSubCategories}
                                                onChange={(e) => {
                                                    setSelectedSubCategories(e.target.value);
                                                    setSelectedSubSubCategories([]);
                                                }}
                                                placeholder="Sub-categories..."
                                                options={subCategories.map(c => ({ id: c.id, name: c.name }))}
                                                className="w-[200px] h-[40px] animate-in slide-in-from-left-2"
                                            />
                                        )}

                                        {data.applies_to === 'product' && selectedSubCategories.length > 0 && subSubCategories.length > 0 && (
                                            <SelectInput
                                                multiple={true}
                                                value={selectedSubSubCategories}
                                                onChange={(e) => setSelectedSubSubCategories(e.target.value)}
                                                placeholder="Sub-sub..."
                                                options={subSubCategories.map(c => ({ id: c.id, name: c.name }))}
                                                className="w-[200px] h-[40px] animate-in slide-in-from-left-2"
                                            />
                                        )}

                                        {data.applies_to === 'product' && (
                                            <SelectInput
                                                value={selectedBrand}
                                                onChange={(e) => setSelectedBrand(e.target.value)}
                                                options={[{ id: 'all', name: 'All brands' }, ...brands.map(b => ({ id: b.id, name: b.name }))]}
                                                className="w-[150px] h-[40px]"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Selected items quick view */}
                        {selectedObjects.length > 0 && (
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-full mb-1">Selected Items:</span>
                                {selectedObjects.map(item => (
                                    <div
                                        key={`tag-${item.id}`}
                                        className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-[1px] group/tag hover:border-[#ef4a23]/30 transition-all"
                                    >
                                        <span className="text-[11px] font-bold text-slate-600 group-hover/tag:text-[#ef4a23]">
                                            {item.name || item.title}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelection(item.id);
                                            }}
                                            className="text-slate-300 hover:text-[#ef4a23] transition-colors"
                                        >
                                            <X size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Items grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-slate-100 min-h-[200px] bg-white">
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item) => {
                                    const isChecked = (data.target_ids || []).some(id => id.toString() === item.id.toString());
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleSelection(item.id)}
                                            onMouseEnter={() => setIsHoveredId(item.id)}
                                            onMouseLeave={() => setIsHoveredId(null)}
                                            className={`py-2.5 px-3 cursor-pointer transition-all flex items-start gap-2.5 group relative border-l-2 ${isChecked
                                                ? 'bg-[#ef4a23]/[0.03] border-[#ef4a23] shadow-[0_2px_10px_rgba(239,74,35,0.03)]'
                                                : 'hover:bg-slate-50/80 border-transparent hover:border-slate-200'
                                                } ${isHoveredId === item.id ? '-translate-y-0.5' : ''}`}
                                        >
                                            <div className={`mt-0.5 w-4 h-4 border rounded-[1px] flex items-center justify-center flex-shrink-0 transition-all ${isChecked ? 'bg-[#ef4a23] border-[#ef4a23]' : 'border-slate-300 group-hover:border-[#ef4a23]'
                                                }`}>
                                                {isChecked && <Check size={12} strokeWidth={4} className="text-white" />}
                                            </div>
                                            <div className="flex flex-col flex-1 overflow-hidden">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`text-[12px] font-bold truncate ${isChecked ? 'text-[#ef4a23]' : 'text-slate-700'}`}>
                                                        {item.name || item.title}
                                                    </span>
                                                    {data.applies_to === 'category' && item.products_count !== undefined && (
                                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-[1px] ${isChecked ? 'bg-[#ef4a23] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                            {item.products_count}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[10px] text-slate-400 font-bold">
                                                        id: #{item.id.toString().padStart(5, '0')}
                                                    </span>
                                                    {item.sku && (
                                                        <span className="flex items-center gap-1 text-[9px] font-black text-slate-300 group-hover:text-slate-500 transition-colors">
                                                            <Hash size={10} /> {item.sku}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-300">
                                    <Search size={48} strokeWidth={1} />
                                    <p className="mt-4 text-[13px] font-bold text-slate-400 text-center px-10">No items match your specific filters</p>
                                </div>
                            )}
                        </div>

                        {/* Custom Pagination Footer matching Index styling */}
                        <div className="flex items-center justify-between px-8 py-4 border-t border-[#e3e4e8] bg-slate-50/30">
                            {/* Selected Items Indicator */}
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#ef4a23] animate-pulse" />
                                <span className="text-[11px] font-bold text-slate-700">
                                    {data.target_ids?.length || 0} items selected
                                </span>
                            </div>

                            {/* Pagination Controls */}
                            {totalItems > 0 && (
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[13px] text-[#727586]">

                                        </span>
                                        <div className="relative">
                                            <select
                                                value={itemsPerPage}
                                                onChange={(e) => {
                                                    setItemsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                                className="h-[38px] pl-4 pr-10 bg-white border border-[#e3e4e8] rounded-[6px] text-[13px] text-[#2f3344] font-medium appearance-none cursor-pointer focus:border-[#ef4a23] outline-none"
                                            >
                                                <option value="6">6</option>
                                                <option value="12">12</option>
                                                <option value="24">24</option>
                                                <option value="48">48</option>
                                                <option value="120">120</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#727586]">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className="text-[13px] text-[#2f3344] font-medium">
                                            {fromItem} - {toItem} of {totalItems}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#ef4a23] hover:bg-[#ef4a23]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#ef4a23] hover:bg-[#ef4a23]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Global scope illustration */}
            {data.applies_to === 'all' && (
                <div className="p-20 border-2 border-dashed border-slate-100 rounded-[1px] flex flex-col items-center text-center bg-slate-50/10 group relative">
                    <Globe className="text-[#ef4a23] mb-6 opacity-80 group-hover:scale-110 transition-transform duration-700" size={48} />
                    <h4 className="text-xl font-bold text-[#081621]">Global campaign active</h4>
                    <p className="text-sm text-slate-400 max-w-sm mt-3 font-medium">
                        This discount code will automatically apply to every single item in your store catalog.
                    </p>
                </div>
            )}

            <InputError message={errors.target_ids} />
        </div>
    );
};

export default ApplicabilityTab;
