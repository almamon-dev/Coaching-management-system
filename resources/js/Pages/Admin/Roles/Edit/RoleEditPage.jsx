import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import RoleForm from '../Form/RoleForm';

const RoleEditPage = ({ auth, role, rolePermissions, permissions }) => {
    // 1. Initialize useForm with current DB values
    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        permissions: rolePermissions || []
    });

    // 2. Submit handler (PUT request to update endpoint)
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
    };

    return (
        <>
            <Head title={`Edit Role: ${role.name}`} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Edit Role: {role.name}</h1>
                    <p className="text-[#6d7175] text-[13px] font-medium mt-0.5">Modify role properties and update assigned operational privileges</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route("admin.roles.index")}
                        className="h-[36px] px-4 bg-white border border-[#d1d1d1] rounded-[4px] text-[#6d7175] font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        form="role-form"
                        disabled={processing}
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#006e52] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        Update Role
                    </button>
                </div>
            </div>

            {/* Main Form container */}
            <RoleForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                permissions={permissions}
                isEdit={true}
            />
        </>
    );
};

RoleEditPage.layout = page => <AdminLayout user={page.props.auth.user} children={page} />

export default RoleEditPage;
