import React, { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import {
    MapPin, Phone, Mail, Clock, MessageSquare,
    Send, ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function Contact({ settings = {} }) {
    const { settings: sharedSettings } = usePage().props;
    const finalSettings = { ...sharedSettings, ...settings };

    const centerName = finalSettings.center_name || 'Ullash Coaching Center';
    const address = finalSettings.address || 'House 123, Road 5, Mirpur-10, Dhaka-1216, Bangladesh';
    const phone = finalSettings.phone || '+880 1712-345678';
    const altPhone = finalSettings.contact_phone_alt;
    const email = finalSettings.email || 'info@ullashcoachingcenter.com';
    const officeHours = finalSettings.contact_office_hours || 'Saturday - Thursday: 8:00 AM - 8:00 PM (Friday Closed)';
    const counselingNote = finalSettings.contact_counseling_note || 'Walk-in academic counseling and batch placement discussions are open daily during office hours.';
    const mapEmbed = finalSettings.contact_map_embed;
    const whatsappNumber = finalSettings.whatsapp_number;
    const cleanWhatsApp = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, '') : null;

    const [sent, setSent] = useState(false);

    const {
        data: form,
        setData: setForm,
        post: postInquiry,
        processing,
        reset,
        errors
    } = useForm({
        name: '',
        phone: '',
        email: '',
        batch: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        postInquiry(route('academic-inquiry.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setSent(true);
                reset();
            },
        });
    };

    return (
        <FrontendLayout>
            <Head title={`Contact Us - ${centerName}`} />

            {/* Header Banner */}
            <div className="bg-[#009ca6] text-white py-12 md:py-16 relative overflow-hidden font-inter">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3.5 shadow-xs">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span>Contact Us</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                        {finalSettings.contact_title || 'Contact Our Campus'}
                    </h1>
                    <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        {finalSettings.contact_subtitle || 'Have questions about admissions, batch schedules, or fee structures? Reach out to our campus office or academic counseling desk today.'}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-12 md:py-16 bg-slate-50/50 font-inter">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-10">
                    
                    {/* Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Card 1: Campus Address */}
                        <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="w-10 h-10 rounded-[4px] bg-emerald-50 text-[#047857] flex items-center justify-center">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Campus Location</span>
                                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Visit Our Center</h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    {address}
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Hotlines */}
                        <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="w-10 h-10 rounded-[4px] bg-emerald-50 text-[#047857] flex items-center justify-center">
                                <Phone size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Phone & WhatsApp</span>
                                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Direct Hotline</h4>
                                <div className="mt-1 space-y-0.5 text-xs font-semibold">
                                    <a href={`tel:${phone}`} className="text-[#047857] hover:underline block">
                                        {phone}
                                    </a>
                                    {altPhone && (
                                        <a href={`tel:${altPhone}`} className="text-slate-600 hover:text-[#047857] block">
                                            Alt: {altPhone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Email */}
                        <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="w-10 h-10 rounded-[4px] bg-teal-50 text-[#009ca6] flex items-center justify-center">
                                <Mail size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email Inquiries</span>
                                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Write to Us</h4>
                                <a href={`mailto:${email}`} className="text-xs text-[#009ca6] font-semibold hover:underline mt-1 block truncate">
                                    {email}
                                </a>
                            </div>
                        </div>

                        {/* Card 4: Office Hours */}
                        <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="w-10 h-10 rounded-[4px] bg-amber-50 text-amber-700 flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Working Hours</span>
                                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Counseling Desk</h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    {officeHours}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Inquiry Form & Location/Map */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Quick Academic Inquiry Form (7 cols) */}
                        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-5">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857] block mb-1">
                                    Online Counseling
                                </span>
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                    Send Us an Academic Message
                                </h2>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Fill out this quick form with your questions and our academic counseling team will get back to you promptly.
                                </p>
                            </div>

                            {sent ? (
                                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-[4px] text-center space-y-2 animate-in fade-in">
                                    <CheckCircle2 size={32} className="mx-auto text-[#047857]" />
                                    <h4 className="text-sm font-bold text-emerald-900">Thank You for Contacting Us!</h4>
                                    <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
                                        Your inquiry has been received. Our senior academic counselor will call you back at your provided phone number shortly.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                Student / Guardian Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="e.g. Mahfuzur Rahman"
                                                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                Mobile Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+880 1712-000000"
                                                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                Email Address (Optional)
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="youremail@example.com"
                                                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                Target Class / Batch
                                            </label>
                                            <input
                                                type="text"
                                                value={form.batch}
                                                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                                                placeholder="e.g. HSC Physics, SSC Science"
                                                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                            Your Question or Inquiry *
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder="Ask about batch routine, admission dates, faculty details, or counseling..."
                                            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="py-2.5 px-6 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold rounded-[3px] shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        <Send size={14} />
                                        <span>{processing ? 'Submitting...' : 'Submit Academic Inquiry'}</span>
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Right: Counseling Desk & Map / WhatsApp (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Walk-in Counseling Box */}
                            <div className="p-6 bg-gradient-to-br from-[#064e3b] to-[#047857] text-white rounded-[4px] shadow-sm space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                                    Direct Academic Counseling
                                </span>
                                <h3 className="text-lg font-bold tracking-tight">
                                    Walk-in Admission & Schedule Assistance
                                </h3>
                                <p className="text-xs text-emerald-100/90 leading-relaxed">
                                    {counselingNote}
                                </p>
                                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                                    {cleanWhatsApp && (
                                        <a
                                            href={`https://wa.me/${cleanWhatsApp}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-[3px] shadow-2xs flex items-center gap-1.5 transition-colors"
                                        >
                                            <MessageSquare size={14} />
                                            <span>WhatsApp Chat</span>
                                        </a>
                                    )}
                                    <Link
                                        href="/admissions"
                                        className="px-4 py-2 bg-white text-[#047857] hover:bg-emerald-50 text-xs font-bold rounded-[3px] shadow-2xs flex items-center gap-1.5 transition-colors"
                                    >
                                        <span>Apply for Admission</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>

                            {/* Google Map Embed or Directions */}
                            {mapEmbed ? (
                                <div className="rounded-[4px] overflow-hidden border border-slate-200 shadow-2xs bg-white">
                                    <iframe
                                        src={mapEmbed}
                                        width="100%"
                                        height="240"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Campus Location Map"
                                    />
                                </div>
                            ) : (
                                <div className="p-6 bg-white rounded-[4px] border border-slate-200/90 shadow-2xs space-y-3">
                                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                                        <MapPin size={16} className="text-[#047857]" />
                                        <span>How to Reach Our Campus</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Our center is conveniently located in the central education zone with easy access from public transportation and metro stations. Visitors can drop by any day during office hours.
                                    </p>
                                    <div className="pt-1">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${centerName} ${address}`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-bold text-[#047857] hover:underline inline-flex items-center gap-1"
                                        >
                                            <span>Open in Google Maps</span>
                                            <ChevronRight size={13} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back to Home Button */}
                    <div className="text-center pt-4">
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors shadow-xs"
                        >
                            <span>← Back to Homepage</span>
                        </Link>
                    </div>

                </div>
            </section>
        </FrontendLayout>
    );
}

