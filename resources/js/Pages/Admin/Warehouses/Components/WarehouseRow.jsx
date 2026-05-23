import React from 'react';
import { router } from '@inertiajs/react';
import { Check, Trash2, SquarePen, Building2, Phone, MapPin, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/StatusDropdown';

const WarehouseRow = ({ warehouse, isSelected, toggleSelect, handleDelete, onEdit, visibleColumns = [] }) => {
    return (
        <tr className={cn(
            "group transition-colors h-[52px]",
            isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
        )}>
            {/* Checkbox Column */}
            <td className="pl-4 pr-2 py-1 w-[50px]">
                <div
                    onClick={() => toggleSelect(warehouse.id)}
                    className={cn(
                        "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                        isSelected
                            ? "bg-[#008060] border-[#008060]"
                            : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                    )}
                >
                    {isSelected && <Check size={11} strokeWidth={4} className="text-white" />}
                </div>
            </td>
            {/* Warehouse Info */}
            {visibleColumns.includes('warehouse') && (
                <td className="px-4 py-1 w-[300px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[6px] bg-white flex items-center justify-center border border-[#ebebeb] text-[#008060] shadow-sm">
                            <Building2 size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[12px] font-bold text-[#202223] truncate leading-tight mb-0.5" title={warehouse.name}>
                                {warehouse.name}
                            </span>
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <span className="text-[10px] text-[#6d7175] font-medium truncate bg-[#f6f6f7] px-1.5 py-0.5 rounded-[2px] border border-[#ebebeb]">
                                    {warehouse.slug}
                                </span>
                            </div>
                        </div>
                    </div>
                </td>
            )}

            {/* Location */}
            {visibleColumns.includes('address') && (
                <td className="px-4 py-1">
                    <div className="flex items-start gap-2 group/addr">
                        <div className="shrink-0 mt-0.5 w-5 h-5 bg-[#f6f6f7] rounded-full flex items-center justify-center">
                            <MapPin size={10} className="text-[#6d7175]" />
                        </div>
                        <span className="text-[11px] text-[#6d7175] font-medium line-clamp-2 leading-relaxed" title={warehouse.address}>
                            {warehouse.address || 'No address set'}
                        </span>
                    </div>
                </td>
            )}

            {/* Contact */}
            {visibleColumns.includes('phone') && (
                <td className="px-4 py-1 text-center w-[180px]">
                    <div className="inline-flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#202223]">
                            <Phone size={10} className="text-[#6d7175]" />
                            {warehouse.phone || 'N/A'}
                        </div>
                        <span className="text-[9px] text-[#bababa] uppercase tracking-tighter">Direct Line</span>
                    </div>
                </td>
            )}

            {/* Status */}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center w-[140px]">
                    <div className="flex justify-center">
                        <StatusDropdown
                            value={warehouse.is_active ? 1 : 0}
                            options={[
                                { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                                { label: 'Inactive', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                            ]}
                            onChange={() => {
                                router.patch(route('admin.warehouses.status', warehouse.id), {}, { preserveScroll: true });
                            }}
                            size="xs"
                        />
                    </div>
                </td>
            )}

            {/* Date Created */}
            {visibleColumns.includes('date') && (
                <td className="px-4 py-1 text-center w-[160px]">
                    <div className="flex flex-col items-center">
                        <span className="text-[11px] text-[#202223] font-bold">
                            {new Date(warehouse.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-1 h-1 rounded-full bg-[#d1d1d1]" />
                            <span className="text-[10px] text-[#6d7175] font-medium">
                                {new Date(warehouse.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                        </div>
                    </div>
                </td>
            )}

            {/* Actions */}
            <td className="px-6 py-1 text-right w-[130px]">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={() => onEdit(warehouse)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                        title="Edit Warehouse"
                    >
                        <SquarePen size={12} />
                    </button>
                    <button
                        onClick={() => handleDelete(warehouse.id, warehouse.name)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Warehouse"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default WarehouseRow;
