import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * ProductBreadcrumbs Component
 * Renders the navigation path for the product.
 * 
 * @param {Array} breadcrumbs - List of breadcrumb items { name, slug, type }
 */
const ProductBreadcrumbs = ({ breadcrumbs = [] }) => {
    return (
        <nav className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-5 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
            <Link href="/" className="text-slate-500 hover:text-slate-800 flex items-center transition-colors">
                <Home size={13} strokeWidth={1.5} />
            </Link>
            
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                    <span className="text-slate-300 text-[11px] font-medium">/</span>
                    <Link 
                        href={crumb.type === 'brand_category' ? `/${crumb.slug}` : route('frontend.url', crumb.slug)} 
                        className="text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        {crumb.name}
                    </Link>
                </React.Fragment>
            ))}
        </nav>
    );
};

export default ProductBreadcrumbs;
