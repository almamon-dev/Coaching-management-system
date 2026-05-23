import { cn } from '@/lib/utils';

const OrderStats = ({ stats, activeTab = 'all', onTabChange }) => {
    const tabs = [
        { key: 'all',        label: 'All Orders',    count: stats.total },
        { key: 'pending',    label: 'Pending',       count: stats.pending },
        { key: 'processing', label: 'Processing',    count: stats.processing },
        { key: 'shipped',    label: 'Shipped',       count: stats.shipped },
        { key: 'delivered',  label: 'Delivered',     count: stats.delivered },
        { key: 'cancelled',  label: 'Cancelled',     count: stats.cancelled },
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

export default OrderStats;
