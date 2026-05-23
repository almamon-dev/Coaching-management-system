import React, { useState } from 'react';
import { Edit, Trash2, Tag, Check, X, Settings2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/StatusDropdown';
import TextInput from '@/Components/TextInput';
import { router } from '@inertiajs/react';

const VariantRow = ({ 
    variant, isSelected, toggleSelect, handleDelete, visibleColumns, 
    managingOptions, setManagingOptions,
    editingVariant, setEditingVariant,
    handleUpdateVariant, confirmDeleteOption,
    newOption, setNewOption, handleAddOption
}) => {
    
    const handleStatusChange = (statusValue) => {
        router.patch(route('admin.variants.status', variant.id), {
            is_active: statusValue
        }, { preserveScroll: true });
    };

    return (
        <React.Fragment>
            <tr className={cn(
                "group transition-colors h-auto",
                isSelected ? "bg-[#f0f9f7]" : "hover:bg-[#f6f6f7]",
                managingOptions === variant.id ? "bg-[#f4f6f8] border-b-0" : ""
            )}>
                {/* Checkbox */}
                <td className="w-10 px-5 py-2">
                    <div className="flex items-center">
                        <button
                            onClick={() => toggleSelect(variant.id)}
                            className={cn(
                                "w-[16px] h-[16px] rounded-[3px] border-[1.5px] flex items-center justify-center transition-colors group-hover:border-[#8c9196]",
                                isSelected ? "bg-[#008060] border-[#008060] group-hover:border-[#008060]" : "bg-white border-[#d2d5d8]"
                            )}
                        >
                            {isSelected && <Check size={10} strokeWidth={4} className="text-white" />}
                        </button>
                    </div>
                </td>

                {/* Variant Details */}
                {visibleColumns.includes('variant') && (
                    <td className="px-3 py-2">
                        {editingVariant?.id === variant.id ? (
                            <div className="flex items-center gap-2">
                                <TextInput 
                                    value={editingVariant.name}
                                    onChange={e => setEditingVariant({ ...editingVariant, name: e.target.value })}
                                    className="max-w-xs"
                                    autoFocus
                                />
                                <button onClick={() => handleUpdateVariant(variant.id)} className="text-[#008060] hover:bg-[#e4f1ef] p-1 rounded">
                                    <Save size={14} />
                                </button>
                                <button onClick={() => setEditingVariant(null)} className="text-[#6d7175] hover:bg-[#ebebeb] p-1 rounded">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-[4px] bg-white border border-[#ebebeb] flex items-center justify-center shadow-sm shrink-0">
                                    <Tag size={14} className="text-[#8c9196]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-[#202223] truncate max-w-[200px]">
                                        {variant.name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </td>
                )}

                {/* Type */}
                {visibleColumns.includes('type') && (
                    <td className="px-3 py-2">
                        <span className="px-2.5 py-0.5 bg-[#f1f1f1] text-[#202223] border border-[#ebebeb] rounded-full text-[11px] font-bold capitalize">
                            {variant.type}
                        </span>
                    </td>
                )}

                {/* Options Count */}
                {visibleColumns.includes('options') && (
                    <td className="px-3 py-2">
                        <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px]",
                            variant.options_count > 0 ? "bg-[#e4f1ef] text-[#008060] border border-[#d1e9e5]" : "text-[#bababa] bg-[#f6f6f7]"
                        )}>
                            {variant.options_count} {variant.options_count === 1 ? 'Option' : 'Options'}
                        </span>
                    </td>
                )}

                {/* Status */}
                {visibleColumns.includes('status') && (
                    <td className="px-3 py-2">
                        <div onClick={e => e.stopPropagation()}>
                            <StatusDropdown 
                                value={variant.status}
                                options={[
                                    { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                                    { label: 'Inactive', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                                ]}
                                onChange={handleStatusChange}
                            />
                        </div>
                    </td>
                )}

                <td className="px-5 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                        <button 
                            onClick={() => setManagingOptions(managingOptions === variant.id ? null : variant.id)}
                            className={cn(
                                "h-[26px] px-2.5 flex items-center justify-center rounded-[2px] text-[11px] font-bold transition-all gap-1.5",
                                managingOptions === variant.id 
                                    ? "bg-[#202223] text-white" 
                                    : "bg-white text-[#202223] border border-[#d2d5d8] hover:bg-[#f9fafb]"
                            )}
                        >
                            <Settings2 size={12} /> {managingOptions === variant.id ? 'Close' : 'Manage'}
                        </button>
                        <button 
                            onClick={() => setEditingVariant({ id: variant.id, name: variant.name, type: variant.type })}
                            className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                            title="Edit Variant"
                        >
                            <Edit size={12} />
                        </button>
                        <button 
                            onClick={() => handleDelete(variant.id, variant.name)}
                            className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                            title="Delete Variant"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Expanded Options Management */}
            {managingOptions === variant.id && (
                <tr className="bg-[#f4f6f8] border-b border-[#ebebeb] shadow-inner">
                    <td colSpan={visibleColumns.length + 2} className="px-[52px] py-4">
                        <div className="flex flex-col gap-3 bg-white p-4 rounded-[6px] border border-[#d2d5d8] shadow-sm">
                            <span className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">
                                Predefined Options for <span className="text-[#202223]">{variant.name}</span>
                            </span>
                            
                            <div className="flex flex-wrap gap-2 min-h-[32px]">
                                {variant.options?.map(opt => (
                                    <div key={opt.id} className="flex items-center gap-1.5 bg-[#f9fafb] border border-[#d2d5d8] pl-2 pr-1 py-1 rounded-[4px] group/opt hover:border-[#008060]/30 transition-all shadow-sm">
                                        <span className="text-[12px] font-bold text-[#202223]">{opt.value}</span>
                                        <button 
                                            onClick={() => confirmDeleteOption(variant.id, opt.id)}
                                            className="w-[18px] h-[18px] flex items-center justify-center text-[#bababa] hover:text-[#ff4d4f] hover:bg-[#ff4d4f]/10 rounded-[3px] transition-all"
                                        >
                                            <X size={12} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))}
                                {(!variant.options || variant.options.length === 0) && (
                                    <span className="text-[12px] text-[#6d7175] italic py-1.5 flex items-center gap-2">
                                        <Tag size={14}/> No options added yet. Type below to add one.
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 w-full max-w-md pt-3 border-t border-[#ebebeb]">
                                <TextInput 
                                    value={newOption}
                                    onChange={e => setNewOption(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddOption(variant.id)}
                                    placeholder={`Add option (e.g. ${variant.name === 'Weight' ? '500g' : variant.name === 'Size' ? 'XL' : 'Red'})...`}
                                    className="flex-1"
                                />
                                <button 
                                    onClick={() => handleAddOption(variant.id)}
                                    className="h-[32px] px-4 bg-[#008060] text-white rounded-[4px] text-[12px] font-bold hover:bg-[#006e52] transition-all shadow-sm flex items-center gap-1.5"
                                >
                                    <Check size={14}/> Add Option
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

export default VariantRow;
