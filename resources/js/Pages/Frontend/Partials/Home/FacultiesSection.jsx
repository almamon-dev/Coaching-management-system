import React from 'react';
import { Link } from '@inertiajs/react';

export default function FacultiesSection() {
    const classOfferings = [
        {
            id: 'class6-8',
            classTitle: 'Class 6 - 8 (Junior Foundation)',
            badge: 'Class 6-8 Batch',
            color: 'bg-amber-50 text-amber-700 font-semibold',
            icon: '📖',
            subjects: ['General Mathematics', 'General Science', 'English Special Care', 'ICT & Computing'],
            description: 'Fundamental concept building, strong academic foundation in Math & Science, and chapter-wise tests.'
        },
        {
            id: 'class9-10',
            classTitle: 'Class 9 - 10 (SSC Preparation)',
            badge: 'SSC Special',
            color: 'bg-blue-50 text-blue-700 font-semibold',
            icon: '📚',
            subjects: ['Physics', 'Chemistry', 'Higher Mathematics', 'General Mathematics', 'ICT'],
            description: 'Comprehensive SSC syllabus coverage, board exam test-paper solving, and intensive revision batches.'
        },
        {
            id: 'hsc1-2',
            classTitle: 'HSC 1st & 2nd Year',
            badge: 'HSC Mastery',
            color: 'bg-emerald-50 text-emerald-700 font-semibold',
            icon: '🔬',
            subjects: ['Physics (1st & 2nd Paper)', 'Chemistry (1st & 2nd Paper)', 'Higher Math (1st & 2nd Paper)', 'ICT Special Care'],
            description: 'Comprehensive HSC board exam preparation focusing on Creative Questions (CQ), MCQs, and concept clarity.'
        }
    ];

    return (
        <section className="py-8 md:py-10 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <div className="inline-block px-3 py-1 bg-[#16a34a]/10 text-[#16a34a] font-bold text-[10px] rounded-full mb-2">Academic Subjects & Classes</div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Classes & Subjects We Teach</h2>
                    <p className="text-slate-600 text-[13px] leading-relaxed">Structured academic coaching and weekly evaluations across key classes and subjects:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {classOfferings.map((offering) => (
                        <div key={offering.id} className="bg-white rounded-lg p-5 shadow-sm hover:shadow transition-all duration-200 border border-slate-200/70 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-2.5 py-0.5 text-[11px] rounded-md ${offering.color}`}>
                                        {offering.badge}
                                    </span>
                                    <span className="text-xl">{offering.icon}</span>
                                </div>
                                
                                <h3 className="text-base font-bold text-slate-900 mb-1.5">{offering.classTitle}</h3>
                                <p className="text-[12px] text-slate-500 mb-3 leading-snug">{offering.description}</p>
                                
                                <div className="space-y-1.5 border-t border-slate-100 pt-3 mb-4">
                                    <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Covered Subjects:</span>
                                    {offering.subjects.map((sub, sIdx) => (
                                        <div key={sIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                                            <span>{sub}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link 
                                href={route('class.details', offering.id)} 
                                className="w-full text-center py-2 bg-transparent hover:bg-[#009ca6] text-[#009ca6] hover:text-white font-bold text-xs rounded-[3px] border-2 border-[#009ca6] transition-all block"
                            >
                                View Batch Routine & Details
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
