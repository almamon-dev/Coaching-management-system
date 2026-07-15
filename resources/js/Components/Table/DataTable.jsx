import React, { useState } from 'react';
import { Check } from 'lucide-react';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';
import { cn } from '@/lib/utils';
import BulkActionBar from '@/Components/Table/BulkActionBar';
import Pagination from '@/Components/Table/Pagination';
import Toolbar from '@/Components/Table/Toolbar';
import TableEmptyState from '@/Components/Table/TableEmptyState';
import TableSkeleton from '@/Components/Table/TableSkeleton';

export default function DataTable({ 
    columns, 
    data, 
    pagination, 
    tabs, 
    selectable = false, 
    itemNoun = 'items', 
    onConfirmDelete, 
    onShowSelection,
    advancedFilters = null,
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search...",
    isLoading = false,
    headerContent = null
}) {
    const [internalSearch, setInternalSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    // Default to showing all columns if no visibleColumns logic is provided externally
    // But since the user wants a column manager, we manage it here internally
    const [visibleColumns, setVisibleColumns] = useState(columns.map(c => c.accessor).filter(Boolean));

    const activeSearch = searchQuery !== undefined ? searchQuery : internalSearch;
    const handleSearch = (val) => {
        if (onSearchChange) onSearchChange(val);
        else setInternalSearch(val);
    };

    const handleSelectAll = () => {
        if (selectedIds.length === (data?.length || 0) && data?.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map((row, i) => row.id || i));
        }
    };

    const handleSelectRow = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleColumn = (accessor) => {
        setVisibleColumns(prev => 
            prev.includes(accessor) 
                ? prev.filter(col => col !== accessor)
                : [...prev, accessor]
        );
    };

    const activeColumns = columns.filter(col => visibleColumns.includes(col.accessor) || !col.accessor);
    const totalCount = pagination?.meta?.total || pagination?.total || (data?.length || 0);

    return (
        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
            {headerContent}
            
            {/* Optional Tabs */}
            {tabs && tabs.length > 0 && (
                <div className="flex items-center gap-6 px-4 border-b border-[#ebebeb] bg-white overflow-x-auto custom-scrollbar pt-2">
                    {tabs.map((tab, index) => (
                        <button 
                            key={index}
                            onClick={() => tab.onClick && tab.onClick()}
                            className={cn(
                                "flex items-center gap-2 pb-3 border-b-2 text-[13px] font-bold transition-colors whitespace-nowrap cursor-pointer",
                                tab.active 
                                    ? "border-[#008060] text-[#008060]" 
                                    : "border-transparent text-[#6d7175] hover:text-[#202223]"
                            )}
                        >
                            {tab.name}
                            {tab.count !== undefined && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[11px] font-bold",
                                    tab.active ? "bg-[#e4f1ef] text-[#008060]" : "bg-[#ebebeb] text-[#6d7175]"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Dynamic Toolbar */}
            <div className="relative border-b border-[#ebebeb] bg-white z-30 min-h-[56px] flex flex-col justify-center">
                {selectedIds.length > 0 ? (
                    <BulkActionBar 
                        selectedCount={selectedIds.length}
                        totalCount={totalCount}
                        itemNoun={itemNoun}
                        onClear={() => setSelectedIds([])}
                        onDelete={() => setIsDeleteModalOpen(true)}
                        onShowSelected={() => onShowSelection && onShowSelection(selectedIds)}
                        selectAllAcrossPages={false}
                        onSelectAllAcrossPages={null}
                    />
                ) : (
                    <Toolbar 
                        searchQuery={activeSearch}
                        onSearchChange={handleSearch}
                        searchPlaceholder={searchPlaceholder}
                        advancedFilters={advancedFilters}
                        showAdvanced={showAdvanced}
                        setShowAdvanced={setShowAdvanced}
                        onRefresh={() => {}}
                        columns={columns}
                        visibleColumns={visibleColumns}
                        toggleColumn={toggleColumn}
                    />
                )}
                
                {showAdvanced && advancedFilters && !selectedIds.length && (
                    <div className="px-3 pb-3 animate-in slide-in-from-top-1 duration-150 border-t border-[#ebebeb] pt-3 bg-[#f9fafb]">
                        {advancedFilters}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar relative h-auto">
                <table className="w-full min-w-[800px] border-collapse text-left">
                    <thead>
                        <tr className="bg-[#f4f6f8]">
                            {selectable && (
                                <th className="py-2 px-3 w-[48px] text-center select-none text-[#6d7175] bg-[#f4f6f8] border-b-0">
                                    <div
                                        onClick={handleSelectAll}
                                        className={cn(
                                            "w-[16px] h-[16px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center select-none",
                                            data && data.length > 0 && selectedIds.length === data.length
                                                ? "bg-[#008060] border-[#008060]"
                                                : "bg-white border-[#d1d1d1]"
                                        )}
                                    >
                                        {data && data.length > 0 && selectedIds.length === data.length && (
                                            <Check size={12} strokeWidth={3} className="text-white" />
                                        )}
                                    </div>
                                </th>
                            )}
                            {activeColumns.map((col, index) => (
                                <th key={index} className={cn(
                                    "py-2 px-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] border-b-0",
                                    col.className
                                )}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebebeb]">
                        {isLoading ? (
                            <TableSkeleton columns={activeColumns} rowCount={5} selectable={selectable} />
                        ) : data && data.length > 0 ? (
                            data.map((row, rowIndex) => {
                                const rowId = row.id || rowIndex;
                                const isSelected = selectedIds.includes(rowId);
                                
                                return (
                                    <tr 
                                        key={rowIndex} 
                                        className={cn(
                                            "border-b border-[#ebebeb] hover:bg-slate-50/40 transition-colors",
                                            isSelected && "bg-[#f0f9f7]/50"
                                        )}
                                    >
                                        {selectable && (
                                            <td className="py-1 px-3 text-center select-none">
                                                <div
                                                    onClick={() => handleSelectRow(rowId)}
                                                    className={cn(
                                                        "w-[16px] h-[16px] border-[1.5px] rounded-[3px] mx-auto transition-all flex items-center justify-center select-none cursor-pointer",
                                                        isSelected
                                                            ? "bg-[#008060] border-[#008060]"
                                                            : "bg-white border-[#d1d1d1] hover:border-slate-400"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <Check size={12} strokeWidth={3} className="text-white" />
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                        {activeColumns.map((col, colIndex) => (
                                            <td key={colIndex} className="py-1.5 px-3">
                                                {col.cell ? col.cell(row, {
                                                    deleteRow: () => {
                                                        setSelectedIds([rowId]);
                                                        setIsDeleteModalOpen(true);
                                                    }
                                                }, rowIndex) : row[col.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <TableEmptyState 
                                colSpan={selectable ? activeColumns.length + 1 : activeColumns.length} 
                                title={`No ${itemNoun} found`} 
                            />
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination */}
            <Pagination pagination={pagination} />

            {/* Built-in Delete Modal */}
            <DeleteConfirmModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    if (onConfirmDelete) {
                        onConfirmDelete(selectedIds, () => {
                            setIsDeleteModalOpen(false);
                            setSelectedIds([]);
                        });
                    } else {
                        setIsDeleteModalOpen(false);
                        setSelectedIds([]);
                    }
                }}
                title={selectedIds.length > 1 ? `Delete Selected ${itemNoun.charAt(0).toUpperCase() + itemNoun.slice(1)}` : `Delete ${itemNoun.charAt(0).toUpperCase() + itemNoun.slice(1).replace(/s$/, '')}`}
                message={`Are you sure you want to delete ${selectedIds.length > 1 ? `these ${selectedIds.length} ${itemNoun}` : `this ${itemNoun.replace(/s$/, '')}`}? This action is permanent and all data will be removed.`}
                processing={false}
            />
        </div>
    );
}
