import React, { useEffect, useState } from 'react';
import InputError from '@/Components/Form/InputError';
import SchoolLogo from '@/Components/SchoolLogo';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';

export default function Login({ status, canResetPassword, isAdmin, isTeacher, isStudent }) {
    const { settings } = usePage().props;
    const centerName = settings?.center_name || 'Ullash Coaching Center';
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        let targetRoute = '/login';
        if (isAdmin) targetRoute = route('admin.login.store');
        else if (isTeacher) targetRoute = route('teacher.login.store');
        else if (isStudent) targetRoute = route('student.login.store');
        post(targetRoute);
    };

    const handleQuickLogin = (email, password) => {
        setData({ ...data, email, password });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const roleTitle = isAdmin
        ? 'Admin Login'
        : (isTeacher ? 'Teacher Login' : 'Student Login');

    const demoCredentials = isAdmin
        ? { email: 'admin@coaching.com', label: 'Demo Admin' }
        : (isTeacher
            ? { email: 'teacher1@coaching.com', label: 'Demo Teacher' }
            : { email: 'student1@coaching.com', label: 'Demo Student' });

    return (
        <>
            <Head title={`${roleTitle} | ${centerName}`} />

            {/* Clean plain background without gradients/blobs */}
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
                
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    {/* Logo & Header */}
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-block">
                            <SchoolLogo variant="wide" className="h-10 sm:h-12 w-auto mx-auto" />
                        </Link>
                        <h2 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                            {roleTitle}
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                            {centerName}
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white py-8 px-6 sm:px-8 shadow-sm border border-slate-200 rounded-2xl">
                        {status && (
                            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full h-10 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                        placeholder={demoCredentials.email}
                                        required
                                        autoComplete="username"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1 text-xs" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full h-10 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1 text-xs" />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between pt-0.5">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <span className="text-xs font-medium text-slate-600">Remember me</span>
                                </label>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-10 mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>

                        {/* DEMO BUTTON (Easy to remove anytime) */}
                        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-medium">Testing:</span>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin(demoCredentials.email, 'password')}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold rounded-md text-[11px] transition-all cursor-pointer"
                            >
                                <span>{copied ? '✓ Credentials Filled' : `Fill ${demoCredentials.label}`}</span>
                            </button>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
                        >
                            <ArrowLeft size={13} />
                            <span>Back to Website</span>
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}
