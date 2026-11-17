import InputError from '@/Components/Form/InputError';
import InputLabel from '@/Components/Form/InputLabel';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import TextInput from '@/Components/Form/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Forgot Password</h2>
                <p className="mt-1 text-xs text-slate-500">
                    Forgot your password? No problem. Enter your account email address and we will email you a password reset link.
                </p>
            </div>

            {status && (
                <div className="mb-4 p-3 rounded-[3px] bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full h-[38px]"
                        isFocused={true}
                        placeholder="your-email@example.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="pt-2 flex items-center justify-between">
                    <Link
                        href={route('login')}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                    >
                        <ArrowLeft size={13} />
                        <span>Back to Login</span>
                    </Link>

                    <PrimaryButton className="h-[36px]" disabled={processing}>
                        Send Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
