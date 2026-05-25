import React from 'react';
import ProductCard from '@/Components/Frontend/ProductCard';

/**
 * RelatedProducts Component
 * Renders a grid of related products at the bottom of the page.
 * 
 * @param {Array} relatedProducts - List of product objects
 */
const RelatedProducts = ({ relatedProducts = [] }) => {
    if (!relatedProducts.length) return null;

    return (
        <section className="mt-12 mb-12">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <h3 className="text-[20px] font-bold text-[#081621]">Related Products</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {relatedProducts.slice(0, 5).map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;
