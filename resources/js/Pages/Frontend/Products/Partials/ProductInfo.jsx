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
        <div className="flex-1">
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
            </div>

            {/* Short Description */}
            <div className="mb-6">
                <p className="text-[14px] text-slate-500 leading-relaxed">
                    This high-quality product is designed to meet your everyday needs. Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora.
                </p>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-3">
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
