import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Home, ChevronRight, X } from 'lucide-react';
import FrontendLayout from '@/Layouts/FrontendLayout';

// Partials
import ProductSidebar from './Partials/ProductSidebar';
import CategoryHeader from './Partials/CategoryHeader';
import IndexToolbar from './Partials/IndexToolbar';
import ProductGrid from './Partials/ProductGrid';
import Pagination from './Partials/Pagination';

/**
 * Product Index Page (Frontend)
 * 
 * Orchestrates the product listing view with filtering, sorting, and layout management.
 */
const Index = ({
    category,
    brand,
    products,
    filters,
    priceRange,
    availableVariants,
    breadcrumbs,
    relevantBrands = [],
    subcategories = []
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        // Global router listeners to manage the loading overlay
        const removeStartListener = router.on('start', (event) => {
            if (event.detail.visit.method.toLowerCase() === 'get' && !event.detail.visit.prefetch) {
                setIsLoading(true);
            }
        });
        const removeFinishListener = router.on('finish', () => setIsLoading(false));

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    // Optimized page metadata
    const title = brand ? brand.name : (category ? category.name : 'Products');

    return (
        <>
            <Head title={`${title} - DailyFresh`} />

            <div className="bg-[#f2f4f8] min-h-screen pt-4 md:pt-8 pb-8">

                <div className="container mx-auto px-4">
                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav className="flex items-center gap-2 text-[12px] md:text-[13px] text-slate-500 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
                            <Link href="/" className="hover:text-[#16a34a] flex items-center gap-1 transition-colors shrink-0">
                                <Home size={14} />
                            </Link>
                            {breadcrumbs.map((crumb, idx) => (
                                <React.Fragment key={idx}>
                                    <ChevronRight size={12} className="text-slate-400 shrink-0" />
                                    <Link
                                        href={crumb.type === 'brand_category' ? `/${crumb.slug}` : route('frontend.url', crumb.slug)}
                                        className={`transition-colors shrink-0 ${idx === breadcrumbs.length - 1 ? 'font-bold text-[#081621]' : 'hover:text-[#16a34a]'}`}
                                    >
                                        {crumb.name}
                                    </Link>
                                </React.Fragment>
                            ))}
                        </nav>
                    )}

                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8">

                        {/* Mobile Filter Overlay */}
                        {isMobileFilterOpen && (
                            <div className="fixed inset-0 z-[100] lg:hidden flex">
                                <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)}></div>
                                <div className="relative w-[85%] max-w-[320px] bg-white h-full flex flex-col overflow-y-auto transform transition-transform">
                                    <div className="p-4 flex items-center justify-between bg-[#16a34a] text-white">
                                        <span className="font-bold text-lg">Filters</span>
                                        <button onClick={() => setIsMobileFilterOpen(false)} className="text-white hover:text-slate-200 p-1">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="flex-1 p-4 bg-[#f2f4f8]">
                                        <ProductSidebar
                                            category={category}
                                            brand={brand}
                                            filters={filters}
                                            priceRange={priceRange}
                                            availableVariants={availableVariants}
                                            relevantBrands={relevantBrands}
                                            subcategories={subcategories}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Desktop Filter Sidebar */}
                        <aside className="hidden lg:block w-[280px] shrink-0">
                            <ProductSidebar
                                category={category}
                                brand={brand}
                                filters={filters}
                                priceRange={priceRange}
                                availableVariants={availableVariants}
                                relevantBrands={relevantBrands}
                                subcategories={subcategories}
                            />
                        </aside>

                        {/* Main Product Listing Area */}
                        <main className="flex-1 relative min-h-[800px]">
                            {/* Toolbar: Sorting & Limit */}
                            <IndexToolbar
                                title={title}
                                filters={filters}
                                category={category}
                                brand={brand}
                                onFilterClick={() => setIsMobileFilterOpen(true)}
                            />

                            {/* Product Grid with Empty State */}
                            <ProductGrid products={products?.data || []} isLoading={isLoading || !products} />

                            {/* Pagination Section */}
                            <div className={`transition-all duration-300 ${(!products || isLoading) ? 'min-h-[80px]' : ''}`}>
                                <Pagination
                                    meta={products?.meta || {
                                        total: products?.total || 0,
                                        from: products?.from || 0,
                                        to: products?.to || 0,
                                        last_page: products?.last_page || 1
                                    }}
                                    links={products?.links || []}
                                />
                            </div>
                        </main>

                    </div>
                </div>
            </div>
        </>
    );
};

Index.layout = page => <FrontendLayout children={page} categories={page.props.categories} brands={page.props.brands} />;

export default Index;
