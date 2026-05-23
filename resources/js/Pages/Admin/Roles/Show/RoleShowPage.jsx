import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Check, Users, Key, Calendar, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RoleShowPage = ({ auth, role, rolePermissions = [], permissions = {} }) => {
    const isSuperAdmin = role.name === 'Super Admin';

    // Helper to determine check status
    const isPermissionChecked = (permissionName) => {
        if (isSuperAdmin) return true;
        return rolePermissions.includes(permissionName);
    };

    // Flatten all permissions to get total system count
    const allPermissionNames = Object.values(permissions).flatMap(modulePerms =>
        modulePerms.map(p => p.name)
    );

    // Calculate active permissions count for current role
    const activeCount = isSuperAdmin
        ? allPermissionNames.length
        : allPermissionNames.filter(name => rolePermissions.includes(name)).length;

    return (
        <>
            <Head title={`Role Details: ${role.name}`} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Role Details: {role.name}</h1>
                        {isSuperAdmin ? (
                            <span className="inline-flex items-center gap-1 bg-[#e4f1ef] text-[#008060] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#a3dfd2]/30 leading-none">
                                <ShieldCheck size={10} /> Root Access
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 leading-none">
                                <Shield size={10} /> Access Tier
                            </span>
                        )}
                    </div>
                    <p className="text-[#6d7175] text-[13px] font-medium mt-0.5">Read-only view of role permissions, configurations, and assigned staff users</p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={route("admin.roles.index")}
                        className="h-[36px] px-4 bg-white border border-[#d1d1d1] rounded-[4px] text-[#6d7175] font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                        Back
                    </Link>
                    <Link
                        href={route("admin.roles.edit", role.id)}
                        className="h-[36px] px-4 bg-[#008060] hover:bg-[#006e52] text-white rounded-[4px] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        Edit Role
                    </Link>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Column: Form Details (Name & Permissions Grid) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Card 1: Role Details */}
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
                        <h2 className="text-[14px] font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-1.5 border-b border-[#ebebeb] pb-2">
                            <Shield size={14} className="text-[#008060]" /> Role details
                        </h2>
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                                Role Name
                            </label>
                            <div className="w-full h-[38px] px-3 bg-slate-50 border border-slate-200 rounded-[4px] text-[13px] text-[#202223] flex items-center font-semibold select-all">
                                {role.name}
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Permissions Grid */}
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#ebebeb]">
                            <div>
                                <h3 className="text-[14px] font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                                    <Key size={14} className="text-[#008060]" /> System Permissions Grid
                                </h3>
                                <p className="text-[#6d7175] text-[12px] mt-0.5 font-medium">
                                    Operational privileges granted to this access tier.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <span className="text-[11px] font-bold text-[#008060] bg-[#e4f1ef] border border-[#a3dfd2]/30 px-2.5 py-1 rounded-[3px]">
                                    {activeCount} of {allPermissionNames.length} Active
                                </span>
                            </div>
                        </div>

                        {/* Modular Grid of Permissions Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                            {Object.entries(permissions).map(([moduleName, modulePerms]) => {
                                const modulePermNames = modulePerms.map(p => p.name);
                                const activeInModule = isSuperAdmin
                                    ? modulePermNames.length
                                    : modulePermNames.filter(name => rolePermissions.includes(name)).length;

                                return (
                                    <div
                                        key={moduleName}
                                        className="bg-white border border-[#ebebeb] rounded-[4px] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col hover:border-slate-300 transition-all duration-150"
                                    >
                                        {/* Card Header */}
                                        <div className="px-4 py-2.5 bg-slate-50 border-b border-[#ebebeb] rounded-t-[4px] flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1">
                                                <Shield size={13} className="text-slate-500" />
                                                <span className="text-[12px] font-bold text-[#303030]">{moduleName}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                                                {activeInModule}/{modulePerms.length} active
                                            </span>
                                        </div>

                                        {/* Card Body Checkboxes */}
                                        <div className="p-4 flex-1 space-y-2.5">
                                            {modulePerms.map((perm) => {
                                                const isChecked = isPermissionChecked(perm.name);
                                                return (
                                                    <div
                                                        key={perm.id}
                                                        className="flex items-start gap-2.5 select-none min-w-0"
                                                    >
                                                        <div
                                                            className={cn(
                                                                "mt-0.5 w-[16px] h-[16px] border-[1.5px] rounded-[3px] flex items-center justify-center flex-shrink-0 transition-all",
                                                                isChecked
                                                                    ? "bg-[#008060] border-[#008060]"
                                                                    : "bg-slate-50 border-[#d1d1d1]"
                                                            )}
                                                        >
                                                            {isChecked && (
                                                                <Check size={10} strokeWidth={4} className="text-white" />
                                                            )}
                                                        </div>
                                                        <span className={cn(
                                                            "text-[12px] font-medium transition-colors truncate",
                                                            isChecked ? "text-slate-700" : "text-slate-400 font-normal"
                                                        )} title={perm.display_name}>
                                                            {perm.display_name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta Info Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Dynamic Summary Card */}
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                        <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                            <Users size={13} className="text-[#008060]" /> Dynamic Summary
                        </h3>
                        <div className="space-y-2.5 text-[12px]">
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-500 font-semibold">Role Name</span>
                                <span className="font-bold text-slate-800 max-w-[150px] truncate" title={role.name}>
                                    {role.name}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-0.5 border-t border-slate-100/70 pt-2">
                                <span className="text-slate-500 font-semibold">Status Config</span>
                                <span className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] border leading-none",
                                    role.name === 'Super Admin'
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : activeCount > 0
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                )}>
                                    {role.name === 'Super Admin'
                                        ? "Protected"
                                        : activeCount > 0
                                            ? "Active"
                                            : "Draft"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-0.5 border-t border-slate-100/70 pt-2">
                                <span className="text-slate-500 font-semibold">Permissions</span>
                                <span className="font-bold text-[#008060]">
                                    {activeCount} of {allPermissionNames.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Active Operators Card */}
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-[#ebebeb] flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <Users className="text-slate-500" size={14} />
                                <h3 className="text-[13px] font-bold text-slate-800">Assigned Operators</h3>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-[3px]">
                                {role.users?.length || 0} Staff
                            </span>
                        </div>

                        <div className="p-4">
                            {!role.users || role.users.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 font-medium bg-slate-50/50 border border-dashed border-slate-200 rounded-[4px]">
                                    <p className="text-[11.5px] text-slate-500 italic">No operators currently assigned to this role</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                                    {role.users.map((user) => (
                                        <div key={user.id} className="flex items-center gap-2.5 p-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/50 rounded-[4px] transition-colors shadow-sm">
                                            <div className="w-[28px] h-[28px] bg-[#e4f1ef] text-[#008060] font-bold text-[10px] rounded-full flex items-center justify-center shrink-0 border border-[#a3dfd2]/20">
                                                {user.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[12px] font-bold text-slate-800 truncate leading-tight">{user.name}</span>
                                                <span className="text-[10.5px] text-slate-500 truncate mt-0.5">{user.email}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata & Stats Card */}
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden p-4 space-y-3">
                        <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase border-b border-slate-100 pb-1.5">Role Information</h3>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-[12px]">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                    <Calendar size={13} />
                                    <span>Created Date</span>
                                </div>
                                <span className="font-bold text-slate-800">
                                    {role.created_at ? new Date(role.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[12px]">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                    <Clock size={13} />
                                    <span>Last Updated</span>
                                </div>
                                <span className="font-bold text-slate-800">
                                    {role.updated_at ? new Date(role.updated_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

RoleShowPage.layout = page => <AdminLayout user={page.props.auth.user} children={page} />

export default RoleShowPage;
