import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';
import OrdersTable from './Partials/OrdersTable';
import { TableSkeleton } from '@/Pages/User/Dashboard/Partials/DashboardSkeleton';

const Orders = ({ auth, orders }) => {
    const user = auth.user;

    return (
        <UserLayout user={user}>
            <Head title="My Orders" />

            <div className="space-y-4">
                {/* Header */}
                <div className="bg-white p-4 rounded-[1px] border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">My Orders</h1>
                        <p className="text-slate-400 text-[11px] font-medium">View and track all your purchase history</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400">Total Orders</p>
                            <p className="text-lg font-bold text-[#081621]">{orders.total || 0}</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-50 rounded-[1px] border border-slate-100 flex items-center justify-center text-slate-400">
                            <ShoppingBag size={18} />
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <OrdersTable orders={orders} />
            </div>

        </UserLayout>
    );
};

export default Orders;
