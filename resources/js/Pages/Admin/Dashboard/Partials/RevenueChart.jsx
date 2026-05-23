import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';

const RevenueChart = ({ data = [] }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState('Last 12 Months');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[350px] w-full bg-[#f7f7f7] animate-pulse rounded-[8px]" />;

    return (
        <div className="rounded-[8px] border border-[#ebebeb] bg-white text-[#202223] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
            <div className="p-4 flex flex-col pb-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#202223] text-[15px]">Sales & Orders</h3>

                    {/* Shadcn-like Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="h-[36px] flex items-center justify-between gap-2 px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f6f6f7] transition-colors min-w-[140px] shadow-sm"
                        >
                            {selectedRange}
                            <ChevronDown size={14} className={`text-[#6d7175] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-1 w-full bg-white border border-[#ebebeb] rounded-[4px] shadow-lg z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                                {['Last 12 Months', 'Last 6 Months', 'Last 3 Months'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => {
                                            setSelectedRange(range);
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[12px] font-semibold text-[#202223] hover:bg-[#f6f6f7] transition-colors"
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Yearly revenue vs volume performance</p>
            </div>
            <div className="p-4 pt-0 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            tickFormatter={(value) => `৳${value}`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingBottom: '20px' }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="revenue"
                            name="Revenue (৳)"
                            fill="#008060"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="orders"
                            name="Orders (Count)"
                            fill="#202223"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
