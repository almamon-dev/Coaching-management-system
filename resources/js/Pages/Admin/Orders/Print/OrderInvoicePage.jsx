/**
 * OrderInvoicePage Component
 * 
 * Optimized view for printing customer invoices.
 * Includes branding, itemized billing, and customer/shipping information.
 */
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft, CreditCard, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const OrderInvoicePage = ({ order }) => {
    const handlePrint = () => {
        window.print();
    };

    const formatAddress = (address) => {
        if (!address) return 'N/A';
        if (typeof address === 'string') return address;

        return [
            address.address,
            address.area,
            address.city,
            address.post_code,
        ].filter(Boolean).join(', ') || 'N/A';
    };

    return (
        <div className="min-h-screen bg-[#f6f6f7] py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
            <Head title={`Invoice - ${order.order_number}`} />

            {/* Print Navigation - Hidden during print */}
            <div className="max-w-[850px] mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href={route('admin.orders.show', order.id)}
                    className="flex items-center gap-2 text-[13px] font-medium text-[#6d7175] hover:text-[#202223] transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Order
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] font-bold text-[12px] flex items-center gap-2 hover:bg-[#006e52] transition-all shadow-sm"
                    >
                        <Printer size={14} /> Print Invoice
                    </button>
                </div>
            </div>

            {/* Invoice Container */}
            <div className="max-w-[850px] mx-auto bg-white shadow-sm border border-[#ebebeb] rounded-[8px] overflow-hidden print:shadow-none print:border-0 print:rounded-0">
                
                {/* Header */}
                <div className="p-8 border-b border-[#f1f1f1] flex justify-between items-start">
                    <div>
                        <div className="text-[24px] font-black text-[#202223] mb-1">INVOICE</div>
                        <div className="text-[14px] font-bold text-[#6d7175]">#{order.order_number}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[18px] font-bold text-[#ef4a23]">Gadget</div>
                        <div className="text-[12px] text-[#6d7175] mt-1 max-w-[200px]">
                            123 Tech Avenue, Sector 7<br />
                            Uttara, Dhaka - 1230<br />
                            Phone: +880 1234-567890
                        </div>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-[#fafbfb] border-b border-[#f1f1f1]">
                    <div>
                        <div className="text-[10px] font-bold text-[#6d7175] uppercase tracking-wider mb-1.5">Date Issued</div>
                        <div className="text-[13px] font-bold text-[#202223]">
                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-[#6d7175] uppercase tracking-wider mb-1.5">Payment Method</div>
                        <div className="text-[13px] font-bold text-[#202223] flex items-center gap-1.5">
                            <CreditCard size={13} className="text-[#6d7175]" />
                            {order.payment_method || order.payment?.payment_method || 'Online'}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-[#6d7175] uppercase tracking-wider mb-1.5">Payment Status</div>
                        <div className={cn(
                            "text-[11px] font-bold px-2 py-0.5 rounded-full border inline-block uppercase",
                            order.payment?.status === 'paid' ? "bg-[#e3f1df] text-[#008060] border-[#aee9d1]" : "bg-[#fff4e5] text-[#b98900] border-[#ffe2b3]"
                        )}>
                            {order.payment?.status || 'Unpaid'}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-[#6d7175] uppercase tracking-wider mb-1.5">Order Status</div>
                        <div className="text-[13px] font-bold text-[#202223] uppercase">{order.status}</div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
                    <div>
                        <div className="text-[12px] font-bold text-[#202223] border-b border-[#f1f1f1] pb-2 mb-4 flex items-center gap-2">
                            <Mail size={14} className="text-[#6d7175]" /> Customer Details
                        </div>
                        <div className="space-y-1">
                            <div className="text-[14px] font-bold text-[#202223]">{order.user?.name || 'Guest Customer'}</div>
                            <div className="text-[13px] text-[#6d7175] flex items-center gap-2">
                                <Mail size={12} /> {order.user?.email || 'N/A'}
                            </div>
                            <div className="text-[13px] text-[#6d7175] flex items-center gap-2">
                                <Phone size={12} /> {order.user?.phone || 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-[12px] font-bold text-[#202223] border-b border-[#f1f1f1] pb-2 mb-4 flex items-center gap-2">
                            <MapPin size={14} className="text-[#6d7175]" /> Shipping Address
                        </div>
                        <div className="space-y-1">
                            <div className="text-[14px] font-bold text-[#202223]">{order.shipping_name || order.user?.name}</div>
                            <div className="text-[13px] text-[#6d7175]">
                                {formatAddress(order.shipping_address)}<br />
                                {order.shipping_upazila}, {order.shipping_district}<br />
                                Phone: {order.shipping_phone || order.user?.phone}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="px-8 pb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-[#f1f1f1]">
                                <th className="py-4 text-[12px] font-bold text-[#202223] uppercase">Product Details</th>
                                <th className="py-4 text-[12px] font-bold text-[#202223] uppercase text-center">Price</th>
                                <th className="py-4 text-[12px] font-bold text-[#202223] uppercase text-center">Qty</th>
                                <th className="py-4 text-[12px] font-bold text-[#202223] uppercase text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f1f1]">
                            {order.items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-4">
                                        <div className="text-[13px] font-bold text-[#202223]">{item.product?.name}</div>
                                        <div className="text-[11px] text-[#6d7175] mt-0.5">SKU: {item.product?.sku || 'N/A'}</div>
                                    </td>
                                    <td className="py-4 text-[13px] text-[#202223] text-center">৳{Number(item.price).toLocaleString()}</td>
                                    <td className="py-4 text-[13px] text-[#202223] text-center">{item.quantity}</td>
                                    <td className="py-4 text-[13px] font-bold text-[#202223] text-right">৳{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Summary */}
                <div className="p-8 bg-[#fafbfb] flex justify-end">
                    <div className="w-[280px] space-y-3">
                        <div className="flex justify-between text-[13px] text-[#6d7175]">
                            <span>Subtotal</span>
                            <span className="font-medium text-[#202223]">৳{Number(order.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[13px] text-[#6d7175]">
                            <span>Shipping</span>
                            <span className="font-medium text-[#202223]">৳{Number(order.shipping_cost).toLocaleString()}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-[13px] text-[#bf0711]">
                                <span>Discount</span>
                                <span className="font-medium">-৳{Number(order.discount).toLocaleString()}</span>
                            </div>
                        )}
                        <div className="h-[1px] bg-[#d1d1d1] my-2" />
                        <div className="flex justify-between text-[16px] font-black text-[#202223]">
                            <span>Total</span>
                            <span>৳{Number(order.total_amount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="p-8 text-center border-t border-[#f1f1f1]">
                    <div className="text-[12px] text-[#6d7175]">
                        Thank you for your business! If you have any questions about this invoice, please contact us.
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; }
                    .print\\:hidden { display: none !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:border-0 { border: 0 !important; }
                    .print\\:rounded-0 { border-radius: 0 !important; }
                }
            `}} />
        </div>
    );
};

export default OrderInvoicePage;
