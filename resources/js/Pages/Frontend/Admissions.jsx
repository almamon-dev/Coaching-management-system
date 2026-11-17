import React from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, Phone, MapPin, Calendar, Clock, ChevronRight, AlertCircle, CheckCircle2, Mail, Info } from 'lucide-react';

export default function Admissions({ settings: propSettings }) {
    const { settings: globalSettings } = usePage().props;
    const settings = propSettings || globalSettings || {};

    const centerName = settings.center_name || 'Ullash Coaching Center';
    const pageTitle = settings.admission_title || 'Admission Instructions';
    const pageSubtitle = settings.admission_subtitle || 'All procedures, required documents, and important guidelines for new student enrollment.';

    const alertEnabled = settings.admission_alert_enabled !== 'no';
    const alertTitle = settings.admission_alert_title || 'Online Admission Notice';
    const alertText = settings.admission_alert_text || "Please note that all admission procedures must be completed physically at the coaching center administration office by the student's parents or legal guardians.";

    const step1Title = settings.admission_step1_title || 'Collect Admission Form';
    const step1Desc = settings.admission_step1_desc || "Admission forms are available at the coaching center main office during working hours. You must collect the form by paying the fixed nominal fee.";

    const step2Title = settings.admission_step2_title || 'Required Documents';
    const step2Desc = settings.admission_step2_desc || "Fill out the admission form properly and attach the following necessary documents:";
    const documentsRaw = settings.admission_documents || "3 copies of recent passport size photographs of the student.\nPhotocopy of the student's Birth Certificate (Online verifiable).\nPhotocopy of parents' NID cards.\nPhotocopy of current school/college student ID card.\nPrevious academic marksheet or report cards.";
    const documentList = documentsRaw.split('\n').map(d => d.trim()).filter(Boolean);

    const step3Title = settings.admission_step3_title || 'Submission & Assessment / Interview';
    const step3Desc = settings.admission_step3_desc || "Submit the completed application form along with all the required documents to the administrative office. A brief viva/assessment may be taken by the teachers to assess the student's primary academic level before finalizing enrollment.";

    const officeLocation = settings.admission_location || settings.address || 'House 42, Road 11, Block E, Banani, Dhaka';
    const officeHours = settings.admission_office_hours || "Saturday - Thursday\n09:00 AM - 08:00 PM\n(Closed on Friday & Govt. Holidays)";
    const officePhone = settings.admission_phone || settings.phone || '+880 1711-000000';
    const officeEmail = settings.admission_email || settings.email || 'info@ullashcoaching.com';

    return (
        <FrontendLayout>
            <Head title={`${pageTitle} - ${centerName}`} />

            {/* Page Header */}
            <div className="bg-slate-900 py-8 md:py-10 relative overflow-hidden font-inter print:hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                    <div className="flex items-center gap-2 text-[#16a34a] font-bold text-[11px] uppercase tracking-wider mb-2">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span className="text-slate-400">Admissions</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                        {pageTitle}
                    </h1>
                    <p className="text-sm md:text-base text-slate-400 mt-2 max-w-3xl leading-relaxed">
                        {pageSubtitle}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-12 bg-slate-50 font-inter min-h-[60vh]">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    
                    {/* Alert Banner */}
                    {alertEnabled && (
                        <div className="bg-amber-50 border border-amber-200 rounded-[4px] p-5 mb-8 flex gap-4 items-start shadow-xs">
                            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={22} />
                            <div>
                                <h3 className="text-amber-900 font-bold text-[15px] mb-1">
                                    {alertTitle}
                                </h3>
                                <p className="text-amber-800/90 text-[13px] leading-relaxed whitespace-pre-line">
                                    {alertText}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Instructions Steps */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Step 1 */}
                            <div className="bg-white p-6 sm:p-7 rounded-[4px] shadow-xs border border-slate-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#16a34a]/10 rounded-bl-full flex items-start justify-end p-3">
                                    <span className="text-[#16a34a] font-black text-lg">01</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2.5">
                                    <FileText className="text-[#16a34a]" size={20} />
                                    <span>{step1Title}</span>
                                </h3>
                                <p className="text-slate-600 text-[14px] leading-relaxed whitespace-pre-line">
                                    {step1Desc}
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white p-6 sm:p-7 rounded-[4px] shadow-xs border border-slate-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#16a34a]/10 rounded-bl-full flex items-start justify-end p-3">
                                    <span className="text-[#16a34a] font-black text-lg">02</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2.5">
                                    <CheckCircle2 className="text-[#16a34a]" size={20} />
                                    <span>{step2Title}</span>
                                </h3>
                                <p className="text-slate-600 text-[14px] leading-relaxed mb-4 whitespace-pre-line">
                                    {step2Desc}
                                </p>
                                <ul className="space-y-2.5 text-slate-700 text-[13.5px]">
                                    {documentList.map((doc, idx) => (
                                        <li key={idx} className="flex gap-2.5 items-start">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0"></div>
                                            <span>{doc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white p-6 sm:p-7 rounded-[4px] shadow-xs border border-slate-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#16a34a]/10 rounded-bl-full flex items-start justify-end p-3">
                                    <span className="text-[#16a34a] font-black text-lg">03</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2.5">
                                    <Calendar className="text-[#16a34a]" size={20} />
                                    <span>{step3Title}</span>
                                </h3>
                                <p className="text-slate-600 text-[14px] leading-relaxed whitespace-pre-line">
                                    {step3Desc}
                                </p>
                            </div>

                        </div>

                        {/* Right Column: Contact & Office Help */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4px] shadow-md p-6 text-white sticky top-24 border border-slate-700">
                                <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-5">
                                    <Info className="text-emerald-400" size={18} />
                                    <h3 className="text-lg font-bold text-white tracking-tight">Need Assistance?</h3>
                                </div>
                                
                                <div className="space-y-5 text-xs">
                                    <div className="flex gap-3.5 items-start">
                                        <MapPin className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <p className="font-bold text-[13px] text-white/90 mb-1">Office Location</p>
                                            <p className="text-[12.5px] text-slate-300 leading-relaxed whitespace-pre-line">
                                                {officeLocation}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3.5 items-start">
                                        <Clock className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <p className="font-bold text-[13px] text-white/90 mb-1">Office Hours</p>
                                            <p className="text-[12.5px] text-slate-300 leading-relaxed whitespace-pre-line">
                                                {officeHours}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3.5 items-start">
                                        <Phone className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <p className="font-bold text-[13px] text-white/90 mb-1">Helpline Numbers</p>
                                            <p className="text-[12.5px] text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                                                {officePhone}
                                            </p>
                                        </div>
                                    </div>

                                    {officeEmail && (
                                        <div className="flex gap-3.5 items-start">
                                            <Mail className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <p className="font-bold text-[13px] text-white/90 mb-1">Email Inquiry</p>
                                                <p className="text-[12.5px] text-slate-300 leading-relaxed">
                                                    {officeEmail}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-7 pt-5 border-t border-white/10">
                                    <p className="text-[11.5px] text-slate-400 leading-relaxed">
                                        * Please verify all payments and receipt stamps directly at the coaching center desk before leaving.
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
