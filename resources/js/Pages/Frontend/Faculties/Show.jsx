import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Mail, Phone, ArrowLeft, GraduationCap, Award, BookOpen } from 'lucide-react';

export default function FacultyShow({ faculty }) {
    return (
        <FrontendLayout>
            <Head title={`${faculty.name} - Lohadi High School`} />

            {/* Profile Header Banner */}
            <div className="bg-[#15803d] pt-12 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-between items-center px-10">
                    <BookOpen size={100} />
                    <GraduationCap size={150} />
                </div>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 md:px-8 -mt-16 relative z-10 mb-16">
                <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-slate-100">
                    
                    <div className="p-6 md:p-8">
                        {/* Back Button */}
                        <Link href={route('faculties.index')} className="inline-flex items-center text-[#16a34a] hover:text-[#009ca6] font-bold text-sm mb-6 transition-colors">
                            <ArrowLeft size={16} className="mr-2" /> Back to Faculty List
                        </Link>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            
                            {/* Left Column: Image & Contact */}
                            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                                    <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover" />
                                </div>
                                
                                <span className="px-3 py-1 bg-[#f0f9f8] text-[#16a34a] text-[10px] font-bold rounded-full uppercase tracking-wider mb-4">
                                    {faculty.department}
                                </span>
                                
                                <div className="w-full flex flex-col gap-2 text-[13px] text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-1.5 uppercase text-[10px] tracking-wider border-b border-slate-200 pb-1.5">Contact Info</h4>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Mail size={14} className="text-[#009ca6]" />
                                        <a href={`mailto:${faculty.email}`} className="hover:text-[#009ca6] transition-colors">{faculty.email}</a>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Phone size={14} className="text-[#009ca6]" />
                                        <a href={`tel:${faculty.phone}`} className="hover:text-[#009ca6] transition-colors">{faculty.phone}</a>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Column: Details */}
                            <div className="w-full md:w-2/3">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1.5">{faculty.name}</h1>
                                <p className="text-lg text-[#009ca6] font-bold mb-6">{faculty.role}</p>
                                
                                <div className="mb-6">
                                    <h3 className="flex items-center text-base font-bold text-slate-800 mb-2">
                                        <Award size={18} className="text-[#16a34a] mr-2" /> About
                                    </h3>
                                    <div className="text-slate-600 text-sm leading-relaxed space-y-3">
                                        {faculty.bio.split('\n\n').map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="flex items-center text-base font-bold text-slate-800 mb-4">
                                        <GraduationCap size={18} className="text-[#16a34a] mr-2" /> Qualifications
                                    </h3>
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                                        {Array.isArray(faculty.qualifications) && faculty.qualifications.map((qual, index) => {
                                            const isObj = typeof qual === 'object' && qual !== null;
                                            const qYear = isObj && qual.year ? qual.year : '✓';
                                            const qDegree = isObj && qual.degree ? qual.degree : qual;
                                            const qMajor = isObj && qual.major ? qual.major : '-';
                                            const qInst = isObj && qual.institution ? qual.institution : '-';
                                            
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={`flex gap-3.5 items-center p-3.5 ${index !== faculty.qualifications.length - 1 ? 'border-b border-slate-200/60' : ''} hover:bg-slate-100/50 transition-colors`}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0 shadow-sm">
                                                        <span className="text-white font-bold text-[11px] tracking-wide">{qYear}</span>
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center overflow-hidden">
                                                        <h4 className="text-[14px] font-bold text-slate-800 leading-tight truncate">{qDegree}</h4>
                                                        {isObj && (
                                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] mt-1 text-slate-500">
                                                                <span className="font-semibold text-slate-600">Major:</span> 
                                                                <span className="truncate max-w-[120px] sm:max-w-none">{qMajor}</span>
                                                                <span className="text-slate-300 hidden sm:inline">|</span>
                                                                <span className="font-semibold text-slate-600">Inst:</span> 
                                                                <span className="truncate max-w-[150px] sm:max-w-none">{qInst}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
