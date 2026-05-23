import React, { useState, memo, useMemo } from 'react';

/**
 * ProductGallery Component
 * 
 * Handles high-performance product image display, including thumbnail switching
 * and responsive scaling. Memoized to prevent re-renders when other product details change.
 * 
 * @param {Object} props.product - The product object containing image relationships and pricing.
 */
const ProductGallery = memo(({ product }) => {
    // Determine the collection of images available for this product
    const allImages = useMemo(() => {
        const images = product.images?.map(img => img.full_url || img.image) || [];
        if (product.primary_image?.full_url) {
            // Ensure primary image is first if not already present in the list
            const primaryUrl = product.primary_image.full_url;
            if (!images.includes(primaryUrl)) {
                images.unshift(primaryUrl);
            }
        }
        return images.length > 0 ? images : [product.thumbnail];
    }, [product.images, product.primary_image, product.thumbnail]);

    // Track the currently viewed image in the main display
    const [selectedImage, setSelectedImage] = useState(allImages[0]);

    return (
        <div className="w-full lg:w-[450px] shrink-0">
            {/* Main Stage Image Container */}
            <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 mb-4 bg-white flex items-center justify-center p-4 group shadow-sm">
                {/* Dynamic Discount Badge (StarTech Professional Style) */}
                {product.price > product.discount_price && product.discount_price > 0 && (
                    <div className="absolute top-4 left-4 bg-[#4f46e5] text-white text-[11px] font-black px-3 py-1 rounded uppercase tracking-wider z-10 shadow-sm pointer-events-none">
                        {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                    </div>
                )}
                
                <img
                    src={selectedImage}
                    className="max-w-full max-h-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-105"
                    alt={product.name}
                    fetchpriority="high"
                    decoding="async"
                />
            </div>

            {/* Interactive Thumbnail Gallery Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {allImages.map((img, idx) => (
                    <button
                        key={`${img}-${idx}`}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 rounded border-2 shrink-0 transition-all p-1 bg-white overflow-hidden flex items-center justify-center ${selectedImage === img
                                ? 'border-[#4f46e5] shadow-md scale-95'
                                : 'border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <img 
                            src={img} 
                            className="max-w-full max-h-full object-contain" 
                            alt={`${product.name} thumbnail ${idx + 1}`} 
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
});

ProductGallery.displayName = 'ProductGallery';

export default ProductGallery;
