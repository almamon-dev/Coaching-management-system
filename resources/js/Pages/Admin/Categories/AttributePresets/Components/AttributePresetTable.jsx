import React from 'react';
import { Sparkles } from 'lucide-react';
import AttributePresetRow from './AttributePresetRow';
import AttributePresetSkeleton from './AttributePresetSkeleton';
import { cn } from '@/lib/utils';

const AttributePresetTable = ({ 
    presets, 
    selectedIds, 
    toggleSelectAll, 
    toggleSelect, 
    handleDelete,
    isProcessing,
    visibleColumns = []
}) => {
    const presetsData = presets?.data || [];
    const isAllSelected = presetsData.length > 0 && selectedIds.length === presetsData.length;

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div className="flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060] focus:ring-offset-0 cursor-pointer"
                                />
                            </div>
                        </th>
                        {visibleColumns.includes('name') && <th className="px-4 py-2.5 w-[300px]">Preset Name</th>}
                        {visibleColumns.includes('slug') && <th className="px-4 py-2.5 w-[200px]">Slug</th>}
                        {visibleColumns.includes('fields') && <th className="px-4 py-2.5 text-center w-[120px]">Fields</th>}
                        {visibleColumns.includes('created_at') && <th className="px-4 py-2.5 w-[160px]">Created</th>}
                        <th className="px-6 py-2.5 text-right w-[120px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {isProcessing ? (
                        <AttributePresetSkeleton visibleColumns={visibleColumns} />
                    ) : presetsData.length > 0 ? (
                        presetsData.map((preset) => (
                            <AttributePresetRow
                                key={preset.id}
                                preset={preset}
                                isSelected={selectedIds.includes(preset.id)}
                                onToggle={() => toggleSelect(preset.id)}
                                onDelete={handleDelete}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center">
                                <div className="flex flex-col items-center justify-center text-[#727586]">
                                    <Sparkles size={40} className="mb-4 text-[#c3c4ca]" />
                                    <p className="text-lg font-bold">No presets found</p>
                                    <p className="text-sm">Try refining your search or create a new preset.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttributePresetTable;
