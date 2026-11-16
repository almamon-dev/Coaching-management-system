import React, { useState, useMemo, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';
import { cn } from '@/lib/utils';
import BulkActionBar from '@/Components/Table/BulkActionBar';
import Pagination from '@/Components/Table/Pagination';
import Toolbar from '@/Components/Table/Toolbar';
import TableEmptyState from '@/Components/Table/TableEmptyState';
import TableSkeleton from '@/Components/Table/TableSkeleton';

export default function DataTable({
    columns = [],
    data = [],
    pagination,
    tabs,
    selectable = false,
    itemNoun = 'items',
    onConfirmDelete,
    onShowSelection,
    advancedFilters = null,
    searchQuery,
    onSearchChange,
    searchPlaceholder = 'Search...',
    isLoading = false,
    headerContent = null,
    compact = false,
    hideToolbar = false,
    hidePagination = false,
    onRefresh,
    isRefreshing = false,
    onRowClick,
}) {
    const [internalSearch, setInternalSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [clientPage, setClientPage] = useState(1);
    const [clientPerPage, setClientPerPage] = useState(10);

    const getColKey = (col, idx) => col.id || col.accessor || `col_${idx}`;
    const getColLabel = (col) => col.label || col.header || '';

    const normalizedColumns = useMemo(
        () =>
            columns.map((col, idx) => ({
                ...col,
                _key: getColKey(col, idx),
                _label: getColLabel(col),
            })),
        [columns]
    );

    const [orderedColumnIds, setOrderedColumnIds] = useState(() =>
        normalizedColumns.map((c) => c._key)
    );
    const [visibleColumns, setVisibleColumns] = useState(() =>
        normalizedColumns.map((c) => c._key)
    );

    // Sync columns if props change
    useEffect(() => {
        const keys = normalizedColumns.map((c) => c._key);
        setOrderedColumnIds((prev) => {
            const validPrev = prev.filter((k) => keys.includes(k));
            const newKeys = keys.filter((k) => !validPrev.includes(k));
            return [...validPrev, ...newKeys];
        });
        setVisibleColumns((prev) => {
            const validPrev = prev.filter((k) => keys.includes(k));
            const newKeys = keys.filter((k) => !validPrev.includes(k));
            return prev.length === 0 ? keys : [...validPrev, ...newKeys];
        });
    }, [columns]);

    const currentColumns = useMemo(() => {
        return orderedColumnIds
            .map((key) => normalizedColumns.find((c) => c._key === key))
            .filter(Boolean);
    }, [orderedColumnIds, normalizedColumns]);

    const activeColumns = useMemo(
        () =>
            currentColumns.filter(
                (col) => visibleColumns.includes(col._key) || col._key === 'actions'
            ),
        [currentColumns, visibleColumns]
    );

    const activeSearch = searchQuery !== undefined ? searchQuery : internalSearch;
    const handleSearch = (val) => {
        setClientPage(1);
        if (onSearchChange) onSearchChange(val);
        else setInternalSearch(val);
    };

    const handleSort = (colKey) => {
        if (sortKey === colKey) {
            setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(colKey);
            setSortDir('asc');
        }
    };

    // Sort rows (for current dataset)
    const sortedData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        if (!sortKey) return data;

        return [...data].sort((a, b) => {
            const aVal = a?.[sortKey];
            const bVal = b?.[sortKey];
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            const aNum = Number(aVal);
            const bNum = Number(bVal);
            if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aVal !== '' && bVal !== '') {
                return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
            }
            const comparison = String(aVal).localeCompare(String(bVal), undefined, {
                numeric: true,
                sensitivity: 'base',
            });
            return sortDir === 'asc' ? comparison : -comparison;
        });
    }, [data, sortKey, sortDir]);

    // Client-side pagination when no server paginator is provided
    const isClientPaginated = !pagination && !hidePagination;
    const totalClientItems = sortedData.length;
    const totalClientPages = Math.max(1, Math.ceil(totalClientItems / clientPerPage));
    const safeClientPage = Math.min(clientPage, totalClientPages);
    const clientStartIdx = (safeClientPage - 1) * clientPerPage;

    const displayedData = isClientPaginated
        ? sortedData.slice(clientStartIdx, clientStartIdx + clientPerPage)
        : sortedData;

    const handleSelectAll = () => {
        if (selectedIds.length === displayedData.length && displayedData.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(displayedData.map((row, i) => row.id ?? i));
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleColumn = (colKey) => {
        setVisibleColumns((prev) =>
            prev.includes(colKey) ? prev.filter((c) => c !== colKey) : [...prev, colKey]
        );
    };

    const handleResetColumns = () => {
        const allKeys = normalizedColumns.map((c) => c._key);
        setOrderedColumnIds(allKeys);
        setVisibleColumns(allKeys);
    };

    const handleDefaultRefresh = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            router.reload({ preserveState: true, preserveScroll: true });
        }
    };

    const headerCheckboxRef = useRef(null);
    const isAllSelected =
        displayedData.length > 0 && selectedIds.length === displayedData.length;
    const isSomeSelected =
        selectedIds.length > 0 && selectedIds.length < displayedData.length;

    useEffect(() => {
        if (headerCheckboxRef.current) {
            headerCheckboxRef.current.indeterminate = isSomeSelected;
        }
    }, [isSomeSelected, isAllSelected]);

    const totalCount =
        pagination?.meta?.total || pagination?.total || sortedData.length;

    const rowHeightClass = compact ? 'min-h-[32px]' : 'min-h-[38px]';
    const cellPaddingClass = compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs';

    return (
        <div className="bg-white rounded-[3px] border border-slate-200 shadow-none">
            {headerContent}

            {/* Optional Tabs */}
            {tabs && tabs.length > 0 && (
                <div className="flex items-center gap-6 px-3.5 pt-2 border-b border-[#ebebeb] bg-white overflow-x-auto custom-scrollbar">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => tab.onClick && tab.onClick()}
                            className={cn(
                                'flex items-center gap-2 pb-2.5 border-b-2 text-[12.5px] font-bold transition-colors whitespace-nowrap cursor-pointer',
                                tab.active
                                    ? 'border-[#16a34a] text-[#16a34a]'
                                    : 'border-transparent text-slate-500 hover:text-slate-900'
                            )}
                        >
                            {tab.name}
                            {tab.count !== undefined && (
                                <span
                                    className={cn(
                                        'px-1.5 py-0.5 rounded-full text-[11px] font-bold',
                                        tab.active
                                            ? 'bg-emerald-50 text-[#16a34a]'
                                            : 'bg-slate-100 text-slate-600'
                                    )}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* CarrierDirect-style Toolbar + Bulk Action Overlay */}
            {!hideToolbar && (
                <div className="relative border-b border-[#ebebeb] bg-white z-20">
                    {selectedIds.length > 0 && (
                        <BulkActionBar
                            selectedCount={selectedIds.length}
                            totalCount={totalCount}
                            itemNoun={itemNoun}
                            onClear={() => setSelectedIds([])}
                            onDelete={
                                onConfirmDelete ? () => setIsDeleteModalOpen(true) : undefined
                            }
                            onShowSelected={
                                onShowSelection ? () => onShowSelection(selectedIds) : undefined
                            }
                            selectAllAcrossPages={false}
                            onSelectAllAcrossPages={null}
                        />
                    )}

                    <div
                        className={
                            selectedIds.length > 0
                                ? 'opacity-0 pointer-events-none'
                                : 'opacity-100'
                        }
                    >
                        <Toolbar
                            searchQuery={activeSearch}
                            onSearchChange={handleSearch}
                            searchPlaceholder={searchPlaceholder}
                            advancedFilters={advancedFilters}
                            showAdvanced={showAdvanced}
                            setShowAdvanced={setShowAdvanced}
                            onRefresh={handleDefaultRefresh}
                            isRefreshing={isRefreshing}
                            columns={normalizedColumns}
                            visibleColumns={visibleColumns}
                            toggleColumn={toggleColumn}
                            onResetColumns={handleResetColumns}
                        />
                    </div>
                </div>
            )}

            {/* Collapsible Filters Panel */}
            {showAdvanced && advancedFilters && selectedIds.length === 0 && (
                <div className="p-4 border-b border-[#ebebeb] bg-[#fcfcfc] animate-in slide-in-from-top-2 duration-200">
                    {advancedFilters}
                </div>
            )}

            {/* Table Area */}
            {displayedData.length === 0 && !isLoading ? (
                <TableEmptyState title={`No ${itemNoun} found`} />
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/90 text-[11.5px] font-semibold text-slate-500 whitespace-nowrap select-none">
                                {selectable && (
                                    <th className={`${compact ? 'px-2 py-2' : 'px-3.5 py-3'} w-[36px]`}>
                                        <div className="flex items-center justify-center">
                                            <input
                                                ref={headerCheckboxRef}
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                                className="table-checkbox cursor-pointer"
                                                title={
                                                    isAllSelected
                                                        ? 'Deselect all on this page'
                                                        : 'Select all on this page'
                                                }
                                                aria-label="Select all on this page"
                                            />
                                        </div>
                                    </th>
                                )}

                                {activeColumns.map((col) => {
                                    const isSortable =
                                        col.sortable !== false &&
                                        col._key !== 'actions' &&
                                        Boolean(col.accessor);
                                    const isCentered =
                                        col.className?.includes('text-center') ||
                                        col.className?.includes('justify-center');
                                    const isRight =
                                        col.className?.includes('text-right') ||
                                        col.className?.includes('justify-end');

                                    return (
                                        <th
                                            key={col._key}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('text/plain', col._key);
                                            }}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const draggedId = e.dataTransfer.getData('text/plain');
                                                if (draggedId && draggedId !== col._key) {
                                                    const order = currentColumns.map((c) => c._key);
                                                    const fromIndex = order.indexOf(draggedId);
                                                    const toIndex = order.indexOf(col._key);
                                                    if (fromIndex !== -1 && toIndex !== -1) {
                                                        const newOrder = [...order];
                                                        const [removed] = newOrder.splice(fromIndex, 1);
                                                        newOrder.splice(toIndex, 0, removed);
                                                        setOrderedColumnIds(newOrder);
                                                    }
                                                }
                                            }}
                                            onClick={() => isSortable && handleSort(col.accessor)}
                                            className={cn(
                                                compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5',
                                                'font-semibold text-slate-600 text-[11px]',
                                                col.className,
                                                isSortable && 'cursor-pointer hover:text-slate-900'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex items-center gap-1',
                                                    isCentered
                                                        ? 'justify-center'
                                                        : isRight
                                                        ? 'justify-end'
                                                        : 'justify-start'
                                                )}
                                            >
                                                <span>{col._label}</span>
                                                {isSortable && sortKey === col.accessor ? (
                                                    sortDir === 'asc' ? (
                                                        <ChevronUp size={12} className="text-[#16a34a]" />
                                                    ) : (
                                                        <ChevronDown size={12} className="text-[#16a34a]" />
                                                    )
                                                ) : isSortable ? (
                                                    <ChevronsUpDown
                                                        size={12}
                                                        className="text-slate-400 opacity-50"
                                                    />
                                                ) : null}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200/90 bg-white">
                            {isLoading ? (
                                <TableSkeleton
                                    columns={activeColumns}
                                    rowCount={5}
                                    selectable={selectable}
                                />
                            ) : (
                                displayedData.map((row, rowIndex) => {
                                    const rowId = row.id ?? rowIndex;
                                    const isSelected = selectedIds.includes(rowId);

                                    return (
                                        <tr
                                            key={rowId}
                                            onClick={(e) => {
                                                if (
                                                    e.target.closest(
                                                        'button, a, input, select, [role="button"], [data-no-click]'
                                                    )
                                                ) {
                                                    return;
                                                }
                                                if (onRowClick) onRowClick(row);
                                            }}
                                            className={cn(
                                                'transition-colors group',
                                                rowHeightClass,
                                                isSelected
                                                    ? 'bg-emerald-50/40'
                                                    : 'hover:bg-slate-50/70',
                                                onRowClick && 'cursor-pointer'
                                            )}
                                        >
                                            {selectable && (
                                                <td
                                                    className={`${cellPaddingClass} w-[36px] min-w-[36px] max-w-[36px] whitespace-nowrap`}
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectRow(rowId);
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="table-checkbox"
                                                        />
                                                    </div>
                                                </td>
                                            )}

                                            {activeColumns.map((col) => {
                                                return (
                                                    <td
                                                        key={col._key}
                                                        className={cn(
                                                            cellPaddingClass,
                                                            'whitespace-nowrap text-xs font-medium text-slate-800',
                                                            col.className
                                                        )}
                                                    >
                                                        {col.cell
                                                            ? col.cell(
                                                                  row,
                                                                  {
                                                                      deleteRow: () => {
                                                                          setSelectedIds([rowId]);
                                                                          setIsDeleteModalOpen(true);
                                                                      },
                                                                  },
                                                                  rowIndex
                                                              )
                                                            : col.render
                                                            ? col.render(row, rowIndex)
                                                            : row[col.accessor]}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Footer Pagination */}
            {!hidePagination &&
                (pagination ? (
                    <Pagination pagination={pagination} itemLabel={itemNoun} />
                ) : (
                    totalClientItems > 0 && (
                        <Pagination
                            total={totalClientItems}
                            fromIdx={clientStartIdx + 1}
                            toIdx={Math.min(clientStartIdx + clientPerPage, totalClientItems)}
                            perPage={clientPerPage}
                            onPerPageChange={(val) => {
                                setClientPerPage(Number(val));
                                setClientPage(1);
                            }}
                            onPrevPage={() => setClientPage((p) => Math.max(1, p - 1))}
                            onNextPage={() =>
                                setClientPage((p) => Math.min(totalClientPages, p + 1))
                            }
                            hasPrev={safeClientPage > 1}
                            hasNext={safeClientPage < totalClientPages}
                            itemLabel={itemNoun}
                        />
                    )
                ))}

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
                title={
                    selectedIds.length > 1
                        ? `Delete Selected ${itemNoun.charAt(0).toUpperCase() + itemNoun.slice(1)}`
                        : `Delete ${itemNoun.charAt(0).toUpperCase() + itemNoun.slice(1).replace(/s$/, '')}`
                }
                message={`Are you sure you want to delete ${
                    selectedIds.length > 1
                        ? `these ${selectedIds.length} ${itemNoun}`
                        : `this ${itemNoun.replace(/s$/, '')}`
                }? This action is permanent and all data will be removed.`}
                processing={false}
            />
        </div>
    );
}
