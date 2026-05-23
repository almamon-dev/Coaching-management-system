import React from 'react';
import { cn } from '@/lib/utils';

const WarehouseStats = ({ stats, activeTab = 'all', onTabChange }) => {
    const tabs = [
        { key: 'all', label: 'All Warehouses', count: stats.total },
        { key: 'active', label: 'Active', count: stats.active },
        { key: 'inactive', label: 'Inactive', count: stats.inactive },
    ];

    return (
        <div className="flex items-center border-b border-[#ebebeb] bg-[#fbfcfd] rounded-t-[4px] px-2 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange && onTabChange(tab.key)}
                        className={cn(
                            "relative h-[44px] px-4 flex items-center transition-all group",
                            isActive ? "text-[#202223]" : "text-[#6d7175] hover:text-[#202223]"
                        )}
                    >
                        <span className="flex items-center gap-2">
                            <span className={cn(
                                "text-[13px] font-bold tracking-tight transition-colors",
                                isActive ? "text-[#202223]" : "text-[#6d7175] group-hover:text-[#202223]"
                            )}>
                                {tab.label}
                            </span>
                            <span className={cn(
                                "text-[11px] font-bold px-1.5 py-0.5 rounded-[4px] transition-colors",
                                isActive ? "bg-[#f1f1f1] text-[#202223]" : "bg-[#f6f6f7] text-[#6d7175] group-hover:text-[#202223]"
                            )}>
                                {tab.count ?? 0}
                            </span>
                        </span>
                        
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#008060] rounded-t-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default WarehouseStats;
