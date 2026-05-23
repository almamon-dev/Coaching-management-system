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
            <h1 className="text-2xl font-bold text-[#081621] mb-6 leading-tight tracking-tight">{product.name}</h1>

            {/* Status & Metadata Pills Grid (StarTech High-Density Style) */}
            <div className="flex flex-wrap gap-2 mb-8">
                <div className="bg-[#f2f4f8] px-3.5 py-1.5 rounded-full text-[12px] text-slate-500 font-medium border border-slate-100/50">
                    Price: <span className="text-[#4f46e5] font-bold">৳{parseFloat(product.discount_price || product.price).toLocaleString()}</span>
                </div>
                <div className="bg-[#f2f4f8] px-3.5 py-1.5 rounded-full text-[12px] text-slate-500 font-medium border border-slate-100/50">
                    Regular Price: <span className="text-[#081621] font-bold">৳{parseFloat(product.price).toLocaleString()}</span>
                </div>
                <div className="bg-[#f2f4f8] px-3.5 py-1.5 rounded-full text-[12px] text-slate-500 font-medium border border-slate-100/50">
                    Status: <span className={`${product.status == 1 ? 'text-[#081621]' : 'text-red-500'} font-bold`}>{product.status == 1 ? "In Stock" : "Out of Stock"}</span>
                </div>
                <div className="bg-[#f2f4f8] px-3.5 py-1.5 rounded-full text-[12px] text-slate-500 font-medium border border-slate-100/50">
                    Product Code: <span className="text-[#081621] font-bold">{product.sku}</span>
                </div>
                {product.brand?.name && (
                    <div className="bg-[#f2f4f8] px-3.5 py-1.5 rounded-full text-[12px] text-slate-500 font-medium border border-slate-100/50">
                        Brand: <span className="text-[#081621] font-bold">{product.brand.name}</span>
                    </div>
                )}
            </div>

            {/* Key Features Executive Summary */}
            <div className="mb-4">
                <h3 className="text-[15px] font-bold text-[#081621] mb-4">Key Features</h3>
                <ul className="space-y-3">
                    {product.features?.length > 0 ? product.features.map((f) => {
                        const featureKey = f.id || f.feature || f.name;
                        return (
                            <li key={featureKey} className="flex items-start gap-3 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0 group-hover:bg-[#4f46e5] transition-colors" />
                                <span className="text-[13px] text-slate-600 font-medium leading-normal">{f.feature}</span>
                            </li>
                        );
                    }) : (
                        <li className="text-[13px] text-slate-400 italic">No key features listed for this model.</li>
                    )}
                </ul>

                <button
                    onClick={onViewMore}
                    className="text-[#4f46e5] text-[13px] font-bold mt-6 hover:underline transition-all inline-flex items-center gap-1 group"
                >
                    View More Info
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
});

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;
