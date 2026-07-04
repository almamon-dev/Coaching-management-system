import React, { useEffect, memo } from 'react';
import Header from '@/Components/Navigation/Guest/Header';
import Footer from '@/Components/Navigation/Guest/Footer';
import LoadingOverlay from '@/Components/ui/LoadingOverlay';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/Hooks/use-toast';
import Lenis from 'lenis';

/**
 * FrontendLayout Component
 * 
 * Serves as the primary wrapper for all guest-facing pages for the School Management System.
 * Handles global UI states, flash notifications, and shared navigation.
 * 
 * @param {Object} props.children - Active page component
 */
const FrontendLayout = ({ children }) => {
    const { flash } = usePage().props;
    const { toast } = useToast();

    // Global Flash Notification Sync
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Success",
                description: flash.success,
                variant: "success",
            });
        }
        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [flash, toast]);

    // Lenis Smooth Scroll Initialization
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2, // Reduced from 1.2 for faster scroll
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative overflow-x-hidden font-inter selection:bg-[#16a34a] selection:text-white bg-gradient-to-r from-white via-[#f0f9f8] to-[#ccece6] print:bg-none print:bg-white">
            {/* Grid Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#009ca60d_1px,transparent_1px),linear-gradient(to_bottom,#009ca60d_1px,transparent_1px)] bg-[size:40px_40px] print:hidden"></div>
            
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Enterprise Navigation Header */}
                <Header />
                
                {/* Dynamic Page Content Area */}
                <main className="flex-1">
                    {children}
                </main>
                
                {/* Global Footer */}
                <Footer />
            </div>

            {/* System-wide Loading Indicator */}
            <LoadingOverlay />
        </div>
    );
};

export default memo(FrontendLayout);
