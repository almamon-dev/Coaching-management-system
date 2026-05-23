import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function AcceptInvitation({ user, signature }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        // Submit to invitation accept handler
        post(route('admin.invitations.accept.store', { user: user.id, expires: signature.expires, signature: signature.token }), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Accept Staff Invitation" />

            <div className="mb-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#e4f1ef] text-[#008060] flex items-center justify-center mx-auto mb-3 shadow-sm font-bold text-[18px]">
                    {user.name.substring(0, 2).toUpperCase()}
                </div>
                <h2 className="text-[18px] font-extrabold text-slate-800 tracking-tight">Accept Staff Invitation</h2>
                <p className="text-[12.5px] text-slate-500 mt-1 font-medium leading-relaxed">
                    Set up your secure administrative credentials to join the operations team.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={user.name}
                        className="mt-1 block w-full bg-slate-50 border-slate-200 text-slate-500 font-medium select-none"
                        disabled
                    />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={user.email}
                        className="mt-1 block w-full bg-slate-50 border-slate-200 text-slate-500 font-medium select-none"
                        disabled
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-[#d1d1d1] focus:border-[#008060] focus:ring-0"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Choose a secure password"
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-[#d1d1d1] focus:border-[#008060] focus:ring-0"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm your secure password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full h-[40px] bg-[#008060] hover:bg-[#006e52] text-white rounded-[4px] font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 border-none transition-all cursor-pointer" 
                        disabled={processing}
                    >
                        Activate & Sign In
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
