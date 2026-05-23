import React, { useState, useEffect } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis
} from 'recharts';
import { ChevronDown } from 'lucide-react';

const ProductPerformanceChart = ({ data = [] }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState('Last 12 Months');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[300px] w-full bg-[#f7f7f7] animate-pulse rounded-[8px]" />;

    return (
        <div className="rounded-[8px] border border-[#ebebeb] bg-white text-[#202223] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] h-full">
            <div className="p-4 flex flex-col pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-[#202223] text-[15px]">Product Performance</h3>
                        <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Price vs Sales Volume analysis</p>
                    </div>

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
            </div>
            <div className="p-4 pt-0 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            type="number"
                            dataKey="price"
                            name="Price"
                            unit="৳"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="sales"
                            name="Sales"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        />
                        <ZAxis type="category" dataKey="name" name="Product" />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Scatter name="Products" data={data} fill="#008060" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProductPerformanceChart;
