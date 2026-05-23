import React, { memo } from 'react';
import ProductCard from '@/Components/Frontend/ProductCard';

/**
 * ProductGrid Component
 * 
 * Efficiently renders a responsive grid of ProductCard components.
 * Wrapped in React.memo to prevent re-renders when parent state changes but product data remains identical.
 * 
 * @param {Array} props.products - Collection of product objects to display.
 */
const ProductGrid = memo(({ products = [], isLoading = false }) => {
    const [lockedSkeletonCount, setLockedSkeletonCount] = React.useState(8);

    React.useEffect(() => {
        if (isLoading && products.length > 0) {
            setLockedSkeletonCount(products.length);
        }
    }, [isLoading]);

    // Show skeletons during actual pagination/filter loading
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(lockedSkeletonCount)].map((_, idx) => (
                    <div key={idx} className="bg-white rounded-md border border-slate-200 p-4 flex flex-col animate-pulse">
                        <div className="bg-slate-100 rounded-[2px] h-[210px] w-full mb-4"></div>
                        <div className="flex-1 flex flex-col">
                            <div className="h-4 bg-slate-100 rounded w-5/6 mb-2"></div>
                            <div className="h-4 bg-slate-100 rounded w-2/3 mb-4"></div>
                            <div className="space-y-2 mb-6 flex-1">
                                <div className="h-3 bg-slate-50 rounded w-full"></div>
                                <div className="h-3 bg-slate-50 rounded w-4/5"></div>
                            </div>
                            <div className="pt-3 border-t border-slate-100">
                                <div className="h-6 bg-slate-100 rounded w-1/3 mx-auto mb-3"></div>
                                <div className="h-10 bg-slate-100 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state visualization for enhanced UX
    if (products.length === 0) {
        return (
            <div className="bg-white rounded-md border border-slate-200 py-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-[#081621]">No products found</h3>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your filters to find what you're looking for.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
