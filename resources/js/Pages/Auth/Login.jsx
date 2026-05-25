import React, { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Login({ status, canResetPassword, isAdmin }) {
    const { t } = useTranslation();
    const { categories, brands } = usePage().props;
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
        post(route(isAdmin ? 'admin.login' : 'login'));
    };

    const handleQuickLogin = (email, password) => {
        setData({ ...data, email, password });
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const FormContent = (
        <div className="w-full bg-white min-h-[60vh]">
            {/* Breadcrumb */}
            <div className="py-3">
                <div className="container mx-auto px-4 flex items-center gap-2 text-[13px]">
                    <Link href="/" className="text-gray-600 hover:text-[#ef4a23] px-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                    </Link>
                    <ChevronRight size={14} className="text-gray-300" />
                    <Link href="#" className="text-gray-600 hover:text-[#ef4a23]">{t('Account')}</Link>
                    <ChevronRight size={14} className="text-gray-300" />
                    <span className="text-gray-400">{t('Login')}</span>
                </div>
            </div>

            <div className="max-w-[400px] mx-auto px-4 pt-5 pb-20">
                <div className="mb-6 text-center">
                    <h1 className="text-[22px] font-bold text-[#081621]">{isAdmin ? 'Admin Login' : t('Account Login')}</h1>
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <InputLabel htmlFor="email" value={t('Phone / E-Mail')} className="text-[14px] font-semibold text-[#081621]" />
                        <div className="relative">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder={t('Phone / E-Mail')}
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            </div>
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="password" value={t('Password')} className="text-[14px] font-semibold text-[#081621]" />
                            {!isAdmin && canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-[13px] text-[#ef4a23] hover:underline"
                                >
                                    {t('Forgotten Password?')}
                                </Link>
                            )}
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={t('Password')}
                            required
                        />
                        <InputError message={errors.password} />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[45px] bg-[#3749bb] hover:bg-[#2c3a96] text-white font-semibold text-[13px] rounded-[4px] transition-colors uppercase mt-2"
                        disabled={processing}
                    >
                        {t('Login')}
                    </button>

                    {!isAdmin && (
                        <>
                            <div className="relative py-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[13px]">
                                    <span className="px-4 bg-white text-gray-500 font-medium">{t("Don't have an account?")}</span>
                                </div>
                            </div>

                            <Link
                                href={route('register')}
                                className="w-full h-[45px] flex items-center justify-center border border-[#3749bb] text-[#3749bb] hover:bg-[#3749bb] hover:text-white font-semibold text-[13px] rounded-[4px] transition-all uppercase"
                            >
                                {t('Create Your Account')}
                            </Link>

                            <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-[8px] border-dashed">
                                <div className="flex items-center gap-2 mb-3">

                                    <p className="text-[11px] font-bold text-slate-500">{t('Test Credentials')}</p>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => handleQuickLogin('mamon193p@gmail.com', 'user123')}
                                        className="w-full flex items-center justify-between p-2.5 hover:bg-white rounded-lg transition-all group border border-transparent hover:border-slate-200 hover:shadow-sm"
                                    >
                                        <div className="text-left">
                                            <p className="text-[13px] font-bold text-[#081621] group-hover:text-[#3749bb]">mamon193p@gmail.com</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{t('Password')}: user123</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold transition-all ${copied ? 'text-emerald-500 opacity-100' : 'text-[#3749bb] opacity-0 group-hover:opacity-100'}`}>
                                                {copied ? t('COPIED!') : t('COPY & FILL')}
                                            </span>
                                            <svg className={`w-4 h-4 transition-colors ${copied ? 'text-emerald-500' : 'text-slate-300 group-hover:text-[#3749bb]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );

    if (isAdmin) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px]">
                <Head title="Admin Access | Gadget Store" />

                {/* Subtle Radial Glows for Premium Vibe */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="w-full max-w-[370px] relative z-10">
                    {/* Compact Login Card */}
                    <div className="bg-[#0b0f19]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-indigo-500/40 before:to-transparent">

                        {/* Header Inside Card to save space */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="inline-flex items-center justify-center w-9 h-9 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.15)] flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-base font-semibold text-slate-100 tracking-tight">Admin Portal</h1>
                                <p className="text-[11px] text-slate-400 font-medium">Gadget Store Management</p>
                            </div>
                        </div>

                        {status && (
                            <div className="mb-4 text-[11px] font-medium text-emerald-400 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-0.5">
                                    <InputLabel htmlFor="admin-email" value="Email Address" className="text-[10px] font-bold uppercase tracking-wider text-slate-400" />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
                                        </svg>
                                    </div>
                                    <TextInput
                                        id="admin-email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full h-10 bg-slate-950/40 border border-slate-800 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 rounded-lg pl-9 pr-3 text-slate-200 placeholder-slate-600 transition-all text-xs outline-none shadow-none"
                                        placeholder="admin@getitmoving.com"
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1 text-[11px]" />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-0.5">
                                    <InputLabel htmlFor="admin-password" value="Password" className="text-[10px] font-bold uppercase tracking-wider text-slate-400" />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                    </div>
                                    <TextInput
                                        id="admin-password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full h-10 bg-slate-950/40 border border-slate-800 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 rounded-lg pl-9 pr-3 text-slate-200 placeholder-slate-600 transition-all text-xs outline-none shadow-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-1 text-[11px]" />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-10 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-medium rounded-lg text-xs transition-all shadow-[0_4px_20px_rgba(99,102,241,0.25)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Highly Refined Compact Dev Fill Section */}
                        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Fill:</span>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('admin@getitmoving.com', 'admin123')}
                                className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 rounded-full text-[10px] text-indigo-400 font-medium transition-all group cursor-pointer"
                            >
                                <svg className={`w-3 h-3 transition-colors ${copied ? 'text-emerald-400' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                                </svg>
                                <span>{copied ? 'Copied & Filled!' : 'Admin Demo'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Back Link */}
                    <div className="mt-5 text-center">
                        <Link
                            href="/"
                            className="text-slate-500 hover:text-slate-300 text-[11px] font-medium transition-colors inline-flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Storefront
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <FrontendLayout categories={categories} brands={brands}>
            <Head title="Account Login" />
            {FormContent}
        </FrontendLayout>
    );
}
