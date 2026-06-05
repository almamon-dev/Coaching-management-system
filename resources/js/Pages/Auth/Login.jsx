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

    // USER LOGIN (Lohadi High School styling based on Green Uni reference)
    return (
        <>
            <Head title="Account Login" />
            
            <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden font-sans">
                {/* Top Left Gradient Circle */}
                <div 
                    className="absolute top-[-25%] left-[-15%] w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(98,177,70,0.2) 0%, rgba(255,255,255,0) 70%)' }}
                ></div>
                
                {/* Bottom Right Gradient Circle */}
                <div 
                    className="absolute bottom-[-25%] right-[-15%] w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(98,177,70,0.2) 0%, rgba(255,255,255,0) 70%)' }}
                ></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 w-full max-w-5xl">
                    
                    {/* Left Side - Logo & Typography */}
                    <div className="flex items-center gap-3 md:gap-5 max-w-full">
                        <div className="w-[60px] h-[80px] md:w-[90px] md:h-[110px] lg:w-[100px] lg:h-[120px] flex-shrink-0">
                            {/* Abstract Tree/Leaf Logo mimicking the screenshot structure */}
                            <svg viewBox="0 0 100 120" className="w-full h-full fill-none stroke-[#008a45]" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter">
                                {/* Center Trunk */}
                                <path d="M50 110 V10" />
                                {/* Left Branches */}
                                <path d="M50 30 Q25 30 10 40" />
                                <path d="M50 50 Q25 50 10 60" />
                                <path d="M50 70 Q25 70 10 80" />
                                <path d="M50 90 Q25 90 10 100" />
                                {/* Right Branches */}
                                <path d="M50 20 Q75 20 90 30" />
                                <path d="M50 40 Q75 40 90 50" />
                                <path d="M50 60 Q75 60 90 70" />
                                <path d="M50 80 Q75 80 90 90" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-[24px] sm:text-[32px] md:text-[38px] lg:text-[46px] font-bold leading-[1.1] text-[#008a45] font-serif uppercase tracking-wide whitespace-nowrap">
                                Lohadi High<br/>School
                            </h1>
                            <span className="text-[11px] sm:text-[14px] lg:text-[18px] text-[#008a45] tracking-[0.15em] lg:tracking-[0.2em] font-medium mt-1 md:mt-2 uppercase whitespace-nowrap">
                                Of Bangladesh
                            </span>
                        </div>
                    </div>

                    {/* Right Side - Login Box */}
                    <div className="bg-white rounded-[4px] p-10 w-full max-w-[400px] relative z-10" style={{ boxShadow: '0px 0px 40px rgba(98,177,70,0.2)' }}>
                        <h2 className="text-center text-[32px] font-serif text-[#4a3f35] mb-8">Login</h2>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Username Field */}
                            <div className="relative border-b border-[#a4b0c0] focus-within:border-[#008a45] transition-colors pb-1">
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[#778ca3]">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <input 
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full pl-9 pr-3 py-1 bg-transparent border-none focus:ring-0 text-[15px] text-gray-800 placeholder-[#778ca3]" 
                                    placeholder="Username"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1 text-xs" />

                            {/* Password Field */}
                            <div className="relative border-b border-[#a4b0c0] focus-within:border-[#008a45] transition-colors pb-1">
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[#778ca3]">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <input 
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="w-full pl-9 pr-3 py-1 bg-transparent border-none focus:ring-0 text-[15px] text-gray-800 placeholder-[#778ca3]" 
                                    placeholder="Password"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1 text-xs" />

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-3 mt-4 bg-gradient-to-r from-[#5ca939] to-[#8ac950] hover:from-[#4b8a2e] hover:to-[#74ad42] text-white rounded-[4px] font-medium transition-colors text-[16px] shadow-md"
                            >
                                Login
                            </button>
                        </form>

                        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Test Credentials:</span>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('mamon193p@gmail.com', 'user123')}
                                className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-gray-50 hover:bg-gray-100 rounded text-[11px] text-gray-600 font-medium transition-colors"
                            >
                                <span>{copied ? 'Copied!' : 'Click to Fill'}</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Back Link to Home */}
                <div className="absolute top-6 left-6 z-20">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#008a45] hover:text-[#006834] font-medium text-[14px]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
}
