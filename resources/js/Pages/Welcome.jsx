import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    GraduationCap, Users, UserCheck, BookOpen, Calendar, Wallet, Award,
    Bell, CheckCircle2, ArrowRight, Phone, Mail, MapPin, Shield, LogIn, Sparkles
} from 'lucide-react';

export default function Welcome({ batches, notices, stats }) {
    const { auth, settings } = usePage().props;

    const centerName = settings?.center_name || 'Ullash Coaching Center';
    const centerPhone = settings?.phone || '+880 1711-000000';
    const centerEmail = settings?.email || 'info@apexcoaching.bd';
    const centerAddress = settings?.address || 'House 42, Road 11, Block E, Banani, Dhaka';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
            <Head title={`Home - ${centerName}`} />

            {/* TOP BAR */}
            <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Phone size={13} className="text-emerald-400" /> {centerPhone}</span>
                        <span className="hidden sm:inline-flex items-center gap-1.5"><Mail size={13} className="text-emerald-400" /> {centerEmail}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Academic Year: <b className="text-emerald-400">2026</b></span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-300 font-semibold">{centerAddress}</span>
                    </div>
                </div>
            </div>

            {/* NAVIGATION HEADER */}
            <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
                            A
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-base leading-none tracking-tight">{centerName}</h1>
                            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mt-0.5 block">Operational Coaching System</span>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                            >
                                Enter Portal Dashboard <ArrowRight size={14} />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
                                >
                                    <LogIn size={14} /> Admin / Staff Login
                                </Link>
                                <Link
                                    href={route('student.login')}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all"
                                >
                                    Student & Guardian Portal
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        <Sparkles size={14} /> Comprehensive Coaching Operations System
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
                        Excellence in Academic Coaching & Student Operations
                    </h1>

                    <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Streamlining daily coaching center operations: Admissions, Batch Scheduling, Attendance Tracking, Digital Receipts, GPA Marksheets, and Live Student/Guardian Portals.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <a
                            href="#batches"
                            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2"
                        >
                            Explore batches & Programs <ArrowRight size={16} />
                        </a>
                        <Link
                            href={route('student.login')}
                            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all"
                        >
                            Student / Guardian Login
                        </Link>
                    </div>

                    {/* LIVE STATS STRIP */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
                        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <div className="text-3xl font-black text-emerald-400">{stats?.students || '250'}+</div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">Active Students</span>
                        </div>
                        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <div className="text-3xl font-black text-emerald-400">{stats?.batches || '12'}+</div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">batches & Programs</span>
                        </div>
                        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <div className="text-3xl font-black text-emerald-400">{stats?.teachers || '15'}+</div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">Expert Instructors</span>
                        </div>
                        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <div className="text-3xl font-black text-emerald-400">{stats?.success_rate || '98.5%'}</div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">Academic Success</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURE HIGHLIGHTS */}
            <section className="py-16 bg-slate-900 border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Built For Seamless Center Management</h2>
                        <p className="text-slate-400 text-sm mt-2">Everything required for coaching daily operations, class routines, financial receipts, and performance monitoring.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                                <GraduationCap size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Automated Admission Workflow</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Instant student ID generation (`UCCA-BATCH-XXXX`), course & batch assignment, and payment receipt issuing in Bangladeshi Taka (৳).</p>
                        </div>

                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Conflict-Free Routines</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Weekly routine scheduling with intelligent teacher and room conflict collision detection to avoid schedule overlaps.</p>
                        </div>

                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                                <Award size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white">GPA & Result Calculation</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Automated marks entry grid calculating percentage, grade (A+, A, B, etc.), GPA 5.0 scale, and printable student report cards.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* batches & PROGRAMS */}
            <section id="batches" className="py-16 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">Academic Offerings</span>
                            <h2 className="text-3xl font-black text-white">Active batches & Programs</h2>
                        </div>
                        <Link href={route('student.login')} className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                            Access Student Portal &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches && batches.length > 0 ? (
                            batches.map((course) => (
                                <div key={course.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">{course.code}</span>
                                            <span className="text-xs text-slate-400 font-medium">{course.batches_count} Batches</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{course.title}</h3>
                                        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{course.description || 'Comprehensive academic prep program.'}</p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Course Fee</span>
                                            <span className="text-lg font-black text-emerald-400">৳ {parseFloat(course.fee).toLocaleString()}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg">{course.duration || 'Full Term'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                                Loading course catalog...
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* NOTICE BULLETIN */}
            {notices && notices.length > 0 && (
                <section className="py-16 bg-slate-900 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-2 mb-8">
                            <Bell className="text-emerald-400" size={24} />
                            <h2 className="text-2xl font-bold text-white">Center Notice Board</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {notices.map((n) => (
                                <div key={n.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                                    <div>
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span className="font-bold text-emerald-400 uppercase">{n.category}</span>
                                            <span className="text-slate-500">{n.published_at}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white">{n.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER */}
            <footer className="bg-slate-950 border-t border-slate-800 py-12 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-base mb-1">
                            <div className="w-6 h-6 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">A</div>
                            {centerName}
                        </div>
                        <p>{centerAddress} • Phone: {centerPhone}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href={route('login')} className="text-slate-400 hover:text-white transition-all">Admin Access</Link>
                        <span>•</span>
                        <Link href={route('student.login')} className="text-slate-400 hover:text-white transition-all">Student Portal</Link>
                        <span>•</span>
                        <Link href={route('student.login')} className="text-slate-400 hover:text-white transition-all">Guardian Portal</Link>
                    </div>

                    <div>
                        <p>&copy; 2026 {centerName}. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
