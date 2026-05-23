import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const StripePaymentForm = ({ order, onReset }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Create Payment Intent on backend
            const { data } = await axios.post(route('checkout.payment.stripe.intent'), {
                order_number: order.order_number
            });

            // 2. Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: order.user?.name,
                        email: order.user?.email,
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // 3. Confirm success on backend
                    await axios.post(route('checkout.payment.stripe.confirm'), {
                        order_number: order.order_number,
                        payment_intent_id: result.paymentIntent.id
                    });
                    
                    toast.success('Payment successful!');
                    window.location.reload(); // Refresh to show paid status
                }
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-in zoom-in-95 duration-300">
            <div className="bg-white p-6 rounded-[4px] border border-slate-200 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[20px] font-bold text-[#081621]">Payment</h3>
                    <div className="flex gap-1.5 opacity-60">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2.5" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                    </div>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="text-[14px] font-bold text-[#081621] mb-2 block">Order ID</label>
                        <input type="text" value={order.order_number} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-4 py-3 text-[15px] text-slate-700 outline-none cursor-not-allowed" />
                    </div>
                    
                    <div>
                        <label className="text-[14px] font-bold text-[#081621] mb-2 block">Amount Due</label>
                        <input type="text" value={`${order.total_amount}৳`} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-4 py-3 text-[15px] text-[#4f46e5] font-bold outline-none cursor-not-allowed" />
                    </div>

                    <div>
                        <label className="text-[14px] font-bold text-[#081621] mb-2 block">Card Information</label>
                        <div className="p-4 border border-slate-200 rounded-[4px] bg-white focus-within:border-[#3749bb] transition-all">
                            <CardElement options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#081621',
                                        '::placeholder': { color: '#94a3b8' },
                                    },
                                },
                            }} />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-[4px] text-[13px]">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <button 
                        disabled={loading || !stripe}
                        className="w-full mt-4 py-4 bg-[#3749bb] text-white font-bold rounded-[4px] hover:bg-[#2e3d9e] transition-all text-[16px] shadow-lg shadow-[#3749bb]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-4">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span>Secure encrypted payment powered by Stripe</span>
                    </div>
                </div>
            </div>
            <button 
                type="button"
                onClick={onReset}
                className="text-[13px] text-slate-400 hover:text-slate-600 font-medium flex items-center justify-center w-full gap-1"
            >
                Cancel and Pay Later
            </button>
        </form>
    );
};

export default StripePaymentForm;
