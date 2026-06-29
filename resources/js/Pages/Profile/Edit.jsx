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
                <div className="bg-white p-6 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Account Settings</h1>
                    <p className="text-[#6d7175] text-[13px] font-medium mt-1">Update your profile information and security settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Information - Left Side */}
                    <div className="bg-white p-6 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] h-full">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Update Password - Right Side */}
                    <div className="bg-white p-6 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] h-full">
                        <UpdatePasswordForm />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
