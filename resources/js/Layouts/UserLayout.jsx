import React, { useState, useMemo, memo, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    User,
    MapPin,
    Lock,
    Star,
    CreditCard,
    Headset,
    Wrench,
    Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Notify from '@/Utils/Notify';

import Sidebar from '@/Components/Navigation/User/Sidebar';
import Header from '@/Components/Navigation/User/Header';
import LoadingOverlay from '@/Components/ui/LoadingOverlay';



export default function UserLayout({ children, user }) {
    const { flash } = usePage().props;
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) Notify.success('Success', flash.success);
        if (flash?.error) Notify.error('Error', flash.error);
    }, [flash]);

    // Track navigation for closing sidebar on mobile
    useEffect(() => {
        const finishHandler = () => {
            setIsSidebarOpen(false);
        };

        const unbindFinish = router.on('finish', finishHandler);
        return () => unbindFinish();
    }, []);

    const navigation = useMemo(() => [
        { name: 'Dashboard', href: route('user.dashboard'), icon: LayoutDashboard },
        { name: 'My Orders', href: route('user.orders'), icon: ShoppingBag },
        { name: 'Wishlist', href: route('user.wishlist'), icon: Heart },
        { name: 'My Reviews', href: route('user.reviews'), icon: Star },
        { name: 'Notifications', href: route('user.notifications.index'), icon: Bell },
        { name: 'Account Info', href: route('profile.edit'), icon: User },
        { name: 'Addresses', href: route('user.addresses'), icon: MapPin },
        { name: 'Payment Methods', href: route('user.payment-methods'), icon: CreditCard },
        { name: 'Security', href: route('user.security'), icon: Lock },
        { name: 'Support Tickets', href: route('dashboard.tickets.index'), icon: Headset },
    ], []);

    return (
        <div className="min-h-screen bg-[#F2F4F8]">
            <LoadingOverlay />

            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-[105] bg-[#081621]/40 backdrop-blur-sm lg:hidden transition-all duration-300" 
                    onClick={() => setIsSidebarOpen(false)} 
                />
            )}
            <Header
                user={user}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="max-w-[1440px] mx-auto pt-9 px-4 pt-3 pb-10">
                <div className="flex flex-col lg:flex-row gap-6">
                    <Sidebar
                        url={url}
                        user={user}
                        navigation={navigation}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>

            {/* Floating Support Button in Bottom-Right Corner of the Screen */}
            <Link 
                href={route('dashboard.tickets.index')}
                className="fixed right-8 bottom-8 z-[999] w-12 h-12 bg-[#008060] text-white flex items-center justify-center rounded-full shadow-2xl hover:bg-[#006e52] hover:scale-105 transition-all duration-200 group"
                title="Customer Support Tickets"
            >
                <Headset size={22} className="group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300" />
            </Link>
        </div>
    );
}
