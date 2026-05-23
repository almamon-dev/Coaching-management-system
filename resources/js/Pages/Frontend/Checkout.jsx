import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Home, ChevronRight, CreditCard, Package, Truck, ShoppingCart } from 'lucide-react';

// Partials
import ShippingForm from './Partials/Checkout/ShippingForm';
import OrderSummary from './Partials/Checkout/OrderSummary';
import PaymentMethods from './Partials/Checkout/PaymentMethods';
import DeliveryMethods from './Partials/Checkout/DeliveryMethods';

import { useFrontend } from '@/Contexts/FrontendContext';
import Notify from '@/Utils/Notify';

const Checkout = ({ categories, brands, auth_user, primary_address }) => {
    const { cartItems, setCartItems } = useFrontend();

    const fullName = primary_address?.name || auth_user?.name || '';
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const { data, setData, post, processing, errors, reset } = useForm({
        firstName: firstName,
        lastName: lastName,
        address: primary_address?.address || '',
        upazila: primary_address?.area || '',
        district: primary_address?.city || 'Dhaka - City',
        mobile: auth_user?.phone || '',
        email: auth_user?.email || '',
        comment: '',
        paymentMethod: 'cod',
        deliveryMethod: 'home',
        agreeTerms: true,
        items: cartItems // Include items in the form data
    });

    // Update items when cartItems change
    useEffect(() => {
        setData('items', cartItems);
    }, [cartItems]);

    const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let shipping = 0;
    if (data.deliveryMethod === 'home') {
        shipping = 200;
    } else if (data.deliveryMethod === 'express') {
        shipping = 300;
    }

    const total = subTotal + shipping;

    // Live Validation Check
    const isFormValid =
        String(data.firstName || '').trim() !== '' &&
        String(data.lastName || '').trim() !== '' &&
        String(data.address || '').trim() !== '' &&
        String(data.district || '').trim() !== '' &&
        String(data.mobile || '').trim() !== '' &&
        String(data.email || '').trim() !== '' &&
        data.agreeTerms;

    const handleConfirmOrder = () => {

        if (!isFormValid) return;

        post(route('checkout.place-order'), {
            onSuccess: () => {
                console.log("Order placed successfully!");
                Notify.success("Success!", "Your order has been placed successfully.");
                setCartItems([]);
                localStorage.removeItem('cart');
            },
            onError: (err) => {
                console.error("Order placement failed:", err);
            }
        });
    };

    const cartData = {
        items: cartItems,
        sub_total: subTotal,
        shipping: shipping,
        total: total
    };

    return (
        <FrontendLayout categories={categories} brands={brands}>
            <Head title="Checkout - Star Tech" />

            <div className="bg-[#f2f4f8] min-h-screen py-6">
                <div className="container mx-auto px-4">

                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[13px] text-slate-500 mb-6">
                        <Link href="/" className="hover:text-[#4f46e5] transition-colors">
                            <Home size={14} />
                        </Link>
                        <ChevronRight size={12} className="text-slate-400" />
                        <Link href="/" className="hover:text-[#4f46e5] transition-colors">Shopping Cart</Link>
                        <ChevronRight size={12} className="text-slate-400" />
                        <span className="text-slate-900 font-medium">Checkout</span>
                    </nav>

                    <h1 className="text-[24px] font-bold text-[#081621] mb-6">Checkout</h1>

                    {/* Disclaimer Banner */}
                    <div className="bg-[#d9edf7] border border-[#bce8f1] p-4 rounded-sm mb-8 text-center">
                        <p className="text-[14px] text-[#31708f] leading-relaxed">
                            কারিগরি ত্রুটির কারণে পণ্যের মূল্য অসংগতিপূর্ণ হলে, স্টার টেক কর্তৃপক্ষ অর্ডার বাতিলের অধিকার সংরক্ষণ করে। অনুগ্রহ করে কাস্টমার সাপোর্ট এজেন্টের কনফার্মেশন ব্যতীত কোনো ধরনের পেমেন্ট প্রসিড না করার অনুরোধ করা হচ্ছে।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Forms */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* 1. Shipping & Billing */}
                            <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                                    <div className="w-6 h-6 bg-[#4f46e5] rounded-sm flex items-center justify-center">
                                        <Package size={14} className="text-white" />
                                    </div>
                                    <h2 className="text-[16px] font-bold text-[#081621] uppercase tracking-tight">Shipping & Billing</h2>
                                </div>
                                <div className="p-6">
                                    <ShippingForm formData={data} setFormData={setData} errors={errors} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                {/* 2. Payment Method */}
                                <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,0.05)] overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                                        <div className="w-6 h-6 bg-[#4f46e5] rounded-sm flex items-center justify-center">
                                            <CreditCard size={14} className="text-white" />
                                        </div>
                                        <h2 className="text-[16px] font-bold text-[#081621] uppercase tracking-tight">Payment Method</h2>
                                    </div>
                                    <div className="p-6">
                                        <PaymentMethods formData={data} setFormData={setData} />
                                    </div>
                                </div>

                                {/* 3. Delivery Method */}
                                <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,0.05)] overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                                        <div className="w-6 h-6 bg-[#4f46e5] rounded-sm flex items-center justify-center">
                                            <Truck size={14} className="text-white" />
                                        </div>
                                        <h2 className="text-[16px] font-bold text-[#081621] uppercase tracking-tight">Delivery Method</h2>
                                    </div>
                                    <div className="p-6">
                                        <DeliveryMethods formData={data} setFormData={setData} />
                                    </div>
                                </div>
                            </div>

                            {/* 4. Products List */}
                            <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                                    <div className="w-6 h-6 bg-[#4f46e5] rounded-sm flex items-center justify-center">
                                        <ShoppingCart size={14} className="text-white" />
                                    </div>
                                    <h2 className="text-[16px] font-bold text-[#081621] uppercase tracking-tight">Products</h2>
                                </div>
                                <div className="p-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                            <div className="text-[14px] text-[#081621]">
                                                {item.quantity} X <span className="font-medium hover:text-[#4f46e5] cursor-pointer transition-colors">{item.name}</span>
                                            </div>
                                            <div className="text-[15px] font-bold text-[#081621]">
                                                {item.price.toLocaleString()}৳
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Order Summary */}
                        <aside className="lg:col-span-4 sticky top-24">
                            <OrderSummary
                                cart={cartData}
                                agreeTerms={data.agreeTerms}
                                onTermsChange={(val) => setData('agreeTerms', val)}
                                onConfirm={handleConfirmOrder}
                                isSubmitting={processing}
                                isValid={isFormValid}
                                paymentMethod={data.paymentMethod}
                            />
                        </aside>
                    </div>

                </div>
            </div>
        </FrontendLayout>
    );
};

export default Checkout;
