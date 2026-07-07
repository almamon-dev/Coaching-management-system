/**
 * UserEditPage Component
 * 
 * Page for editing existing administrative staff details and role assignments.
 * Standardized header layout matching Role and Category management pages.
 */
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import UserForm from '../Form/UserForm';

const UserEditPage = ({ auth, user, userRoles, roles }) => {
    // 1. Initialize useForm with current DB values
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        roles: userRoles || [],
        status: user.status || 'active',
        user_type: user.user_type || 'admin',
        _method: 'PUT' // Support PUT method override via Laravel POST
    });

    // 2. Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.update', user.id));
    };

    return (
        <>
            <Head title={`Edit Staff: ${user.name}`} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Edit Staff: {user.name}</h1>
                    <p className="text-[#6d7175] text-[13px] font-medium mt-0.5">Modify properties and sync updated Spatie system roles</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route("admin.users.index")}
                        className="h-[36px] px-4 bg-white border border-[#d1d1d1] rounded-[4px] text-[#6d7175] font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        form="user-form"
                        disabled={processing}
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#006e52] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        Update User
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <UserForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                roles={roles}
                isEdit={true}
            />
        </>
    );
};

UserEditPage.layout = page => <AdminLayout user={page.props.auth.user} children={page} />;

export default UserEditPage;
