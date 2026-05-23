import React, { useEffect, memo } from 'react';
import Header from '@/Components/Navigation/Guest/Header';
import Footer from '@/Components/Navigation/Guest/Footer';
import StickyActions from '@/Components/Frontend/StickyActions';
import CartSidebar from '@/Components/Frontend/CartSidebar';
import CartModal from '@/Components/Frontend/CartModal';
import LoadingOverlay from '@/Components/ui/LoadingOverlay';
import { useFrontend } from '@/Contexts/FrontendContext';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/Hooks/use-toast';

/**
 * FrontendLayout Component
 * 
 * Serves as the primary wrapper for all guest-facing pages.
 * Handles global UI states (Cart, Modals), flash notifications, and shared navigation.
 * 
 * @param {Object} props.children - Active page component
 * @param {Array} props.categories - Categorical navigation data
 * @param {Array} props.brands - Branding navigation data
 */
const FrontendLayout = ({ children, categories, brands }) => {
    const { flash } = usePage().props;
    const { toast } = useToast();
    const {
        isCartOpen,
        setIsCartOpen,
        isCartModalOpen,
        closeCartModal,
        addedProduct,
        addedQuantity,
        cartItems,
        removeFromCart,
        toggleCartSidebar
    } = useFrontend();

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

    return (
        <div className="min-h-screen flex flex-col bg-[#f2f4f8] overflow-x-hidden font-inter selection:bg-[#4f46e5] selection:text-white">
            {/* Optimized Navigation Header */}
            <Header categories={categories} brands={brands} />
            
            {/* Dynamic Page Content Area */}
            <main className="relative flex-1">
                {children}
            </main>
            
            {/* Global Footer */}
            <Footer />

            {/* Utility Overlays and Interaction Components */}
            <StickyActions
                cartCount={cartItems.length}
                compareCount={0}
                onCartClick={toggleCartSidebar}
            />
            
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onRemove={removeFromCart}
            />
            
            <CartModal
                isOpen={isCartModalOpen}
                onClose={closeCartModal}
                product={addedProduct}
                quantity={addedQuantity}
            />
            
            {/* System-wide Loading Indicator */}
            <LoadingOverlay />
        </div>
    );
};

export default memo(FrontendLayout);
