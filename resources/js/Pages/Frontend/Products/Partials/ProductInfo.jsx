import React, { memo } from 'react';

/**
 * ProductInfo Component
 * 
 * Displays the product title, core metadata pills (Price, SKU, Brand), and 
 * an executive summary of key features. Optimized with React.memo for high-speed detail navigation.
 * 
 * @param {Object} props.product - The product data object with features and branding.
 * @param {Function} props.onViewMore - Anchor callback for jumping to the specifications tab.
 */
const ProductInfo = memo(({ product, onViewMore }) => {
    return (
        <div>
            <h1 className="text-[32px] lg:text-[36px] font-bold text-[#081621] leading-tight mb-4 tracking-tight">
                {product.name}
            </h1>

            {/* Metadata (Rating, Brand, SKU) */}
            <div className="flex items-center flex-wrap gap-3 text-[13px] text-slate-500 mb-6 pb-4 border-b border-slate-100">
                {/* Simulated Rating */}
                <div className="flex items-center gap-1.5">
                    <div className="flex text-[#fbbf24]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#e2e8f0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="border border-slate-200 px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-700">4.33</span>
                        <span className="text-[12px] text-slate-400">3</span>
                    </div>
                </div>

                <div className="w-[1px] h-3.5 bg-slate-200"></div>

                {product.brand?.name && (
                    <>
                        <div className="flex items-center gap-1">
                            Brand: <span className="text-[#081621] font-bold">{product.brand.name}</span>
                        </div>
                        <div className="w-[1px] h-3.5 bg-slate-200"></div>
                    </>
                )}
                
                <div className="flex items-center gap-1">
                    SKU: <span className="text-[#081621] font-bold">{product.sku}</span>
                </div>

                <div className="w-[1px] h-3.5 bg-slate-200"></div>
                <div className="flex items-center gap-1 text-[#10b981] font-semibold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    In Stock
                </div>
            </div>

            {/* Product Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border border-emerald-100">Fresh</span>
                <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border border-amber-100">100% Organic</span>
            </div>

            {/* Short Description */}
            <div className="mb-4">
                <p className="text-[13px] text-slate-500 leading-relaxed">
                    {product.short_description || "High-quality, freshly sourced product designed to meet your daily grocery needs. Carefully packed to ensure maximum freshness and quality."}
                </p>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-3 mb-2">
                {product.price > product.discount_price && product.discount_price > 0 ? (
                    <>
                        <span className="text-[36px] font-black text-[#081621] tracking-tight leading-none">
                            ৳{parseFloat(product.discount_price).toLocaleString()}
                        </span>
                        <span className="text-[20px] font-medium text-slate-400 line-through mb-1">
                            ৳{parseFloat(product.price).toLocaleString()}
                        </span>
                    </>
                ) : (
                    <span className="text-[36px] font-black text-[#081621] tracking-tight leading-none">
                        ৳{parseFloat(product.price).toLocaleString()}
                    </span>
                )}
            </div>
        </div>
    );
});

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;
