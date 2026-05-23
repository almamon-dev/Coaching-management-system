import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Pagination from '../Products/Partials/Pagination';
import { Search, ChevronLeft, ArrowUpDown, ChevronDown, ChevronUp, SlidersHorizontal, Home } from 'lucide-react';

export default function Choose({ 
    slot = {}, 
    products = {}, 
    filters = {}, 
    priceRange = { min: 0, max: 100000 }, 
    availableVariants = [] 
}) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [openSections, setOpenSections] = useState({
        price: true,
        ...availableVariants.reduce((acc, variant) => ({ ...acc, [variant.id]: true }), {})
    });

    // Local price inputs
    const [minPriceInput, setMinPriceInput] = useState(filters.min_price || '');
    const [maxPriceInput, setMaxPriceInput] = useState(filters.max_price || '');

    // Keep inputs in sync with filters
    useEffect(() => {
        setMinPriceInput(filters.min_price || '');
        setMaxPriceInput(filters.max_price || '');
        setSearchVal(filters.search || '');
    }, [filters]);

    const toggleSection = (id) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Helper to build request parameters while preserving compatibility variables (processor, motherboard, ram)
    const getFilterParams = (additionalParams = {}) => {
        const params = { ...filters };
        
        // Remove empty keys
        Object.keys(params).forEach(key => {
            if (params[key] === undefined || params[key] === null || params[key] === '') {
                delete params[key];
            }
        });

        return { ...params, ...additionalParams };
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(
            route('pc-builder.choose', { slotId: slot.id }),
            getFilterParams({ search: searchVal }),
            { preserveState: true }
        );
    };

    const handleSortChange = (newSort) => {
        router.get(
            route('pc-builder.choose', { slotId: slot.id }),
            getFilterParams({ sort: newSort }),
            { preserveState: true }
        );
    };

    const handlePriceFilterChange = (minVal, maxVal) => {
        router.get(
            route('pc-builder.choose', { slotId: slot.id }),
            getFilterParams({ 
                min_price: minVal !== '' ? minVal : undefined, 
                max_price: maxVal !== '' ? maxVal : undefined 
            }),
            { preserveState: true }
        );
    };

    const handleVariantChange = (variantId, value) => {
        const currentVariantObj = { ...filters.variants } || {};
        let values = currentVariantObj[variantId] ? currentVariantObj[variantId].split(',') : [];

        if (values.includes(value)) {
            values = values.filter(v => v !== value);
        } else {
            values.push(value);
        }

        const updatedVariantObj = { ...currentVariantObj };
        if (values.length > 0) {
            updatedVariantObj[variantId] = values.join(',');
        } else {
            delete updatedVariantObj[variantId];
        }

        router.get(
            route('pc-builder.choose', { slotId: slot.id }),
            getFilterParams({ 
                variants: Object.keys(updatedVariantObj).length > 0 ? updatedVariantObj : undefined 
            }),
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSelectProduct = (product) => {
        const saved = localStorage.getItem('pc_builder_selections');
        const selections = saved ? JSON.parse(saved) : {};
        
        selections[slot.id] = {
            id: product.id,
            name: product.name,
            price: product.price,
            discount_price: product.discount_price,
            slug: product.slug,
            thumbnail: product.thumbnail || (product.primary_image ? product.primary_image.image : null),
            features: product.features,
        };

        localStorage.setItem('pc_builder_selections', JSON.stringify(selections));
        router.visit(route('pc-builder.index'));
    };

    // Calculate saving amount
    const getSavingAmount = (product) => {
        if (product.discount_price && product.price > product.discount_price) {
            return product.price - product.discount_price;
        }
        return 0;
    };

    const activeSort = filters.sort || 'default';

    return (
        <>
            <Head title={`Choose ${slot.name} - PC Builder`} />

            <div className="bg-[#f2f4f8] min-h-screen pb-12 font-inter">
                
                {/* Top Breadcrumbs bar */}
                <div className="bg-white border-b border-slate-200 py-3 mb-6">
                    <div className="container mx-auto px-4 max-w-7xl flex items-center gap-2 text-xs text-slate-500 font-semibold">
                        <Link href="/" className="hover:text-[#3749bb]">
                            <Home size={13} className="inline mr-1" />
                        </Link>
                        <span>/</span>
                        <Link href={route('pc-builder.index')} className="hover:text-[#3749bb]">PC Builder</Link>
                        <span>/</span>
                        <span className="text-slate-400">Choose {slot.name}</span>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* LEFT: Sidebar Filters */}
                        <div className="w-full lg:w-[260px] shrink-0 space-y-4">
                            
                            {/* Price range filter */}
                            <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-2xs">
                                <button 
                                    onClick={() => toggleSection('price')}
                                    className="w-full px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Price Range</span>
                                    {openSections.price ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                                </button>
                                
                                {(() => {
                                    const minLimit = Number(priceRange.min) || 0;
                                    const maxLimit = Number(priceRange.max) || 100000;
                                    const currentMin = minPriceInput === '' ? minLimit : Number(minPriceInput);
                                    const currentMax = maxPriceInput === '' ? maxLimit : Number(maxPriceInput);

                                    return openSections.price && (
                                        <div className="p-4 space-y-4">
                                            <style dangerouslySetInnerHTML={{__html: `
                                                .range-slider-input::-webkit-slider-thumb {
                                                    -webkit-appearance: none;
                                                    appearance: none;
                                                    width: 16px;
                                                    height: 16px;
                                                    border-radius: 50%;
                                                    background: #ffffff;
                                                    border: 2px solid #f04f23;
                                                    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                                                    cursor: pointer;
                                                    pointer-events: auto;
                                                    transition: transform 0.1s ease;
                                                }
                                                .range-slider-input::-webkit-slider-thumb:hover {
                                                    transform: scale(1.1);
                                                }
                                                .range-slider-input::-moz-range-thumb {
                                                    width: 16px;
                                                    height: 16px;
                                                    border-radius: 50%;
                                                    background: #ffffff;
                                                    border: 2px solid #f04f23;
                                                    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                                                    cursor: pointer;
                                                    pointer-events: auto;
                                                    transition: transform 0.1s ease;
                                                }
                                                .range-slider-input::-moz-range-thumb:hover {
                                                    transform: scale(1.1);
                                                }
                                            `}} />
                                            
                                            <div className="relative h-6 w-full flex items-center select-none pt-2 pb-6">
                                                {/* Base Track */}
                                                <div className="absolute h-1.5 w-full bg-slate-100 rounded-full" />
                                                {/* Active Highlight Track */}
                                                <div 
                                                    className="absolute h-1.5 bg-[#f04f23] rounded-full" 
                                                    style={{
                                                        left: `${Math.max(0, Math.min(100, ((currentMin - minLimit) / (maxLimit - minLimit)) * 100))}%`,
                                                        right: `${Math.max(0, Math.min(100, 100 - ((currentMax - minLimit) / (maxLimit - minLimit)) * 100))}%`
                                                    }}
                                                />
                                                
                                                {/* Min Range Input */}
                                                <input 
                                                    type="range"
                                                    min={minLimit}
                                                    max={maxLimit}
                                                    value={currentMin}
                                                    onChange={(e) => {
                                                        const val = Math.min(Number(e.target.value), currentMax - 1);
                                                        setMinPriceInput(val);
                                                    }}
                                                    onMouseUp={() => handlePriceFilterChange(currentMin, currentMax)}
                                                    onTouchEnd={() => handlePriceFilterChange(currentMin, currentMax)}
                                                    className="range-slider-input absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none cursor-pointer outline-none"
                                                    style={{
                                                        zIndex: currentMin > maxLimit - 100 ? 5 : 3
                                                    }}
                                                />
                                                {/* Max Range Input */}
                                                <input 
                                                    type="range"
                                                    min={minLimit}
                                                    max={maxLimit}
                                                    value={currentMax}
                                                    onChange={(e) => {
                                                        const val = Math.max(Number(e.target.value), currentMin + 1);
                                                        setMaxPriceInput(val);
                                                    }}
                                                    onMouseUp={() => handlePriceFilterChange(currentMin, currentMax)}
                                                    onTouchEnd={() => handlePriceFilterChange(currentMin, currentMax)}
                                                    className="range-slider-input absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none cursor-pointer outline-none"
                                                    style={{
                                                        zIndex: 4
                                                    }}
                                                />
                                            </div>
                                            
                                            <div className="flex items-center justify-between gap-3">
                                                <input 
                                                    type="number"
                                                    placeholder={priceRange.min}
                                                    value={minPriceInput}
                                                    onChange={(e) => setMinPriceInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handlePriceFilterChange(minPriceInput, maxPriceInput)}
                                                    onBlur={() => handlePriceFilterChange(minPriceInput, maxPriceInput)}
                                                    className="w-full text-center border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#3749bb]"
                                                />
                                                <input 
                                                    type="number"
                                                    placeholder={priceRange.max}
                                                    value={maxPriceInput}
                                                    onChange={(e) => setMaxPriceInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handlePriceFilterChange(minPriceInput, maxPriceInput)}
                                                    onBlur={() => handlePriceFilterChange(minPriceInput, maxPriceInput)}
                                                    className="w-full text-center border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#3749bb]"
                                                />
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Dynamic variants filters (e.g. Series, Generation, Cores) */}
                            {availableVariants.map((variant) => {
                                const uniqueValues = Array.from(new Set(variant.options?.map(v => v.value)));
                                if (uniqueValues.length === 0) return null;

                                return (
                                    <div key={variant.id} className="bg-white rounded border border-slate-200 overflow-hidden shadow-2xs">
                                        <button 
                                            onClick={() => toggleSection(variant.id)}
                                            className="w-full px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{variant.name}</span>
                                            {openSections[variant.id] ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                                        </button>

                                        {openSections[variant.id] && (
                                            <div className="p-3 max-h-60 overflow-y-auto space-y-1">
                                                {uniqueValues.map((val) => {
                                                    const isChecked = filters.variants?.[variant.id]?.split(',').includes(val) || false;
                                                    return (
                                                        <label 
                                                            key={val} 
                                                            className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-slate-50 rounded cursor-pointer select-none text-xs font-medium text-slate-600"
                                                        >
                                                            <input 
                                                                type="checkbox" 
                                                                checked={isChecked}
                                                                onChange={() => handleVariantChange(variant.id, val)}
                                                                className="rounded border-slate-300 text-[#3749bb] focus:ring-0 focus:ring-offset-0 h-4 w-4"
                                                            />
                                                            <span>{val}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* RIGHT: Listing Area */}
                        <div className="flex-1 flex flex-col gap-4">
                            
                            {/* Toolbar: Search and Sort */}
                            <div className="bg-white rounded border border-slate-200 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                                <div className="flex items-center gap-2 w-full sm:max-w-md">
                                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                                        <input 
                                            type="text"
                                            placeholder="Search product..."
                                            value={searchVal}
                                            onChange={(e) => setSearchVal(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 pl-8 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-[#3749bb]"
                                        />
                                        <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
                                    </form>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-slate-600 w-full sm:w-auto justify-end">
                                    <ArrowUpDown size={13} className="text-slate-400" />
                                    <span>Sort:</span>
                                    <select 
                                        value={activeSort}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 focus:outline-none focus:border-[#3749bb] font-medium"
                                    >
                                        <option value="default">Default</option>
                                        <option value="price_low">Price (Low &gt; High)</option>
                                        <option value="price_high">Price (High &gt; Low)</option>
                                        <option value="name_az">Name (A &gt; Z)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Products List (Horizontal Layout) */}
                            {products.data && products.data.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-3">
                                        {products.data.map((product) => {
                                            const saving = getSavingAmount(product);
                                            const price = product.discount_price || product.price;

                                            return (
                                                <div 
                                                    key={product.id}
                                                    className="bg-white rounded border border-slate-200 overflow-hidden flex flex-col sm:flex-row hover:shadow-sm transition-shadow min-h-[140px]"
                                                >
                                                    {/* Image Left Panel */}
                                                    <div className="w-full sm:w-44 bg-white flex items-center justify-center p-4 relative shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100">
                                                        <img 
                                                            src={product.thumbnail || (product.primary_image ? product.primary_image.image : 'https://placehold.co/150')} 
                                                            alt={product.name}
                                                            className="max-h-24 max-w-full object-contain"
                                                        />
                                                        {saving > 0 && (
                                                            <div className="absolute top-2 left-2 bg-[#6e2585] text-white text-[10px] px-2 py-0.5 font-bold rounded">
                                                                Save: {saving.toLocaleString()}৳
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Middle Info Panel */}
                                                    <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                                                        <Link 
                                                            href={`/${product.slug}`}
                                                            className="text-xs font-bold text-slate-800 hover:text-[#3749bb] transition-colors leading-snug line-clamp-2 block"
                                                        >
                                                            {product.name}
                                                        </Link>

                                                        {/* Features list bullet points */}
                                                        {product.features && product.features.length > 0 && (
                                                            <ul className="mt-3 space-y-1">
                                                                {product.features.slice(0, 4).map((f, index) => (
                                                                    <li key={index} className="text-[10.5px] text-slate-500 list-disc list-inside truncate">
                                                                        {f.feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>

                                                    {/* Right Price & CTA Panel */}
                                                    <div className="w-full sm:w-40 p-4 border-t sm:border-t-0 sm:border-l border-slate-100 flex flex-row sm:flex-col items-center sm:justify-center justify-between gap-2 shrink-0">
                                                        <div className="text-left sm:text-center">
                                                            <span className="text-sm font-black text-slate-800 block">
                                                                {price.toLocaleString()}৳
                                                            </span>
                                                            {product.discount_price && product.price > product.discount_price && (
                                                                <span className="text-[10px] text-slate-400 line-through mt-0.5 block">
                                                                    {product.price.toLocaleString()}৳
                                                                </span>
                                                            )}
                                                        </div>

                                                        <button 
                                                            onClick={() => handleSelectProduct(product)}
                                                            className="w-24 py-1.5 bg-[#3749bb] hover:bg-[#253285] text-white text-xs font-bold rounded transition-colors shadow-2xs"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>

                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    <div className="bg-white rounded border border-slate-200 p-4">
                                        <Pagination 
                                            meta={products.meta || {
                                                total: products.total || 0,
                                                from: products.from || 0,
                                                to: products.to || 0,
                                                last_page: products.last_page || 1
                                            }}
                                            links={products.links || []}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white border border-slate-200 rounded p-12 text-center shadow-2xs">
                                    <span className="text-3xl">🔍</span>
                                    <h2 className="text-xs font-bold text-slate-800 mt-4">No Compatible Products Found</h2>
                                    <p className="text-[11px] text-slate-500 mt-1">Try resetting search filters or checking previously configured components.</p>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

Choose.layout = page => <FrontendLayout children={page} categories={page.props.categories} brands={page.props.brands} />;
