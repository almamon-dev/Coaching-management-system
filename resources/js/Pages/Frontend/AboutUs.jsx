import React from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    ChevronRight, BookOpen, Target, Award, Users, 
    CheckCircle2, Clock, MapPin, Phone, Mail, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function AboutUs({ settings: propSettings = {} }) {
    const { settings: globalSettings } = usePage().props;
    const settings = propSettings || globalSettings || {};

    const centerName = settings.center_name || "Ullash Coaching Center";
    const address = settings.address || "House 42, Road 11, Block E, Banani, Dhaka";
    const phone = settings.phone || "+880 1712-345678";
    const email = settings.email || "info@ullashcoaching.com";
    const headerTitle = settings.about_header_title || "About Our Institution";
    const headerSubtitle = settings.about_header_subtitle || "Committed to providing comprehensive coaching, personal care, and building a solid foundation for academic and professional success.";
    const storyTitle = settings.about_title || "Empowering Minds, Inspiring Excellence";
    const aboutText = settings.about_text || `${centerName} is a leading academic coaching institution dedicated to providing comprehensive education, structured evaluation, and rigorous academic guidance for students from Junior classes up to College (HSC) level. With a team of university-educated, experienced subject specialists, we focus on fundamental conceptual clarity, daily practice, and regular mock exams to ensure every student achieves their fullest potential.`;
    const heritageStat = settings.about_stat_heritage || "15+ Years";
    const successStat = settings.about_stat_success || "98%";
    const studentsStat = settings.about_stat_students || "10,000+";
    const aboutImage = settings.about_image || "/images/about.png";
    const missionTitle = settings.about_mission_title || "Our Mission";
    const missionText = settings.about_mission_text || "To mentor, guide, and empower every student with conceptual clarity, disciplined study habits, and rigorous exam preparation, enabling them to achieve outstanding academic results and develop strong character.";
    const visionTitle = settings.about_vision_title || "Our Vision";
    const visionText = settings.about_vision_text || "To be recognized as the premier coaching institution in the country, fostering an inspiring academic environment where talent is nurtured, potential is realized, and future leaders are prepared for global challenges.";

    const highlights = [
        {
            title: "Expert Subject Specialists",
            desc: "Experienced educators graduated from top universities who care deeply about each student's learning progress.",
            icon: Users,
        },
        {
            title: "Daily & Weekly Assessment",
            desc: "Continuous model tests and performance tracking that build real confidence ahead of board exams.",
            icon: Award,
        },
        {
            title: "Structured Lecture Sheets",
            desc: "Custom-crafted, syllabus-oriented study materials, board question analysis, and formula guidebooks.",
            icon: BookOpen,
        },
        {
            title: "Dedicated Doubt Clearing",
            desc: "One-on-one problem solving sessions where students can resolve specific questions and tough topics.",
            icon: Target,
        },
        {
            title: "Guardian Regular Feedback",
            desc: "Real-time SMS alerts for attendance, exam scores, and scheduled parent-teacher consultation meetings.",
            icon: ShieldCheck,
        },
        {
            title: "Modern Learning Ambience",
            desc: "Spacious, air-conditioned smart classrooms equipped with multimedia projectors and audio systems.",
            icon: CheckCircle2,
        },
    ];

    return (
        <FrontendLayout>
            <Head title={`About Us - ${centerName}`} />

            {/* Header Banner - Same Style Like Events */}
            <div className="bg-[#009ca6] text-white py-14 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3.5 shadow-xs">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span>About Us</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                        {headerTitle}
                    </h1>
                    <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        {headerSubtitle}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-12 bg-slate-50 min-h-[60vh] font-inter">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-12">
                    
                    {/* Story & Introduction */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 md:p-10 rounded-[4px] border border-slate-200/90 shadow-2xs">
                        <div className="lg:col-span-7 space-y-4">
                            <span className="inline-block px-3 py-1 bg-[#dcfce7] text-[#15803d] font-bold text-[10px] rounded-full uppercase tracking-wider">
                                WHO WE ARE
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {storyTitle}
                            </h2>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                                {aboutText}
                            </p>
                            <div className="pt-2 flex flex-wrap gap-4">
                                <div className="border-l-2 border-[#009ca6] pl-3 py-1">
                                    <span className="block text-xl font-black text-slate-900">{heritageStat}</span>
                                    <span className="text-xs text-slate-500 font-semibold">Educational Heritage</span>
                                </div>
                                <div className="border-l-2 border-[#16a34a] pl-3 py-1">
                                    <span className="block text-xl font-black text-slate-900">{successStat}</span>
                                    <span className="text-xs text-slate-500 font-semibold">Success Track Record</span>
                                </div>
                                <div className="border-l-2 border-blue-500 pl-3 py-1">
                                    <span className="block text-xl font-black text-slate-900">{studentsStat}</span>
                                    <span className="text-xs text-slate-500 font-semibold">Students Mentored</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative rounded-[4px] overflow-hidden shadow-xs">
                            <img 
                                src={aboutImage} 
                                alt={storyTitle} 
                                className="w-full h-80 object-cover"
                                onError={(e) => { e.target.src = '/images/coaching/coaching_01.jpg'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5">
                                <span className="text-white text-xs font-bold">
                                    Modern, focused learning environment for ambitious students
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-7 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="w-10 h-10 rounded-[4px] bg-[#009ca6]/10 text-[#009ca6] flex items-center justify-center font-bold">
                                <Target size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {missionTitle}
                            </h3>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                                {missionText}
                            </p>
                        </div>

                        <div className="bg-white p-7 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="w-10 h-10 rounded-[4px] bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <Award size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {visionTitle}
                            </h3>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                                {visionText}
                            </p>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="space-y-6">
                        <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="inline-block px-3 py-1 bg-[#dcfce7] text-[#15803d] font-bold text-[10px] rounded-full uppercase tracking-wider">
                                WHY CHOOSE US
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                                What Sets {centerName} Apart
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                Our comprehensive methodology combines teaching excellence with rigorous student care.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {highlights.map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <div 
                                        key={idx} 
                                        className="bg-white p-6 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-[#009ca6]/50 transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-[4px] bg-slate-100 text-[#009ca6] flex items-center justify-center">
                                            <IconComponent size={18} />
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            {item.title}
                                        </h4>
                                        <p className="text-slate-500 text-xs leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact & Location Info */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-[4px] bg-[#009ca6]/10 text-[#009ca6] flex items-center justify-center shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Our Campus</h4>
                                <p className="text-xs md:text-sm font-semibold text-slate-800 mt-0.5">{address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-[4px] bg-[#16a34a]/10 text-[#16a34a] flex items-center justify-center shrink-0">
                                <Phone size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Hotline</h4>
                                <a href={`tel:${phone}`} className="text-xs md:text-sm font-semibold text-slate-800 hover:text-[#009ca6] mt-0.5 block">{phone}</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Mail size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</h4>
                                <a href={`mailto:${email}`} className="text-xs md:text-sm font-semibold text-slate-800 hover:text-[#009ca6] mt-0.5 block">{email}</a>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home Button */}
                    <div className="text-center pt-2">
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors shadow-xs"
                        >
                            <span>← Back to Home</span>
                        </Link>
                    </div>

                </div>
            </section>
        </FrontendLayout>
    );
}

