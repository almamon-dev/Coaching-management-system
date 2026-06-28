import React, { useState } from 'react';
import { Tag, Gift, List } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';

const OrderSummary = ({ cart, agreeTerms, onTermsChange, onConfirm, isSubmitting, isValid, paymentMethod }) => {
    const [couponType, setCouponType] = useState('coupon');
    const [couponCode, setCouponCode] = useState('');

    return (
        <div className="bg-white rounded-[2px] shadow-[0_1px_1px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-6 h-6 bg-[#4f46e5] rounded-sm flex items-center justify-center">
                    <List size={14} className="text-white" />
                </div>
                <h2 className="text-[16px] font-bold text-[#081621] uppercase tracking-tight">Order Summary</h2>
            </div>

            <div className="p-4">
                {/* Coupon Toggle Box */}
                <div className="border border-dashed border-slate-300 rounded-[4px] p-4 mb-6 bg-[#f2f4f8]">
                    <p className="text-[14px] font-bold text-[#081621] mb-1">Get Some Extra</p>
                    <p className="text-[12px] text-slate-500 mb-4">Use coupon/voucher/star points</p>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setCouponType('coupon')}
                            className={`py-1.5 px-5 rounded-full flex items-center justify-center gap-2 text-[12px] font-bold transition-all ${couponType === 'coupon' ? 'bg-[#3749bb] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <Tag size={13} className={couponType === 'coupon' ? 'text-white' : 'text-slate-400'} />
                            Coupon
                        </button>
                        <button
                            onClick={() => setCouponType('voucher')}
                            className={`py-1.5 px-5 rounded-full flex items-center justify-center gap-2 text-[12px] font-bold transition-all ${couponType === 'voucher' ? 'bg-[#3749bb] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <Gift size={13} className={couponType === 'voucher' ? 'text-white' : 'text-slate-400'} />
                            Gift Voucher
                        </button>
                    </div>

                    <div className="flex h-10 shadow-sm rounded-sm overflow-hidden bg-white border border-[#e5e7eb]">
                        <TextInput
                            placeholder="Promo / Coupon Code"
                            className="flex-1 border-0 h-full rounded-none px-4"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className="bg-[#e8ebf4] border-l border-[#e5e7eb] px-6 text-[13px] font-bold text-[#3749bb] hover:bg-[#3749bb] hover:text-white transition-all h-full">
                            Apply
                        </button>
                    </div>
                </div>

                {/* Calculation Table */}
                <div className="mb-6">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                        <span className="text-[14px] text-[#081621]">Sub-Total:</span>
                        <span className="text-[15px] font-bold text-[#081621]">{cart.sub_total.toLocaleString()}৳</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                        <span className="text-[14px] text-[#081621]">Home Delivery:</span>
                        <span className="text-[15px] font-bold text-[#081621]">{cart.shipping.toLocaleString()}৳</span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                        <span className="text-[15px] font-bold text-[#081621]">Total:</span>
                        <span className="text-[24px] font-bold text-[#4f46e5]">{cart.total.toLocaleString()}৳</span>
                    </div>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-3 cursor-pointer group mb-6">
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => onTermsChange(e.target.checked)}
                        className="w-[15px] h-[15px] rounded-[2px] border-slate-300 text-[#4f46e5] focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5"
                    />
                    <span className="text-[12px] text-[#081621] leading-tight group-hover:text-black transition-colors">
                        I have read and agree to the <a href="#!" onClick={(e) => e.preventDefault()} className="text-[#4f46e5] font-bold">Terms and Conditions</a>, <a href="#!" onClick={(e) => e.preventDefault()} className="text-[#4f46e5] font-bold">Privacy Policy</a> and <a href="#!" onClick={(e) => e.preventDefault()} className="text-[#4f46e5] font-bold">Refund and Return Policy</a>
                    </span>
                </label>

                {/* Confirm Button */}
                <button
                    disabled={!isValid || isSubmitting}
                    onClick={onConfirm}
                    className={`w-full py-2.5 rounded-[4px] font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${isValid && !isSubmitting
                        ? 'bg-[#3749bb] text-white hover:bg-[#2e3d9e]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        paymentMethod === 'stripe' ? 'Pay Now' : 'Confirm Order'
                    )}
                </button>
            </div>

            {/* Bottom scalloped edge effect */}
            <div className="h-1.5 w-full bg-[radial-gradient(circle_at_4px_0px,#ffffff_4px,transparent_4px)] bg-[length:8px_8px] bg-repeat-x" />
        </div>
    );
};

export default OrderSummary;
