/**
 * RoleForm Component
 * 
 * High-performance, responsive two-column layout styled after Shopify Plus.
 * Left Column: General details and modular permissions grid with custom checkboxes.
 * Right Column: Real-time role status summaries and administrative action buttons.
 */
import React from 'react';
import { Link } from '@inertiajs/react';
import { Shield, Check, Users, Key, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RoleForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    permissions,
    isEdit = false
}) => {
    // Flatten all permissions to get full available list names
    const allPermissionNames = Object.values(permissions).flatMap(modulePerms =>
        modulePerms.map(p => p.name)
    );

    // Check if a permission is selected
    const isPermissionChecked = (permissionName) => {
        return data.permissions.includes(permissionName);
    };

    // Toggle single permission selection
    const handlePermissionToggle = (permissionName) => {
        setData('permissions',
            data.permissions.includes(permissionName)
                ? data.permissions.filter(p => p !== permissionName)
                : [...data.permissions, permissionName]
        );
    };

    // Toggle all permissions inside a specific module card
    const toggleModulePermissions = (moduleName, modulePerms) => {
        const modulePermNames = modulePerms.map(p => p.name);
        const hasAllSelected = modulePermNames.every(name => data.permissions.includes(name));

        if (hasAllSelected) {
            // Uncheck all for this module
            setData('permissions', data.permissions.filter(p => !modulePermNames.includes(p)));
        } else {
            // Check all for this module (and keep existing from other modules)
            const otherModulePerms = data.permissions.filter(p => !modulePermNames.includes(p));
            setData('permissions', [...otherModulePerms, ...modulePermNames]);
        }
    };

    // Global check/uncheck all permissions
    const toggleAllGlobal = (select) => {
        setData('permissions', select ? allPermissionNames : []);
    };

    return (
        <form id="role-form" onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Details (Name & Permissions Grid) */}
            <div className="lg:col-span-8 space-y-6">
                {/* Card 1: Role Information */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
                    <h2 className="text-[14px] font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-1.5">
                        <Shield size={14} className="text-[#008060]" /> Role Details
                    </h2>
                    <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g. Inventory Manager, Support Agent"
                            disabled={isEdit && data.name === 'Super Admin'} // Prevent changing Super Admin name
                            className={`w-full h-[38px] px-3 bg-white border rounded-[4px] text-[13px] text-[#202223] placeholder-slate-400 focus:outline-none focus:border-[#008060] focus:ring-0 transition-all ${errors.name ? 'border-red-500' : 'border-[#d1d1d1]'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-[12px] mt-1.5 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {errors.name}
                            </p>
                        )}
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
                                Grant module level operational privileges to this access tier.
                            </p>
                        </div>
                        {/* Global actions */}
                        <div className="flex items-center gap-2 self-start sm:self-center">
                            <button
                                type="button"
                                onClick={() => toggleAllGlobal(true)}
                                className="h-[28px] px-3 bg-[#f6f6f7] hover:bg-[#ebebeb] text-slate-700 rounded-[3px] text-[11px] font-bold transition-all border border-[#d1d1d1] cursor-pointer"
                            >
                                Check All
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleAllGlobal(false)}
                                className="h-[28px] px-3 bg-[#f6f6f7] hover:bg-[#ebebeb] text-slate-700 rounded-[3px] text-[11px] font-bold transition-all border border-[#d1d1d1] cursor-pointer"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {errors.permissions && (
                        <p className="text-red-500 text-[12px] mb-4 font-semibold">{errors.permissions}</p>
                    )}

                    {/* Modular Grid of Permissions Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {Object.entries(permissions).map(([moduleName, modulePerms]) => {
                            const modulePermNames = modulePerms.map(p => p.name);
                            const hasAllSelected = modulePermNames.every(name => data.permissions.includes(name));

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
                                        <button
                                            type="button"
                                            onClick={() => toggleModulePermissions(moduleName, modulePerms)}
                                            className={`text-[10px] font-bold hover:underline transition-all cursor-pointer ${hasAllSelected ? 'text-red-600 hover:text-red-700' : 'text-[#008060] hover:text-[#006e52]'
                                                }`}
                                        >
                                            {hasAllSelected ? 'Uncheck All' : 'Select All'}
                                        </button>
                                    </div>

                                    {/* Card Body Checkboxes */}
                                    <div className="p-4 flex-1 space-y-2.5">
                                        {modulePerms.map((perm) => {
                                            const isChecked = isPermissionChecked(perm.name);
                                            return (
                                                <div
                                                    key={perm.id}
                                                    onClick={() => handlePermissionToggle(perm.name)}
                                                    className="flex items-start gap-2 cursor-pointer select-none group min-w-0"
                                                >
                                                    <div
                                                        className={cn(
                                                            "mt-0.5 w-[16px] h-[16px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center flex-shrink-0",
                                                            isChecked
                                                                ? "bg-[#008060] border-[#008060]"
                                                                : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                                                        )}
                                                    >
                                                        {isChecked && (
                                                            <Check size={10} strokeWidth={4} className="text-white" />
                                                        )}
                                                    </div>
                                                    <span className="text-[12px] font-medium text-slate-650 group-hover:text-slate-800 transition-colors truncate" title={perm.display_name}>
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
                {/* Card 1: Live Role Summary Card */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                    <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                        <Users size={13} className="text-[#008060]" /> Dynamic Summary
                    </h3>
                    <div className="space-y-2.5 text-[12px]">
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-500 font-semibold">Role Name</span>
                            <span className="font-bold text-slate-800 max-w-[150px] truncate" title={data.name}>
                                {data.name || <span className="text-slate-400 italic">Untitled</span>}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-0.5 border-t border-slate-100/70 pt-2">
                            <span className="text-slate-500 font-semibold">Status Config</span>
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] border leading-none",
                                data.name === 'Super Admin'
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : data.permissions.length > 0 
                                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                            )}>
                                {data.name === 'Super Admin' 
                                    ? "Protected" 
                                    : data.permissions.length > 0 
                                        ? "Active" 
                                        : "Draft"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 border-t border-slate-100/70 pt-2">
                            <span className="text-slate-500 font-semibold">Permissions</span>
                            <span className="font-bold text-[#008060]">
                                {data.permissions.length} of {allPermissionNames.length}
                            </span>
                        </div>
                        
                        {data.name === 'Super Admin' ? (
                            <div className="p-2 bg-amber-50/50 border border-amber-200/60 text-amber-800 rounded-[3px] text-[10.5px] font-medium leading-relaxed flex gap-1.5 mt-2">
                                <AlertTriangle size={13} className="flex-shrink-0 text-amber-600 mt-0.5" />
                                <span>Name is protected. All system permissions mapped.</span>
                            </div>
                        ) : (
                            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                                Roles allocate permissions. Assigned users inherit all selected capabilities instantly.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default RoleForm;
