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
            description: 'ষষ্ঠ থেকে অষ্টম শ্রেণীর শিক্ষার্থীদের জন্য গণিত, বিজ্ঞান ও ইংরেজির বেসিক কনসেপ্ট ক্লিয়ারিং ক্লাস, অধ্যায়ভিত্তিক অনুশীলন ও বিশেষ দুর্বলতা সংশোধন সেশন।',
            feeInfo: 'মাসিক ফি: ৳ ২,০০০ (সকল বিষয় অন্তর্ভুক্ত)',
            subjects: [
                { name: 'General Math (সাধারণ গণিত)', desc: 'বীজগণিত, পাটিগণিত ও জ্যামিতির মৌলিক ধারণা ও অনুশীধনী সলভিং।' },
                { name: 'General Science (সাধারণ বিজ্ঞান)', desc: 'পদার্থ, রসায়ন ও জীববিজ্ঞানের বুনিয়াদি পাঠদান।' },
                { name: 'English Special Care (ইংরেজি)', desc: 'Grammar, Reading Skill, Vocabulary & Creative Writing.' },
                { name: 'ICT (তথ্য ও যোগাযোগ প্রযুক্তি)', desc: 'বেসিক আইসিটি ও কম্পিউটার বিষয়ের ব্যবহারিক প্রস্তুতি।' }
            ],
            routines: [
                { day: 'শনিবার, সোমবার, বুধবার', time: 'বিকেল ৩:৩০ - বিকেল ৫:০০', subject: 'সাধারণ গণিত ও বিজ্ঞান' },
                { day: 'রবিবার, মঙ্গলবার, বৃহস্পতিবার', time: 'বিকেল ৩:৩০ - বিকেল ৫:০০', subject: 'English Special & ICT' }
            ],
            features: [
                'প্রতি সপ্তাহে অধ্যায়ভিত্তিক ক্লাস টেস্ট ও ফিডব্যাক',
                'দুর্বল শিক্ষার্থীদের জন্য অতিরিক্ত কেয়ার সেশন',
                'অভিভাবকদের নিয়মিত অগ্রগতি রিপোর্ট প্রদান'
            ]
        },
        'class9-10': {
            title: 'Class 9 - 10 (SSC Preparation Batch)',
            badge: 'SSC Special',
            icon: '📚',
            description: 'এসএসসি পরীক্ষার্থীদের জন্য পদার্থবিজ্ঞান, রসায়ন, উচ্চতর গণিত ও সাধারণ গণিতের সম্পূর্ণ সিলেবাস কভারেজ, টেস্ট পেপার সলভিং এবং টার্গেট A+ প্রস্তুতি।',
            feeInfo: 'মাসিক ফি: ৳ ২,৫০০ (সকল বিষয় অন্তর্ভুক্ত)',
            subjects: [
                { name: 'Physics (পদার্থবিজ্ঞান)', desc: 'গতি, বল, কাজ-ক্ষমতা, আলো ও তড়িৎ অধ্যায়ের গাণিতিক সমস্যার সমাধান।' },
                { name: 'Chemistry (রসায়ন)', desc: 'মৌলের পর্যায় সারণি, রাসায়নিক বন্ধন ও বিক্রিয়ার সহজ মেথড।' },
                { name: 'Higher Math (উচ্চতর গণিত)', desc: 'স্থানাঙ্ক জ্যামিতি, ত্রিকোণমিতি, ভেক্টর ও সম্ভাবনা সলভিং।' },
                { name: 'General Math (সাধারণ গণিত)', desc: 'বোর্ড টেস্ট পেপার ও সৃজনশীল (CQ) সলভিং মেথড।' },
                { name: 'ICT (তথ্য ও যোগাযোগ প্রযুক্তি)', desc: 'এইচটিএমএল, সি প্রোগ্রামিং ও আইসিটি শর্টকাটস।' }
            ],
            routines: [
                { day: 'শনিবার, সোমবার, বুধবার', time: 'বিকেল ৫:০০ - সন্ধ্যা ৭:০০', subject: 'পদার্থবিজ্ঞান ও উচ্চতর গণিত' },
                { day: 'রবিবার, মঙ্গলবার, বৃহস্পতিবার', time: 'বিকেল ৫:০০ - সন্ধ্যা ৭:০০', subject: 'রসায়ন, সাধারণ গণিত ও ICT' }
            ],
            features: [
                'বিগত ১০ বছরের বোর্ড প্রশ্ন ও শীর্ষ স্কুলের টেস্ট পেপার সলভিং',
                'ওএমআর সিটে নিয়মিত এমসিকিউ টেস্ট গ্রহণ',
                'পরীক্ষার পূর্বে ফাইনাল মডেল টেস্ট ও সাজেশন প্রদান'
            ]
        },
        'hsc1-2': {
            title: 'HSC 1st & 2nd Year (HSC Mastery Batch)',
            badge: 'HSC Special',
            icon: '🔬',
            description: 'এইচএসসি পরীক্ষার্থীদের জন্য ফিজিক্স, কেমিস্ট্রি, হায়ার ম্যাথ ১ম ও ২য় পত্রের পূর্ণাঙ্গ প্রস্তুতি, গাণিতিক প্রবলেম সলভিং ও বোর্ড CQ/MCQ মাস্টারপ্লাস।',
            feeInfo: 'মাসিক ফি: ৳ ৩,০০০ (সকল বিষয় অন্তর্ভুক্ত)',
            subjects: [
                { name: 'Physics 1st & 2nd Paper', desc: 'ভেক্টর, নিউটনীয় বলবিদ্যা, তাপগতিবিদ্যা, আলো ও আধুনিক পদার্থবিজ্ঞান।' },
                { name: 'Chemistry 1st & 2nd Paper', desc: 'গুণগত রসায়ন, জৈব রসায়ন (Organic Chemistry) ও তড়িৎ রসায়ন।' },
                { name: 'Higher Math 1st & 2nd Paper', desc: 'ক্যালকুলাস (ডিফারেন্সিয়েশন ও ইন্টিগ্রেশন), জটিল সংখ্যা ও বহুপদী।' },
                { name: 'ICT Special Care', desc: 'C Programming, HTML Code, Data Structure & Logic Gates.' }
            ],
            routines: [
                { day: 'শনিবার, সোমবার, বুধবার', time: 'সকাল ৮:০০ - ১০:০০ / বিকেল ৪:০০ - ৬:০০', subject: 'পদার্থবিজ্ঞান ১ম/২য় পত্র ও উচ্চতর গণিত' },
                { day: 'রবিবার, মঙ্গলবার, বৃহস্পতিবার', time: 'সকাল ৮:০০ - ১০:০০ / বিকেল ৪:০০ - ৬:০০', subject: 'রসায়ন ১ম/২য় পত্র ও ICT Special' }
            ],
            features: [
                'অধ্যায়ভিত্তিক বেসিক থেকে এডভান্সড গাণিতিক নোট প্রদান',
                'এইচএসসি বোর্ড পরীক্ষার প্রশ্ন ব্যাংক সম্পূর্ণ সমাধান',
                'ফাইনাল মডেল টেস্ট ও পারফরম্যান্স র‍্যাংকিং প্রকাশ'
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
                                <BookOpen className="text-[#16a34a]" size={18} /> বিষয়ভিত্তিক পাঠদান ও সিলেবাস (Subjects Taught)
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
                                <Clock className="text-[#009ca6]" size={18} /> সাপ্তাহিক ব্যাচ শিডিউল (Batch Routine)
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
                                <ShieldCheck className="text-purple-600" size={18} /> বিশেষ সুবিধাসমূহ (Batch Features)
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
                                    <PhoneCall size={15} /> কল করে ভর্তি হোন: +880 1711-000000
                                </a>
                                <Link
                                    href={route('student.login')}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-[3px] flex items-center justify-center gap-2 transition-all border border-slate-700"
                                >
                                    <LogIn size={15} /> স্টুডেন্ট পোর্টালে লগইন
                                </Link>
                            </div>

                            <div className="text-[10px] text-slate-400 text-center border-t border-slate-800 pt-3">
                                নিয়মিত মডেল টেস্ট ও আপডেট পেতে কোচিং পোর্টালে যুক্ত থাকুন।
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
