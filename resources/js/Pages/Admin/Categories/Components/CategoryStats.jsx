import React from 'react';
import { cn } from '@/lib/utils';

/**
 * CategoryStats Component
 * Tab-style metrics bar matching the Shopify administrative style.
 */
const CategoryStats = ({ stats, activeTab = 'all', onTabChange }) => {
    const tabs = [
        { key: 'all',       label: 'All Categories',     count: stats.total },
        { key: 'active',    label: 'Active',             count: stats.active },
        { key: 'inactive',  label: 'Inactive',           count: stats.inactive },
        { key: 'root',      label: 'Root',               count: stats.root },
        { key: 'sub',       label: 'Sub',                count: stats.sub },
        { key: 'sub_sub',   label: 'Sub-Sub',            count: stats.sub_sub },
        { key: 'withImage', label: 'With Image',         count: stats.withImage },
        { key: 'noImage',   label: 'No Image',           count: stats.noImage },
    ];

    return (
        <div className="flex items-center border-b border-[#ebebeb] px-2 overflow-x-auto scrollbar-hide bg-white">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange && onTabChange(tab.key)}
                        className={cn(
                            "relative py-3 px-2 text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1 min-w-fit",
                            isActive
                                ? 'text-[#008060] font-bold'
                                : 'text-[#6d7175] hover:text-[#202223] hover:bg-[#f6f6f7]'
                        )}
                    >
                        <span>{tab.label}</span>
                        <span className={cn(
                            "text-[11px] px-1.5 py-0.5 rounded-full",
                            isActive ? "bg-[#e4f1ef] text-[#008060]" : "bg-[#f1f1f1] text-[#6d7175]"
                        )}>
                            {tab.count ?? 0}
                        </span>
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008060] rounded-t-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryStats;
