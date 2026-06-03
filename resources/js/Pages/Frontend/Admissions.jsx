import React from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Phone, MapPin, Calendar, Clock, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Admissions() {
    return (
        <FrontendLayout>
            <Head title="Admission Instructions - Lohadi High School" />

            {/* Page Header */}
            <div className="bg-slate-900 py-6 md:py-8 relative overflow-hidden font-inter print:hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 max-w-8xl relative z-10">
                    <div className="flex items-center gap-2 text-[#16a34a] font-bold text-[10px] uppercase tracking-wider mb-2">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={10} />
                        <span className="text-slate-400">Admissions</span>
                    </div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight max-w-4xl">
                        Admission Instructions
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-16 bg-slate-50 font-inter">
                <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                    
                    {/* Alert Banner */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-10 flex gap-4 items-start shadow-sm">
                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="text-amber-800 font-bold text-[16px] mb-1">Online Admission is Currently Unavailable</h3>
                            <p className="text-amber-700/80 text-[14px] leading-relaxed">
                                Please note that we do not accept online applications at this moment. All admission procedures must be completed physically at the school administration office by the student's parents or legal guardians.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Instructions */}
                        <div className="md:col-span-2 space-y-8">
                            
                            {/* Step 1 */}
                            <div className="bg-white p-6 rounded-md shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#16a34a]/5 rounded-bl-full flex items-start justify-end p-3">
                                    <span className="text-[#16a34a] font-black text-xl">01</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <FileText className="text-[#009ca6]" size={20} />
                                    Collect Admission Form
                                </h3>
                                <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                                    Admission forms are available at the school's main office during working hours. You must collect the form by paying the fixed nominal fee. 
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#16a34a]/5 rounded-bl-full flex items-start justify-end p-3">
                                    <span className="text-[#16a34a] font-black text-xl">02</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="text-[#009ca6]" size={20} />
                                    Required Documents
                                </h3>
                                <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                                    Fill out the admission form properly and attach the following necessary documents:
                                </p>
                                <ul className="space-y-2 text-slate-600 text-[14px]">
                                    <li className="flex gap-2 items-start">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0"></div>
                                        <span>3 copies of recent passport size photographs of the student.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0"></div>
                                        <span>Photocopy of the student's Birth Certificate (Online verifiable).</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0"></div>
                                        <span>Photocopy of parents' NID cards.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0"></div>
                                        <span>Transfer Certificate (TC) from the previous school (if applicable).</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0"></div>
                                        <span>Previous academic transcripts or report cards.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#16a34a]/5 rounded-bl-full flex items-start justify-end p-3">
                                    <span className="text-[#16a34a] font-black text-xl">03</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Calendar className="text-[#009ca6]" size={20} />
                                    Submission & Interview
                                </h3>
                                <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                                    Submit the completed application form along with all the required documents to the administrative office. A brief viva/interview may be taken by the Headmaster or assigned teachers to assess the student's primary academic level before finalizing the admission.
                                </p>
                            </div>

                        </div>

                        {/* Right Column: Contact Info */}
                        <div className="md:col-span-1">
                            <div className="bg-gradient-to-br from-[#009ca6] to-[#007b83] rounded-xl shadow-md p-6 text-white sticky top-24">
                                <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">Need Help?</h3>
                                
                                <div className="space-y-5">
                                    <div className="flex gap-4 items-start">
                                        <MapPin className="text-white/70 shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-[14px] text-white/90 mb-1">Office Location</p>
                                            <p className="text-[13px] text-white/70 leading-relaxed">
                                                Lohadi High School<br />
                                                Kapasia, Gazipur, Bangladesh
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <Clock className="text-white/70 shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-[14px] text-white/90 mb-1">Office Hours</p>
                                            <p className="text-[13px] text-white/70 leading-relaxed">
                                                Saturday - Thursday<br />
                                                09:00 AM - 04:00 PM<br />
                                                (Closed on Friday & Govt. Holidays)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <Phone className="text-white/70 shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-[14px] text-white/90 mb-1">Contact Numbers</p>
                                            <p className="text-[13px] text-white/70 leading-relaxed">
                                                +880 1711-000000<br />
                                                +880 1911-000000
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-white/20">
                                    <p className="text-[12px] text-white/60 italic">
                                        * Please do not send any money through mobile banking without confirming with the office authority directly.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
