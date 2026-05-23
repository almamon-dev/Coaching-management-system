import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * CategoryHeader Component
 * Renders the category/brand title, description, breadcrumbs, and sub-tags.
 */
const CategoryHeader = ({ category, brand, breadcrumbs, priceRange, subcategories = [], relevantBrands = [] }) => {
    // If no category and no brand, or if we don't want the header for brands only, return null
    if (!category && !brand) return null;

    // Logic for showing header
    const showHeader = category && !brand;
    if (!showHeader) return null;

    return (
        <div className="bg-white border-b border-slate-200 py-5 mb-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <Link href="/" className="hover:text-[#4f46e5] flex items-center gap-1">
                        <Home size={12} />
                    </Link>
                    {breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            <ChevronRight size={10} className="text-slate-300" />
                            <Link
                                href={crumb.type === 'brand_category' ? `/${crumb.slug}` : route('frontend.url', crumb.slug)}
                                className={`hover:text-[#4f46e5] ${idx === breadcrumbs.length - 1 ? 'font-bold text-slate-600' : ''}`}
                            >
                                {crumb.name}
                            </Link>
                        </React.Fragment>
                    ))}
                </nav>

                <h1 className="text-[22px] font-bold text-[#3749bb] mb-3">{category.name} Price in Bangladesh</h1>
                {priceRange && (
                    <p className="text-[13px] text-slate-500 mb-6 leading-relaxed max-w-5xl">
                        {category.name} price starts from BDT {parseFloat(priceRange.min).toLocaleString()} to BDT {parseFloat(priceRange.max).toLocaleString()} in Bangladesh, depending on configuration. Build your {category.name} from Star Tech online shop. Browse below and order yours now!
                    </p>
                )}

                {/* Sub-tags / Links */}
                <div className="flex flex-wrap gap-2">
                    {subcategories.map(sub => (
                        <Link
                            key={sub.id}
                            href={route('frontend.url', sub.path)}
                            className="px-[16px] py-[6px] rounded-full border border-slate-200 bg-white text-[12px] text-[#111] hover:bg-[#3749bb] hover:text-white hover:border-[#3749bb] transition-all shadow-sm font-medium"
                        >
                            {sub.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryHeader;
