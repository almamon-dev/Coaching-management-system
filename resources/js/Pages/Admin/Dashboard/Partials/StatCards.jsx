import React from 'react';
import {
    TrendingUp,
    ShoppingCart,
    Package,
    Users,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const StatCards = ({ stats }) => {
    const statCards = [
        {
            label: 'Total Revenue',
            value: stats?.total_sales?.value || '৳0',
            trend: stats?.total_sales?.trend,
            trendLabel: stats?.total_sales?.trend_label,
            icon: <TrendingUp size={16} className="text-muted-foreground" />,
            type: stats?.total_sales?.type || 'up'
        },
        {
            label: 'Total Orders',
            value: stats?.total_orders?.value || '0',
            trend: stats?.total_orders?.trend,
            trendLabel: stats?.total_orders?.trend_label,
            icon: <ShoppingCart size={16} className="text-muted-foreground" />,
            type: stats?.total_orders?.type || 'up'
        },
        {
            label: 'Avg. Order Value',
            value: stats?.avg_order_value?.value || '৳0',
            trend: stats?.avg_order_value?.trend,
            trendLabel: stats?.avg_order_value?.trend_label,
            icon: <Package size={16} className="text-muted-foreground" />,
            type: stats?.avg_order_value?.type || 'up'
        },
        {
            label: 'New Customers',
            value: stats?.new_customers?.value || '0',
            trend: stats?.new_customers?.trend,
            trendLabel: stats?.new_customers?.trend_label,
            icon: <Users size={16} className="text-muted-foreground" />,
            type: stats?.new_customers?.type || 'up'
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {statCards.map((card, idx) => (
                <div key={idx} className="rounded-[8px] border border-[#ebebeb] bg-white text-[#202223] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <div className="p-4 flex flex-row items-center justify-between pb-2">
                        <h3 className="text-[12px] font-bold text-[#6d7175] uppercase tracking-tight">{card.label}</h3>
                        {card.icon}
                    </div>
                    <div className="p-4 pt-0">
                        <div className="text-[20px] font-bold text-[#202223] tracking-tight">{card.value}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${
                                card.type === 'up' ? 'text-[#008060]' : 'text-[#bf0711]'
                            }`}>
                                {card.trend}
                            </span>
                            <span className="text-[12px] text-[#6d7175] font-medium">{card.trendLabel}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
