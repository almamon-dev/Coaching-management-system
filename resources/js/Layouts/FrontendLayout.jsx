import React, { useEffect, useState, memo } from 'react';
import Header from '@/Components/Navigation/Guest/Header';
import Footer from '@/Components/Navigation/Guest/Footer';
import LoadingOverlay from '@/Components/ui/LoadingOverlay';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/Hooks/use-toast';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ChevronUp } from 'lucide-react';

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

    const [showScrollTop, setShowScrollTop] = useState(false);

    // Lenis Smooth Scroll Initialization
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            infinite: false,
        });

        window.lenis = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const animId = requestAnimationFrame(raf);

        // Smooth in-page anchor scroll (#batches, #about, etc.)
        const handleAnchorClick = (e) => {
            const anchor = e.target.closest('a[href*="#"]');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (!href) return;

            const isSamePage = href.startsWith('#') || (href.startsWith('/#') && window.location.pathname === '/');
            if (isSamePage) {
                const hash = href.includes('#') ? '#' + href.split('#')[1] : null;
                if (hash && hash !== '#') {
                    const targetEl = document.querySelector(hash);
                    if (targetEl) {
                        e.preventDefault();
                        lenis.scrollTo(targetEl, { offset: -76, duration: 1.2 });
                    }
                }
            }
        };

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 350);
        };

        document.addEventListener('click', handleAnchorClick);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(animId);
            document.removeEventListener('click', handleAnchorClick);
            window.removeEventListener('scroll', handleScroll);
            lenis.destroy();
            delete window.lenis;
        };
    }, []);

    const scrollToTop = () => {
        if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-x-hidden font-inter selection:bg-[#16a34a] selection:text-white bg-white print:bg-none print:bg-white">
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

            {/* Floating Smooth Scroll to Top Button */}
            <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#047857] hover:bg-[#065f46] text-white shadow-lg transition-all duration-300 ease-out flex items-center justify-center cursor-pointer ${
                    showScrollTop
                        ? 'opacity-100 translate-y-0 pointer-events-auto shadow-emerald-900/20'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            >
                <ChevronUp size={20} />
            </button>

            {/* System-wide Loading Indicator */}
            <LoadingOverlay />
        </div>
    );
};

export default memo(FrontendLayout);
