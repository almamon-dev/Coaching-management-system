import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingBasket, Heart } from 'lucide-react';
import { useFrontend } from '@/Contexts/FrontendContext';
import AnimatedBorder from './AnimatedBorder';
import DiscountBadge from './DiscountBadge';
import StarRating from './StarRating';

/**
 * ProductCard Component
 * 
 * Renders a product card with dashed borders, starburst discount badge,
 * inline pricing, and a full-width gradient buy button (DailyFresh Theme).
 */
const ProductCard = memo(({ product, compact = false }) => {
    const { auth } = usePage().props;
    const { openCartModal } = useFrontend();

    // Local state for optimistic UI updates
    const [isWishlisted, setIsWishlisted] = useState(auth.user?.wishlist_ids?.includes(product.id));
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setIsWishlisted(auth.user?.wishlist_ids?.includes(product.id));
    }, [auth.user?.wishlist_ids, product.id]);

    // Financial calculations (Memoized)
    const { hasDiscount, currentPrice, discountPercent } = useMemo(() => {
        const hasDisc = Boolean(product.discount_price && product.discount_price > 0 && product.discount_price < product.price);
        const currPrice = hasDisc ? product.discount_price : product.price;
        const discPercent = hasDisc ? Math.round(((product.price - product.discount_price) / product.price) * 100) : 0;

        return { hasDiscount: hasDisc, currentPrice: currPrice, discountPercent: discPercent };
    }, [product.price, product.discount_price]);

    const handleBuyNow = useCallback((e) => {
        e.preventDefault();
        openCartModal(product);
    }, [openCartModal, product]);

    const toggleWishlist = useCallback((e) => {
        e.preventDefault();
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        setIsWishlisted((prev) => !prev);

        router.post(route('frontend.product.wishlist.toggle', product.id), {}, {
            preserveScroll: true,
            only: ['auth', 'flash'],
            onError: () => setIsWishlisted((prev) => !prev) // Revert on error
        });
    }, [auth.user, product.id]);

    const rating = 5;

    return (
        <div className="bg-white p-3 flex flex-col group relative transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 h-full rounded-md z-0">
            {/* Animated Dashed Border (Marching Ants) */}
            <AnimatedBorder />

            {/* Starburst Discount Badge */}
            {hasDiscount && <DiscountBadge percent={discountPercent} />}

            {/* Interactive Wishlist Control */}
            <button
                onClick={toggleWishlist}
                className={`absolute top-2 right-2 z-20 p-1.5 rounded-full shadow-sm transition-all duration-300 border border-slate-100 ${isWishlisted
                    ? 'bg-[#10b981] text-white opacity-100 scale-110 border-transparent'
                    : 'bg-white text-slate-400 hover:text-[#10b981] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                    }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>

            <div className="relative overflow-hidden bg-white flex items-center justify-center h-[250px] mb-3">
                <Link href={route('frontend.url', product.slug)} className="w-full h-full flex items-center justify-center">
                    {product.primary_image && !imgError ? (
                        <img
                            src={product.primary_image.full_url}
                            className="max-w-[90%] max-h-[90%] object-contain mix-blend-multiply contrast-[1.1] brightness-[1.05] group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            alt={product.name}
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="text-slate-200">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                        </div>
                    )}
                </Link>
            </div>

            <div className="flex flex-col flex-1 relative z-10">
                {/* Title */}
                <Link
                    href={route('frontend.url', product.slug)}
                    prefetch
                    className="text-[14px] font-bold text-[#202223] hover:text-[#10b981] mb-1.5 leading-[1.3] tracking-tight line-clamp-2"
                >
                    {product.name}
                </Link>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-2">
                    <StarRating rating={rating} />
                </div>

                {/* Inline Price */}
                <div className="flex items-baseline gap-2 mb-3 mt-auto">
                    <span className="text-[17px] font-black text-[#10b981] leading-none tracking-tight">
                        ৳ {parseFloat(currentPrice).toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <span className="text-[12px] text-slate-400 line-through font-medium leading-none">
                            MRP {parseFloat(product.price).toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Full-width Buy Button */}
                <button
                    onClick={handleBuyNow}
                    className="w-full h-[36px] btn-primary flex items-center justify-center gap-2"
                    title="Buy Now"
                >
                    <ShoppingBasket size={16} strokeWidth={2.5} />
                    <span>Buy</span>
                </button>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
