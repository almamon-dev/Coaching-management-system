import React from 'react';
import { ShoppingBasket, PlusSquare, LifeBuoy } from 'lucide-react';
import { Link } from '@inertiajs/react';

const StickyActions = ({ cartCount = 3, compareCount = 0, onCartClick }) => {
    return (
        <div className="fixed right-5 bottom-10 z-[100] flex flex-col gap-[15px]">
            {/* Support Button */}
            <Link 
                href={route('dashboard.tickets.index')}
                className="w-[62px] h-[62px] bg-[#081621] text-white flex flex-col items-center justify-center rounded-[3px] shadow-2xl group transition-all hover:bg-[#4f46e5] relative border border-white/10"
                title="Customer Support Tickets"
            >
                <LifeBuoy size={20} strokeWidth={2.5} className="mb-0.5 group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-[11px] font-extrabold uppercase tracking-tighter">Support</span>
            </Link>

            {/* Compare Button */}
            <Link 
                href="/compare"
                className="w-[62px] h-[62px] bg-[#081621] text-white flex flex-col items-center justify-center rounded-[3px] shadow-2xl group transition-all hover:bg-[#4f46e5] relative border border-white/10"
            >
                <PlusSquare size={20} strokeWidth={2.5} className="mb-0.5" />
                <span className="text-[11px] font-extrabold uppercase tracking-tighter">Compare</span>
                {/* Badge */}
                <div className="absolute -top-1 -right-1 bg-[#4f46e5] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-[3px] border border-white/20 shadow-md">
                    {compareCount}
                </div>
            </Link>

            {/* Cart Button (Triggers Sidebar) */}
            <button 
                type="button"
                onClick={onCartClick}
                className="w-[62px] h-[62px] bg-[#081621] text-white flex flex-col items-center justify-center rounded-[3px] shadow-2xl group transition-all hover:bg-[#4f46e5] relative border border-white/10"
            >
                <ShoppingBasket size={20} strokeWidth={2.5} className="mb-0.5" />
                <span className="text-[11px] font-extrabold uppercase tracking-tighter">Cart</span>
                {/* Badge */}
                <div className="absolute -top-1 -right-1 bg-[#4f46e5] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-[3px] border border-white/20 shadow-md">
                    {cartCount}
                </div>
            </button>
        </div>
    );
};

export default StickyActions;
