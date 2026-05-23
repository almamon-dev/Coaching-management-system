import React, { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const CategoryChart = ({ data = [] }) => {
    const [isMounted, setIsMounted] = useState(false);
    const COLORS = ['#008060', '#202223', '#6d7175', '#aee9d1', '#005bd3'];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[350px] w-full bg-[#f7f7f7] animate-pulse rounded-[8px]" />;

    return (
        <div className="rounded-[8px] border border-[#ebebeb] bg-white text-[#202223] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex flex-col h-full">
            <div className="p-4 flex flex-col pb-6">
                <h3 className="font-bold text-[#202223] text-[15px]">Sales by Category</h3>
            </div>
            <div className="p-4 pt-0 h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {data?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CategoryChart;
