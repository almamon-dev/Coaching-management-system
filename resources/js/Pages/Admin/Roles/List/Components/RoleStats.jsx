/**
 * RoleStats Component
 * Tab-style metrics bar matching the Category administrative style.
 */
import React from 'react';
import { cn } from '@/lib/utils';

const RoleStats = ({ stats, activeTab = 'all', onTabChange }) => {
    const tabs = [
        { key: 'all',                label: 'All Roles',          count: stats?.all },
        { key: 'operators',          label: 'Has Operators',      count: stats?.with_operators },
        { key: 'empty',              label: 'No Operators',       count: stats?.without_operators },
        { key: 'permissions',        label: 'Has Permissions',    count: stats?.with_permissions },
        { key: 'no_permissions',     label: 'No Permissions',     count: stats?.without_permissions },
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
                            "relative py-3.5 px-3 text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 min-w-fit cursor-pointer",
                            isActive
                                ? 'text-[#008060] font-bold'
                                : 'text-[#6d7175] hover:text-[#202223] hover:bg-[#f6f6f7]'
                        )}
                    >
                        <span>{tab.label}</span>
                        <span className={cn(
                            "text-[11px] px-1.5 py-0.5 rounded-full font-bold",
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

export default RoleStats;
