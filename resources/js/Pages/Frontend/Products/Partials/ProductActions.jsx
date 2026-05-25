import { Plus, Minus, Heart, Share2, ArrowRightLeft, ShoppingBag } from 'lucide-react';

/**
 * ProductActions Component
 * Handles quantity selection and buy/cart actions.
 */
const ProductActions = ({ quantity, setQuantity, onAddToCart, onBuyNow, isInWishlist, onToggleWishlist, children }) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Action Bar (Quantity + Cart) */}
            <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-slate-200 rounded-md h-[46px] bg-white overflow-hidden w-[120px] shrink-0">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-full flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-800 shrink-0"
                    >
                        <Minus size={16} />
                    </button>
                    <input
                        type="text"
                        value={quantity}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) setQuantity(Math.max(1, val));
                        }}
                        className="w-10 h-full text-center border-none focus:ring-0 font-bold text-slate-800 text-[15px] p-0 bg-transparent"
                    />
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-full flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-800 shrink-0"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={onAddToCart}
                    className="flex-1 sm:flex-none px-6 h-[46px] bg-[#10b981] text-white font-bold rounded-md hover:bg-[#059669] transition-colors text-[14px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm"
                >
                    <ShoppingBag size={18} strokeWidth={2.5} />
                    Add to cart
                </button>

                {/* Buy Now Button */}
                <button
                    onClick={onBuyNow}
                    className="flex-1 sm:flex-none px-6 h-[46px] bg-[#e62e04] text-white font-bold rounded-md hover:bg-[#cc2803] transition-colors text-[14px] uppercase tracking-wide flex items-center justify-center shadow-sm"
                >
                    Buy Now
                </button>
            </div>

            {/* Render PaymentOptions (Injected via children to keep separation of concerns) */}
            {children}

            {/* Utility Actions (Wishlist, Share, Compare) */}
            <div className="flex items-center flex-wrap gap-3 text-[13px] text-[#081621] font-medium mt-2">
                <button
                    onClick={onToggleWishlist}
                    className={`flex items-center gap-2 border border-slate-200 rounded-md px-4 py-2 hover:border-slate-300 transition-colors ${isInWishlist ? 'text-[#5c319e]' : ''}`}
                >
                    <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} strokeWidth={2} />
                    {isInWishlist ? 'In wishlist' : 'Add to wishlist'}
                </button>
                <button className="flex items-center gap-2 border border-slate-200 rounded-md px-4 py-2 hover:border-slate-300 transition-colors">
                    <Share2 size={16} strokeWidth={2} />
                    Share this Product
                </button>
                <button className="flex items-center gap-2 border border-slate-200 rounded-md px-4 py-2 hover:border-slate-300 transition-colors">
                    <ArrowRightLeft size={16} strokeWidth={2} />
                    Compare
                </button>
            </div>
        </div>
    );
};

export default ProductActions;
