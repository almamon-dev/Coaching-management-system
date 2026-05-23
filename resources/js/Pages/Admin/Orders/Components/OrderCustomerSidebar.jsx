import React from 'react';
import { User, MapPin, CreditCard, Mail, Phone, ShoppingBag } from 'lucide-react';

const OrderCustomerSidebar = ({ order }) => {
    const formatAddress = (address) => {
        if (!address) return 'No specific address provided';
        if (typeof address === 'string') return address;

        return [
            address.address,
            address.area,
            address.city,
            address.post_code,
        ].filter(Boolean).join(', ') || 'No specific address provided';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(price || 0).replace('BDT', '৳');
    };

    return (
        <div className="space-y-4">
            {/* 1. Payment Summary */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ebebeb] flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#202223]">Payment Summary</h3>
                    <CreditCard size={14} className="text-[#6d7175]" />
                </div>
                <div className="p-4 space-y-3">
                    <div className="flex justify-between text-[12px]">
                        <span className="text-[#6d7175] font-medium">Subtotal</span>
                        <span className="text-[#202223] font-bold">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                        <span className="text-[#6d7175] font-medium">Discount</span>
                        <span className="text-[#bf0711] font-bold">-{formatPrice(order.discount)}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                        <span className="text-[#6d7175] font-medium">Shipping</span>
                        <span className="text-[#202223] font-bold">{formatPrice(order.shipping_cost)}</span>
                    </div>
                    <div className="pt-2.5 border-t border-[#f1f1f1] flex items-center justify-between">
                        <span className="text-[12px] font-black text-[#202223] uppercase tracking-wider">Total</span>
                        <span className="text-[18px] font-black text-[#008060] tracking-tight">{formatPrice(order.total_amount)}</span>
                    </div>
                </div>
            </div>

            {/* 2. Customer Info */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ebebeb] flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#202223]">Customer</h3>
                    <User size={14} className="text-[#6d7175]" />
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#f6f6f7] border border-[#ebebeb] flex items-center justify-center text-[#6d7175] shrink-0">
                            <User size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-bold text-[#202223] truncate">{order.shipping_name || order.user?.name}</p>
                            <p className="text-[10px] text-[#008060] font-bold uppercase tracking-wider">Registered Member</p>
                        </div>
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 text-[#6d7175] hover:text-[#005bd3] cursor-pointer transition-colors group">
                            <Mail size={13} />
                            <span className="text-[12px] font-medium group-hover:underline truncate">{order.shipping_email || order.user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[#6d7175]">
                            <Phone size={13} />
                            <span className="text-[12px] font-medium">{order.shipping_phone || order.user?.phone || 'No phone provided'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Shipping Address */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ebebeb] flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#202223]">Shipping Address</h3>
                    <MapPin size={14} className="text-[#6d7175]" />
                </div>
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[4px] bg-[#f6f6f7] text-[#6d7175] flex items-center justify-center shrink-0 border border-[#ebebeb]">
                            <MapPin size={14} />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-[12px] font-bold text-[#202223] leading-relaxed">
                                {formatAddress(order.shipping_address)}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                <span className="px-2 py-0.5 bg-[#f6f6f7] border border-[#ebebeb] rounded-full text-[10px] font-bold text-[#6d7175] uppercase tracking-wider">
                                    {order.shipping_district || 'Dhaka'}
                                </span>
                                <span className="px-2 py-0.5 bg-[#f6f6f7] border border-[#ebebeb] rounded-full text-[10px] font-bold text-[#6d7175] uppercase tracking-wider">
                                    {order.shipping_upazila || 'Uttara'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCustomerSidebar;
