import React, { memo, useMemo } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

/**
 * CartSidebar Component
 * 
 * Provides a high-performance, sliding drawer interface for managing the user's shopping cart.
 * Wrapped in React.memo to ensure that layout updates only occur when cart data changes.
 * 
 * @param {boolean} props.isOpen - Visibility status of the drawer.
 * @param {Function} props.onClose - Trigger to dismiss the sidebar.
 * @param {Array} props.cartItems - Collection of products currently in the cart.
 * @param {Function} props.onRemove - Callback for deleting an item from the cart.
 */
const CartSidebar = memo(({ isOpen, onClose, cartItems = [], onRemove }) => {
    // Memoize the subtotal to avoid recalculating on non-data related re-renders
    const subTotal = useMemo(() => 
        cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0), 
    [cartItems]);

    return (
        <>
            {/* Global Backdrop Overlay */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black/60 z-[1000] backdrop-blur-[2px] transition-opacity duration-500",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Precision Engineered Sidebar Drawer */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-full max-w-[360px] bg-white z-[1001] shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Visual Header with Brand Identity */}
                <div className="bg-[#081621] p-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-[15px] font-bold uppercase tracking-wide">Your Cart</h2>
                    <button 
                        onClick={onClose} 
                        className="hover:rotate-180 transition-transform duration-500 p-1 rounded-full hover:bg-white/10"
                        aria-label="Close cart"
                    >
                        <X size={22} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Scoped Scrolling Items Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0 relative group animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="w-[50px] h-[50px] shrink-0">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 pr-6">
                                    <h3 className="text-[13px] text-slate-800 leading-[1.4] mb-1 truncate hover:text-indigo-600 cursor-pointer">
                                        {item.name}
                                    </h3>
                                    <div className="text-[14px] font-medium text-slate-900 flex items-center gap-1.5">
                                        <span>{item.price.toLocaleString()}৳</span>
                                        <span className="text-slate-400 font-normal">×</span>
                                        <span>{item.quantity}</span>
                                        <span className="text-slate-400 font-normal">=</span>
                                        <span>{(item.price * item.quantity).toLocaleString()}৳</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onRemove(item.id)}
                                    className="absolute top-0 right-0 p-1 text-slate-400 hover:text-red-500 transition-all"
                                    title="Remove Item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 bg-[#f2f4f8] rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <ShoppingBag className="text-slate-300" size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#081621] mb-2">Cart is empty</h3>
                            <p className="text-[14px] text-slate-400">Discover amazing tech deals and start filling your cart!</p>
                        </div>
                    )}
                </div>

                {/* Strategic Transactional Footer Area */}
                <div className="bg-[#f8f9fa] border-t border-slate-200">
                    {/* Discount/Voucher Input Field */}
                    <div className="p-4 flex gap-2 border-b border-slate-200">
                        <input 
                            type="text" 
                            placeholder="Promo Code" 
                            className="flex-1 h-9 border border-slate-200 px-3 text-[13px] rounded-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                        />
                        <button className="px-5 h-9 bg-[#3f51b5] text-white font-bold text-[13px] rounded-sm hover:bg-[#303f9f] transition-all">
                            Apply
                        </button>
                    </div>

                    {/* Financial Summary Calculation */}
                    <div className="px-5 py-3 space-y-3">
                        <div className="flex justify-between items-center text-[14px] text-slate-600">
                            <span>Sub-Total</span>
                            <span className="font-bold text-slate-900">{subTotal.toLocaleString()}৳</span>
                        </div>
                        <div className="flex justify-between items-center text-[14px] text-slate-600 pb-3 border-b border-slate-200">
                            <span>Home Delivery</span>
                            <span className="font-bold text-slate-900">200৳</span>
                        </div>
                        <div className="flex justify-between items-center text-[15px] text-slate-600 pt-1">
                            <span>Total</span>
                            <span className="font-bold text-slate-900">{(subTotal + 200).toLocaleString()}৳</span>
                        </div>
                    </div>
                </div>

                {/* Final Checkout Call-to-Action */}
                {cartItems.length > 0 ? (
                    <Link 
                        href={route('checkout')}
                        onClick={onClose}
                        className="w-full h-[45px] bg-[#ef4a23] text-white font-bold text-[15px] hover:bg-[#d8431f] transition-all shrink-0 flex items-center justify-center"
                    >
                        Checkout
                    </Link>
                ) : (
                    <button 
                        onClick={onClose}
                        className="w-full h-[50px] bg-slate-200 text-slate-500 font-bold text-[13px] uppercase tracking-widest shrink-0 cursor-not-allowed"
                        disabled
                    >
                        Cart Empty
                    </button>
                )}
            </div>
        </>
    );
});

CartSidebar.displayName = 'CartSidebar';

export default CartSidebar;
