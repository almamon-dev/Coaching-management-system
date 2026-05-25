import React, { useState, memo, useMemo, useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

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
    
    // Lightbox state
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setIsZoomed(false); // Reset zoom when closing
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isLightboxOpen]);

    return (
        <>
        <div className="w-full shrink-0">
            {/* Main Stage Image Container */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center p-8 group">
                {/* Dynamic Discount Badge (Grogin Red Pill) */}
                {product.price > product.discount_price && product.discount_price > 0 && (
                    <div className="absolute top-5 left-5 bg-[#e11d48] text-white text-[12px] font-bold px-2 py-0.5 rounded shadow-sm z-10 pointer-events-none">
                        -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                    </div>
                )}
                
                <button 
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="relative w-full h-full flex items-center justify-center cursor-zoom-in"
                    title="Click to enlarge"
                >
                    <img
                        src={selectedImage}
                        className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700 ease-in-out group-hover:scale-105"
                        alt={product.name}
                        fetchpriority="high"
                        decoding="async"
                    />
                    
                    {/* Hover indicator for zoom */}
                    <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <div className="bg-white text-slate-800 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <ZoomIn size={24} />
                        </div>
                    </div>
                </button>
            </div>

            {/* Interactive Thumbnail Gallery Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {allImages.map((img, idx) => (
                    <button
                        key={`${img}-${idx}`}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 rounded border-2 shrink-0 transition-all p-1 bg-white overflow-hidden flex items-center justify-center ${selectedImage === img
                                ? 'border-[#ea580c] shadow-sm'
                                : 'border-slate-100 hover:border-slate-300'
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

        {/* Lightbox Overlay */}
        {isLightboxOpen && (
            <div className="fixed inset-0 z-[1000] bg-white flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-end p-4 border-b border-slate-100 shadow-sm z-10 bg-white">
                    <button 
                        onClick={() => setIsLightboxOpen(false)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition-colors flex items-center gap-2 font-bold text-[13px]"
                    >
                        <span className="pl-2">Close</span>
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Main Image View */}
                <div 
                    className={`flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-50 transition-all duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                    onClick={() => setIsZoomed(!isZoomed)}
                    title={isZoomed ? "Click to zoom out" : "Click to zoom in"}
                >
                    <img
                        src={selectedImage}
                        alt={`${product.name} enlarged`}
                        className={`transition-all duration-300 object-contain ${isZoomed ? 'max-w-none w-auto max-h-none h-auto' : 'max-w-full max-h-full'}`}
                        style={isZoomed ? { minWidth: '150%', minHeight: '150%' } : {}}
                    />
                </div>

                {/* Lightbox Thumbnails */}
                {allImages.length > 1 && (
                    <div className="bg-white p-4 border-t border-slate-100 flex items-center justify-center">
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar max-w-full">
                            {allImages.map((img, idx) => (
                                <button
                                    key={`lb-${img}-${idx}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(img);
                                    }}
                                    className={`w-20 h-20 rounded-lg border-2 shrink-0 transition-all p-1 bg-white overflow-hidden flex items-center justify-center ${selectedImage === img
                                            ? 'border-[#e62e04] shadow-md'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <img 
                                        src={img} 
                                        className="max-w-full max-h-full object-contain" 
                                        alt={`${product.name} thumbnail ${idx + 1}`} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Floating zoom hint */}
                <div className="fixed top-[80px] left-1/2 -translate-x-1/2 bg-black/70 text-white text-[12px] px-4 py-2 rounded-full pointer-events-none opacity-80 backdrop-blur-sm flex items-center gap-2 shadow-lg">
                    {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                    {isZoomed ? "Click anywhere to zoom out" : "Click anywhere to zoom in"}
                </div>
            </div>
        )}
        </>
    );
});

ProductGallery.displayName = 'ProductGallery';

export default ProductGallery;
