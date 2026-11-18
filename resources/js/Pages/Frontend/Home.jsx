import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import {
    GraduationCap, Play, Users, UserCheck, BookOpen,
    Award, CheckCircle2, ChevronRight, ArrowRight,
    Calendar, Clock, MapPin, Quote, Check, X, FileText, Download, Bell,
    Coins, Video, Mail, Phone, MessageSquare, Send
} from 'lucide-react';

export default function Home({
    dbNotices = [],
    dbImportantLinks = [],
    dbBatches = [],
    dbbatches = [],
    dbEvents = [],
    dbGalleries = [],
    dbTestimonials = [],
    cmsSettings = {},
}) {
    const { settings } = usePage().props;
    const centerName = cmsSettings?.center_name || settings?.center_name || "Ullash Coaching Center";

    const [showAllNotices, setShowAllNotices] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', batch: '', message: '' });
    const [inquirySent, setInquirySent] = useState(false);

    const handleInquirySubmit = (e) => {
        e.preventDefault();
        setInquirySent(true);
        setTimeout(() => {
            setInquiryForm({ name: '', phone: '', batch: '', message: '' });
        }, 4000);
    };

    // Safe route helper
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

    // 1. Dynamic or Default Notices
    const defaultNotices = [
        {
            id: 1,
            day: '28',
            month: 'JUL',
            title: 'Annual Sports Day 2026',
            description: 'Get ready for the annual sports day! Registrations for track and field events are now open.',
            content: 'Get ready for the annual sports day! Registrations for track and field events are now open. All students from Class 6 to Class 12 are encouraged to participate. Please contact your sports department teacher for registration forms and schedule details.',
            category: 'Sports',
            date_formatted: '28 Jul, 2026',
            isNew: false,
        },
        {
            id: 2,
            day: '28',
            month: 'JUL',
            title: 'New Library Rules',
            description: 'Students must return their borrowed books within 14 days to avoid a late fee penalty.',
            content: 'Students must return their borrowed books within 14 days to avoid a late fee penalty. Reference books and journals can now be accessed digitally via student portal accounts.',
            category: 'Library',
            date_formatted: '28 Jul, 2026',
            isNew: false,
        },
        {
            id: 3,
            day: '28',
            month: 'JUL',
            title: 'Teachers Meeting at 3 PM',
            description: 'All teaching staff are requested to gather in the main auditorium for the monthly academic progress meeting.',
            content: 'All teaching staff are requested to gather in the main auditorium for the monthly academic progress meeting. Important updates regarding semester assessments and curriculum will be discussed.',
            category: 'Academic',
            date_formatted: '28 Jul, 2026',
            isNew: false,
        },
        {
            id: 4,
            day: '27',
            month: 'JUL',
            title: 'Upcoming Final Examinations',
            description: 'Dear students and teachers, the final model tests and examinations will commence from next month. Please check the routine attached on the coaching notice board.',
            content: 'Dear students and teachers, the final examinations will commence from next month. Please check the routine attached on the coaching notice board. Admit cards will be distributed from the administrative office.',
            category: 'Exam',
            date_formatted: '27 Jul, 2026',
            isNew: false,
        },
        {
            id: 5,
            day: '25',
            month: 'JUL',
            title: 'Weekly Model Test Schedule Announcement',
            description: 'All HSC 2026 students are hereby informed that the upcoming weekly Physics Model Test will take place this Friday at 10:00 AM.',
            content: 'All HSC 2026 students are hereby informed that the upcoming weekly Physics Model Test will take place this Friday at 10:00 AM in Hall Room B. Attendance is mandatory for all enrolled batch students.',
            category: 'Exam',
            date_formatted: '25 Jul, 2026',
            isNew: true,
        },
        {
            id: 6,
            day: '22',
            month: 'JUL',
            title: 'Special Extra Classes for Board Candidates',
            description: 'Special guidance and revision sessions have been arranged on weekends for upcoming board exam batches.',
            content: 'Special guidance and revision sessions have been arranged on weekends for upcoming board exam batches. High-focus problem-solving sets will be provided during these sessions.',
            category: 'Academic',
            date_formatted: '22 Jul, 2026',
            isNew: false,
        },
    ];

    const noticeBoardItems = (dbNotices && dbNotices.length > 0)
        ? (dbNotices.length >= 4 ? dbNotices : [...dbNotices, ...defaultNotices.filter(d => !dbNotices.some(n => n.title.toLowerCase() === d.title.toLowerCase()))])
        : defaultNotices;

    const displayedNotices = showAllNotices ? noticeBoardItems : noticeBoardItems.slice(0, 4);

    // 2. Dynamic or Default Important Links
    const defaultImportantLinks = [
        { title: 'Notice Board', href: '#notice-board' },
        { title: 'Academic batches & Programs', href: '#batches' },
        { title: 'Admission Instructions', href: safeRoute('admissions', undefined, '/admissions') },
        { title: 'Campus Events & Seminars', href: safeRoute('events', undefined, '/events') },
        { title: 'Student Success Stories', href: safeRoute('success-stories', undefined, '/success-stories') },
        { title: 'Campus Photo Gallery', href: safeRoute('gallery', undefined, '/gallery') },
        { title: 'About Our Coaching', href: safeRoute('about-us', undefined, '/about-us') },
        { title: 'Student & Guardian Portal', href: safeRoute('student.login', undefined, '/student-login') },
        { title: 'Sexual Harassment & Safety Help', href: safeRoute('complaints.create', undefined, '/complaints/create') },
    ];
    const importantLinks = (dbImportantLinks && dbImportantLinks.length > 0)
        ? dbImportantLinks.map((l, i) => {
            let targetHref = l.href;
            if (!targetHref || targetHref.trim() === '') {
                targetHref = defaultImportantLinks[i]?.href || '/notices-board';
            }
            if (l.title.toLowerCase().includes('notice') && typeof window !== 'undefined' && window.location.pathname === '/') {
                targetHref = '#notice-board';
            } else if ((l.title.toLowerCase().includes('course') || l.title.toLowerCase().includes('program')) && typeof window !== 'undefined' && window.location.pathname === '/') {
                targetHref = '#batches';
            }
            return {
                title: l.title,
                href: targetHref,
            };
        })
        : defaultImportantLinks;

    // 3. Dynamic or Default Batches (Coaching Batches)
    const defaultBatches = [
        {
            id: 1,
            display_title: 'HSC Physics Batch',
            name: 'Morning-01: HSC Physics (1st & 2nd Paper)',
            category: 'HSC / Intermediate',
            code: 'HSC-PHY-101',
            image: '/images/batches/batch_physics.jpg',
            description: 'Complete HSC Physics (1st & 2nd Paper) with a clear concept, problem solving, and exam preparation.',
            duration: '12 Months',
            total_classes: 48,
            seats_left: 28,
            fee: 1500,
            admission_fee: 500,
            class_days: 'Sun, Tue, Thu',
            class_time: '07:00 AM - 08:00 AM',
            subjects: [
                { id: 1, name: 'Physics 1st Paper' },
                { id: 2, name: 'Physics 2nd Paper' },
            ],
            link: safeRoute('admissions', undefined, '/admissions'),
        },
        {
            id: 2,
            display_title: 'HSC Higher Math Batch',
            name: 'Morning-02: HSC Higher Math (1st & 2nd Paper)',
            category: 'HSC / Intermediate',
            code: 'HSC-MATH-102',
            image: '/images/batches/batch_higher_math.jpg',
            description: 'Complete Higher Mathematics (1st & 2nd Paper) with in-depth concepts, practice, and exam preparation.',
            duration: '12 Months',
            total_classes: 52,
            seats_left: 24,
            fee: 1600,
            admission_fee: 500,
            class_days: 'Sun, Tue, Thu',
            class_time: '08:00 AM - 09:00 AM',
            subjects: [
                { id: 3, name: 'Higher Math 1st Paper' },
                { id: 4, name: 'Higher Math 2nd Paper' },
            ],
            link: safeRoute('admissions', undefined, '/admissions'),
        },
        {
            id: 5,
            display_title: 'HSC Chemistry Batch',
            name: 'Afternoon-02: HSC Chemistry (1st & 2nd Paper)',
            category: 'HSC / Intermediate',
            code: 'HSC-CHE-103',
            image: '/images/batches/batch_chemistry.jpg',
            description: 'In-depth HSC Chemistry (1st & 2nd Paper) covering Qualitative, Kinetics, Organic & Electrochemistry.',
            duration: '12 Months',
            total_classes: 46,
            seats_left: 30,
            fee: 1500,
            admission_fee: 500,
            class_days: 'Sat, Mon, Wed',
            class_time: '04:00 PM - 05:00 PM',
            subjects: [
                { id: 5, name: 'Chemistry 1st Paper' },
                { id: 6, name: 'Chemistry 2nd Paper' },
            ],
            link: safeRoute('admissions', undefined, '/admissions'),
        },
        {
            id: 3,
            display_title: 'Class 9 Science Batch',
            name: 'Morning-03: Class 9 Science (Higher Math, Physics, Chem & ICT)',
            category: 'Class 9',
            code: 'CLS9-SCI-201',
            image: '/images/batches/batch_class9.jpg',
            description: 'Foundation building for Class 9 Science students with intensive focus on Math, Physics, Chem & ICT.',
            duration: '12 Months',
            total_classes: 64,
            seats_left: 18,
            fee: 1800,
            admission_fee: 500,
            class_days: 'Sat, Mon, Wed',
            class_time: '09:00 AM - 10:00 AM',
            subjects: [
                { id: 7, name: 'Class 9 Higher Math' },
                { id: 8, name: 'Class 9 Physics' },
                { id: 9, name: 'Class 9 Chemistry' },
                { id: 10, name: 'Class 9 ICT' },
            ],
            link: safeRoute('admissions', undefined, '/admissions'),
        },
        {
            id: 4,
            display_title: 'Class 10 / SSC Batch',
            name: 'Afternoon-01: Class 10 / SSC (Higher Math, Physics, Chem & ICT)',
            category: 'Class 10',
            code: 'CLS10-SCI-301',
            image: '/images/batches/batch_class10.jpg',
            description: 'Complete SSC board preparation for Science students focusing on test papers, model tests, and CQ mastery.',
            duration: '10 Months',
            total_classes: 68,
            seats_left: 15,
            fee: 2000,
            admission_fee: 500,
            class_days: 'Sun, Tue, Thu',
            class_time: '03:00 PM - 04:00 PM',
            subjects: [
                { id: 11, name: 'Class 10 Higher Math' },
                { id: 12, name: 'Class 10 Physics' },
                { id: 13, name: 'Class 10 Chemistry' },
                { id: 14, name: 'Class 10 ICT' },
            ],
            link: safeRoute('admissions', undefined, '/admissions'),
        },
        {
            id: 6,
            display_title: 'HSC ICT Batch',
            name: 'Afternoon-03: HSC ICT (1st & 2nd Paper)',
            category: 'HSC / Intermediate',
            code: 'HSC-ICT-104',
            image: '/images/batches/batch_ict.jpg',
            description: 'Comprehensive HSC ICT syllabus coverage with C Programming, HTML/Web, Database and Networking.',
            duration: '8 Months',
            total_classes: 40,
            seats_left: 22,
            fee: 1200,
            admission_fee: 500,
            class_days: 'Sun, Tue, Thu',
            class_time: '05:00 PM - 06:00 PM',
            subjects: [
                { id: 15, name: 'ICT 1st Paper' },
                { id: 16, name: 'ICT 2nd Paper' },
            ],
            link: safeRoute('admissions', undefined, '/admissions'),
        },
    ];

    const academicBatches = (dbBatches && dbBatches.length > 0) ? dbBatches : defaultBatches;

    // 4. Dynamic or Default Events
    const defaultEvents = [
        {
            id: 1,
            title: 'Annual Merit Award & Achievers Crest Ceremony',
            image: '/images/ullash_award_crest_01.jpg',
            month: 'MAR',
            day: '15',
            time: '04:00 PM',
            location: 'MAIN AUDITORIUM & RECEPTION',
            description: 'Ullash Coaching Center honors top scorers in HSC and SSC board exams with merit crests, certificates, and recognition by the Director.',
            accent: {
                text: 'text-[#d97706]',
                border: 'border-[#d97706]',
                hoverText: 'group-hover:text-[#d97706]',
            },
        },
        {
            id: 2,
            title: 'HSC & SSC Central Model Test Grand Exam',
            image: '/images/ullash_classroom_model_test_01.jpg',
            month: 'MAR',
            day: '25',
            time: '09:00 AM',
            location: 'EXAMINATION HALL 1 & 2',
            description: 'Board-standard centralized model test examination in our air-conditioned classrooms with strict invigilation and detailed script evaluation.',
            accent: {
                text: 'text-[#059669]',
                border: 'border-[#059669]',
                hoverText: 'group-hover:text-[#059669]',
            },
        },
        {
            id: 3,
            title: 'HSC Batch Grand Farewell & Celebration Ceremony',
            image: '/images/ullash_farewell_gift_ceremony.jpg',
            month: 'APR',
            day: '05',
            time: '11:00 AM',
            location: 'COACHING CAMPUS HALL',
            description: 'Grand farewell ceremony for outgoing HSC examinees featuring gift pack presentations, celebration cake cutting, and motivational guidance from faculty.',
            accent: {
                text: 'text-[#e11d48]',
                border: 'border-[#e11d48]',
                hoverText: 'group-hover:text-[#e11d48]',
            },
        },
        {
            id: 4,
            title: 'New HSC ICT Batch Admission & Orientation Seminar',
            image: '/images/ullash_ict_batch_poster.jpg',
            month: 'APR',
            day: '14',
            time: '10:00 AM',
            location: 'ICT SEMINAR ROOM',
            description: 'Special orientation seminar on ICT syllabus coverage, C programming, and practical board question mastery for HSC science and commerce students.',
            accent: {
                text: 'text-[#2563eb]',
                border: 'border-[#2563eb]',
                hoverText: 'group-hover:text-[#2563eb]',
            },
        },
    ];

    const eventAccentStyles = [
        { text: 'text-[#059669]', border: 'border-[#059669]', hoverText: 'group-hover:text-[#059669]' },
        { text: 'text-[#d97706]', border: 'border-[#d97706]', hoverText: 'group-hover:text-[#d97706]' },
        { text: 'text-[#e11d48]', border: 'border-[#e11d48]', hoverText: 'group-hover:text-[#e11d48]' },
        { text: 'text-[#2563eb]', border: 'border-[#2563eb]', hoverText: 'group-hover:text-[#2563eb]' },
    ];

    const upcomingEventsList = (dbEvents && dbEvents.length > 0)
        ? dbEvents.map((evt, idx) => ({
            ...evt,
            accent: eventAccentStyles[idx % eventAccentStyles.length],
        }))
        : defaultEvents;

    // 5. Dynamic or Default Success Stories
    const defaultTestimonials = [
        {
            id: 1,
            name: "Ariful Islam",
            initials: "AI",
            color: "bg-emerald-100 text-emerald-800 border-emerald-300",
            batch: "HSC Science Batch",
            badge: "GPA 5.00 (Golden A+)",
            institution: "Dhaka College",
            quote: "The complex topics in Physics and Higher Mathematics were explained with such clarity. Regular weekly model tests built my confidence to excel in the board examination.",
        },
        {
            id: 2,
            name: "Tasmia Rahman",
            initials: "TR",
            color: "bg-purple-100 text-purple-800 border-purple-300",
            batch: "SSC Science Batch",
            badge: "GPA 5.00 & Board Top",
            institution: "Viqarunnisa Noon School",
            quote: "The personal mentorship and problem-solving techniques were extraordinary. Dedicated problem-solving sessions helped me achieve 100% marks in Mathematics.",
        },
        {
            id: 3,
            name: "Farhan Ahmed",
            initials: "FA",
            color: "bg-blue-100 text-blue-800 border-blue-300",
            batch: "HSC Special Batch",
            badge: "GPA 5.00 (Golden A+)",
            institution: "Notre Dame College",
            quote: "The structured lecture sheets for Chemistry and ICT combined with regular tests made my preparation complete. Ullash Coaching played a key role in my academic success.",
        },
        {
            id: 4,
            name: "Sumaiya Akter",
            initials: "SA",
            color: "bg-rose-100 text-rose-800 border-rose-300",
            batch: "Class 10 Intensive Batch",
            badge: "GPA 5.00 Achiever",
            institution: "Holy Cross College",
            quote: "Regular attendance tracking and result feedback helped me stay disciplined. Complex topics were broken down and explained with joy and simplicity.",
        },
    ];
    const successStories = (dbTestimonials && dbTestimonials.length > 0) ? dbTestimonials : defaultTestimonials;

    // 6. Dynamic or Default Bento Gallery Photos
    const defaultGalleries = [
        { id: 1, title: 'Model Test Examination Session in AC Classroom', category: 'ACADEMICS', image: '/images/ullash_classroom_model_test_01.jpg' },
        { id: 2, title: 'HSC-2026 Batch Grand Farewell & Celebration', category: 'EVENTS', image: '/images/ullash_farewell_gift_ceremony.jpg' },
        { id: 3, title: 'Merit Crest Award Presentation to Top Achievers', category: 'RECOGNITION', image: '/images/ullash_award_crest_01.jpg' },
        { id: 4, title: 'Faculty Mentorship & Guidance in Front of Campus', category: 'CAMPUS', image: '/images/ullash_campus_mentorship.jpg' },
    ];
    const galleryPhotos = (dbGalleries && dbGalleries.length > 0) ? dbGalleries : defaultGalleries;

    // Background architectural grid texture
    const gridBgStyle = {
        backgroundImage: 'linear-gradient(to right, rgba(0, 156, 166, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 156, 166, 0.05) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
    };

    return (
        <div className="font-inter text-slate-800 bg-white">
            <Head title={`${centerName} - Excellence in Academic Coaching`} />

            {/* ========================================================================= */}
            {/* 1. HERO SECTION                                                           */}
            {/* ========================================================================= */}
            <section
                className="relative overflow-hidden bg-[#047857] text-white min-h-[460px] md:min-h-[500px] lg:min-h-[540px] flex items-center"
                style={{
                    backgroundImage: `url('${cmsSettings?.hero_banner_image || "/images/banner.png"}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "right center",
                }}
            >
                {/* Softer emerald backdrop overlay allowing the banner image to be clearly visible */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#047857]/80 via-[#047857]/45 via-40% md:via-45% to-black/15 pointer-events-none z-0" />

                <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16 lg:py-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        <div className="lg:col-span-6 space-y-5 text-left max-w-xl">
                            {/* Top Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold backdrop-blur-xs">
                                <GraduationCap size={14} className="text-emerald-200" />
                                <span>{centerName}</span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.15]">
                                {cmsSettings?.hero_title ? (
                                    cmsSettings.hero_title
                                ) : (
                                    <>
                                        Build Your Future With <br />
                                        <span className="text-[#fde047]">Quality Education</span>
                                    </>
                                )}
                            </h1>

                            {/* Subtitle */}
                            <p className="text-emerald-50 text-xs sm:text-sm lg:text-[14px] font-normal leading-relaxed max-w-lg">
                                {cmsSettings?.hero_subtitle || `At ${centerName}, we believe every student has the potential to achieve greatness. Our experienced teachers, structured learning programs, and student-focused guidance help learners build strong academic foundations and achieve their goals.`}
                            </p>

                            {/* Hero Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link
                                    href={safeRoute('admissions', undefined, '/admissions')}
                                    className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-[13px] font-bold rounded-[4px] shadow-md transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <GraduationCap size={16} />
                                    <span>Apply for Admission</span>
                                </Link>

                                <a
                                    href="#batches"
                                    className="px-5 py-2.5 bg-emerald-900/40 hover:bg-emerald-900/70 text-white text-xs sm:text-[13px] font-bold rounded-[4px] border border-white/30 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <Play size={14} fill="currentColor" />
                                    <span>Explore Our Batches</span>
                                </a>
                            </div>
                        </div>

                        {/* Spacer column */}
                        <div className="hidden lg:block lg:col-span-6" aria-hidden="true" />

                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 2. STATISTICS COUNTER BAR                                                 */}
            {/* ========================================================================= */}
            <section className="bg-[#064e3b] text-white py-4 sm:py-5 border-t border-emerald-900/60 font-inter">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 divide-x-0 md:divide-x divide-emerald-800/60">

                        <div className="flex items-center justify-center gap-3.5 px-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-300">
                                <Users size={20} />
                            </div>
                            <div className="text-left">
                                <div className="text-xl sm:text-2xl font-black leading-none">{cmsSettings?.stat_students || '500+'}</div>
                                <div className="text-[11px] text-emerald-200 font-medium mt-1">Students</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3.5 px-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-300">
                                <UserCheck size={20} />
                            </div>
                            <div className="text-left">
                                <div className="text-xl sm:text-2xl font-black leading-none">{cmsSettings?.stat_teachers || '20+'}</div>
                                <div className="text-[11px] text-emerald-200 font-medium mt-1">Expert Teachers</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3.5 px-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-300">
                                <BookOpen size={20} />
                            </div>
                            <div className="text-left">
                                <div className="text-xl sm:text-2xl font-black leading-none">{cmsSettings?.stat_batches || '10+'}</div>
                                <div className="text-[11px] text-emerald-200 font-medium mt-1">batches & Programs</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3.5 px-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-300">
                                <Award size={20} />
                            </div>
                            <div className="text-left">
                                <div className="text-xl sm:text-2xl font-black leading-none">{cmsSettings?.stat_success || '95%'}</div>
                                <div className="text-[11px] text-emerald-200 font-medium mt-1">Success Rate</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 3. ABOUT US SECTION                                                       */}
            {/* ========================================================================= */}
            <section id="about" className="py-12 sm:py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                        <div className="lg:col-span-5">
                            <div className="relative rounded-[4px] overflow-hidden shadow-md border border-slate-200 aspect-[4/3]">
                                <img
                                    src={cmsSettings?.about_image || "/images/about.png"}
                                    alt="About Coaching Center"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-4 text-left">
                            <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-[#047857] text-[11px] font-bold border border-emerald-200">
                                About Us
                            </span>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                {cmsSettings?.about_title || (
                                    <>A Commitment to <span className="text-[#ea580c]">Excellence</span> in Education</>
                                )}
                            </h2>

                            <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed">
                                {cmsSettings?.about_description || `${centerName} is dedicated to providing quality education through experienced teachers, effective teaching methods, and a supportive learning environment.`}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-semibold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-[#047857] shrink-0" />
                                    <span>Experienced & Qualified Teachers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-[#047857] shrink-0" />
                                    <span>Smart Learning Environment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-[#047857] shrink-0" />
                                    <span>Regular Class Tests & Assessments</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-[#047857] shrink-0" />
                                    <span>Individual Student Care</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-[#047857] shrink-0" />
                                    <span>Updated Study Materials</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-[#047857] shrink-0" />
                                    <span>Special Exam Preparation</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href={safeRoute('about-us', undefined, '/about-us')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#047857] border border-[#047857] hover:bg-emerald-50 rounded-[4px] transition-colors"
                                >
                                    <span>Learn More About Us</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 4. NOTICE BOARD & IMPORTANT LINKS                                         */}
            {/* ========================================================================= */}
            <section id="notice-board" className="py-14 bg-slate-50/50 border-b border-slate-200/80 scroll-mt-20" style={gridBgStyle}>
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Notice Board (Expanded to ~75% width) */}
                        <div className="flex-1 min-w-0 w-full space-y-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="inline-block px-3 py-0.5 bg-[#dcfce7] text-[#15803d] font-bold text-[10px] rounded-full uppercase tracking-wider mb-1.5">
                                        LATEST UPDATES
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                        Notice Board
                                    </h2>
                                </div>
                                <Link
                                    href={safeRoute('notices.index', undefined, '/notices-board')}
                                    className="inline-flex items-center gap-0.5 text-[#16a34a] text-xs font-bold hover:underline mb-1"
                                >
                                    <span>View All</span>
                                    <ChevronRight size={14} />
                                </Link>
                            </div>

                            <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                                {displayedNotices.map(notice => (
                                    <div
                                        key={notice.id}
                                        onClick={() => setSelectedNotice(notice)}
                                        className="flex gap-4 items-start p-4 hover:bg-slate-50/70 transition-colors group cursor-pointer"
                                    >
                                        {/* Calendar Date Card */}
                                        <div className="flex flex-col items-center rounded-[4px] overflow-hidden border border-slate-200/90 bg-white shadow-2xs shrink-0 w-16 group-hover:border-[#009ca6] group-hover:shadow-xs transition-all mt-0.5">
                                            <div className="w-full bg-[#009ca6] group-hover:bg-[#008790] text-white text-[11px] font-black uppercase tracking-wider text-center py-1 leading-none transition-colors">
                                                {notice.month || (notice.date ? new Date(notice.date).toLocaleString('default', { month: 'short' }).toUpperCase() : 'JUL')}
                                            </div>
                                            <div className="w-full py-2 flex items-center justify-center bg-white group-hover:bg-teal-50/20 transition-colors">
                                                <span className="font-black text-2xl text-slate-800 leading-none group-hover:text-[#009ca6] transition-colors">
                                                    {notice.day || (notice.date ? new Date(notice.date).getDate() : '28')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#009ca6] transition-colors leading-snug">
                                                    {notice.title}
                                                </h3>
                                                {notice.isNew && (
                                                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-[3px] shrink-0">
                                                        New
                                                    </span>
                                                )}
                                                {notice.category && (
                                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9.5px] font-bold rounded-[3px] shrink-0">
                                                        {notice.category}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
                                                {notice.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Important Links (Compact fixed width ~320px, top aligned with notice card) */}
                        <div className="w-full lg:w-[320px] shrink-0 pt-0 lg:pt-[54px]">
                            <div className="border border-[#009ca6] rounded-[4px] overflow-hidden bg-[#f4fbfa] shadow-2xs">
                                <div className="bg-[#009ca6] py-3 px-5">
                                    <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                                        Important Links
                                    </h3>
                                </div>
                                <div className="flex flex-col py-1.5 divide-y divide-[#009ca6]/10">
                                    {importantLinks.map((link, idx) => {
                                        const isAnchor = link.href.startsWith('#') || link.href.startsWith('/#');
                                        return isAnchor ? (
                                            <a
                                                key={idx}
                                                href={link.href}
                                                className="py-2.5 px-5 text-slate-700 hover:text-[#009ca6] hover:bg-white/80 transition-colors text-[13px] font-medium flex items-center justify-between group"
                                            >
                                                <span>{link.title}</span>
                                                <ChevronRight size={13} className="text-slate-300 group-hover:text-[#009ca6] group-hover:translate-x-0.5 transition-all" />
                                            </a>
                                        ) : (
                                            <Link
                                                key={idx}
                                                href={link.href}
                                                className="py-2.5 px-5 text-slate-700 hover:text-[#009ca6] hover:bg-white/80 transition-colors text-[13px] font-medium flex items-center justify-between group"
                                            >
                                                <span>{link.title}</span>
                                                <ChevronRight size={13} className="text-slate-300 group-hover:text-[#009ca6] group-hover:translate-x-0.5 transition-all" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 5. EXPLORE OUR ACADEMIC BATCHES                                            */}
            {/* ========================================================================= */}
            <section id="batches" className="scroll-mt-20 py-14 sm:py-16 bg-slate-50/50 border-b border-slate-200/80" style={gridBgStyle}>
                <span id="batches" className="sr-only" aria-hidden="true">batches & Batches</span>
                <div className="container mx-auto px-4 max-w-7xl space-y-8">

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200/80 pb-6">
                        <div className="max-w-2xl">
                            <span className="inline-block px-3 py-1 bg-emerald-50 text-[#047857] font-bold text-[10px] uppercase tracking-wider rounded-full mb-2">
                                Academic Batches
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                Explore Our Batches
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                Find the right batch for your academic level and join our expert-guided learning programs.
                            </p>
                        </div>

                        {/* View All Batches Button in Section Header */}
                        <Link
                            href={safeRoute('batches.index', undefined, '/batches')}
                            className="shrink-0 px-5 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white text-xs sm:text-sm font-bold rounded-[4px] shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
                        >
                            <span>View All Batches</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {/* Batches Grid: 4 Batches in 2 Columns (Matching Upcoming Events Layout) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {academicBatches.slice(0, 4).map(batch => (
                            <div
                                key={batch.id}
                                className="bg-white rounded-[4px] overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md flex flex-col sm:flex-row group transition-all"
                            >
                                {/* Left Image with Category & Code Badges */}
                                <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0 bg-slate-100">
                                    <img
                                        src={batch.image || '/images/batches/batch_physics.jpg'}
                                        alt={batch.display_title || batch.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = '/images/batches/batch_physics.jpg'; }}
                                    />
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-[4px] px-2.5 py-1 text-center shadow-xs border border-slate-200/90">
                                        <span className="block text-[10px] font-bold text-[#047857] uppercase tracking-wider leading-none">
                                            {batch.category || 'Academic Batch'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-[#047857]/90 backdrop-blur-xs rounded-[4px] px-2 py-0.5 text-center">
                                        <span className="block font-mono text-[10px] text-white tracking-wider font-semibold">
                                            {batch.code || `BATCH-${batch.id}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Content Column */}
                                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                                    <div>
                                        {/* Routine / Schedule Row */}
                                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 mb-2">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-[#047857]" />
                                                <span>{batch.class_days || 'Regular Days'}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={13} className="text-[#047857]" />
                                                <span>{batch.class_time || 'Schedule'}</span>
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-[#047857] transition-colors">
                                            {batch.display_title || batch.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3">
                                            {batch.description}
                                        </p>

                                        {/* Key Stats */}
                                        <div className="py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                            <span>
                                                Duration: <strong className="text-slate-700 font-semibold">{batch.duration || '12 Months'}</strong>
                                            </span>
                                            <span>
                                                Seats: <strong className="text-slate-700 font-semibold">{batch.seats_left ?? 25} Remaining</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-2">
                                        <Link
                                            href={batch.details_url || safeRoute('batches.show', batch.id, `/batches/${batch.id}`)}
                                            className="w-full py-2 px-3 text-center text-xs font-semibold text-slate-700 bg-white hover:bg-emerald-50 hover:text-[#047857] border border-slate-300 hover:border-emerald-300 rounded-[4px] transition-colors block"
                                        >
                                            Details
                                        </Link>
                                        <Link
                                            href={batch.link || safeRoute('admissions', undefined, '/admissions')}
                                            className="w-full py-2 px-3 text-center text-xs font-semibold text-white bg-[#047857] hover:bg-[#065f46] rounded-[4px] transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                        >
                                            <span>Join</span>
                                            <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Bottom Guidance Banner */}
                    <div className="p-5 sm:p-6 bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] rounded-[4px] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-emerald-800/40">
                        <div className="space-y-1 text-center sm:text-left">
                            <h4 className="text-base sm:text-lg font-bold tracking-tight">
                                Want to join multiple subjects or need guidance?
                            </h4>
                            <p className="text-xs text-emerald-100/90">
                                Our academic counseling team will assist you in selecting the best batch combinations for your school/college schedule.
                            </p>
                        </div>
                        <Link
                            href={safeRoute('admissions', undefined, '/admissions')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-[4px] shadow-sm transition-colors shrink-0 cursor-pointer"
                        >
                            <span>Admission Instructions</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                </div>
            </section>

            {/* ========================================================================= */}
            {/* 6. UPCOMING EVENTS                                                        */}
            {/* ========================================================================= */}
            <section id="events" className="py-14 sm:py-16 bg-slate-50/50 border-b border-slate-200/80" style={gridBgStyle}>
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                        <div className="max-w-2xl">
                            <span className="inline-block px-3 py-1 bg-[#ffe4e6] text-[#e11d48] font-bold text-[10px] uppercase tracking-wider rounded-full mb-2">
                                STAY UPDATED
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1.5">
                                Upcoming Events
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm">
                                Don't miss out on what's happening around our beautiful campus this month.
                            </p>
                        </div>
                        <Link
                            href={safeRoute('events', undefined, '/events')}
                            className="shrink-0 px-5 py-2.5 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors"
                        >
                            View All Events
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {upcomingEventsList.map(event => (
                            <div
                                key={event.id}
                                className="bg-white rounded-[4px] overflow-hidden shadow-2xs hover:shadow-md border border-slate-200/90 flex flex-col sm:flex-row group transition-all"
                            >
                                <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className={`absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-[4px] p-2 text-center shadow-md border-b-2 ${event.accent.border} min-w-[52px]`}>
                                        <span className={`block ${event.accent.text} font-bold text-[10px] uppercase tracking-wider leading-none mb-1`}>
                                            {event.month}
                                        </span>
                                        <span className="block text-xl font-black text-slate-900 leading-none">
                                            {event.day}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={13} className={event.accent.text} />
                                                <span>{event.time}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={13} className={event.accent.text} />
                                                <span>{event.location}</span>
                                            </span>
                                        </div>

                                        <h3 className={`text-base font-bold text-slate-900 mb-1.5 ${event.accent.hoverText} transition-colors leading-snug`}>
                                            {event.title}
                                        </h3>

                                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="pt-3">
                                        <Link
                                            href={safeRoute('events', undefined, '/events')}
                                            className={`font-bold text-xs inline-flex items-center gap-1 ${event.accent.text} hover:underline`}
                                        >
                                            <span>Read More</span>
                                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 7. STUDENT SUCCESS STORIES                                                */}
            {/* ========================================================================= */}
            <section id="success-stories" className="py-14 sm:py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 max-w-7xl space-y-8">
                    <div className="text-center space-y-1.5">
                        <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-[#047857] text-[11px] font-bold border border-emerald-200">
                            🏆 Student Success Stories
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Celebrating Our Outstanding Achievers
                        </h2>
                        <p className="text-xs text-slate-500 max-w-xl mx-auto">
                            Inspiring stories of dedication, hard work, and academic excellence shared by our brilliant students.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {successStories.map((story, idx) => (
                            <div
                                key={story.id || idx}
                                className="bg-white p-5 rounded-[4px] border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group relative"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-[3px] text-[10px] font-bold">
                                        <Award size={12} className="text-amber-600 shrink-0" />
                                        <span>{story.badge}</span>
                                    </span>
                                    <Quote size={18} className="text-emerald-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                                </div>

                                <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4">
                                    "{story.quote}"
                                </p>

                                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                                    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${story.color || 'bg-emerald-100 text-emerald-800 border-emerald-300'}`}>
                                        <span>{story.initials || story.name.substring(0, 2).toUpperCase()}</span>
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                        <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-[#047857] transition-colors">{story.name}</h4>
                                        <p className="text-[10.5px] font-semibold text-[#047857] truncate mt-0.5">{story.institution}</p>
                                        <p className="text-[9.5px] text-slate-400 font-mono truncate">{story.batch}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 pt-3">
                        <Link
                            href={safeRoute('success-stories', undefined, '/success-stories')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white text-xs sm:text-[13px] font-bold rounded-[4px] shadow-sm hover:shadow transition-all group cursor-pointer"
                        >
                            <span>View All Success Stories</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <p className="text-xs text-slate-500 pt-1">
                            Ready to achieve your academic dreams in our upcoming batch?
                            <Link
                                href={safeRoute('admissions', undefined, '/admissions')}
                                className="ml-1.5 font-bold text-[#ea580c] hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                                <span>View Admission Details</span>
                                <ArrowRight size={11} />
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 8. COACHING LIFE & ACTIVITIES (BENTO GRID GALLERY)                         */}
            {/* ========================================================================= */}
            <section id="gallery" className="py-14 sm:py-16 bg-slate-50/50" style={gridBgStyle}>
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                        <div className="max-w-2xl">
                            <span className="inline-block px-3 py-1 bg-[#fef3c7] text-[#92400e] font-bold text-[10px] uppercase tracking-wider rounded-full mb-2">
                                Vibrant Community
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1.5">
                                Coaching Life & Activities
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm">
                                Academic excellence with personal mentorship. Explore our vibrant coaching life, interactive seminars, and campus activities.
                            </p>
                        </div>
                        <Link
                            href={safeRoute('gallery', undefined, '/gallery')}
                            className="shrink-0 px-5 py-2 border-2 border-[#009ca6] text-[#009ca6] hover:bg-[#009ca6] hover:text-white rounded-[4px] font-bold transition-all text-xs"
                        >
                            View Gallery
                        </Link>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 md:gap-4 h-[440px] md:h-[480px] lg:h-[500px]">

                        {/* 1. Large Card Left: Model Test Exam in AC Classroom (2 cols, 2 rows) */}
                        <div className="md:col-span-2 md:row-span-2 relative rounded-[4px] overflow-hidden group shadow-2xs">
                            <img
                                src={galleryPhotos[0]?.image || '/images/ullash_classroom_model_test_01.jpg'}
                                alt={galleryPhotos[0]?.title || 'Model Test Examination Session in AC Classroom'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            <div className="absolute bottom-5 left-5 right-5">
                                <span className="px-2.5 py-0.5 bg-[#009ca6] text-white text-[10px] font-bold rounded-[2px] uppercase inline-block mb-1.5 tracking-wider">
                                    {galleryPhotos[0]?.category || 'ACADEMICS'}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                                    {galleryPhotos[0]?.title || 'Model Test Examination Session in AC Classroom'}
                                </h3>
                            </div>
                        </div>

                        {/* 2. Top Right Wide Card: Farewell Celebration (2 cols, 1 row) */}
                        <div className="md:col-span-2 md:row-span-1 relative rounded-[4px] overflow-hidden group shadow-2xs">
                            <img
                                src={galleryPhotos[1]?.image || '/images/ullash_farewell_gift_ceremony.jpg'}
                                alt={galleryPhotos[1]?.title || 'HSC-2026 Batch Grand Farewell & Celebration'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className="px-2.5 py-0.5 bg-[#009ca6] text-white text-[10px] font-bold rounded-[2px] uppercase inline-block mb-1.5 tracking-wider">
                                    {galleryPhotos[1]?.category || 'EVENTS'}
                                </span>
                                <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                                    {galleryPhotos[1]?.title || 'HSC-2026 Batch Grand Farewell & Celebration'}
                                </h3>
                            </div>
                        </div>

                        {/* 3. Bottom Right Card 1: Merit Crest Award (1 col, 1 row) */}
                        <div className="md:col-span-1 md:row-span-1 relative rounded-[4px] overflow-hidden group shadow-2xs">
                            <img
                                src={galleryPhotos[2]?.image || '/images/ullash_award_crest_01.jpg'}
                                alt={galleryPhotos[2]?.title || 'Merit Crest Award Presentation to Top Achievers'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="px-2.5 py-0.5 bg-[#009ca6] text-white text-[10px] font-bold rounded-[2px] uppercase inline-block mb-1 tracking-wider">
                                    {galleryPhotos[2]?.category || 'RECOGNITION'}
                                </span>
                                <h3 className="text-sm md:text-base font-bold text-white leading-tight">
                                    {galleryPhotos[2]?.title || 'Merit Crest Award Presentation to Top Achievers'}
                                </h3>
                            </div>
                        </div>

                        {/* 4. Bottom Right Card 2: Faculty Mentorship (1 col, 1 row) */}
                        <div className="md:col-span-1 md:row-span-1 relative rounded-[4px] overflow-hidden group shadow-2xs">
                            <img
                                src={galleryPhotos[3]?.image || '/images/ullash_campus_mentorship.jpg'}
                                alt={galleryPhotos[3]?.title || 'Faculty Mentorship & Guidance in Front of Campus'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="px-2.5 py-0.5 bg-[#009ca6] text-white text-[10px] font-bold rounded-[2px] uppercase inline-block mb-1 tracking-wider">
                                    {galleryPhotos[3]?.category || 'CAMPUS'}
                                </span>
                                <h3 className="text-sm md:text-base font-bold text-white leading-tight">
                                    {galleryPhotos[3]?.title || 'Faculty Mentorship & Guidance in Front of Campus'}
                                </h3>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 9. CONTACT US & CAMPUS COUNSELING SECTION                                  */}
            {/* ========================================================================= */}
            <section id="contact" className="scroll-mt-20 py-14 sm:py-16 bg-white border-t border-slate-200/80">
                <div className="container mx-auto px-4 max-w-7xl space-y-10">

                    {/* Section Header */}
                    <div className="max-w-2xl text-left">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-[#047857] font-bold text-[10px] uppercase tracking-wider rounded-full mb-2">
                            GET IN TOUCH
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {settings?.contact_title || 'Contact Our Campus'}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                            {settings?.contact_subtitle || 'Have questions about academic batches, admission guidelines, or fee structures? Reach out to our campus office or academic counseling desk today.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: 4 Information Cards & Counseling Box (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Card 1: Campus Address */}
                                <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-2">
                                    <div className="w-8 h-8 rounded-[4px] bg-emerald-100 text-[#047857] flex items-center justify-center">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Campus Location</h4>
                                        <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-relaxed">
                                            {settings?.address || 'House 123, Road 5, Mirpur-10, Dhaka-1216, Bangladesh'}
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2: Hotlines */}
                                <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-2">
                                    <div className="w-8 h-8 rounded-[4px] bg-emerald-100 text-[#047857] flex items-center justify-center">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Official Hotline</h4>
                                        <div className="mt-0.5 space-y-0.5">
                                            <a href={`tel:${settings?.phone || '+880 1712-345678'}`} className="text-xs font-bold text-slate-800 hover:text-[#047857] block transition-colors">
                                                {settings?.phone || '+880 1712-345678'}
                                            </a>
                                            {settings?.contact_phone_alt && (
                                                <a href={`tel:${settings.contact_phone_alt}`} className="text-xs text-slate-600 hover:text-[#047857] block transition-colors">
                                                    Alt: {settings.contact_phone_alt}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3: Email */}
                                <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-2">
                                    <div className="w-8 h-8 rounded-[4px] bg-teal-100 text-[#009ca6] flex items-center justify-center">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Official Email</h4>
                                        <a href={`mailto:${settings?.email || 'info@ullashcoachingcenter.com'}`} className="text-xs font-bold text-slate-800 hover:text-[#009ca6] mt-0.5 block truncate transition-colors">
                                            {settings?.email || 'info@ullashcoachingcenter.com'}
                                        </a>
                                    </div>
                                </div>

                                {/* Card 4: Office Hours */}
                                <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-2">
                                    <div className="w-8 h-8 rounded-[4px] bg-amber-100 text-amber-700 flex items-center justify-center">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Office & Counseling Hours</h4>
                                        <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-relaxed">
                                            {settings?.contact_office_hours || 'Saturday - Thursday: 8:00 AM - 8:00 PM (Friday Closed)'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Counseling Guidance Banner */}
                            <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-[4px] border border-emerald-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857] block">Academic Counseling Desk</span>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        {settings?.contact_counseling_note || 'Walk-in academic counseling and batch placement discussions are open daily during office hours.'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {settings?.whatsapp_number && (
                                        <a
                                            href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-[3px] shadow-2xs flex items-center gap-1.5 transition-colors"
                                        >
                                            <MessageSquare size={13} />
                                            <span>WhatsApp</span>
                                        </a>
                                    )}
                                    <Link
                                        href={safeRoute('admissions', undefined, '/admissions')}
                                        className="px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold rounded-[3px] shadow-2xs flex items-center gap-1.5 transition-colors"
                                    >
                                        <span>Admission</span>
                                        <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Quick Counseling Inquiry Form (5 cols) */}
                        <div className="lg:col-span-5 bg-slate-50/80 p-5 sm:p-6 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                    Send an Academic Inquiry
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Leave your contact details and our counseling team will get back to you.
                                </p>
                            </div>

                            {inquirySent ? (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[4px] text-center space-y-2 animate-in fade-in">
                                    <CheckCircle2 size={28} className="mx-auto text-[#047857]" />
                                    <h4 className="text-xs font-bold text-emerald-900">Inquiry Received Successfully!</h4>
                                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                                        Thank you for contacting {centerName}. Our academic counseling team will reach out to your phone number shortly.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleInquirySubmit} className="space-y-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                            Student / Guardian Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={inquiryForm.name}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                            placeholder="Enter your name"
                                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                            Mobile Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={inquiryForm.phone}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                            placeholder="+880 1712-000000"
                                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                            Target Class / Batch
                                        </label>
                                        <input
                                            type="text"
                                            value={inquiryForm.batch}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, batch: e.target.value })}
                                            placeholder="e.g. HSC Physics, SSC Science"
                                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                            Your Question / Note
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={inquiryForm.message}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                            placeholder="Inquire about batch schedules, fees, or routine..."
                                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2.5 px-4 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold rounded-[3px] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Send size={13} />
                                        <span>Submit Inquiry</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </section>

            {/* Notice Detail Modal */}
            {selectedNotice && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setSelectedNotice(null)}
                >
                    <div
                        className="bg-white rounded-[4px] border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all scale-100"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-[#009ca6] text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-white/20 text-white border border-white/30 text-[11px] font-bold rounded">
                                    Notice Details
                                </span>
                                {selectedNotice.category && (
                                    <span className="text-xs text-white/90 font-medium">
                                        • {selectedNotice.category}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedNotice(null)}
                                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center rounded-[4px] overflow-hidden border border-slate-200/90 bg-white shadow-xs shrink-0 w-14">
                                    <div className="w-full bg-[#009ca6] text-white text-[10px] font-black uppercase tracking-wider text-center py-1 leading-none">
                                        {selectedNotice.month || (selectedNotice.date ? new Date(selectedNotice.date).toLocaleString('default', { month: 'short' }).toUpperCase() : 'JUL')}
                                    </div>
                                    <div className="w-full py-2 flex items-center justify-center bg-white">
                                        <span className="font-black text-xl text-slate-900 leading-none">
                                            {selectedNotice.day || (selectedNotice.date ? new Date(selectedNotice.date).getDate() : '28')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                            {selectedNotice.title}
                                        </h3>
                                        {selectedNotice.isNew && (
                                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9.5px] font-bold rounded shrink-0">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                        <Calendar size={13} className="text-slate-400" />
                                        <span>Published: {selectedNotice.date_formatted || `${selectedNotice.day} ${selectedNotice.month}`}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm">
                                    {selectedNotice.content || selectedNotice.description}
                                </div>
                            </div>

                            {selectedNotice.attachment && (
                                <div className="bg-slate-50 border border-slate-200 rounded-[4px] p-3 flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <FileText size={18} className="text-[#009ca6] shrink-0" />
                                        <span className="text-xs font-semibold text-slate-700 truncate">
                                            Attached Document
                                        </span>
                                    </div>
                                    <a
                                        href={selectedNotice.attachment}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a] hover:underline"
                                    >
                                        <Download size={14} />
                                        Download
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedNotice(null)}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-[3px] transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Home.layout = page => <FrontendLayout children={page} />;
