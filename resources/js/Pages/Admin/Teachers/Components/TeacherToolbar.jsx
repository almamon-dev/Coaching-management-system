import React, { useState } from 'react';
import { Search, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import SelectInput from "@/Components/Form/SelectInput";
import TextInput from "@/Components/Form/TextInput";
import { cn } from '@/lib/utils';
import TeacherBulkActionBar from './TeacherBulkActionBar';
import ColumnManager from '../../AcademicClasses/Components/ColumnManager';

const TeacherToolbar = ({
    search,
    setSearch,
    filters,
    handleFilterChange,
    handleReset,
    selectedIds,
    selectAllAcrossPages,
    totalCount,
    perPageCount,
    handleClearSelection,
    handleBulkDeleteClick,
    handleSelectAllAcrossPages,
    showOnlySelected,
    setShowOnlySelected,
    allColumns,
    visibleColumns,
    toggleColumn,
    departments = [],
    designations = []
}) => {
    const [showAdvanced, setShowAdvanced] = useState(
        filters?.department || filters?.designation ? true : false
    );
    const activeFilterCount = (filters?.department ? 1 : 0) + (filters?.designation ? 1 : 0);

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {selectedIds.length > 0 && (
                <TeacherBulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    selectAllAcrossPages={selectAllAcrossPages}
                    onClear={handleClearSelection}
                    onBulkDelete={handleBulkDeleteClick}
                    onSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                />
            )}

            <div className={cn(
                "p-3 flex items-center justify-between gap-4 transition-opacity duration-200",
                selectedIds.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search teacher by name or ID..."
                        className="pl-9 pr-9 w-full"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors border-none bg-transparent cursor-pointer">
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={cn(
                                "h-[32px] px-3 rounded-[3px] border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer outline-none",
                                showAdvanced || activeFilterCount > 0
                                    ? "bg-[#e4f1ef] border-[#008060] text-[#008060]"
                                    : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]"
                            )}
                        >
                            <SlidersHorizontal size={14} />
                            Filters
                        </button>

                        <button
                            onClick={handleReset}
                            className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer"
                            title="Reset Filters"
                        >
                            <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                        </button>

                        <div className="w-[1px] h-4 bg-[#ebebeb] mx-1" />

                        <ColumnManager
                            columns={allColumns}
                            visibleColumns={visibleColumns}
                            toggleColumn={toggleColumn}
                        />
                    </div>
                </div>
            </div>
            
            {showAdvanced && (
                <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in slide-in-from-top-1 duration-150 border-t border-[#ebebeb] pt-3 bg-[#f9fafb]">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                        <SelectInput
                            value={filters?.department || ''}
                            onChange={(e) => handleFilterChange('department', e.target.value)}
                            options={[{ id: '', name: 'All Departments' }, ...departments]}
                            placeholder="Select department..."
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                        <SelectInput
                            value={filters?.designation || ''}
                            onChange={(e) => handleFilterChange('designation', e.target.value)}
                            options={[{ id: '', name: 'All Designations' }, ...designations]}
                            placeholder="Select designation..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherToolbar;
