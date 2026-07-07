/**
 * UserForm Component
 * 
 * Standardized, high-performance two-column admin form.
 * Left Column: Basic credentials and Spatie roles select grid.
 * Right Column: Real-time user preview card and status switch.
 */
import React from 'react';
import { Link } from '@inertiajs/react';
import { User, Mail, Lock, Shield, Check, Info, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import SelectInput from '@/Components/Form/SelectInput';

const UserForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    roles,
    existingUsers = [],
    isEdit = false
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    // Check if a role is selected
    const isRoleSelected = (roleName) => {
        return data.roles.includes(roleName);
    };

    // Toggle role selection
    const handleRoleToggle = (roleName) => {
        // Support multiple roles selection (array of roles)
        setData('roles', 
            data.roles.includes(roleName)
                ? data.roles.filter(r => r !== roleName)
                : [...data.roles, roleName]
        );
    };

    return (
        <form id="user-form" onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Input Fields (Name, Email, Password, Roles) */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* Card 1: Account Information */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
                    <h3 className="text-[14px] font-bold text-slate-800 mb-5 flex items-center gap-1.5 pb-2 border-b border-[#ebebeb]">
                        <User size={15} className="text-[#008060]" /> Account Credentials
                    </h3>
                    
                    {!isEdit && existingUsers?.length > 0 && (
                        <div className="mb-5 pb-5 border-b border-[#ebebeb]">
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                                Quickly assign roles to an existing user
                            </label>
                            <SelectInput
                                value={data.existing_user_id || ''}
                                options={existingUsers.map(u => ({ id: u.id, name: `${u.name} (${u.email})` }))}
                                placeholder="-- Select an existing user to auto-fill --"
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    if (selectedId) {
                                        const user = existingUsers.find(u => u.id == selectedId);
                                        if (user) {
                                            const userRoleNames = user.roles ? user.roles.map(r => r.name) : [];
                                            setData(data => ({
                                                ...data,
                                                name: user.name,
                                                email: user.email,
                                                user_type: user.user_type || 'admin',
                                                existing_user_id: user.id,
                                                roles: userRoleNames
                                            }));
                                        }
                                    } else {
                                        setData(data => ({
                                            ...data,
                                            name: '',
                                            email: '',
                                            existing_user_id: null,
                                            roles: []
                                        }));
                                    }
                                }}
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Select a user above to auto-fill their details, or fill out the form below to create a brand new user.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. John Doe"
                                className={`w-full h-[38px] px-3 bg-white border rounded-[4px] text-[13px] text-[#202223] placeholder-slate-400 focus:outline-none focus:border-[#008060] focus:ring-0 transition-all ${
                                    errors.name ? 'border-red-500' : 'border-[#d1d1d1]'
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="e.g. john.doe@company.com"
                                className={`w-full h-[38px] px-3 bg-white border rounded-[4px] text-[13px] text-[#202223] placeholder-slate-400 focus:outline-none focus:border-[#008060] focus:ring-0 transition-all ${
                                    errors.email ? 'border-red-500' : 'border-[#d1d1d1]'
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                                Password {isEdit ? <span className="text-[#6d7175] font-normal">(Leave blank to keep current)</span> : <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder={isEdit ? "••••••••" : "Enter secure password"}
                                    className={`w-full h-[38px] pl-3 pr-10 bg-white border rounded-[4px] text-[13px] text-[#202223] placeholder-slate-400 focus:outline-none focus:border-[#008060] focus:ring-0 transition-all ${
                                        errors.password ? 'border-red-500' : 'border-[#d1d1d1]'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer border-none bg-transparent"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                                Confirm Password {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder={isEdit ? "••••••••" : "Confirm secure password"}
                                    className={`w-full h-[38px] pl-3 pr-10 bg-white border rounded-[4px] text-[13px] text-[#202223] placeholder-slate-400 focus:outline-none focus:border-[#008060] focus:ring-0 transition-all ${
                                        errors.password_confirmation ? 'border-red-500' : 'border-[#d1d1d1]'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer border-none bg-transparent"
                                >
                                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.password_confirmation}</p>}
                        </div>
                        
                    </div>
                </div>

                {/* Card 2: Role Access Mapping */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
                    <h3 className="text-[14px] font-bold text-slate-800 mb-2 flex items-center gap-1.5 pb-2 border-b border-[#ebebeb]">
                        <Shield size={15} className="text-[#008060]" /> Role Access Control
                    </h3>
                    <p className="text-[#6d7175] text-[12px] mb-5 font-medium">
                        Assign one or more Spatie system roles. This maps operational credentials to this user.
                    </p>

                    {errors.roles && <p className="text-red-500 text-[12px] mb-4 font-semibold">{errors.roles}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {roles.map((role) => {
                            const isChecked = isRoleSelected(role.name);
                            return (
                                <div
                                    key={role.id}
                                    onClick={() => handleRoleToggle(role.name)}
                                    className={cn(
                                        "p-4 border rounded-[4px] cursor-pointer flex items-center justify-between transition-all select-none",
                                        isChecked
                                            ? "border-[#008060] bg-[#f0f9f7]/40 shadow-sm"
                                            : "border-[#ebebeb] hover:border-slate-300 bg-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "w-[17px] h-[17px] border-[1.5px] rounded-[3px] flex items-center justify-center transition-all",
                                                isChecked
                                                    ? "bg-[#008060] border-[#008060]"
                                                    : "bg-white border-[#d1d1d1]"
                                            )}
                                        >
                                            {isChecked && <Check size={11} strokeWidth={4} className="text-white" />}
                                        </div>
                                        <span className={cn(
                                            "text-[13px] font-semibold",
                                            isChecked ? "text-[#008060]" : "text-slate-700"
                                        )}>
                                            {role.name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                                        Role Tier
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Column: Status Switch & Live Preview */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Card 1: Active Status & Invitation Mode */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] space-y-5">
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-[#ebebeb]">Account Status</h3>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setData('status', data.status === 'active' ? 'disabled' : 'active')}
                                className={cn(
                                    "w-10 h-5 rounded-full transition-all relative cursor-pointer border-none outline-none",
                                    data.status === 'active' ? 'bg-[#008060]' : 'bg-slate-200'
                                )}
                            >
                                <div 
                                    className="absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all shadow-sm" 
                                    style={{ left: data.status === 'active' ? '22px' : '2px' }} 
                                />
                            </button>
                            <span className="text-[13px] font-bold text-slate-700">
                                {data.status === 'active' ? 'Active' : 'Inactive'} Status
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-medium">
                            Inactive administrators are completely blocked from logging into the dashboard.
                        </p>
                    </div>

                    {!isEdit && (
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-[#ebebeb]">Invitation Method</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('pre_verified', !data.pre_verified)}
                                    className={cn(
                                        "w-10 h-5 rounded-full transition-all relative cursor-pointer border-none outline-none",
                                        data.pre_verified ? 'bg-[#008060]' : 'bg-slate-200'
                                    )}
                                >
                                    <div 
                                        className="absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all shadow-sm" 
                                        style={{ left: data.pre_verified ? '22px' : '2px' }} 
                                    />
                                </button>
                                <span className="text-[13px] font-bold text-slate-700">
                                    {data.pre_verified ? 'Pre-verified' : 'Email Invitation'}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-2 font-medium">
                                {data.pre_verified 
                                    ? "Directly activate the account. No invitation email will be sent."
                                    : "Email invitation keeps the account pending until they click the secure verification link in their email to activate."
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Card 2: Real-time Profile Preview */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] text-center">
                    <h3 className="text-[11px] font-bold text-[#6d7175] mb-4 text-left pb-2 border-b border-[#ebebeb]">
                        Staff Profile Preview
                    </h3>
                    
                    {/* Mock Avatar */}
                    <div className="w-16 h-16 bg-[#e4f1ef] text-[#008060] rounded-full mx-auto flex items-center justify-center font-bold text-[22px] shadow-sm mb-3">
                        {data.name ? data.name.substring(0, 2).toUpperCase() : '?'}
                    </div>

                    <h4 className="text-[15px] font-bold text-slate-800 truncate px-2">
                        {data.name || <span className="text-slate-400 italic font-medium">Unnamed Staff</span>}
                    </h4>
                    <p className="text-[12px] text-slate-500 truncate mb-4">
                        {data.email || 'no-email@company.com'}
                    </p>

                    <div className="space-y-2.5 text-left border-t border-[#ebebeb] pt-4">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-[#6d7175] font-semibold">Account State</span>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-[10px] border",
                                data.status === 'active'
                                    ? "bg-[#e4f1ef] text-[#008060] border-[#a3dfd2]/30"
                                    : (!isEdit && !data.pre_verified)
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-rose-50 text-rose-700 border-rose-200"
                            )}>
                                {data.status === 'active'
                                    ? 'Active'
                                    : (!isEdit && !data.pre_verified)
                                        ? 'Pending'
                                        : 'Suspended'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-[12px]">
                            <span className="text-[#6d7175] font-semibold">Assigned Access Tiers</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {data.roles.length > 0 ? (
                                    data.roles.map((r, idx) => (
                                        <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
                                            {r}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-amber-600 font-semibold italic flex items-center gap-1">
                                        ⚠️ No roles mapped (No Access)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit advisory */}
                {data.roles.includes('Super Admin') && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-[4px] text-[11px] font-medium leading-relaxed flex gap-2">
                        <ShieldAlert size={16} className="shrink-0 text-amber-600 mt-0.5" />
                        <span><strong>Security Advisor:</strong> Mapping "Super Admin" role grants complete system permissions without constraints. Proceed with caution.</span>
                    </div>
                )}
            </div>
        </form>
    );
};

export default UserForm;
