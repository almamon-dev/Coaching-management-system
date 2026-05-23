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

    return (
        <div className="bg-white rounded-md border border-slate-200 p-4 flex flex-col group relative transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#3749bb]/30 hover:-translate-y-1">
            {/* Promo/Savings Badge - Precision aligned to corner as per screenshot */}
            {hasDiscount && (
                <div className="absolute top-0 left-0 bg-[#6e2594] text-white text-[12px] font-bold px-4 py-1.5 rounded-br-[20px] rounded-tl-md z-10 shadow-sm">
                    Save: {Math.round(savings).toLocaleString()}৳
                </div>
            )}

            {/* Interactive Wishlist Control */}
            <button
                onClick={toggleWishlist}
                className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md transition-all duration-300 ${isWishlisted
                    ? 'bg-[#4f46e5] text-white opacity-100 scale-110'
                    : 'bg-white text-slate-400 hover:text-[#4f46e5] border border-slate-100 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                    }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>

            {/* High-Performance Product Image Container */}
            <div className="relative overflow-hidden bg-white flex items-center justify-center h-[210px] mb-4 p-2">
                {product.primary_image ? (
                    <img
                        src={product.primary_image.full_url}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-100">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 border-t border-slate-100 pt-4">
                {/* Title Section */}
                <Link
                    href={route('frontend.url', product.slug)}
                    prefetch
                    className="text-[14px] font-bold text-[#081621] hover:text-[#4f46e5] hover:underline mb-4 leading-[1.4] tracking-tight"
                >
                    {product.name}
                </Link>

                {/* Technical Highlights - Refined bullet points */}
                {!compact && (
                    <ul className="mb-5 space-y-1.5 flex-1 list-disc pl-4">
                        {(product.features?.length > 0 ? product.features : []).slice(0, 4).map((feature) => {
                            const featureText = typeof feature === 'string' ? feature : (feature.feature || feature.name || '');
                            return (
                                <li key={featureText} className="text-[13px] text-[#666666] leading-tight pl-1 marker:text-slate-300">
                                    <span>{featureText}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Price and Actions Area */}
                <div className="mt-auto pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
                        <span className="text-[18px] font-bold text-[#4f46e5]">{parseFloat(currentPrice).toLocaleString()}৳</span>
                        {hasDiscount && (
                            <span className="text-[13px] text-[#666666] line-through font-normal opacity-70">{parseFloat(product.price).toLocaleString()}৳</span>
                        )}
                    </div>

                    {!compact && (
                        <div className="space-y-3">
                            <button
                                onClick={handleBuyNow}
                                className="w-full py-2.5 bg-[#f2f4f8] text-[#3749bb] rounded-[2px] font-bold text-[14px] hover:bg-[#3749bb] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                            >
                                <ShoppingCart size={18} className="text-[#3749bb] group-hover/btn:text-white transition-colors" />
                                Buy Now
                            </button>

                            <button className="w-full flex items-center justify-center gap-2 text-[#666666] hover:text-[#4f46e5] transition-colors text-[13px] font-bold group/comp py-1">
                                <Plus size={14} className="border border-slate-300 rounded-[2px] group-hover/comp:border-[#4f46e5] transition-colors p-[1px]" />
                                Add to Compare
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
