import React from 'react';
import { cn } from '@/lib/utils';

const VariantStats = ({ stats, activeTab, onTabChange }) => {
    if (!stats) return null;

    const tabs = [
        { id: 'all', label: 'All Variants', value: stats.total },
        { id: 'active', label: 'Active', value: stats.active },
        { id: 'inactive', label: 'Inactive', value: stats.inactive }
    ];

    return (
        <div className="flex flex-wrap border-b border-[#ebebeb] bg-[#f9fafb]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-3 text-[13px] font-bold transition-all border-b-2 relative",
                            isActive
                                ? "border-[#008060] text-[#008060] bg-white"
                                : "border-transparent text-[#6d7175] hover:text-[#202223] hover:bg-slate-50"
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            "ml-1.5 px-2 py-0.5 rounded-full text-[11px]",
                            isActive ? "bg-[#e4f1ef] text-[#008060]" : "bg-[#ebebeb] text-[#6d7175]"
                        )}>
                            {tab.value}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default VariantStats;
