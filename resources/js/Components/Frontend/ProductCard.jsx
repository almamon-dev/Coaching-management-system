import React, { memo } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Plus, Heart } from 'lucide-react';
import { useFrontend } from '@/Contexts/FrontendContext';

/**
 * ProductCard Component
 * 
 * Renders a high-density, professional product card consistent with StarTech design language.
 * Features optimistic UI for wishlisting, lazy-loaded images, and responsive action buttons.
 * 
 * @param {Object} props.product - The product data object including relationships.
 */
const ProductCard = memo(({ product, compact = false }) => {
    const { auth } = usePage().props;
    const { openCartModal } = useFrontend();

    // Local state for optimistic UI updates to ensure zero-latency feeling
    const [isWishlisted, setIsWishlisted] = React.useState(auth.user?.wishlist_ids?.includes(product.id));

    // Synchronize local wishlist state with global auth props
    React.useEffect(() => {
        setIsWishlisted(auth.user?.wishlist_ids?.includes(product.id));
    }, [auth.user?.wishlist_ids, product.id]);

    // Financial calculations for display
    const hasDiscount = Boolean(product.discount_price && product.discount_price > 0 && product.discount_price < product.price);
    const currentPrice = hasDiscount ? product.discount_price : product.price;
    const savings = hasDiscount ? Math.max(0, product.price - product.discount_price) : 0;

    /**
     * Handles the 'Buy Now' action by triggering the global cart modal.
     */
    const handleBuyNow = (e) => {
        e.preventDefault();
        openCartModal(product);
    };

    /**
     * Toggles wishlist status with optimistic UI feedback.
     */
    const toggleWishlist = (e) => {
        e.preventDefault();
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        setIsWishlisted(!isWishlisted);

        router.post(route('frontend.product.wishlist.toggle', product.id), {}, {
            preserveScroll: true,
            only: ['auth', 'flash'],
            onError: () => setIsWishlisted(isWishlisted) // Rollback on failure
        });
    };

    // Mock rating data for UI consistency
    const rating = 5;
    const reviewCount = 3;

    return (
        <div className="bg-white rounded-md border border-slate-200 p-3 flex flex-col group relative transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#3749bb]/30 hover:-translate-y-1 h-full">
            {/* Promo/Savings Badge */}
            {hasDiscount && (
                <div className="absolute top-0 left-0 bg-[#6e2594] text-white text-[11px] font-bold px-2 py-1 rounded-br-[16px] rounded-tl-[4px] z-10 shadow-sm">
                    Save: {Math.round(savings).toLocaleString()}৳
                </div>
            )}

            {/* Interactive Wishlist Control */}
            <button
                onClick={toggleWishlist}
                className={`absolute top-2 right-2 z-20 p-1.5 rounded-full shadow-sm transition-all duration-300 border border-slate-100 ${isWishlisted
                    ? 'bg-[#4f46e5] text-white opacity-100 scale-110 border-transparent'
                    : 'bg-white text-slate-400 hover:text-[#4f46e5] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                    }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>

            {/* High-Performance Product Image Container */}
            <div className="relative overflow-hidden bg-white flex items-center justify-center h-[160px] mb-3">
                <Link href={route('frontend.url', product.slug)} className="w-full h-full flex items-center justify-center">
                    {product.primary_image ? (
                        <img
                            src={product.primary_image.full_url}
                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            alt={product.name}
                            loading="lazy"
                        />
                    ) : (
                        <div className="text-slate-200">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                        </div>
                    )}
                </Link>
            </div>

            <div className="flex flex-col flex-1 border-t border-slate-100 pt-3 relative">
                {/* Badges/Tags Area */}
                <div className="flex items-center mb-1.5">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#d3f971] to-[#9df0a3] text-[#0a5c36] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        In Stock
                    </span>
                </div>

                {/* Title Section */}
                <Link
                    href={route('frontend.url', product.slug)}
                    prefetch
                    className="text-[13px] font-bold text-[#081621] hover:text-[#4f46e5] hover:underline mb-1.5 leading-[1.3] tracking-tight line-clamp-2"
                >
                    {product.name}
                </Link>

                {/* Ratings instead of Features */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-[#ffc107]">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-[12px] h-[12px] ${i < rating ? 'fill-current' : 'fill-slate-200 text-slate-200'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[11px] text-slate-400 leading-none">{reviewCount}</span>
                </div>

                {/* Price and Actions Area - Same Row */}
                <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    {/* Price Block - Left Aligned */}
                    <div className="flex flex-col">
                        <span className="text-[16px] font-black text-[#e62e04] leading-none tracking-tight">
                            {parseFloat(currentPrice).toLocaleString()}৳
                        </span>
                        {hasDiscount && (
                            <span className="text-[11.5px] text-slate-400 line-through font-medium leading-none mt-1">
                                {parseFloat(product.price).toLocaleString()}৳
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        {/* Secondary Buy Now Button (Small) */}
                        <button
                            onClick={handleBuyNow}
                            className="h-[28px] px-2.5 bg-[#f2f4f8] text-[#081621] hover:bg-[#e2e6f0] rounded-[4px] font-bold text-[11px] transition-colors flex items-center justify-center shadow-sm"
                            title="Buy Now"
                        >
                            Buy
                        </button>
                        
                        {/* Primary Add to Cart Button (Small) */}
                        <button
                            onClick={handleBuyNow}
                            className="h-[28px] px-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-[4px] font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-sm"
                            title="Add to Cart"
                        >
                            <ShoppingCart size={12} strokeWidth={2.5} />
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
