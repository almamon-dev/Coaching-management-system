import { Plus, Minus, Heart } from 'lucide-react';

/**
 * ProductActions Component
 * Handles quantity selection and buy/cart actions.
 * 
 * @param {Number} quantity - Current quantity value
 * @param {Function} setQuantity - State setter for quantity
 * @param {Function} onAddToCart - Handler for adding to cart
 * @param {Function} onBuyNow - Handler for immediate purchase
 * @param {Boolean} isInWishlist - Whether product is in wishlist
 * @param {Function} onToggleWishlist - Handler for wishlist toggle
 */
const ProductActions = ({ quantity, setQuantity, onAddToCart, onBuyNow, isInWishlist, onToggleWishlist }) => {
    return (
        <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-200 rounded h-[42px] bg-white overflow-hidden shadow-sm">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-slate-50 transition-colors border-r border-slate-100 text-slate-500"
                >
                    <Minus size={16} />
                </button>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-12 h-full text-center border-none focus:ring-0 font-bold text-[#081621] text-[14px]"
                />
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center hover:bg-slate-50 transition-colors border-l border-slate-100 text-[#4f46e5]"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Buy Now Button - Smaller and Blue */}
            <button
                onClick={onBuyNow}
                className="px-10 h-[42px] bg-[#3749bb] text-white font-bold rounded-[2px] hover:bg-[#2e3d9e] transition-all text-[14px] shadow-sm active:scale-95"
            >
                Buy Now
            </button>

            {/* Wishlist Button */}
            <button
                onClick={onToggleWishlist}
                className={`w-[42px] h-[42px] flex items-center justify-center rounded border transition-all shadow-sm active:scale-95 ${isInWishlist
                        ? 'bg-[#4f46e5] border-[#4f46e5] text-white'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-[#4f46e5] hover:border-[#4f46e5]'
                    }`}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
        </div>
    );
};

export default ProductActions;
