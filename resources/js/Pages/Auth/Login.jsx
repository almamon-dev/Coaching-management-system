import React, { useEffect, useState } from 'react';
import InputError from '@/Components/Form/InputError';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SchoolLogo from '@/Components/SchoolLogo';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Login({ status, canResetPassword, isAdmin, isTeacher, isStudent }) {
    const { t } = useTranslation();
    const { categories, brands } = usePage().props;
    const [copied, setCopied] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
        let routeName = 'login';
        if (isStudent) routeName = 'student.login';
        if (isAdmin) routeName = 'admin.login';
        if (isTeacher) routeName = 'teacher.login';
        post(route(routeName));
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
                <Head title="Admin Access | School Management" />

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
                                <p className="text-[11px] text-slate-400 font-medium">School Management System</p>
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
                                        placeholder="admin@school.com"
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
                                onClick={() => handleQuickLogin('admin@school.com', 'admin123')}
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
            <Head title={isTeacher ? "Teacher Login" : "Student Login"} />
            
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

                <div className="container mx-auto px-4 relative z-10 flex items-center justify-center w-full max-w-4xl">
                    
                    {/* Unified Split Card */}
                    <div className="flex flex-col lg:flex-row w-full bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,138,69,0.2)] border border-gray-100 overflow-hidden items-stretch">
                        
                        {/* Left Side - Logo Container */}
                        <div className="w-full lg:w-1/2 bg-slate-50 flex flex-col items-center justify-center p-12 border-b lg:border-b-0 lg:border-r border-slate-100 relative overflow-hidden">
                            {/* Subtle decorative background inside left side */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#008a45 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
                            
                            <SchoolLogo variant="wide" className="scale-125 transform relative z-10" />
                        </div>

                        {/* Right Side - Login Box */}
                        <div className="w-full lg:w-1/2 p-8 md:p-12 relative z-10 flex flex-col justify-center bg-white">
                            <h2 className="text-center text-[32px] font-serif text-[#4a3f35] mb-8">
                                {isTeacher ? 'Teacher Login' : 'Student Login'}
                            </h2>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6 mt-4">
                            {/* Username Field */}
                            <div>
                                <div className="relative border-b border-[#a4b0c0] focus-within:border-[#008a45] transition-colors pb-1 pt-3">
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[#778ca3]">
                                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <input 
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="peer w-full pl-9 pr-3 py-1 bg-transparent border-none focus:ring-0 text-[15px] text-gray-800 placeholder-transparent" 
                                        placeholder="Username"
                                    />
                                    <label 
                                        htmlFor="email"
                                        className="absolute left-9 top-1/2 -translate-y-[22px] text-[12px] font-medium text-[#778ca3] transition-all duration-300 ease-out peer-placeholder-shown:text-[15px] peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-[22px] peer-focus:text-[12px] peer-focus:text-[#008a45] pointer-events-none"
                                    >
                                        Username
                                    </label>
                                </div>
                                <InputError message={errors.email} className="mt-1 text-xs" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="relative border-b border-[#a4b0c0] focus-within:border-[#008a45] transition-colors pb-1 pt-3">
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[#778ca3]">
                                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="peer w-full pl-9 pr-10 py-1 bg-transparent border-none focus:ring-0 text-[15px] text-gray-800 placeholder-transparent" 
                                        placeholder="Password"
                                    />
                                    <label 
                                        htmlFor="password"
                                        className="absolute left-9 top-1/2 -translate-y-[22px] text-[12px] font-medium text-[#778ca3] transition-all duration-300 ease-out peer-placeholder-shown:text-[15px] peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-[22px] peer-focus:text-[12px] peer-focus:text-[#008a45] pointer-events-none"
                                    >
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#778ca3] hover:text-[#008a45] transition-colors focus:outline-none p-1"
                                        title={showPassword ? "Hide Password" : "Show Password"}
                                    >
                                        {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1 text-xs" />
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-3 mt-4 bg-gradient-to-r from-[#5ca939] to-[#8ac950] hover:from-[#4b8a2e] hover:to-[#74ad42] text-white rounded-[4px] font-medium transition-colors text-[16px] shadow-md flex justify-center items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>
                    </div>
                    {/* End Unified Split Card */}
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
