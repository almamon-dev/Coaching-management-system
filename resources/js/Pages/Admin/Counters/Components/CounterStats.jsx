import React from 'react';
import { cn } from '@/lib/utils';

/**
 * CounterStats Component
 * Tab-style metrics bar matching the Shopify administrative style.
 */
const CounterStats = ({ stats, activeTab = 'all', onTabChange }) => {
    const tabs = [
        { key: 'all',       label: 'All Counters',   count: stats.all },
        { key: 'active',    label: 'Active',         count: stats.active },
        { key: 'inactive',  label: 'Offline',        count: stats.inactive },
    ];

    return (
        <div className="flex items-center border-b border-[#ebebeb] px-4 overflow-x-auto scrollbar-hide bg-white">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onTabChange && onTabChange(tab.key)}
                        className={cn(
                            "relative py-3.5 px-3 text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 min-w-fit",
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

export default CounterStats;
