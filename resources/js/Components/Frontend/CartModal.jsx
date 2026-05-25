import React, { memo, useCallback } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useFrontend } from '@/Contexts/FrontendContext';

/**
 * CartModal Component
 * 
 * An immediate-feedback overlay triggered when a product is successfully added to the cart.
 * Wrapped in React.memo for high-speed UI transitions and lifecycle stability.
 * 
 * @param {boolean} props.isOpen - Display toggle for the modal.
 * @param {Function} props.onClose - Trigger to dismiss the modal.
 * @param {Object} props.product - The specific product object added.
 * @param {number} props.quantity - The quantity of the product added.
 */
const CartModal = memo(({ isOpen, onClose, product, quantity = 1 }) => {
    const { toggleCartSidebar } = useFrontend();

    // Performance Guard: Do not render if closed or data missing
    if (!isOpen || !product) return null;

    const currentPrice = product.discount_price > 0 ? product.discount_price : product.price;

    /**
     * handleViewCart
     * Synchronizes closing the modal while simultaneously opening the cart sidebar
     */
    const handleViewCart = useCallback((e) => {
        e.preventDefault();
        onClose();
        // Delay slightly for smooth transition if needed, or trigger immediately
        toggleCartSidebar();
    }, [onClose, toggleCartSidebar]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div
                className="bg-white rounded-sm shadow-[0_20px_70px_rgba(0,0,0,0.4)] w-full max-w-[730px] overflow-hidden relative animate-in zoom-in-95 duration-300"
                role="dialog"
                aria-modal="true"
            >
                {/* Executive Close Interface */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-[#10b981] hover:rotate-90 transition-all duration-300 p-1 z-10"
                    aria-label="Close modal"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                <div className="p-6 md:p-8 pt-10 md:pt-12">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Status Messaging Block */}
                        <div className="flex-1 flex gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#00ab55] flex items-center justify-center shrink-0 shadow-lg shadow-[#00ab55]/20">
                                <CheckCircle2 className="text-white" size={20} strokeWidth={2.5} />
                            </div>
                            <div className="text-[15px] text-[#081621] leading-relaxed font-medium">
                                Successfully added <span className="text-[#10b981] font-black underline underline-offset-4 decoration-2">"{product.name}"</span> to your shopping cart!
                            </div>
                        </div>

                        {/* Transaction Summary Micro-Card */}
                        <div className="w-full md:w-[220px] bg-[#f8f9fb] rounded-sm border border-slate-200 p-4 shadow-inner">
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200/60">
                                <span className="text-[12px] text-slate-500 font-medium">Added Qty:</span>
                                <span className="text-[16px] font-black text-[#081621]">{quantity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-slate-500 font-medium">Cart Total:</span>
                                <span className="text-[18px] font-black text-[#10b981]">৳{parseFloat(currentPrice * quantity).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        <button
                            onClick={handleViewCart}
                            className="flex-1 md:flex-none px-8 py-2.5 bg-[#10b981] text-white font-bold rounded-sm hover:bg-[#059669] transition-all text-[14px] shadow-md active:scale-95"
                        >
                            View Cart
                        </button>
                        <Link
                            href={route('checkout')}
                            onClick={onClose}
                            className="flex-1 md:flex-none px-8 py-2.5 border border-[#10b981] text-[#10b981] font-bold rounded-sm hover:bg-[#10b981] hover:text-white transition-all text-[14px] active:scale-95 text-center"
                        >
                            Confirm Order
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
});

CartModal.displayName = 'CartModal';

export default CartModal;
