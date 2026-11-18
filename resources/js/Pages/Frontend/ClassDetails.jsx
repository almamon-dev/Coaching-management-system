import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { BookOpen, Clock, CheckCircle, PhoneCall, LogIn, ShieldCheck } from 'lucide-react';

export default function ClassDetails({ classId }) {
    const classDataMap = {
        'class6-8': {
            title: 'Class 6 - 8 (Junior Academic Foundation)',
            badge: 'Class 6 - 8 Batch',
            icon: '📖',
            description: 'Basic conceptual foundation classes in Mathematics, Science, and English for grades 6 to 8 with chapter-wise problem solving and personalized doubt-clearing sessions.',
            feeInfo: 'Monthly Fee: ৳ 2,000 (All Subjects Included)',
            subjects: [
                { name: 'General Mathematics', desc: 'Core fundamentals of Algebra, Arithmetic, and Geometry with exercise-solving.' },
                { name: 'General Science', desc: 'Fundamental concepts in Physics, Chemistry, and Biology.' },
                { name: 'English Special Care', desc: 'Grammar mastery, reading comprehension, vocabulary, and creative writing.' },
                { name: 'ICT & Computing', desc: 'Basic information technology, computer science fundamentals, and practical applications.' }
            ],
            routines: [
                { day: 'Saturday, Monday, Wednesday', time: '03:30 PM - 05:00 PM', subject: 'General Mathematics & Science' },
                { day: 'Sunday, Tuesday, Thursday', time: '03:30 PM - 05:00 PM', subject: 'English Special & ICT' }
            ],
            features: [
                'Weekly chapter-wise class tests and analytical performance feedback',
                'Dedicated extra doubt-clearing care sessions for struggling students',
                'Regular student progress and attendance updates for guardians'
            ]
        },
        'class9-10': {
            title: 'Class 9 - 10 (SSC Preparation Batch)',
            badge: 'SSC Special',
            icon: '📚',
            description: 'Complete board curriculum coverage for Physics, Chemistry, Higher Math, and General Math with board test-paper solving and target A+ preparation.',
            feeInfo: 'Monthly Fee: ৳ 2,500 (All Subjects Included)',
            subjects: [
                { name: 'Physics', desc: 'Kinematics, dynamics, energy, optics, and electricity numerical problem-solving.' },
                { name: 'Chemistry', desc: 'Periodic table, chemical bonding, reactions, and stoichiometry simplified.' },
                { name: 'Higher Mathematics', desc: 'Coordinate geometry, trigonometry, vectors, and probability problem-solving.' },
                { name: 'General Mathematics', desc: 'Board test-paper solving and creative question (CQ) strategies.' },
                { name: 'ICT & Programming', desc: 'HTML, C programming basics, and digital logic shortcuts.' }
            ],
            routines: [
                { day: 'Saturday, Monday, Wednesday', time: '05:00 PM - 07:00 PM', subject: 'Physics & Higher Mathematics' },
                { day: 'Sunday, Tuesday, Thursday', time: '05:00 PM - 07:00 PM', subject: 'Chemistry, General Math & ICT' }
            ],
            features: [
                'Last 10 years of board exam questions and top school test papers solved',
                'Regular OMR-sheet based MCQ mock exams',
                'Comprehensive final model test series with high-probability suggestions'
            ]
        },
        'hsc1-2': {
            title: 'HSC 1st & 2nd Year (HSC Mastery Batch)',
            badge: 'HSC Special',
            icon: '🔬',
            description: 'Comprehensive preparation for Physics, Chemistry, and Higher Math (1st & 2nd paper) focusing on advanced numerical problem solving and board CQ/MCQ mastery.',
            feeInfo: 'Monthly Fee: ৳ 3,000 (All Subjects Included)',
            subjects: [
                { name: 'Physics (1st & 2nd Paper)', desc: 'Vectors, Newtonian mechanics, thermodynamics, wave optics, and modern physics.' },
                { name: 'Chemistry (1st & 2nd Paper)', desc: 'Qualitative analysis, organic chemistry mechanisms, and electrochemistry.' },
                { name: 'Higher Mathematics (1st & 2nd Paper)', desc: 'Calculus (differentiation & integration), complex numbers, and polynomials.' },
                { name: 'ICT Special Care', desc: 'C Programming, HTML web design, data structures, and logic circuits.' }
            ],
            routines: [
                { day: 'Saturday, Monday, Wednesday', time: '08:00 AM - 10:00 AM / 04:00 PM - 06:00 PM', subject: 'Physics (1st/2nd Paper) & Higher Math' },
                { day: 'Sunday, Tuesday, Thursday', time: '08:00 AM - 10:00 AM / 04:00 PM - 06:00 PM', subject: 'Chemistry (1st/2nd Paper) & ICT' }
            ],
            features: [
                'Chapter-wise basic-to-advanced numerical formulas and lecture notes',
                'Complete solution of HSC board examination question banks',
                'Final board model test series with published merit rankings'
            ]
        }
    };

    const info = classDataMap[classId] || classDataMap['class9-10'];

    return (
        <FrontendLayout>
            <Head title={`${info.title} - Details`} />

            {/* Compact Header Banner */}
            <div className="bg-[#16a34a] text-white py-10 md:py-12">
                <div className="container mx-auto px-4 md:px-8 text-center max-w-5xl">
                    <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">{info.title}</h1>
                    <p className="text-white/90 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                        {info.description}
                    </p>
                </div>
            </div>

            {/* Content Container (Matching max-w-8xl) */}
            <div className="container mx-auto px-4 md:px-8 py-8 max-w-8xl">
                {/* Top Back Button */}
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:text-[#16a34a] font-bold text-xs rounded-[3px] border border-slate-200 shadow-sm transition-colors">
                        ← Back to Home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT 2 COLUMNS: SUBJECTS & ROUTINE */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* SUBJECTS TAUGHT */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200/70 shadow-sm space-y-3">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                <BookOpen className="text-[#16a34a]" size={18} /> Subjects Taught & Syllabus
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {info.subjects.map((sub, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 rounded-md border border-slate-100/80 space-y-0.5">
                                        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                            <CheckCircle className="text-[#16a34a] shrink-0" size={14} /> {sub.name}
                                        </h4>
                                        <p className="text-[11px] text-slate-500">{sub.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WEEKLY ROUTINE */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200/70 shadow-sm space-y-3">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                <Clock className="text-[#009ca6]" size={18} /> Weekly Batch Schedule
                            </h3>
                            <div className="space-y-2">
                                {info.routines.map((r, idx) => (
                                    <div key={idx} className="p-3 bg-[#f0f9f8] rounded-md border border-[#009ca6]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <div>
                                            <span className="font-bold text-slate-900 text-xs block">{r.day}</span>
                                            <span className="text-[11px] text-slate-600">{r.subject}</span>
                                        </div>
                                        <span className="px-2.5 py-0.5 bg-white text-[#009ca6] font-bold text-[11px] rounded border border-[#009ca6]/30">
                                            {r.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SPECIAL FEATURES */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200/70 shadow-sm space-y-3">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                <ShieldCheck className="text-purple-600" size={18} /> Batch Highlights & Features
                            </h3>
                            <div className="space-y-1.5 text-xs font-medium text-slate-700">
                                {info.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FEE & ADMISSION ACTION SIDEBAR */}
                    <div className="space-y-5">
                        <div className="bg-slate-900 text-white p-5 rounded-lg shadow-md space-y-5 sticky top-24 border border-slate-800">
                            <div className="border-b border-slate-800 pb-3">
                                <span className="text-[10px] font-bold text-[#16a34a] block mb-0.5">Batch Pricing & Admission</span>
                                <h3 className="text-lg font-bold">{info.badge} Fee Details</h3>
                            </div>

                            <div className="p-3 bg-slate-800/80 rounded border border-slate-700 text-xs font-bold text-emerald-400">
                                {info.feeInfo}
                            </div>

                            <div className="space-y-2.5 pt-1">
                                <a
                                    href="tel:+8801711000000"
                                    className="w-full py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] flex items-center justify-center gap-2 transition-all shadow"
                                >
                                    <PhoneCall size={15} /> Call for Admission: +880 1711-000000
                                </a>
                                <Link
                                    href={route('student.login')}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-[3px] flex items-center justify-center gap-2 transition-all border border-slate-700"
                                >
                                    <LogIn size={15} /> Login to Student Portal
                                </Link>
                            </div>

                            <div className="text-[10px] text-slate-400 text-center border-t border-slate-800 pt-3">
                                Stay connected via the coaching portal for routine updates and exam results.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
