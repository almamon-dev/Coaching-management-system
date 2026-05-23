import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Check, Trash2, Eye, SquarePen, Building2, User, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/StatusDropdown';

/**
 * SupplierRow Component
 * A single row in the supplier list with high-fidelity design.
 */
const SupplierRow = ({ supplier, isSelected, toggleSelect, handleDelete, visibleColumns = [] }) => {
    return (
        <tr className={cn(
            "group transition-colors h-[52px]",
            isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
        )}>
            {/* Checkbox Column */}
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => toggleSelect(supplier.id)}
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

            {/* Supplier Info */}
            {visibleColumns.includes('supplier') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[4px] bg-white flex items-center justify-center overflow-hidden border border-[#ebebeb] group-hover:border-[#008060]/30 transition-all shadow-sm">
                            {supplier.logo ? (
                                <img src={`/uploads/${supplier.logo}`} alt={supplier.name} className="w-full h-full object-contain p-1" />
                            ) : (
                                <Building2 size={16} className="text-[#bababa]" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[12px] font-bold text-[#202223] truncate" title={supplier.name}>
                                {supplier.name}
                            </span>
                            <span className="text-[10px] text-[#6d7175] font-medium truncate">/{supplier.slug}</span>
                        </div>
                    </div>
                </td>
            )}

            {/* Contact Person */}
            {visibleColumns.includes('contact') && (
                <td className="px-4 py-1">
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <User size={10} className="text-[#6d7175]" />
                            <span className="text-[11px] font-bold text-[#202223] truncate">{supplier.contact_person || 'N/A'}</span>
                        </div>
                        <span className="text-[10px] text-[#6d7175] truncate ml-[14px]">{supplier.email || 'No email'}</span>
                    </div>
                </td>
            )}

            {/* Brands */}
            {visibleColumns.includes('brands') && (
                <td className="px-4 py-1">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {supplier.brands?.length > 0 ? (
                            supplier.brands.slice(0, 3).map(brand => (
                                <span key={brand.id} className="px-1.5 py-0.5 bg-[#f1f1f1] text-[#202223] text-[9px] font-bold rounded-[2px] border border-[#ebebeb] whitespace-nowrap uppercase tracking-tight">
                                    {brand.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-[#bababa] italic">No brands associated</span>
                        )}
                        {supplier.brands?.length > 3 && (
                            <span className="text-[9px] font-bold text-[#6d7175] bg-white border border-[#ebebeb] px-1.5 py-0.5 rounded-[2px]">
                                +{supplier.brands.length - 3} more
                            </span>
                        )}
                    </div>
                </td>
            )}

            {/* Phone */}
            {visibleColumns.includes('phone') && (
                <td className="px-4 py-1 text-center">
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#202223] bg-[#f1f1f1] px-2 py-0.5 rounded-[2px] border border-[#ebebeb]">
                        <Phone size={10} />
                        {supplier.phone || 'N/A'}
                    </div>
                </td>
            )}

            {/* Status */}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    <StatusDropdown
                        value={supplier.is_active ? 1 : 0}
                        options={[
                            { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                            { label: 'Inactive', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                        ]}
                        onChange={(newVal) => {
                            router.patch(route('admin.suppliers.status', supplier.id), {
                                status: newVal === 1
                            }, { preserveScroll: true });
                        }}
                        size="xs"
                    />
                </td>
            )}

            {/* Joined Date */}
            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                        <span className="text-[11px] text-[#202223] font-bold">
                            {new Date(supplier.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-[#6d7175]">
                            {new Date(supplier.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                    </div>
                </td>
            )}

            {/* Actions */}
            <td className="px-6 py-1 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route("admin.suppliers.edit", supplier.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#f1f1f1] text-[#202223] border border-[#d1d1d1] rounded-[2px] hover:bg-white hover:border-[#008060] hover:text-[#008060] transition-all shadow-sm"
                        title="Edit Supplier"
                    >
                        <SquarePen size={12} />
                    </Link>
                    <button
                        onClick={() => handleDelete(supplier.id, supplier.name)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all shadow-sm"
                        title="Delete Supplier"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default SupplierRow;
