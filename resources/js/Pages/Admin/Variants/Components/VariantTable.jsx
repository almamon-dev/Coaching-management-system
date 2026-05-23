import React, { useState } from 'react';
import { Boxes, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import VariantRow from './VariantRow';
import VariantSkeleton from './VariantSkeleton';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import Notify from '@/Utils/Notify';
import { router } from '@inertiajs/react';

const VariantTable = ({
    variants, filters, selectedIds, selectAllAcrossPages,
    toggleSelectAll, toggleSelect, handleDelete, isProcessing,
    activeTab, visibleColumns, stats
}) => {
    const isAllOnPageSelected = variants?.data?.length > 0 && selectedIds.length === variants.data.length;
    const shouldShowSkeletons = isProcessing && (stats?.[activeTab] > 0 || stats?.[activeTab] === undefined);

    const [managingOptions, setManagingOptions] = useState(null);
    const [editingVariant, setEditingVariant] = useState(null);
    const [newOption, setNewOption] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, variantId: null, optionId: null });

    const handleUpdateVariant = (id) => {
        if (!editingVariant.name) return;
        router.put(route('admin.variants.update', id), editingVariant, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingVariant(null);
                Notify.success('Variant updated successfully');
            }
        });
    };

    const confirmDeleteOption = (variantId, optionId) => {
        setDeleteModal({ show: true, variantId, optionId });
    };

    const executeDeleteOption = () => {
        if (!deleteModal.variantId || !deleteModal.optionId) return;
        router.delete(route('admin.variants.options.destroy', [deleteModal.variantId, deleteModal.optionId]), {
            preserveScroll: true,
            onSuccess: () => {
                Notify.success('Option deleted successfully');
                setDeleteModal({ show: false, variantId: null, optionId: null });
            }
        });
    };

    const handleAddOption = (variantId) => {
        if (!newOption) return;
        router.post(route('admin.variants.options.store', variantId), { value: newOption }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewOption('');
                Notify.success('Option added successfully');
            }
        });
    };

    return (
        <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#f9fafb] border-b border-[#ebebeb]">
                        <th className="w-10 px-5 py-3">
                            <div className="flex items-center">
                                <button
                                    onClick={toggleSelectAll}
                                    className={cn(
                                        "w-[16px] h-[16px] rounded-[3px] border-[1.5px] flex items-center justify-center transition-colors",
                                        isAllOnPageSelected || selectAllAcrossPages ? "bg-[#008060] border-[#008060]" : "bg-white border-[#8c9196] hover:border-[#202223]"
                                    )}
                                >
                                    {(isAllOnPageSelected || selectAllAcrossPages) && <Check size={10} strokeWidth={4} className="text-white" />}
                                </button>
                            </div>
                        </th>
                        
                        {visibleColumns.includes('variant') && (
                            <th className="px-3 py-3 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider w-1/3">
                                Variant Details
                            </th>
                        )}
                        
                        {visibleColumns.includes('type') && (
                            <th className="px-3 py-3 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">
                                Input Type
                            </th>
                        )}
                        
                        {visibleColumns.includes('options') && (
                            <th className="px-3 py-3 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">
                                Predefined Options
                            </th>
                        )}
                        
                        {visibleColumns.includes('status') && (
                            <th className="px-3 py-3 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">
                                Status
                            </th>
                        )}

                        <th className="px-5 py-3 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] bg-white">
                    {shouldShowSkeletons ? (
                        Array.from({ length: variants?.data?.length > 0 ? variants.data.length : 5 }).map((_, i) => (
                            <VariantSkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : variants?.data?.length > 0 ? (
                        variants.data.map((variant) => (
                            <VariantRow
                                key={variant.id}
                                variant={variant}
                                isSelected={selectAllAcrossPages || selectedIds.includes(variant.id)}
                                toggleSelect={toggleSelect}
                                handleDelete={handleDelete}
                                visibleColumns={visibleColumns}
                                managingOptions={managingOptions}
                                setManagingOptions={setManagingOptions}
                                editingVariant={editingVariant}
                                setEditingVariant={setEditingVariant}
                                handleUpdateVariant={handleUpdateVariant}
                                confirmDeleteOption={confirmDeleteOption}
                                newOption={newOption}
                                setNewOption={setNewOption}
                                handleAddOption={handleAddOption}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-5 py-16 text-center">
                                <div className="flex flex-col items-center justify-center text-[#6d7175]">
                                    <div className="w-12 h-12 rounded-full bg-[#f6f6f7] flex items-center justify-center mb-3">
                                        <Boxes size={24} className="text-[#bababa]" />
                                    </div>
                                    <p className="text-[14px] font-bold text-[#202223] mb-1">
                                        {filters?.search ? 'No variants match your search' : 'No variants found'}
                                    </p>
                                    <p className="text-[13px]">
                                        {filters?.search 
                                            ? 'Try adjusting your search or filters to find what you are looking for.' 
                                            : 'Create a variant like "Weight" or "Size" to get started.'}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <DeleteConfirmModal 
                show={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, variantId: null, optionId: null })}
                onConfirm={executeDeleteOption}
                title="Delete Option"
                message="Are you sure you want to delete this predefined option? This action cannot be undone."
            />
        </div>
    );
};

export default VariantTable;
