/**
 * OrderDetailsPage Component
 * 
 * Comprehensive view of a single customer order.
 * Displays order timeline, purchased items, customer details, and payment information.
 * Allows administrative status updates (processing, shipping, etc.).
 */
import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Shared Utilities
import Notify from '@/Utils/Notify';

// Local Components
import OrderShowHeader from '../Components/OrderShowHeader';
import OrderTimeline from '../Components/OrderTimeline';
import OrderItemTable from '../Components/OrderItemTable';
import OrderCustomerSidebar from '../Components/OrderCustomerSidebar';

const OrderDetailsPage = ({ auth, order }) => {
    const [processing, setProcessing] = React.useState(false);

    const handleUpdateStatus = (newStatus) => {
        if (newStatus === order.status) return;
        
        setProcessing(true);
        router.post(route('admin.orders.update-status', order.id), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                Notify.success("Status Updated Successfully");
                setProcessing(false);
            },
            onError: (errors) => {
                Notify.error(errors.status || "Something went wrong");
                setProcessing(false);
            }
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title={`Order #${order.order_number} Details`} />

            <div className="p-6 min-h-screen bg-slate-50/30">
                {/* Header Section */}
                <OrderShowHeader 
                    order={order} 
                    onStatusUpdate={handleUpdateStatus} 
                    processing={processing}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Progress and Items */}
                    <div className="lg:col-span-8">
                        <OrderTimeline order={order} />
                        <OrderItemTable items={order.items || []} orderStatus={order.status} />
                    </div>

                    {/* Right Column: Customer and Payment Info */}
                    <div className="lg:col-span-4">
                        <OrderCustomerSidebar order={order} />
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .print\\:hidden, button, .admin-sidebar, .admin-header { display: none !important; }
                    .p-6 { padding: 0 !important; }
                    .bg-slate-50\\/30 { background: white !important; }
                    .lg\\:col-span-8, .lg\\:col-span-4 { width: 100% !important; grid-column: span 12 / span 12 !important; }
                }
            `}</style>
        </AdminLayout>
    );
};

export default OrderDetailsPage;
