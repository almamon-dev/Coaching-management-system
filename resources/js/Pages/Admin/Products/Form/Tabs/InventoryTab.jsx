import React, { useState } from 'react';
import TextInput from '@/Components/TextInput';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Notify from '@/Utils/Notify';

const InventoryTab = ({ data, setData, isEdit = false }) => {
    const [warehouseSearch, setWarehouseSearch] = useState('');
    const [bulkQuantity, setBulkQuantity] = useState('');
    const [selectedWarehouses, setSelectedWarehouses] = useState(() => {
        return data.warehouse_stocks
            .filter(s => parseInt(s.quantity) > 0)
            .map(s => s.warehouse_id);
    });

    const filteredWarehouses = data.warehouse_stocks.filter(s =>
        s.name.toLowerCase().includes(warehouseSearch.toLowerCase()) ||
        s.warehouse_id.toString().includes(warehouseSearch)
    );

    const handleBulkApply = () => {
        const targetIds = selectedWarehouses.length > 0
            ? selectedWarehouses
            : filteredWarehouses.map(s => s.warehouse_id);

        const newStocks = data.warehouse_stocks.map(s =>
            targetIds.includes(s.warehouse_id)
                ? { ...s, quantity: bulkQuantity || '0' }
                : s
        );
        setData('warehouse_stocks', newStocks);
        setBulkQuantity('');

        if (selectedWarehouses.length > 0) {
            Notify.success('Stocks Applied', `Updated ${selectedWarehouses.length} selected warehouses.`);
            setSelectedWarehouses([]);
        } else {
            Notify.success('Global Update', `Applied ${bulkQuantity || 0} units to visible warehouses.`);
        }
    };

    const handleBulkClear = () => {
        const targetIds = selectedWarehouses.length > 0
            ? selectedWarehouses
            : filteredWarehouses.map(s => s.warehouse_id);

        const newStocks = data.warehouse_stocks.map(s =>
            targetIds.includes(s.warehouse_id)
                ? { ...s, quantity: '0' }
                : s
        );
        setData('warehouse_stocks', newStocks);

        if (selectedWarehouses.length > 0) {
            Notify.success('Stocks Cleared', `Cleared stocks for ${selectedWarehouses.length} selected warehouses.`);
            setSelectedWarehouses([]);
        } else {
            Notify.success('Stocks Cleared', 'Visible inventory levels have been reset.');
        }
    };

    const toggleSelectAll = (checked) => {
        const filteredIds = filteredWarehouses.map(s => s.warehouse_id);
        if (checked) {
            setSelectedWarehouses(prev => [...new Set([...prev, ...filteredIds])]);
        } else {
            setSelectedWarehouses(prev => prev.filter(id => !filteredIds.includes(id)));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-[14px] font-bold text-[#202223] mb-1">Multi-Warehouse Inventory</h3>
                    <p className="text-[12px] text-[#6d7175]">
                        {isEdit ? 'Manage stock levels across all locations.' : 'Manage initial stock levels across all locations.'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <TextInput
                        type="number"
                        placeholder="Bulk Qty"
                        value={bulkQuantity}
                        onChange={(e) => setBulkQuantity(e.target.value)}
                        className="w-[100px] h-[32px]"
                    />
                    <button
                        type="button"
                        onClick={handleBulkApply}
                        className={cn(
                            "h-[32px] px-4 font-bold text-[11px] rounded-[4px] border transition-all",
                            selectedWarehouses.length > 0
                                ? "bg-[#008060] text-white border-[#008060] hover:bg-[#006e52]"
                                : "bg-[#f1f1f1] text-[#202223] border-[#d1d1d1] hover:bg-[#e4e6e7]"
                        )}
                    >
                        {selectedWarehouses.length > 0 ? `Apply to (${selectedWarehouses.length})` : 'Apply to All'}
                    </button>
                    <button
                        type="button"
                        onClick={handleBulkClear}
                        className="h-[32px] px-4 bg-white hover:bg-red-50 text-red-600 font-bold text-[11px] rounded-[4px] border border-red-200 transition-all"
                    >
                        {selectedWarehouses.length > 0 ? 'Clear Selected' : 'Clear All'}
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                <TextInput
                    type="text"
                    placeholder="Search warehouses by name or ID..."
                    value={warehouseSearch}
                    onChange={(e) => setWarehouseSearch(e.target.value)}
                    className="h-[32px] pl-9"
                />
            </div>

            <div className="border border-[#ebebeb] rounded-[4px] overflow-hidden bg-white shadow-sm">
                <div className="bg-[#f9fafb] border-b border-[#ebebeb] px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-[#d1d1d1] text-[#008060] focus:ring-[#008060] cursor-pointer"
                            checked={filteredWarehouses.length > 0 && filteredWarehouses.every(s => selectedWarehouses.includes(s.warehouse_id))}
                            onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                        <span className="text-[11px] font-bold text-[#6d7175]">Warehouse Name</span>
                    </div>
                    <div className="hidden md:flex items-center gap-12 mr-16">
                        <span className="text-[11px] font-bold text-[#6d7175]">{isEdit ? 'Stock Level' : 'Initial Stock'}</span>
                        <span className="text-[11px] font-bold text-[#6d7175]">Low Alert</span>
                    </div>
                </div>

                <div className="divide-y divide-[#f1f1f1] max-h-[305px] overflow-y-auto custom-scrollbar">
                    {filteredWarehouses.map((stock) => {
                        const actualIndex = data.warehouse_stocks.findIndex(s => s.warehouse_id === stock.warehouse_id);
                        const qty = parseInt(stock.quantity) || 0;
                        const threshold = parseInt(stock.low_stock_threshold) || 5;
                        const isLow = isEdit && qty <= threshold && qty > 0;
                        const isOut = isEdit && qty === 0;
                        const isSelected = selectedWarehouses.includes(stock.warehouse_id);

                        return (
                            <div
                                key={stock.warehouse_id}
                                className={cn(
                                    "group flex flex-col md:flex-row md:items-center justify-between px-4 py-2 md:py-1 transition-all duration-150",
                                    isSelected ? "bg-[#f4fbf9]" : "hover:bg-[#fbfcfd]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[#d1d1d1] text-[#008060] focus:ring-[#008060] cursor-pointer"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedWarehouses(prev => [...prev, stock.warehouse_id]);
                                            } else {
                                                setSelectedWarehouses(prev => prev.filter(id => id !== stock.warehouse_id));
                                            }
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px] font-semibold text-[#202223]">{stock.name}</span>
                                            {isEdit ? (
                                                <>
                                                    {isOut ? (
                                                        <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" title="Out of Stock"></span>
                                                    ) : isLow ? (
                                                        <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" title="Low Stock"></span>
                                                    ) : (
                                                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#008060]" title="Good Stock"></span>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {qty > 0 ? (
                                                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#008060]" title="Stock Provided"></span>
                                                    ) : (
                                                        <span className="flex h-1.5 w-1.5 rounded-full bg-slate-200" title="No Initial Stock"></span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-[#6d7175] font-medium tracking-tight">WH-{stock.warehouse_id}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 w-full md:w-auto mt-1 md:mt-0 ml-7 md:ml-0">
                                    <div className="flex items-center justify-between md:justify-start gap-2">
                                        <span className="md:hidden text-[10px] font-bold text-[#6d7175] uppercase tracking-tight">Stock:</span>
                                        <div className="relative group/input">
                                            <TextInput
                                                type="number"
                                                min="0"
                                                value={stock.quantity}
                                                onChange={(e) => {
                                                    const newStocks = [...data.warehouse_stocks];
                                                    const val = e.target.value;
                                                    newStocks[actualIndex].quantity = val;
                                                    setData('warehouse_stocks', newStocks);

                                                    const parsedQty = parseInt(val) || 0;
                                                    if (parsedQty > 0 && !selectedWarehouses.includes(stock.warehouse_id)) {
                                                        setSelectedWarehouses(prev => [...prev, stock.warehouse_id]);
                                                    } else if (parsedQty === 0 && selectedWarehouses.includes(stock.warehouse_id)) {
                                                        setSelectedWarehouses(prev => prev.filter(id => id !== stock.warehouse_id));
                                                    }
                                                }}
                                                className={cn(
                                                    "h-[28px] md:h-[30px] w-[80px] md:w-[90px] text-center font-bold text-[12px] md:text-[13px] transition-all",
                                                    isEdit ? (
                                                        isOut ? "border-red-200 bg-red-50 text-red-700" :
                                                        isLow ? "border-amber-200 bg-amber-50 text-amber-700" :
                                                        "border-[#d1d1d1] bg-white text-[#202223] focus:border-[#008060] focus:bg-[#f4fbf9]"
                                                    ) : (
                                                        qty > 0 ? "border-[#008060] bg-[#f4fbf9] text-[#008060] focus:ring-1 focus:ring-[#008060]" :
                                                        "border-[#d1d1d1] bg-white text-[#202223] focus:border-[#008060] focus:bg-[#f4fbf9]"
                                                    )
                                                )}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-start gap-2">
                                        <span className="md:hidden text-[10px] font-bold text-[#6d7175] uppercase tracking-tight">Alert:</span>
                                        <div className="relative">
                                            <TextInput
                                                type="number"
                                                min="0"
                                                value={stock.low_stock_threshold}
                                                onChange={(e) => {
                                                    const newStocks = [...data.warehouse_stocks];
                                                    newStocks[actualIndex].low_stock_threshold = e.target.value;
                                                    setData('warehouse_stocks', newStocks);
                                                }}
                                                className="h-[28px] md:h-[30px] w-[80px] md:w-[90px] text-center text-[11px] md:text-[12px] border-[#d1d1d1] bg-[#f9fafb]/50 text-[#6d7175] focus:bg-white focus:text-[#202223]"
                                                placeholder="5"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredWarehouses.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f9fafb] mb-3">
                                <Search className="text-[#6d7175]" size={20} />
                            </div>
                            <p className="text-[14px] font-medium text-[#202223]">No warehouses found</p>
                            <p className="text-[12px] text-[#6d7175]">Try adjusting your search terms</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryTab;
