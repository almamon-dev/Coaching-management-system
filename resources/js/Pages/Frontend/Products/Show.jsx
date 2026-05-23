import React, { useState, useCallback, useMemo } from 'react';
import { Head, usePage, router, Deferred } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { useFrontend } from '@/Contexts/FrontendContext';
import Notify from '@/Utils/Notify';

// Performance-Optimized Partials
import ProductBreadcrumbs from './Partials/ProductBreadcrumbs';
import ProductGallery from './Partials/ProductGallery';
import ProductInfo from './Partials/ProductInfo';
import ProductPaymentOptions from './Partials/ProductPaymentOptions';
import ProductActions from './Partials/ProductActions';
import ProductTabs from './Partials/ProductTabs';
import RelatedProducts from './Partials/RelatedProducts';
import ProductPriceSummary from './Partials/ProductPriceSummary';
import QuestionModal from '@/Components/Frontend/QuestionModal';
import ReviewModal from '@/Components/Frontend/ReviewModal';

/**
 * Product Show Page (Product Detail View)
 * 
 * Orchestrates the full product details experience including gallery, specifications, 
 * related items, and interactive modals.
 */
const Show = ({ product, breadcrumbs, relatedProducts }) => {
    const { auth } = usePage().props;
    const { openCartModal } = useFrontend();
    
    // UI Interaction States
    const [quantity, setQuantity] = useState(1);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Stable Handlers for Action Components
    const handleAddToCart = useCallback(() => openCartModal(product, quantity), [product, quantity, openCartModal]);
    const handleBuyNow = useCallback(() => openCartModal(product, quantity), [product, quantity, openCartModal]);

    // Optimized calculation for wishlist status
    const isInWishlist = useMemo(() => auth.user?.wishlist_ids?.includes(product.id), [auth.user?.wishlist_ids, product.id]);

    const handleToggleWishlist = useCallback(() => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }
        router.post(route('frontend.product.wishlist.toggle', product.id), {}, {
            preserveScroll: true,
            only: ['auth', 'flash'],
        });
    }, [auth.user, product.id]);

    const handleAskQuestion = useCallback(() => {
        if (!auth.user) {
            Notify.info('Login Required', 'Please login to ask a question.');
            router.get(route('login'));
            return;
        }
        setIsQuestionModalOpen(true);
    }, [auth.user]);

    const handleWriteReview = useCallback(() => {
        if (!auth.user) {
            Notify.info('Login Required', 'Please login to write a review.');
            router.get(route('login'));
            return;
        }
        setIsReviewModalOpen(true);
    }, [auth.user]);

    const scrollToTabs = useCallback(() => {
        const el = document.getElementById('product-sections');
        el?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <>
            <Head title={`${product.name} - Star Tech`} />
            <div className="bg-[#f2f4f8] min-h-screen py-5">
                <div className="container mx-auto px-4">
                    {/* Contextual Navigation */}
                    <ProductBreadcrumbs breadcrumbs={breadcrumbs} />

                    {/* Primary Product Information Grid */}
                    <div className="bg-white rounded-[2px] shadow-[0_1px_1px_rgba(0,0,0,0.1)] p-5 md:p-8 mb-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                            <ProductGallery product={product} />
                            
                            <div className="flex-1 flex flex-col justify-between">
                                <ProductInfo product={product} onViewMore={scrollToTabs} />
                                
                                <div className="mt-8">
                                    <ProductPaymentOptions product={product} />
                                    <ProductActions
                                        quantity={quantity}
                                        setQuantity={setQuantity}
                                        onAddToCart={handleAddToCart}
                                        onBuyNow={handleBuyNow}
                                        isInWishlist={isInWishlist}
                                        onToggleWishlist={handleToggleWishlist}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Content Sections (Specs, Reviews, Related Items) */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <ProductTabs
                                product={product}
                                onAskQuestion={handleAskQuestion}
                                onWriteReview={handleWriteReview}
                            />
                        </div>
                        
                        <aside className="w-full lg:w-[320px] shrink-0">
                            {/* Performance optimization: Deferred loading for non-critical related items */}
                            <Deferred data="relatedProducts" fallback={
                                <div className="animate-pulse space-y-4">
                                    <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                                    <div className="h-24 bg-slate-200 rounded"></div>
                                    <div className="h-24 bg-slate-200 rounded"></div>
                                </div>
                            }>
                                <RelatedProducts relatedProducts={relatedProducts} />
                            </Deferred>
                        </aside>
                    </div>

                    {/* Bottom Sticky Price Summary (Mobile focused) */}
                    <ProductPriceSummary product={product} />
                </div>
            </div>

            {/* Interactive Modals */}
            <QuestionModal
                isOpen={isQuestionModalOpen}
                onClose={() => setIsQuestionModalOpen(false)}
                product={product}
            />
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                product={product}
            />
        </>
    );
};

Show.layout = page => <FrontendLayout children={page} categories={page.props.categories} brands={page.props.brands} />;

export default Show;
