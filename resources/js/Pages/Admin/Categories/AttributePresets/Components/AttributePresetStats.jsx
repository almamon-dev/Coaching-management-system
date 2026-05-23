import React from 'react';
import { cn } from '@/lib/utils';

const AttributePresetStats = ({ stats, activeTab, onTabChange }) => {
    const tabs = [
        { key: 'all', label: 'All Templates', count: stats?.total || 0 },
    ];

    return (
        <div className="flex items-center border-b border-[#ebebeb] px-4 overflow-x-auto scrollbar-hide bg-white">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange && onTabChange(tab.key)}
                        className={cn(
                            "relative py-3.5 px-3 text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 min-w-fit",
                            isActive ? 'text-[#008060] font-bold' : 'text-[#6d7175] hover:text-[#202223] hover:bg-[#f6f6f7]'
                        )}
                    >
                        <span>{tab.label}</span>
                        <span className={cn(
                            "text-[11px] px-1.5 py-0.5 rounded-full",
                            isActive ? "bg-[#e4f1ef] text-[#008060]" : "bg-[#f1f2f3] text-[#6d7175]"
                        )}>
                            {tab.count}
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

export default AttributePresetStats;
