import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { AlertTriangle, Calendar, Check, Mail, SquarePen, Trash2 } from 'lucide-react';
import UserSkeleton from './UserSkeleton';

const UserTable = ({
    users,
    filters,
    selectedIds,
    selectAllAcrossPages,
    toggleSelectAll,
    toggleSelect,
    handleDelete,
    isProcessing,
    activeTab,
    stats,
    visibleColumns,
    auth
}) => {
    const masterAdminEmail = 'admin@getitmoving.com';

    // Calculate selection statuses
    const availableBulkUsers = users.data.filter(u => u.email !== masterAdminEmail && u.id !== auth.user.id);
    const availableBulkIds = availableBulkUsers.map(u => u.id);
    const isAllSelected = selectedIds.length === availableBulkIds.length && availableBulkIds.length > 0;

    const shouldShowSkeletons = isProcessing && (stats?.[activeTab] > 0 || stats?.[activeTab] === undefined);

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-[#ebebeb] bg-slate-50/50">
                        <th className="py-3 px-4 w-[48px] text-center select-none">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center select-none",
                                    isAllSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1]"
                                )}
                            >
                                {isAllSelected && (
                                    <Check size={11} strokeWidth={4} className="text-white" />
                                )}
                            </div>
                        </th>
                        {visibleColumns.includes('name') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Staff Member</th>}
                        {visibleColumns.includes('email') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Email Details</th>}
                        {visibleColumns.includes('roles') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">System Roles</th>}
                        {visibleColumns.includes('status') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Access State</th>}
                        {visibleColumns.includes('created_at') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Created Date</th>}
                        <th className="py-3 px-4 text-[12px] font-bold text-slate-700 text-right w-[120px] select-none">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {shouldShowSkeletons ? (
                        Array.from({ length: users.data?.length > 0 ? users.data.length : 5 }).map((_, i) => (
                            <UserSkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : users.data && users.data.length > 0 ? (
                        users.data.map((user) => {
                            const isSelected = selectedIds.includes(user.id);
                            const isProtected = user.email === masterAdminEmail || user.id === auth.user.id;

                            return (
                                <tr
                                    key={user.id}
                                    className={cn(
                                        "border-b border-[#ebebeb] hover:bg-slate-50/40 transition-colors",
                                        isSelected && "bg-[#f0f9f7]/20"
                                    )}
                                >
                                    {/* Checkbox Column */}
                                    <td className="py-2 px-4 text-center select-none">
                                        <div
                                            onClick={() => !isProtected && toggleSelect(user.id)}
                                            className={cn(
                                                "w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto transition-all flex items-center justify-center select-none",
                                                isProtected
                                                    ? "bg-slate-100 border-slate-200 cursor-not-allowed opacity-50"
                                                    : isSelected
                                                        ? "bg-[#008060] border-[#008060] cursor-pointer"
                                                        : "bg-white border-[#d1d1d1] cursor-pointer hover:border-slate-400"
                                            )}
                                        >
                                            {isSelected && !isProtected && (
                                                <Check size={11} strokeWidth={4} className="text-white" />
                                            )}
                                        </div>
                                    </td>

                                    {/* Staff Name and Profile Bubble */}
                                    {visibleColumns.includes('name') && (
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-[32px] h-[32px] bg-[#e4f1ef] text-[#008060] font-bold text-[13px] rounded-full flex items-center justify-center shadow-sm shrink-0">
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                                                        {user.name}
                                                        {user.id === auth.user.id && (
                                                            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">You</span>
                                                        )}
                                                    </span>
                                                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] font-medium text-slate-500">
                                                        {isProtected && user.email === masterAdminEmail ? (
                                                            <span className="text-amber-600 font-bold">System Owner</span>
                                                        ) : user.invited_by ? (
                                                            <span>
                                                                {(user.email_verified_at || user.is_verified) ? 'Invited by ' : 'Sent by '}
                                                                <span className="text-slate-700 font-semibold">{user.invited_by.name}</span>
                                                                {!(user.email_verified_at || user.is_verified) && ` on ${new Date(user.created_at).toLocaleDateString()}`}
                                                            </span>
                                                        ) : (
                                                            <span>System Auto</span>
                                                        )}
                                                        <span className="text-slate-300 select-none">•</span>
                                                        {user.email_verified_at || user.is_verified ? (
                                                            <span className="text-slate-500 flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                                                {user.last_login_at ? `Active ${new Date(user.last_login_at).toLocaleDateString()}` : 'Joined'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/40 leading-none">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block"></span>
                                                                Pending Invite
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    )}

                                    {/* Email */}
                                    {visibleColumns.includes('email') && (
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
                                                <Mail size={13} className="text-slate-400" />
                                                <span>{user.email}</span>
                                            </div>
                                        </td>
                                    )}

                                    {/* Roles (Spatie badges) */}
                                    {visibleColumns.includes('roles') && (
                                        <td className="py-2 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.length > 0 ? (
                                                    user.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className={cn(
                                                                "text-[10px] font-bold px-2 py-0.5 rounded-[4px] border",
                                                                role.name === 'Super Admin'
                                                                    ? "bg-[#e4f1ef] text-[#008060] border-[#a3dfd2]/30"
                                                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                                            )}
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[11px] text-rose-500 font-bold italic flex items-center gap-1">
                                                        ⚠️ No Access
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    )}

                                    {/* Access Status badge */}
                                    {visibleColumns.includes('status') && (
                                        <td className="py-2 px-4">
                                            {user.status === 'active' ? (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-[10px] border inline-block bg-[#e4f1ef] text-[#008060] border-[#a3dfd2]/30">
                                                    Active
                                                </span>
                                            ) : !(user.is_verified || user.email_verified_at) ? (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-[10px] border inline-block bg-amber-50 text-amber-700 border-amber-200">
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-[10px] border inline-block bg-rose-50 text-rose-700 border-rose-200">
                                                    Suspended
                                                </span>
                                            )}
                                        </td>
                                    )}

                                    {/* Created Date */}
                                    {visibleColumns.includes('created_at') && (
                                        <td className="py-2 px-4 text-[12.5px] text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-slate-400" />
                                                <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                    )}

                                    {/* Action Buttons */}
                                    <td className="py-2 px-4 text-right select-none">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer"
                                                title="Edit Staff Member"
                                            >
                                                <SquarePen size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                disabled={isProtected}
                                                className={cn(
                                                    "h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none",
                                                    isProtected
                                                        ? "bg-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                                                        : "bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer"
                                                )}
                                                title="Delete Staff Member"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={7} className="p-12 text-center text-slate-400 bg-white">
                                <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                <h5 className="text-[13.5px] font-bold text-slate-700">No staff members found</h5>
                                <p className="text-[12px] text-[#6d7175] mt-0.5">Try clearing filters or checking other tabs</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
