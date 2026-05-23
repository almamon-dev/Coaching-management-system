import React from 'react';

const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-md border border-slate-200 p-4 flex flex-col h-full animate-pulse">
            {/* Image Skeleton */}
            <div className="relative bg-slate-50 flex items-center justify-center h-[210px] mb-2 rounded-sm border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                </div>
            </div>

            <div className="flex flex-col flex-1 border-t-2 border-slate-50 pt-4">
                {/* Title Skeleton */}
                <div className="space-y-2 mb-4 min-h-[42px]">
                    <div className="h-3 w-full bg-slate-100 rounded-full"></div>
                    <div className="h-3 w-3/4 bg-slate-100 rounded-full"></div>
                </div>

                {/* Features Skeleton */}
                <ul className="mb-5 space-y-2.5 flex-1">
                    {[1, 2, 3].map((i) => (
                        <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-100 mt-1.5 shrink-0" />
                            <div className="h-2 w-full bg-slate-50 rounded-full"></div>
                        </li>
                    ))}
                </ul>

                {/* Price and Actions Skeleton */}
                <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                        <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-10 w-full bg-slate-50 rounded-md"></div>
                        <div className="h-4 w-32 bg-slate-50 rounded-full mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
