import React, { useState, useEffect, useCallback, memo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';


/**
 * ProductSidebar Component
 *
 * A high-performance filtering sidebar optimized for e-commerce.
 * Uses memoization and stable callbacks to minimize re-renders during high-frequency interactions.
 */
const ProductSidebar = memo(({
    category,
    brand,
    filters,
    priceRange,
    availableVariants,
    relevantBrands = [],
    subcategories = []
}) => {
    const { categories: globalCategories = [] } = usePage().props;

    // Safe priceRange with fallbacks — may be undefined while deferred data loads
    const safePriceRange = priceRange ?? { min: 0, max: 1000000 };

    // Initial state for accordion visibility
    const [openSections, setOpenSections] = useState({
        price: true,
        availability: true,
        status: true,
        brands: true,
        categories: true,
        ...availableVariants?.reduce((acc, variant) => ({ ...acc, [`variant_${variant.id}`]: true }), {})
    });

    // Search state for variants
    const [variantSearches, setVariantSearches] = useState({});

    // Local filter state for optimistic UI feedback
    const [localFilters, setLocalFilters] = useState({
        ...filters,
        variants: filters.variants || {}
    });



    // Price state management for dual-range slider
    const [localPrices, setLocalPrices] = useState({
        min: Number(filters.min_price || safePriceRange.min || 0),
        max: Number(filters.max_price || safePriceRange.max || 1000000)
    });

    // Subcategory expanded branches state
    const [expandedCategories, setExpandedCategories] = useState({});

    // Auto-expand active category ancestors on load
    useEffect(() => {
        if (category && globalCategories.length > 0) {
            const expansions = {};

            const traceParentIds = (items, targetId, parents = []) => {
                for (const item of items) {
                    if (item.id === targetId) {
                        return parents;
                    }
                    if (item.children && item.children.length > 0) {
                        const result = traceParentIds(item.children, targetId, [...parents, item.id]);
                        if (result) return result;
                    }
                }
                return null;
            };

            const parentIds = traceParentIds(globalCategories, category.id);
            if (parentIds) {
                parentIds.forEach(id => {
                    expansions[id] = true;
                });
                setExpandedCategories(prev => ({ ...prev, ...expansions }));
            }
        }
    }, [category, globalCategories]);

    /**
     * Synchronize local state with server-provided filters on navigation.
     */
    useEffect(() => {
        setLocalFilters(filters);
        if (priceRange) {
            setLocalPrices({
                min: filters.min_price || priceRange.min,
                max: filters.max_price || priceRange.max
            });
        }
    }, [filters, priceRange]);

    const currentRoute = route('frontend.url', category?.slug || brand?.slug || '#');

    const toggleSection = useCallback((section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }, []);

    /**
     * Applies price filter updates while resetting pagination page to 1.
     */
    const applyPriceFilter = useCallback((min, max) => {
        const nextFilters = { ...filters };
        delete nextFilters.page;
        if (min !== undefined) nextFilters.min_price = min;
        if (max !== undefined) nextFilters.max_price = max;
        router.get(currentRoute, nextFilters, { preserveState: true, preserveScroll: true });
    }, [filters, currentRoute]);

    /**
     * Handles complex filtering logic for status and dynamic attributes.
     * Implements optimistic UI updates followed by debounced server sync.
     */
    const handleFilterChange = useCallback((type, value, id = null, isPrefetch = false) => {
        let newFilters = { ...localFilters };

        // Handle Stock Status logic
        if (type === 'status') {
            let statuses = localFilters.status ? localFilters.status.toString().split(',').filter(Boolean) : [];
            if (statuses.includes(value)) {
                statuses = statuses.filter(s => s !== value);
            } else {
                statuses.push(value);
            }
            newFilters.status = statuses.length > 0 ? statuses.join(',') : undefined;
            if (!newFilters.status) delete newFilters.status;
        }
        // Handle Dynamic Variants (Size, Color, etc)
        else if (type === 'variant') {
            let variantFilters = { ...localFilters.variants } || {};
            let values = variantFilters[id] ? variantFilters[id].toString().split(',').filter(Boolean) : [];

            if (values.includes(value)) {
                values = values.filter(v => v !== value);
            } else {
                values.push(value);
            }

            if (values.length > 0) {
                variantFilters[id] = values.join(',');
            } else {
                delete variantFilters[id];
            }

            newFilters.variants = Object.keys(variantFilters).length > 0 ? variantFilters : undefined;
            if (!newFilters.variants) delete newFilters.variants;
        }

        // Reset page to 1 whenever filters change to avoid empty results on non-existent pages
        delete newFilters.page;

        // Prefetching for hover performance optimization
        if (isPrefetch) {
            router.prefetch(currentRoute, newFilters, {
                preserveState: true,
                preserveScroll: true
            });
            return;
        }

        // Apply instant UI feedback
        setLocalFilters(newFilters);

        // Immediate navigation with cancelation support to prevent race conditions
        router.get(currentRoute, newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    }, [localFilters, currentRoute]);

    const toggleExpandCategory = (id, e) => {
        e.stopPropagation();
        e.preventDefault();
        setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Recursive Category Tree Renderer
    const renderCategoryTree = (items, level = 0) => {
        return items.map((cat) => {
            const hasChildren = cat.children && cat.children.length > 0;
            const isExpanded = !!expandedCategories[cat.id];
            const isActive = category?.id === cat.id;

            return (
                <div key={cat.id} className="flex flex-col">
                    <div
                        className={`flex items-center justify-between text-[12.5px] font-semibold py-1.5 px-3 rounded-[2px] transition-all group ${isActive
                            ? "bg-[#4f46e5]/5 text-[#4f46e5]"
                            : "text-slate-600 hover:text-[#4f46e5] hover:bg-slate-50"
                            }`}
                        style={{ paddingLeft: `${Math.max(12, level * 12)}px` }}
                    >
                        <button
                            onClick={() => router.get(route('frontend.url', cat.path || cat.slug))}
                            className="flex-1 text-left flex items-center gap-2 group/btn"
                        >
                            <div className={`w-1 h-1 rounded-full transition-colors ${isActive ? "bg-[#4f46e5]" : "bg-slate-300 group-hover:bg-[#4f46e5]"
                                }`} />
                            <span className={isActive ? "font-bold text-[#4f46e5]" : ""}>{cat.name}</span>
                        </button>
                        {hasChildren && (
                            <button
                                onClick={(e) => toggleExpandCategory(cat.id, e)}
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            </button>
                        )}
                    </div>
                    {hasChildren && isExpanded && (
                        <div className="flex flex-col mt-0.5 border-l border-slate-100 ml-3.5">
                            {renderCategoryTree(cat.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col gap-1.5">

            {/* Price Filter Section */}
            <div className="bg-white rounded-[2px] border border-slate-200 overflow-hidden shadow-sm">
                <button
                    onClick={() => toggleSection('price')}
                    className="w-full px-4 py-2 flex items-center justify-between bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                    <InputLabel className="!mb-0 uppercase tracking-wider text-[12px]">Price Range</InputLabel>
                    {openSections.price ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>
                {openSections.price && (
                    <div className="p-3 flex flex-col gap-6 pt-4">
                        <div className="px-2">
                            <div className="relative h-2 w-full bg-slate-100 rounded-full">
                                <div
                                    className="absolute h-full bg-[#4f46e5] rounded-full"
                                    style={{
                                        left: `${(((localPrices.min || 0) - safePriceRange.min) / (Math.max(1, safePriceRange.max - safePriceRange.min))) * 100}%`,
                                        right: `${100 - (((localPrices.max || safePriceRange.max) - safePriceRange.min) / (Math.max(1, safePriceRange.max - safePriceRange.min))) * 100}%`
                                    }}
                                />

                                <input
                                    type="range"
                                    min={safePriceRange.min}
                                    max={safePriceRange.max}
                                    value={localPrices.min || 0}
                                    onChange={(e) => {
                                        const val = Math.min(Number(e.target.value), localPrices.max - 1);
                                        setLocalPrices(prev => ({ ...prev, min: val }));
                                    }}
                                    onMouseUp={() => applyPriceFilter(localPrices.min, undefined)}
                                    onTouchEnd={() => applyPriceFilter(localPrices.min, undefined)}
                                    className="absolute w-full h-2 bg-transparent appearance-none z-20 slider-thumb-custom top-0 left-0"
                                />
                                <input
                                    type="range"
                                    min={safePriceRange.min}
                                    max={safePriceRange.max}
                                    value={localPrices.max || safePriceRange.max}
                                    onChange={(e) => {
                                        const val = Math.max(Number(e.target.value), localPrices.min + 1);
                                        setLocalPrices(prev => ({ ...prev, max: val }));
                                    }}
                                    onMouseUp={() => applyPriceFilter(undefined, localPrices.max)}
                                    onTouchEnd={() => applyPriceFilter(undefined, localPrices.max)}
                                    className="absolute w-full h-2 bg-transparent appearance-none z-20 slider-thumb-custom top-0 left-0"
                                />

                                <div
                                    className="absolute w-5 h-5 bg-white border-2 border-[#4f46e5] rounded-full shadow-sm flex items-center justify-center -top-1.5 -translate-x-1/2 z-30 pointer-events-none"
                                    style={{ left: `${(((localPrices.min || 0) - safePriceRange.min) / (Math.max(1, safePriceRange.max - safePriceRange.min))) * 100}%` }}
                                >
                                    <div className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full" />
                                </div>
                                <div
                                    className="absolute w-5 h-5 bg-white border-2 border-[#4f46e5] rounded-full shadow-sm flex items-center justify-center -top-1.5 -translate-x-1/2 z-30 pointer-events-none"
                                    style={{ left: `${(((localPrices.max || safePriceRange.max) - safePriceRange.min) / (Math.max(1, safePriceRange.max - safePriceRange.min))) * 100}%` }}
                                >
                                    <div className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full" />
                                </div>
                            </div>
                        </div>

                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .slider-thumb-custom::-webkit-slider-thumb { appearance: none; width: 24px; height: 24px; cursor: pointer; pointer-events: auto; border-radius: 50%; }
                            .slider-thumb-custom::-moz-range-thumb { appearance: none; width: 24px; height: 24px; cursor: pointer; pointer-events: auto; border: none; background: transparent; border-radius: 50%; }
                        `}} />

                        <div className="flex items-center justify-between">
                            <TextInput
                                type="number"
                                value={localPrices.min}
                                className="w-[47%] h-9 border border-slate-200 text-[13px] font-medium text-[#081621] focus:border-[#4f46e5] outline-none text-center bg-white rounded-[1px] px-2"
                                onChange={(e) => setLocalPrices(prev => ({ ...prev, min: Number(e.target.value) }))}
                                onBlur={() => applyPriceFilter(localPrices.min, undefined)}
                            />
                            <TextInput
                                type="number"
                                value={localPrices.max}
                                className="w-[47%] h-9 border border-slate-200 text-[13px] font-medium text-[#081621] focus:border-[#4f46e5] outline-none text-center bg-white rounded-[1px] px-2"
                                onChange={(e) => setLocalPrices(prev => ({ ...prev, max: Number(e.target.value) }))}
                                onBlur={() => applyPriceFilter(undefined, localPrices.max)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Availability Stock Filter */}
            <div className="bg-white rounded-[2px] border border-slate-200 overflow-hidden shadow-sm">
                <button
                    onClick={() => toggleSection('status')}
                    className="w-full px-4 py-2 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                >
                    <InputLabel className="!mb-0 text-[12px]">Availability</InputLabel>
                    {openSections.status ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>
                {openSections.status && (
                    <div className="p-2 flex flex-col gap-0.5">
                        {[
                            { label: 'In Stock', value: '1' },
                            { label: 'Pre Order', value: '3' },
                            { label: 'Up Coming', value: '4' }
                        ].map((item) => (
                            <label
                                key={item.value}
                                className="flex items-center gap-2 py-1.5 px-2 cursor-pointer group hover:bg-slate-50/80 rounded-[2px] transition-all duration-200 border-l-2 border-transparent hover:border-[#4f46e5]/30"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.status?.split(',').includes(item.value)}
                                        onChange={() => handleFilterChange('status', item.value)}
                                        className="w-[15px] h-[15px] rounded-[2px] border-slate-300 text-[#4f46e5] focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors"
                                    />
                                </div>
                                <span className="text-[12.5px] font-semibold text-slate-600 group-hover:text-[#081621] transition-colors tracking-tight">{item.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Dynamic Product Variants */}
            {availableVariants?.filter(variant => variant.options && variant.options.length > 0).map((variant) => {
                const uniqueValues = Array.from(new Set(variant.options?.map(v => v.value)));
                const variantSearch = variantSearches[variant.id] || '';
                const filteredValues = uniqueValues.filter(val => val.toLowerCase().includes(variantSearch.toLowerCase()));

                return (
                    <div key={variant.id} className="bg-white rounded-[2px] border border-slate-200 overflow-hidden shadow-sm">
                        <button
                            onClick={() => toggleSection(`variant_${variant.id}`)}
                            className="w-full px-4 py-2 flex items-center justify-between bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <InputLabel className="!mb-0 uppercase tracking-wider text-[12px]">{variant.name}</InputLabel>
                            {openSections[`variant_${variant.id}`] ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </button>
                        {openSections[`variant_${variant.id}`] && (
                            <div className="p-2 flex flex-col gap-0.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                                {/* Search within filter - optimized for long variant lists */}
                                {uniqueValues.length > 6 && (
                                    <div className="mb-2">
                                        <TextInput
                                            type="text"
                                            placeholder={`Search ${variant.name}...`}
                                            value={variantSearch}
                                            onChange={(e) => setVariantSearches(prev => ({ ...prev, [variant.id]: e.target.value }))}
                                            className="w-full h-7 px-2 border border-slate-100 rounded-[1px] text-[11px] font-medium placeholder:text-slate-400 bg-slate-50/50 focus:border-[#4f46e5] focus:ring-0 outline-none transition-all"
                                        />
                                    </div>
                                )}

                                {filteredValues.map((val) => (
                                    <label
                                        key={val}
                                        className="flex items-center gap-2 py-1.5 px-2 cursor-pointer group hover:bg-slate-50/80 rounded-[2px] transition-all duration-200 border-l-2 border-transparent hover:border-[#4f46e5]/30"
                                    >
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={localFilters.variants?.[variant.id]?.split(',').includes(val)}
                                                onChange={() => handleFilterChange('variant', val, variant.id)}
                                                className="w-[15px] h-[15px] rounded-[2px] border-slate-300 text-[#4f46e5] focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors"
                                            />
                                        </div>
                                        <span className="text-[12.5px] font-semibold text-slate-600 group-hover:text-[#081621] transition-colors tracking-tight">{val}</span>
                                    </label>
                                ))}
                                {filteredValues.length === 0 && (
                                    <div className="py-2 text-center text-[11px] text-slate-400 italic">No matches</div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

ProductSidebar.displayName = 'ProductSidebar';

export default ProductSidebar;
