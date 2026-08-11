import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Shield, CheckCircle } from 'lucide-react';

export default function PermissionIndex({ rolePermissions, availableModules }) {
    const [selectedRole, setSelectedRole] = useState('manager');

    const currentRolePerm = rolePermissions[selectedRole]?.permissions || [];

    const { data, setData, post, processing } = useForm({
        role: selectedRole,
        permissions: currentRolePerm,
    });

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        const newPerms = rolePermissions[role]?.permissions || [];
        setData({
            role: role,
            permissions: newPerms,
        });
    };

    const handleCheckToggle = (modKey) => {
        const has = data.permissions.includes(modKey);
        let updated = [];
        if (has) {
            updated = data.permissions.filter(p => p !== modKey);
        } else {
            updated = [...data.permissions, modKey];
        }
        setData('permissions', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.permissions.update'));
    };

    const rolesList = [
        { id: 'super_admin', label: 'Super Admin / Owner' },
        { id: 'manager', label: 'Center Manager' },
        { id: 'teacher', label: 'Teacher / Instructor' },
        { id: 'accountant', label: 'Accountant / Operator' },
        { id: 'student', label: 'Student' },
        { id: 'guardian', label: 'Guardian' },
    ];

    return (
        <AdminLayout>
            <Head title="User Roles & Permissions" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Role & Permission Management</h1>
                    <p className="text-sm text-slate-500">Define access rights and module permissions for each user role.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* ROLE SELECTOR */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select User Role</span>
                    {rolesList.map(r => (
                        <button
                            key={r.id}
                            onClick={() => handleRoleChange(r.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                selectedRole === r.id ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                {/* PERMISSION MATRIX */}
                <form onSubmit={handleSubmit} className="md:col-span-3 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <h3 className="text-sm font-bold text-slate-900">Module Access Rights for: <span className="text-emerald-600 uppercase">{selectedRole}</span></h3>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm">
                            Save Permissions
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {Object.entries(availableModules).map(([key, label]) => {
                            const isChecked = data.permissions.includes(key);
                            return (
                                <label key={key} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                    isChecked ? 'bg-emerald-50/50 border-emerald-300 font-bold text-slate-900' : 'bg-slate-50/50 border-slate-200 text-slate-600'
                                }`}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleCheckToggle(key)}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>{label}</span>
                                </label>
                            );
                        })}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
