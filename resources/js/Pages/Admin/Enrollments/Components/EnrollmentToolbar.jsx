import React, { useState } from 'react';
import { Search, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import SelectInput from '@/Components/Form/SelectInput';
import TextInput from '@/Components/Form/TextInput';
import { cn } from '@/lib/utils';
import StudentBulkActionBar from '../../Students/Components/StudentBulkActionBar';
import ColumnManager from '../../AcademicClasses/Components/ColumnManager';

const EnrollmentToolbar = ({
    search,
    setSearch,
    filters,
    handleFilterChange,
    handleReset,
    sessions,
    classes,
    sections,
    totalCount,
    selectedIds,
    selectAllAcrossPages,
    perPageCount,
    handleClearSelection,
    handleBulkDeleteClick,
    handleSelectAllAcrossPages,
    showOnlySelected,
    setShowOnlySelected,
    allColumns,
    visibleColumns,
    toggleColumn
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    // Check if any advanced filter is active
    const activeFilterCount = [filters?.session_id, filters?.class_id, filters?.section_id, filters?.status].filter(Boolean).length;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30 rounded-t-[4px]">
            {/* Bulk Action Bar Overlay (Floating Design) */}
            {selectedIds?.length > 0 && (
                <StudentBulkActionBar
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
                selectedIds?.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                {/* --- Search Box --- */}
                <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ID or Name..."
                        className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none w-full"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors border-none bg-transparent cursor-pointer">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* --- Filters Group --- */}
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={cn(
                            "h-[32px] px-3 rounded-[3px] border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-white outline-none",
                            showAdvanced || activeFilterCount > 0
                                ? "bg-[#e4f1ef] border-[#008060] text-[#008060]"
                                : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]"
                        )}
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 w-4 h-4 rounded-full bg-[#008060] text-white flex items-center justify-center text-[10px] leading-none">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleReset}
                        className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer"
                        title="Reset Filters"
                    >
                        <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    </button>

                    <div className="w-[1px] h-4 bg-[#ebebeb] mx-1" />

                    {/* Column Management */}
                    <ColumnManager
                        columns={allColumns}
                        visibleColumns={visibleColumns}
                        toggleColumn={toggleColumn}
                    />
                </div>
            </div>

            {/* Advanced Filters Drawer */}
            {showAdvanced && (
                <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in slide-in-from-top-1 duration-150 border-t border-[#ebebeb] pt-3 bg-[#f9fafb]">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Session</label>
                        <SelectInput
                            value={filters?.session_id || ''}
                            onChange={(e) => handleFilterChange('session_id', e.target.value)}
                            options={[
                                { id: '', name: 'All Sessions' },
                                ...sessions.map(s => ({ id: s.id, name: s.name }))
                            ]}
                            className="h-[32px] text-[12px]"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Class</label>
                        <SelectInput
                            value={filters?.class_id || ''}
                            onChange={(e) => handleFilterChange('class_id', e.target.value)}
                            options={[
                                { id: '', name: 'All Classes' },
                                ...classes.map(c => ({ id: c.id, name: c.name }))
                            ]}
                            className="h-[32px] text-[12px]"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Section</label>
                        <SelectInput
                            value={filters?.section_id || ''}
                            onChange={(e) => handleFilterChange('section_id', e.target.value)}
                            options={[
                                { id: '', name: 'All Sections' },
                                ...sections
                                    .filter(s => filters?.class_id ? s.academic_class_id == filters.class_id : true)
                                    .map(s => ({ id: s.id, name: s.name }))
                            ]}
                            className="h-[32px] text-[12px]"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Status</label>
                        <SelectInput
                            value={filters?.status ?? 'active'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            options={[
                                { id: '', name: 'All Status' },
                                { id: 'active', name: 'Active' },
                                { id: 'promoted', name: 'Promoted' },
                                { id: 'graduated', name: 'Graduated' },
                                { id: 'transferred', name: 'Transferred' },
                                { id: 'failed', name: 'Failed' },
                            ]}
                            className="h-[32px] text-[12px]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnrollmentToolbar;
