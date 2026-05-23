/**
 * RoleTable Component
 * 
 * Standardized data grid matching Products and Categories table UI.
 * Features Shopify-style custom checkbox controls, high-contrast actions,
 * and dynamic column visibility controls.
 */
import React from 'react';
import { Link } from '@inertiajs/react';
import { Check, Trash2, Shield, ShieldCheck, Key, Users, SquarePen, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const RoleTable = ({
    roles,
    selectedIds,
    toggleSelectAll,
    toggleSelect,
    handleDelete,
    isProcessing,
    visibleColumns = ['role', 'operators', 'permissions', 'created_at']
}) => {
    const allRoles = roles.data || [];
    
    // Filter out Super Admin from selectable rows
    const deletableRolesOnPage = allRoles.filter(role => role.name !== 'Super Admin');
    const isAllSelected = deletableRolesOnPage.length > 0 && 
                          deletableRolesOnPage.every(role => selectedIds.includes(role.id));

    // Calculate active columns count including checkbox and action columns
    const activeColCount = visibleColumns.length + 2; 

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            {/* Loading Indicator Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-20">
                    <div className="w-8 h-8 border-4 border-[#008060] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[18px] h-[18px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                    isAllSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]"
                                )}
                            >
                                {isAllSelected ? (
                                    <Check size={12} strokeWidth={4} className="text-white" />
                                ) : selectedIds.length > 0 ? (
                                    <div className="w-2.5 h-[1.5px] bg-slate-500"></div>
                                ) : null}
                            </div>
                        </th>
                        {visibleColumns.includes('role') && <th className="px-4 py-2.5 w-[250px]">Role Name</th>}
                        {visibleColumns.includes('operators') && <th className="px-4 py-2.5 text-center w-[120px]">Operators</th>}
                        {visibleColumns.includes('permissions') && <th className="px-4 py-2.5 w-[500px]">Permissions</th>}
                        {visibleColumns.includes('created_at') && <th className="px-4 py-2.5 text-center w-[180px]">Created Date</th>}
                        <th className="px-6 py-2.5 text-right w-[120px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] bg-white text-[13px] text-slate-600">
                    {allRoles.length === 0 ? (
                        <tr>
                            <td colSpan={activeColCount} className="py-12 text-center text-slate-400 font-medium bg-slate-50/50">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Shield size={36} className="text-slate-300 stroke-[1.5]" />
                                    <span>No system roles found matching filters</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        allRoles.map((role) => {
                            const isSelected = selectedIds.includes(role.id);
                            const isSuperAdmin = role.name === 'Super Admin';

                            return (
                                <tr 
                                    key={role.id}
                                    className={cn(
                                        "group transition-colors h-[48px]",
                                        isSelected
                                            ? "bg-[#f4f6f8]"
                                            : "hover:bg-[#f6f6f7]"
                                    )}
                                >
                                    {/* Row Checkbox */}
                                    <td className="pl-4 pr-2 py-1 w-[45px]">
                                        <div
                                            onClick={() => !isSuperAdmin && toggleSelect(role.id)}
                                            className={cn(
                                                "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                                isSuperAdmin 
                                                    ? "bg-slate-100 border-slate-200 cursor-not-allowed opacity-30" 
                                                    : isSelected
                                                        ? "bg-[#008060] border-[#008060]"
                                                        : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                                            )}
                                        >
                                            {isSelected && !isSuperAdmin && (
                                                <Check size={11} strokeWidth={4} className="text-white" />
                                            )}
                                        </div>
                                    </td>

                                    {/* Role Name */}
                                    {visibleColumns.includes('role') && (
                                        <td className="px-4 py-1 font-bold text-[#202223]">
                                            <div className="flex items-center gap-2">
                                                {isSuperAdmin ? (
                                                    <ShieldCheck size={16} className="text-[#008060]" />
                                                ) : (
                                                    <Shield size={16} className="text-[#6d7175]" />
                                                )}
                                                <span>{role.name}</span>
                                            </div>
                                        </td>
                                    )}

                                    {/* Assigned Operators Count */}
                                    {visibleColumns.includes('operators') && (
                                        <td className="px-4 py-1 text-center">
                                            <div className="inline-flex items-center gap-1 bg-[#f6f6f7] text-[#202223] px-2.5 py-0.5 rounded-[10px] text-[11px] font-bold border border-[#ebebeb]">
                                                <Users size={11} className="text-[#6d7175]" />
                                                <span>{role.users_count || 0}</span>
                                            </div>
                                        </td>
                                    )}

                                    {/* Permissions Preview */}
                                    {visibleColumns.includes('permissions') && (
                                        <td className="px-4 py-1">
                                            {isSuperAdmin ? (
                                                <div className="inline-flex items-center gap-1 bg-[#e4f1ef] text-[#008060] px-2.5 py-0.5 rounded-[10px] text-[11px] font-bold border border-[#a3dfd2]/30">
                                                    <Key size={11} />
                                                    <span>All System Permissions Granted</span>
                                                </div>
                                            ) : role.permissions_count === 0 ? (
                                                <span className="text-[#6d7175] italic text-[12px]">No permissions assigned</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="text-[11px] font-bold text-[#202223] bg-[#f6f6f7] border border-[#ebebeb] px-2 py-0.5 rounded-[4px]">
                                                        {role.permissions_count} permissions assigned
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    )}

                                    {/* Created At */}
                                    {visibleColumns.includes('created_at') && (
                                        <td className="px-4 py-1 text-center text-[12px] text-[#6d7175] font-semibold">
                                            {role.created_at ? new Date(role.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : '—'}
                                        </td>
                                    )}

                                    {/* Actions */}
                                    <td className="px-6 py-1 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route("admin.roles.show", role.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-slate-100 text-slate-700 rounded-[2px] hover:bg-slate-200 border border-slate-200/80 active:scale-90 transition-all cursor-pointer"
                                                title="View Details"
                                            >
                                                <Eye size={12} />
                                            </Link>
                                            <Link
                                                href={route("admin.roles.edit", role.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] active:scale-90 transition-all cursor-pointer"
                                                title="Edit Role"
                                            >
                                                <SquarePen size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(role.id, role.name)}
                                                disabled={isSuperAdmin}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] active:scale-90 transition-all disabled:opacity-30 disabled:hover:bg-[#ff4d4f] disabled:cursor-not-allowed"
                                                title={isSuperAdmin ? "Super Admin cannot be deleted" : "Delete Role"}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RoleTable;
