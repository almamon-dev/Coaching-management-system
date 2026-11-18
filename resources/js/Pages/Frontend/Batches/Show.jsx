import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { 
    Calendar, Clock, MapPin, Users, Video, BookOpen, 
    GraduationCap, ArrowRight, ArrowLeft, Check, Coins, 
    ChevronRight, Phone, Mail, Award, CheckCircle2, ShieldCheck, 
    Sparkles, HelpCircle
} from 'lucide-react';

export default function BatchShow({ batch = {}, otherBatches = [], settings = {} }) {
    const { settings: globalSettings } = usePage().props;
    const centerName = settings?.center_name || globalSettings?.center_name || "Ullash Coaching Center";
    const phone = settings?.phone || globalSettings?.phone || "+880 1711-000000";
    const email = settings?.email || globalSettings?.email || "info@ullashcoaching.com";

    const safeRoute = (name, params = undefined, fallback = '#') => {
        try {
            if (typeof route === 'function') {
                return route(name, params);
            }
        } catch {
            // fallback
        }
        return fallback;
    };

    return (
        <FrontendLayout>
            <Head title={`${batch.display_title || batch.name || 'Batch Details'} - ${centerName}`} />

            {/* Top Page Header Banner */}
            <div className="bg-[#009ca6] text-white py-12 md:py-14 relative overflow-hidden font-inter">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                    
                    {/* Breadcrumbs */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-[4px] text-xs font-semibold text-white uppercase tracking-wider mb-4">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link href="/#batches" className="hover:text-emerald-200 transition-colors">Batches</Link>
                        <ChevronRight size={12} />
                        <span>Details</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="max-w-3xl space-y-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-[4px] uppercase tracking-wider border border-white/30">
                                    <GraduationCap size={13} />
                                    <span>{batch.category || 'Academic Batch'}</span>
                                </span>
                                {batch.code && (
                                    <span className="text-xs font-mono font-medium text-white/90 bg-black/20 px-2 py-0.5 rounded-[4px] border border-white/20">
                                        Batch: {batch.code}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                                {batch.display_title || batch.name}
                            </h1>

                            <p className="text-xs sm:text-sm text-teal-50 max-w-2xl leading-relaxed">
                                {batch.description}
                            </p>
                        </div>

                        <div className="shrink-0">
                            <Link
                                href={safeRoute('admissions', undefined, '/admissions')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold rounded-[4px] shadow-md transition-all cursor-pointer"
                            >
                                <span>Join This Batch</span>
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-10 bg-slate-50/60 font-inter">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        {/* Left Main Column */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Key Specifications Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-[4px] border border-slate-200/90 shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-[4px] bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                                        <Calendar size={18} className="text-[#009ca6]" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Duration</span>
                                        <span className="text-sm font-bold text-slate-900 mt-1 block">{batch.duration || '12 Months'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-[4px] bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                                        <Video size={18} className="text-[#009ca6]" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Total Classes</span>
                                        <span className="text-sm font-bold text-slate-900 mt-1 block">{batch.total_classes}+</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-[4px] bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                        <Users size={18} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Seats Left</span>
                                        <span className="text-sm font-bold text-emerald-700 mt-1 block">{batch.seats_left ?? 25} Remaining</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-[4px] bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                        <MapPin size={18} className="text-slate-600" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Room</span>
                                        <span className="text-sm font-bold text-slate-900 mt-1 block truncate max-w-[120px]">{batch.room || 'Main Campus'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Class Routine & Schedule Card */}
                            <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <Clock size={16} className="text-[#009ca6]" />
                                    <span>Class Routine & Batch Schedule</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-[4px] bg-[#f0fdfa] border border-[#ccfbf1] space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Weekly Class Days</span>
                                        <p className="text-base font-bold text-slate-800 flex items-center gap-2">
                                            <Calendar size={15} className="text-[#009ca6]" />
                                            <span>{batch.class_days || 'Regular Days'}</span>
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-[4px] bg-[#f0fdfa] border border-[#ccfbf1] space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Class Time Slot</span>
                                        <p className="text-base font-bold text-[#009ca6] flex items-center gap-2">
                                            <Clock size={15} className="text-[#009ca6]" />
                                            <span>{batch.class_time || 'Regular Schedule'}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Instructor Info */}
                                {batch.teacher_name && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-[4px] bg-[#009ca6]/10 text-[#009ca6] font-black text-sm flex items-center justify-center shrink-0 border border-teal-200">
                                                {batch.teacher_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Lead Subject Instructor</span>
                                                <h4 className="text-sm font-bold text-slate-900">{batch.teacher_name}</h4>
                                                <p className="text-xs text-slate-500">{batch.teacher_designation || 'Academic Specialist'}</p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[4px] border border-emerald-200">
                                            <Award size={13} />
                                            <span>Certified Faculty</span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Included Subjects & Papers Breakdown */}
                            <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <BookOpen size={16} className="text-[#009ca6]" />
                                        <span>Included Subjects & Papers ({batch.subjects?.length || 1})</span>
                                    </h3>
                                    <span className="text-xs text-slate-400 font-medium">Complete Syllabus Coverage</span>
                                </div>

                                {batch.subjects && batch.subjects.length > 0 ? (
                                    <div className="space-y-3">
                                        {batch.subjects.map((sub, i) => (
                                            <div 
                                                key={sub.id || i}
                                                className="p-4 rounded-[4px] border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-teal-200 transition-colors"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="w-6 h-6 rounded-[4px] bg-[#009ca6] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                                            {i + 1}
                                                        </span>
                                                        <h4 className="font-bold text-sm text-slate-900">
                                                            {typeof sub === 'object' ? sub.name : sub}
                                                        </h4>
                                                        {sub.code && (
                                                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-[2px]">
                                                                {sub.code}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {sub.lectures && (
                                                        <span className="text-xs font-bold text-[#009ca6] bg-teal-50 px-2.5 py-0.5 rounded-[4px] border border-teal-200/70 shrink-0">
                                                            {sub.lectures} Lectures
                                                        </span>
                                                    )}
                                                </div>

                                                {sub.description && (
                                                    <p className="text-xs text-slate-600 mt-2 pl-8.5 leading-relaxed">
                                                        {sub.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-[4px] bg-slate-50 border border-slate-200 text-xs text-slate-600">
                                        This batch covers full board curriculum lessons, intensive exercises, creative question (CQ) mastery, and weekly model tests.
                                    </div>
                                )}
                            </div>

                            {/* Batch Features & Academic Facilities */}
                            <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <Sparkles size={16} className="text-[#009ca6]" />
                                    <span>Program Benefits & Academic Support</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                                    <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-slate-50 border border-slate-200/70">
                                        <CheckCircle2 size={16} className="text-[#16a34a] shrink-0 mt-0.5" />
                                        <span><strong>Weekly Model Tests:</strong> Board-standard chapter-wise tests and performance ranking.</span>
                                    </div>
                                    <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-slate-50 border border-slate-200/70">
                                        <CheckCircle2 size={16} className="text-[#16a34a] shrink-0 mt-0.5" />
                                        <span><strong>Printed Lecture Sheets:</strong> Comprehensive summary notes & formula sheets for all chapters.</span>
                                    </div>
                                    <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-slate-50 border border-slate-200/70">
                                        <CheckCircle2 size={16} className="text-[#16a34a] shrink-0 mt-0.5" />
                                        <span><strong>Special Doubt Clearing:</strong> Dedicated weekly Q&A sessions with senior mentors.</span>
                                    </div>
                                    <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-slate-50 border border-slate-200/70">
                                        <CheckCircle2 size={16} className="text-[#16a34a] shrink-0 mt-0.5" />
                                        <span><strong>Guardian SMS & App:</strong> Automated attendance, exam results and progress updates.</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Sidebar Column */}
                        <div className="space-y-6">
                            
                            {/* Admission & Fee Structure Card */}
                            <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-sm p-6 space-y-5 sticky top-20">
                                
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tuition & Admission</span>
                                    <h3 className="text-lg font-black text-slate-900">Fee Structure</h3>
                                </div>

                                {/* Fee Box */}
                                <div className="p-4 rounded-[4px] bg-amber-50/70 border border-amber-200/90 space-y-3">
                                    <div className="flex items-baseline justify-between border-b border-amber-200/60 pb-2">
                                        <span className="text-xs font-semibold text-slate-600">Monthly Tuition Fee</span>
                                        <span className="text-xl font-black text-slate-900">৳{Number(batch.fee || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-xs font-semibold text-slate-600">Registration / Admission Fee</span>
                                        <span className="text-sm font-bold text-slate-800">৳{Number(batch.admission_fee || 500).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Seats & Status */}
                                <div className="p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                                        <span className="font-bold text-emerald-800">Admissions Open</span>
                                    </div>
                                    <span className="font-semibold text-emerald-700">{batch.seats_left ?? 25} Seats Available</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2.5 pt-1">
                                    <Link
                                        href={safeRoute('admissions', undefined, '/admissions')}
                                        className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-bold rounded-[4px] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>Apply For This Batch</span>
                                        <ArrowRight size={15} />
                                    </Link>

                                    <Link
                                        href="/#batches"
                                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-[4px] transition-colors text-center block cursor-pointer"
                                    >
                                        ← Back to All Batches
                                    </Link>
                                </div>

                                {/* Counseling Helpline */}
                                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                                    <span className="font-bold text-slate-700 block">Need Admission Assistance?</span>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Phone size={13} className="text-[#009ca6]" />
                                        <span>{phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail size={13} className="text-[#009ca6]" />
                                        <span>{email}</span>
                                    </div>
                                </div>

                            </div>

                            {/* Other Active Batches */}
                            {otherBatches && otherBatches.length > 0 && (
                                <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-5 space-y-4">
                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                                        Other Available Batches
                                    </h4>

                                    <div className="space-y-3">
                                        {otherBatches.map(ob => (
                                            <Link
                                                key={ob.id}
                                                href={safeRoute('batches.show', ob.id, `/batches/${ob.id}`)}
                                                className="block p-3 rounded-[4px] border border-slate-200/70 hover:border-[#009ca6] hover:bg-teal-50/10 transition-colors group cursor-pointer"
                                            >
                                                <h5 className="font-bold text-xs text-slate-900 group-hover:text-[#009ca6] transition-colors">
                                                    {ob.display_title}
                                                </h5>
                                                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                                                    <span>{ob.class_days}</span>
                                                    <span className="font-bold text-slate-800">৳{Number(ob.fee).toLocaleString()}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}

