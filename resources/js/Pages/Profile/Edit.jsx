import UserLayout from '@/Layouts/UserLayout';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <UserLayout user={auth.user}>
            <Head title="Account Settings" />

            <div className="space-y-5">
                {/* Header */}
                <div className="bg-white p-5 rounded-[1px] border border-slate-200 shadow-sm">
                    <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">Account Settings</h1>
                    <p className="text-slate-400 text-[11px] font-medium mt-1">Update your profile information and security settings</p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    {/* Profile Information */}
                    <div className="bg-white p-5 rounded-sm border border-slate-100 shadow-sm">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Update Password */}
                    <div className="bg-white p-5 rounded-[1px] border border-slate-200 shadow-sm">
                        <UpdatePasswordForm />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
