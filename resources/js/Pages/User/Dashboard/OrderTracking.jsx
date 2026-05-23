import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, ShoppingBag, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const OrderTracking = ({ auth, order }) => {
    const user = auth.user;
    const [showReturnModal, setShowReturnModal] = React.useState(false);
    const [showCancelModal, setShowCancelModal] = React.useState(false);
    
    const returnableItems = (order.items || []);
    const canRequestReturn = order.status?.toLowerCase() === 'delivered' && returnableItems.some((item) => !item.return_request);
    const canCancelOrder = order.status?.toLowerCase() === 'pending';

    const { data, setData, post, processing, errors, reset } = useForm({
        items: [],
        reason: 'Defective product',
        details: ''
    });

    const reasonOptions = [
        { id: 'Defective product', name: 'Defective product' },
        { id: 'Wrong item delivered', name: 'Wrong item delivered' },
        { id: 'Damaged packaging', name: 'Damaged packaging' },
        { id: 'Changed mind', name: 'Changed mind' },
        { id: 'Other', name: 'Other' }
    ];

    React.useEffect(() => {
        if (showReturnModal) {
            setData(data => ({
                ...data,
                items: returnableItems.map(item => ({
                    selected: false,
                    order_item_id: item.id,
                    product_name: item.product_name,
                    max_quantity: item.quantity,
                    quantity: 1,
                })),
                reason: 'Defective product',
                details: ''
            }));
        }
    }, [showReturnModal]);

    const formatAddress = (address) => {
        if (!address) return 'No address provided';
        if (typeof address === 'string') return address;

        return [
            address.address,
            address.area,
            address.city,
            address.post_code,
        ].filter(Boolean).join(', ') || 'No address provided';
    };

    const steps = [
        { id: 'pending', label: 'Order Placed', icon: ShoppingBag, description: 'Your order has been received.' },
        { id: 'processing', label: 'Processing', icon: Clock, description: 'Items are being packed.' },
        { id: 'shipped', label: 'Shipped', icon: Truck, description: 'Package is with our courier.' },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle2, description: 'Order reached its destination.' }
    ];

    const currentStatus = order.status.toLowerCase();

    const getStepStatus = (stepId) => {
        const statusPriority = {
            'pending': 1,
            'processing': 2,
            'shipped': 3,
            'delivered': 4,
            'cancelled': 0
        };

        const orderPriority = statusPriority[currentStatus] || 1;
        const stepPriority = statusPriority[stepId];

        if (currentStatus === 'cancelled') return 'cancelled';
        if (orderPriority >= stepPriority) return 'completed';
        if (orderPriority + 1 === stepPriority) return 'active';
        return 'upcoming';
    };

    const handleReturnSubmit = (event) => {
        event.preventDefault();

        post(route('user.orders.returns.store', order.order_number), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowReturnModal(false);
            },
        });
    };

    const handleCancelSubmit = (event) => {
        event.preventDefault();

        router.post(route('user.orders.cancel', order.order_number), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCancelModal(false);
            },
        });
    };

    return (
        <UserLayout user={user}>
            <Head title={`Track Order #${order.order_number}`} />

            <div className="max-w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">Live Order Tracking</h1>
                            <p className="text-slate-400 text-[11px] font-medium flex items-center gap-2">
                                Order ID: <span className="text-[#3749bb] font-bold">#{order.order_number}</span>
                                <span className="text-slate-200">|</span>
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <span className={cn(
                            "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                            order.status === 'Delivered' ? "bg-green-50 text-green-700 border-green-100" :
                                order.status === 'Cancelled' ? "bg-red-50 text-red-700 border-red-100" :
                                    "bg-indigo-50 text-indigo-700 border-indigo-100"
                        )}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {(canCancelOrder || canRequestReturn) && (
                    <div className="flex justify-end gap-2">
                        {canCancelOrder && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="h-[36px] px-4 bg-red-600 hover:bg-red-700 text-white rounded-[4px] font-bold text-[12px] transition-all flex items-center gap-2 shadow-sm"
                            >
                                <X size={14} />
                                Cancel Order
                            </button>
                        )}
                        {canRequestReturn && (
                            <button
                                onClick={() => setShowReturnModal(true)}
                                className="h-[36px] px-4 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] font-bold text-[12px] hover:bg-[#f6f6f7] transition-all flex items-center gap-2 shadow-sm"
                            >
                                <RotateCcw size={14} className="text-[#008060]" />
                                Request Return
                            </button>
                        )}
                    </div>
                )}

                {/* Main Tracking Card */}
                <div className="bg-white rounded-[2px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 md:p-12">
                        {/* Timeline */}
                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
                            {steps.map((step, idx) => {
                                const status = getStepStatus(step.id);
                                return (
                                    <div key={step.id} className="relative flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-4 flex-1 w-full">
                                        {/* Connection Line to next step (Desktop) */}
                                        {idx < steps.length - 1 && (
                                            <div 
                                                className={cn(
                                                    "absolute top-[22px] left-[calc(50%+24px)] right-[calc(-50%+24px)] h-[2px] hidden md:block z-0 transition-all duration-500",
                                                    getStepStatus(steps[idx + 1].id) === 'completed' || getStepStatus(steps[idx + 1].id) === 'active'
                                                        ? "bg-[#008060]"
                                                        : "bg-slate-100"
                                                )} 
                                            />
                                        )}

                                        {/* Connection Line to next step (Mobile) */}
                                        {idx < steps.length - 1 && (
                                            <div 
                                                className={cn(
                                                    "absolute left-[24px] top-[48px] bottom-[-32px] w-[2px] md:hidden z-0 transition-all duration-500",
                                                    getStepStatus(steps[idx + 1].id) === 'completed' || getStepStatus(steps[idx + 1].id) === 'active'
                                                        ? "bg-[#008060]"
                                                        : "bg-slate-100"
                                                )} 
                                            />
                                        )}

                                        {/* Icon Container */}
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white shadow-sm relative z-10 shrink-0",
                                            status === 'completed' ? "bg-[#008060] text-white scale-110 shadow-lg shadow-[#008060]/20" :
                                                status === 'active' ? "bg-white text-[#008060] border-[#008060] animate-pulse" :
                                                    "bg-slate-50 text-slate-300"
                                        )}>
                                            <step.icon size={20} />
                                        </div>

                                        {/* Content */}
                                        <div className="text-left md:text-center relative z-10">
                                            <p className={cn(
                                                "text-[13px] font-bold mb-1 transition-colors",
                                                status === 'completed' ? "text-[#081621]" :
                                                    status === 'active' ? "text-[#008060]" : "text-slate-400"
                                            )}>
                                                {step.label}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[120px] md:mx-auto">
                                                {status === 'upcoming'
                                                    ? (step.id === 'delivered' ? 'Expected after shipment.' : 'Next phase of delivery.')
                                                    : status === 'active'
                                                        ? 'Current stage - In progress.'
                                                        : step.description
                                                }
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-6">
                            <h4 className="text-[11px] font-bold text-slate-400 mb-3 flex items-center gap-2">
                                <MapPin size={12} className="text-[#008060]" />
                                Shipping Address
                            </h4>
                            <div className="text-[13px] text-[#081621] space-y-1">
                                <p className="font-bold">{order.shipping_name}</p>
                                <p className="text-slate-600">{formatAddress(order.shipping_address)}</p>
                                <p className="text-slate-600">{order.shipping_upazila}, {order.shipping_district}</p>
                                <p className="text-slate-600 font-medium">{order.shipping_phone}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-[11px] font-bold text-slate-400 mb-3 flex items-center gap-2">
                                <Package size={12} className="text-[#008060]" />
                                Order Info
                            </h4>
                            <div className="text-[13px] text-[#081621] space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Payment Status:</span>
                                    <span className="font-bold text-emerald-600">{order.payment?.status.toUpperCase() || 'PENDING'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Payment Method:</span>
                                    <span className="font-bold">{order.payment?.payment_method.toUpperCase() || 'COD'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Shipping Cost:</span>
                                    <span className="font-bold">৳{order.shipping_cost}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-[11px] font-bold text-slate-400 mb-3 flex items-center gap-2">
                                <ChevronRight size={12} className="text-[#008060]" />
                                Summary
                            </h4>
                            <div className="text-[13px] text-[#081621] space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Subtotal:</span>
                                    <span className="font-bold">৳{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                    <span className="text-slate-600 font-bold">Total Amount:</span>
                                    <span className="text-[16px] font-bold text-[#008060]">৳{order.total_amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items and History Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2px] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                                <h3 className="text-[13px] font-bold text-[#081621]">Order Items ({order.items.length})</h3>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-[1px] border border-slate-100 flex items-center justify-center">
                                                <Package size={20} className="text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-[#081621] leading-tight mb-1">{item.product_name}</p>
                                                <p className="text-[11px] text-slate-400 font-medium">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                                                {item.return_request && (
                                                    <span className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-[#fff4e5] text-[#b98900] border border-[#ffe2b5] text-[10px] font-bold uppercase">
                                                        Return {item.return_request.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[13px] font-bold text-[#081621]">৳{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tracking History */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2px] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                                <h3 className="text-[13px] font-bold text-[#081621]">Tracking History</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {steps.filter(s => getStepStatus(s.id) === 'completed' || getStepStatus(s.id) === 'active').reverse().map((step, idx) => (
                                        <div key={step.id} className="relative pl-6 pb-2 last:pb-0">
                                            {/* Timeline Line */}
                                            {idx !== steps.filter(s => getStepStatus(s.id) === 'completed' || getStepStatus(s.id) === 'active').length - 1 && (
                                                <div className="absolute left-[7px] top-4 w-[2px] h-full bg-slate-100" />
                                            )}

                                            {/* Dot */}
                                            <div className={cn(
                                                "absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all duration-300",
                                                idx === 0 ? "bg-[#008060] scale-110" : "bg-slate-200"
                                            )} />

                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-[12px] font-bold leading-tight",
                                                    idx === 0 ? "text-[#008060]" : "text-[#081621]"
                                                )}>
                                                    {step.label}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium mt-1">
                                                    {idx === 0 ? 'Recently updated' : 'Completed on track'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-300 mt-2 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center px-4">
                    <div className="w-full max-w-md bg-white rounded-[8px] border border-[#ebebeb] shadow-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-[#ebebeb] flex items-center justify-between">
                            <h3 className="text-[16px] font-bold text-[#202223]">Cancel Order</h3>
                            <button type="button" onClick={() => setShowCancelModal(false)} className="w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-[#f6f6f7]">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-5">
                            <p className="text-[13px] text-slate-650 font-medium">
                                Are you sure you want to cancel this order? This action cannot be undone and your order status will be updated to cancelled immediately.
                            </p>
                        </div>
                        <div className="px-5 py-4 border-t border-[#ebebeb] bg-[#f9fafb] flex justify-end gap-2">
                            <button type="button" onClick={() => setShowCancelModal(false)} className="h-[36px] px-4 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] font-bold text-[12px]">
                                Keep Order
                            </button>
                            <button 
                                onClick={handleCancelSubmit}
                                className="h-[36px] px-4 bg-red-600 hover:bg-red-700 text-white rounded-[4px] font-bold text-[12px] transition-colors"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Request Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center px-4">
                    <form onSubmit={handleReturnSubmit} className="w-full max-w-lg bg-white rounded-[8px] border border-[#ebebeb] shadow-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-[#ebebeb] flex items-center justify-between">
                            <div>
                                <h3 className="text-[16px] font-bold text-[#202223]">Request Product Return</h3>
                                <p className="text-[12px] text-[#6d7175] mt-0.5">Choose the delivered item you want to return.</p>
                            </div>
                            <button type="button" onClick={() => setShowReturnModal(false)} className="w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-[#f6f6f7]">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar">
                            <div className="divide-y divide-slate-100/80">
                                {(!data.items || data.items.length === 0) ? (
                                    <p className="text-[12px] text-slate-500 text-center py-4">No items available for return.</p>
                                ) : (
                                    data.items.map((item, index) => {
                                        const originalItem = (order.items || []).find(i => i.id === item.order_item_id);
                                        const hasReturnRequest = !!originalItem?.return_request;
                                        
                                        return (
                                            <div key={item.order_item_id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id={`item-${item.order_item_id}`}
                                                        disabled={hasReturnRequest}
                                                        checked={item.selected || false}
                                                        onChange={(e) => {
                                                            const newItems = [...data.items];
                                                            newItems[index].selected = e.target.checked;
                                                            setData('items', newItems);
                                                        }}
                                                        className="rounded border-slate-350 text-[#008060] focus:ring-[#008060] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                                    />
                                                    <label 
                                                        htmlFor={hasReturnRequest ? undefined : `item-${item.order_item_id}`} 
                                                        className={`text-[12px] font-medium truncate ${
                                                            hasReturnRequest 
                                                                ? "text-slate-400 cursor-not-allowed" 
                                                                : "text-[#202223] cursor-pointer hover:text-[#008060] transition-colors"
                                                        }`}
                                                    >
                                                        {item.product_name}
                                                    </label>
                                                    {hasReturnRequest && (
                                                        <span className="ml-2 shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#fef3c7] text-[#d97706] border border-[#fde68a]">
                                                            Already Requested
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-2 ml-4 shrink-0">
                                                    <span className="text-[11px] text-[#6d7175]">Qty:</span>
                                                    <select
                                                        disabled={!item.selected || hasReturnRequest}
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const newItems = [...data.items];
                                                            newItems[index].quantity = parseInt(e.target.value);
                                                            setData('items', newItems);
                                                        }}
                                                        className="h-[28px] py-0 pl-2 pr-7 text-[12px] font-medium border-[#d1d1d1] rounded-[3px] bg-white disabled:bg-slate-50 disabled:text-slate-400 focus:border-[#008060] focus:ring-0 focus:outline-none transition-all"
                                                    >
                                                        {Array.from({ length: item.max_quantity }, (_, i) => i + 1).map(num => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <InputError message={errors.items} className="mt-1" />

                            {/* Global Return Details */}
                            <div className="space-y-3 pt-3 border-t border-slate-100">
                                <div>
                                    <InputLabel value="Reason for Return" className="mb-1 text-[11px] font-bold text-[#6d7175]" />
                                    <SelectInput
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        options={reasonOptions}
                                        showSearch={false}
                                        placeholder="Select Reason"
                                        direction="up"
                                        className="mt-1"
                                    />
                                    <InputError message={errors.reason} className="mt-1" />
                                </div>
                                <div>
                                    <InputLabel value="Details / Notes" className="mb-1 text-[11px] font-bold text-[#6d7175]" />
                                    <textarea
                                        value={data.details}
                                        onChange={(e) => setData('details', e.target.value)}
                                        rows={2}
                                        placeholder="Describe the issue..."
                                        className="mt-1 w-full rounded-[3px] border-[#d1d1d1] text-[12px] font-medium text-[#202223] focus:border-[#008060] focus:ring-0 focus:outline-none transition-all placeholder:text-slate-400 py-1.5 px-3 min-h-[32px] max-h-[80px]"
                                    />
                                    <InputError message={errors.details} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-4 border-t border-[#ebebeb] bg-[#f9fafb] flex justify-end gap-2">
                            <button type="button" onClick={() => setShowReturnModal(false)} className="h-[36px] px-4 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] font-bold text-[12px]">
                                Cancel
                            </button>
                            <button type="submit" disabled={processing} className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] font-bold text-[12px] hover:bg-[#006e52] disabled:opacity-50">
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </UserLayout>
    );
};

export default OrderTracking;
