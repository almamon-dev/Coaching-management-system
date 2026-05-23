import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { CheckCircle2, ShoppingBag, ArrowRight, Download, Package, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const OrderSuccess = ({ categories, brands, order }) => {
    const [showStripe, setShowStripe] = useState(false);

    // Check if order is already paid
    const isPaid = order.payment?.status === 'paid' || order.payment?.status === 'success';

    return (
        <FrontendLayout categories={categories} brands={brands}>
            <Head title="Order Successful - Star Tech" />

            <div className="bg-[#f2f4f8] min-h-screen py-10">
                <div className="container mx-auto px-4 max-w-xl">
                    <div className="bg-white rounded-[8px] shadow-md border border-slate-200 overflow-hidden">
                        {/* Header: Compact & Clean */}
                        <div className="p-6 text-center bg-white border-b border-slate-50">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full mb-3">
                                <CheckCircle2 size={28} />
                            </div>
                            <h1 className="text-[18px] font-bold text-[#081621] mb-0.5">
                                {isPaid ? 'Payment Received!' : 'Order Placed Successfully!'}
                            </h1>
                            <p className="text-slate-400 text-[12px]">
                                Order ID: <span className="font-bold text-[#4f46e5]">#{order.order_number}</span>
                            </p>
                        </div>

                        {/* Content Grid: Stacked & Dense */}
                        <div className="divide-y divide-slate-100">
                            {/* Summary Section */}
                            <div className="p-5">
                                <h2 className="text-[13px] font-bold text-[#081621] mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <Package size={14} className="text-[#3749bb]" />
                                    Order Summary
                                </h2>
                                <div className="bg-slate-50/50 rounded-[4px] border border-slate-100 p-4 space-y-2">
                                    <div className="flex justify-between text-[13px] border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Items Count:</span>
                                        <span className="text-[#081621] font-medium">{order.items?.length || 0} Item(s)</span>
                                    </div>
                                    <div className="flex justify-between text-[13px] border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Sub-Total:</span>
                                        <span className="text-[#081621] font-medium">{order.subtotal.toLocaleString()}৳</span>
                                    </div>
                                    <div className="flex justify-between text-[13px] border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Delivery:</span>
                                        <span className="text-[#081621] font-medium">{order.shipping_cost.toLocaleString()}৳</span>
                                    </div>
                                    <div className="flex justify-between text-[13px] pt-1">
                                        <span className="text-slate-500 font-bold">Total Payable:</span>
                                        <span className="text-[#3749bb] font-bold">{order.total_amount.toLocaleString()}৳</span>
                                    </div>
                                    <div className="flex justify-between text-[13px] pt-1 border-t border-slate-200 mt-1">
                                        <span className="text-[#4f46e5] font-bold">Amount Due:</span>
                                        <span className="text-[#4f46e5] text-[16px] font-bold">
                                            {isPaid ? 0 : order.total_amount.toLocaleString()}৳
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-[13px] font-bold text-[#081621] uppercase tracking-wider">Payment Status</h2>
                                    {isPaid ? (
                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Paid</span>
                                    ) : (
                                        <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Pending</span>
                                    )}
                                </div>

                                {isPaid ? (
                                    <div className="p-4 bg-emerald-50 rounded-[4px] border border-emerald-100 flex items-center gap-3">
                                        <ShieldCheck size={20} className="text-emerald-500" />
                                        <p className="text-[12px] text-emerald-700 font-medium">Your payment has been successfully verified.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {!showStripe ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setShowStripe(true)}
                                                    className="flex-1 py-2.5 bg-[#3749bb] text-white rounded-[4px] font-bold text-[13px] hover:bg-[#2e3d9e] shadow-sm uppercase tracking-wide"
                                                >
                                                    Pay Online
                                                </button>
                                                <button className="flex-1 py-2.5 border border-[#3749bb] text-[#3749bb] rounded-[4px] font-bold text-[13px] hover:bg-slate-50 uppercase tracking-wide">
                                                    Later
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="animate-in slide-in-from-top-2 duration-300">
                                                <div className="bg-slate-50 p-4 rounded-[4px] border border-slate-200 mb-2">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <CreditCard size={14} className="text-[#3749bb]" />
                                                        <span className="text-[12px] font-bold text-slate-700">Stripe Secure Payment</span>
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const { data } = await axios.post(route('payment.stripe.process'), {
                                                                    order_number: order.order_number
                                                                });
                                                                if (data.url) window.location.href = data.url;
                                                            } catch (err) {
                                                                console.error(err);
                                                                alert('Payment error.');
                                                            }
                                                        }}
                                                        className="w-full py-2.5 bg-[#3749bb] text-white font-bold rounded-[4px] hover:bg-[#2e3d9e] text-[13px] shadow-sm"
                                                    >
                                                        Proceed to Pay {order.total_amount.toLocaleString()}৳
                                                    </button>
                                                </div>
                                                <button onClick={() => setShowStripe(false)} className="w-full text-[11px] text-slate-400 font-bold uppercase py-1">Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions & Footer */}
                            <div className="p-5 flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/"
                                        className="flex items-center justify-center gap-2 text-[12px] text-slate-600 font-bold py-2 border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-all"
                                    >
                                        <ShoppingBag size={14} />
                                        Shoping
                                    </Link>
                                    <a
                                        href={route('checkout.invoice', order.order_number)}
                                        target="_blank"
                                        className="flex items-center justify-center gap-2 text-[12px] text-slate-600 font-bold py-2 border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-all"
                                    >
                                        <Download size={14} />
                                        Invoice
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
};

export default OrderSuccess;
