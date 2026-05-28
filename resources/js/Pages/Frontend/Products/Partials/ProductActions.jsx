import { Plus, Minus, Heart, ShoppingBag } from 'lucide-react';

/**
 * ProductActions Component
 * Handles quantity selection and buy/cart actions.
 */
const ProductActions = ({ quantity, setQuantity, onAddToCart, onBuyNow, isInWishlist, onToggleWishlist, children }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Action Bar (Quantity + Cart) */}
            <div className="flex items-center gap-3">
                {/* Quantity Selector - Professional Minimalist */}
                <div className="flex items-center border border-slate-300 rounded-[4px] h-[42px] w-[120px] shrink-0 bg-white focus-within:border-[#10b981] focus-within:ring-1 focus-within:ring-[#10b981] transition-all group hover:border-slate-400">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-[38px] h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors rounded-l-[3px]"
                    >
                        <Minus size={18} strokeWidth={1.5} />
                    </button>
                    
                    <div className="w-px h-5 bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>

                    <input
                        type="text"
                        value={quantity}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) setQuantity(Math.max(1, val));
                        }}
                        className="flex-1 w-full h-full text-center border-none focus:ring-0 font-semibold text-slate-800 text-[16px] p-0 bg-transparent"
                    />

                    <div className="w-px h-5 bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>

                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-[38px] h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors rounded-r-[3px]"
                    >
                        <Plus size={18} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={onAddToCart}
                    className="flex-1 sm:flex-none px-4 h-[42px] bg-[#10b981] text-white font-bold rounded-[4px] hover:bg-[#059669] transition-colors text-[13px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm"
                >
                    <ShoppingBag size={16} strokeWidth={2.5} />
                    Add to cart
                </button>

                {/* Buy Now Button */}
                <button
                    onClick={onBuyNow}
                    className="flex-1 sm:flex-none px-4 h-[42px] bg-[#e62e04] text-white font-bold rounded-[4px] hover:bg-[#cc2803] transition-colors text-[13px] uppercase tracking-wide flex items-center justify-center shadow-sm"
                >
                    Buy Now
                </button>
            </div>

            {/* Render PaymentOptions (Injected via children to keep separation of concerns) */}
            {children}

            {/* Utility Actions (Wishlist, Share) */}
            <div className="flex items-center flex-wrap gap-4 text-[12px] text-slate-600 font-medium mt-1">
                <button
                    onClick={onToggleWishlist}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border ${isInWishlist ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'} transition-all h-[34px]`}
                >
                    <Heart size={14} fill={isInWishlist ? "currentColor" : "none"} strokeWidth={2} />
                    {isInWishlist ? 'Saved' : 'Save to wishlist'}
                </button>

                <div className="w-px h-4 bg-slate-300"></div>

                <div className="flex items-center gap-2">
                    <span className="text-[12px] text-slate-500 font-medium mr-1">Share:</span>
                    <button className="flex items-center justify-center w-[34px] h-[34px] rounded bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-all shadow-sm" title="Share on Facebook">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" /></svg>
                    </button>
                    <button className="flex items-center justify-center w-[34px] h-[34px] rounded bg-[#25D366] text-white hover:bg-[#25D366]/90 transition-all shadow-sm" title="Share on WhatsApp">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.996 0C5.372 0 0 5.373 0 11.998c0 2.127.553 4.192 1.603 6.012L.357 24l6.136-1.609a11.932 11.932 0 005.503 1.341h.005c6.622 0 11.996-5.373 11.996-11.998S18.618 0 11.996 0zm6.541 17.31c-.276.776-1.597 1.488-2.195 1.547-.565.055-1.282.115-3.655-.867-2.883-1.196-4.734-4.148-4.88-4.343-.146-.195-1.168-1.554-1.168-2.964 0-1.41.731-2.106 1.002-2.399.271-.293.585-.366.78-.366.195 0 .39.001.56.008.176.007.419-.068.654.498.244.586.829 2.025.903 2.171.073.146.122.317.024.512-.098.195-.146.317-.293.488-.146.171-.307.356-.44.478-.146.136-.298.286-.134.57.163.285.727 1.208 1.567 1.956 1.086.967 1.986 1.267 2.279 1.414.293.146.464.122.635-.073.171-.195.731-.854.927-1.146.195-.293.39-.244.658-.146.268.098 1.696.8 1.988.946.293.146.488.22.561.342.073.122.073.708-.203 1.483z" /></svg>
                    </button>
                    <button className="flex items-center justify-center w-[34px] h-[34px] rounded bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-all shadow-sm" title="Share on LinkedIn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.225 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.77 24h20.452C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.069 20.452H3.555V9.034h3.514v11.418zM5.312 7.542c-1.127 0-2.041-.912-2.041-2.039 0-1.128.914-2.04 2.041-2.04s2.043.912 2.043 2.04c0 1.127-.916 2.039-2.043 2.039zM20.452 20.452h-3.515v-5.568c0-1.328-.024-3.037-1.85-3.037-1.85 0-2.133 1.445-2.133 2.941v5.664h-3.515V9.034h3.376v1.562h.048c.47-.887 1.616-1.821 3.321-1.821 3.552 0 4.21 2.338 4.21 5.378v6.299z" /></svg>
                    </button>
                    <button className="flex items-center justify-center w-[34px] h-[34px] rounded bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 transition-all shadow-sm" title="Share on Twitter">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductActions;
