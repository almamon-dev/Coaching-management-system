import React from 'react';
import { cn } from '@/lib/utils';

/**
 * RepairStats Component
 * Tab-style metrics bar matching the Shopify administrative style.
 */
const RepairStats = ({ stats, activeTab = 'all', onTabChange }) => {
    const tabs = [
        { key: 'all',            label: 'All Tickets',      count: stats.total },
        { key: 'pending',        label: 'Kiosk Queue',      count: stats.pending },
        { key: 'approved',       label: 'Received',         count: stats.approved },
        { key: 'diagnosing',     label: 'Diagnostics',      count: stats.diagnosing },
        { key: 'awaiting_quote', label: 'Awaiting Quote',   count: stats.awaiting_quote },
        { key: 'repairing',      label: 'Repairing',        count: stats.repairing },
        { key: 'testing',        label: 'Testing QC',       count: stats.testing },
        { key: 'ready',          label: 'Ready',            count: stats.ready },
        { key: 'completed',      label: 'Closed',           count: stats.completed },
        { key: 'cancelled',      label: 'Cancelled',        count: stats.cancelled },
    ];

    return (
        <div className="flex items-center border-b border-[#ebebeb] px-4 overflow-x-auto scrollbar-hide bg-white select-none">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
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
                            "text-[10.5px] px-1.5 py-0.5 rounded-full font-bold",
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

export default RepairStats;
