import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * RelatedProducts Component
 * Renders a vertical list of related products in the sidebar.
 * 
 * @param {Array} relatedProducts - List of product objects
 */
const RelatedProducts = ({ relatedProducts = [] }) => {
    if (!relatedProducts.length) return null;

    return (
        <div className="bg-white rounded-md border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-[#081621] mb-6 pb-3 border-b border-slate-100">Related Products</h3>
            <div className="space-y-6">
                {relatedProducts.map((item) => (
                    <Link
                        key={item.id}
                        href={item.slug} // Assuming direct slug routing or adjust as needed
                        className="flex gap-4 transition-all"
                    >
                        <div className="w-16 h-16 rounded border border-slate-100 p-1 bg-white shrink-0 overflow-hidden flex items-center justify-center transition-colors">
                            <img
                                src={item.primary_image?.full_url}
                                className="max-w-full max-h-full object-contain transition-transform"
                                alt={item.name}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-bold text-slate-700 leading-snug transition-colors line-clamp-2">{item.name}</h4>
                            <div className="text-[14px] font-black text-[#4f46e5] mt-1">৳{parseFloat(item.discount_price || item.price).toLocaleString()}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <button className="w-full mt-8 py-2.5 border-2 border-[#4f46e5] text-[#4f46e5] font-bold text-sm rounded transition-all uppercase tracking-widest">
                View All
            </button>
        </div>
    );
};

export default RelatedProducts;
