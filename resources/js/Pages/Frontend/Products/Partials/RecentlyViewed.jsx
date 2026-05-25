import React from 'react';
import ProductCard from '@/Components/Frontend/ProductCard';

/**
 * RecentlyViewed Component
 * Renders a grid of recently viewed products statically as requested by the user.
 */
const RecentlyViewed = ({ relatedProducts = [] }) => {
    // We are using relatedProducts temporarily as dummy static data for recently viewed
    if (!relatedProducts || !relatedProducts.length) return null;

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <h3 className="text-[20px] font-bold text-[#081621]">Recently Viewed Items</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Reusing relatedProducts array slice for static placeholder */}
                {relatedProducts.slice(0, 5).reverse().map((item) => (
                    <ProductCard key={`recent-${item.id}`} product={item} />
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;
