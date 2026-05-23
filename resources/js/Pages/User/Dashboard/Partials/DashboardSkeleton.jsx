import React from 'react';
import { cn } from '@/lib/utils';

const SkeletonBase = ({ className }) => (
    <div className={cn("bg-slate-100 animate-pulse rounded-[1px]", className)} />
);

// Table Skeleton (For Orders)
export const TableSkeleton = () => (
    <div className="space-y-4">
        <div className="bg-white p-4 rounded-[1px] border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
                <SkeletonBase className="h-6 w-48" />
                <SkeletonBase className="h-3 w-32 bg-slate-50" />
            </div>
        </div>
        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-10">
                <SkeletonBase className="h-4 w-20" />
                <SkeletonBase className="h-4 w-32" />
                <SkeletonBase className="h-4 w-24" />
                <SkeletonBase className="h-4 w-40" />
            </div>
            <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 flex items-center justify-between h-[52px]">
                        <div className="flex items-center gap-4 flex-1">
                            <SkeletonBase className="h-4 w-full max-w-[150px]" />
                        </div>
                        <div className="flex items-center gap-10 flex-1 justify-center">
                            <SkeletonBase className="h-4 w-24" />
                            <SkeletonBase className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="flex gap-2 flex-1 justify-end">
                            <SkeletonBase className="h-8 w-20" />
                            <SkeletonBase className="h-8 w-8" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Card Skeleton (For Wishlist / Products)
export const CardSkeleton = () => (
    <div className="space-y-4">
        <div className="bg-white p-4 rounded-[1px] border border-slate-200 shadow-sm">
            <SkeletonBase className="h-6 w-48 mb-2" />
            <SkeletonBase className="h-3 w-32 bg-slate-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-slate-200 p-4 rounded-[1px] shadow-sm space-y-4">
                    <SkeletonBase className="h-40 w-full" />
                    <SkeletonBase className="h-5 w-full" />
                    <SkeletonBase className="h-4 w-2/3" />
                    <div className="flex justify-between pt-2">
                        <SkeletonBase className="h-8 w-24" />
                        <SkeletonBase className="h-8 w-8" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Form Skeleton (For Profile / Security)
export const FormSkeleton = () => (
    <div className="bg-white p-8 rounded-[1px] border border-slate-200 shadow-sm space-y-8">
        <div className="space-y-2">
            <SkeletonBase className="h-6 w-64" />
            <SkeletonBase className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                    <SkeletonBase className="h-3 w-20" />
                    <SkeletonBase className="h-10 w-full" />
                </div>
            ))}
        </div>
        <SkeletonBase className="h-10 w-32" />
    </div>
);

const DashboardSkeleton = ({ type = 'table' }) => {
    switch (type) {
        case 'card': return <CardSkeleton />;
        case 'form': return <FormSkeleton />;
        default: return <TableSkeleton />;
    }
};

export default DashboardSkeleton;
