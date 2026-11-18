import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, User, Contact, Layers, FileText, Calendar, ClipboardCheck, GraduationCap, CheckCircle2, XCircle, MessageSquareText, Award } from 'lucide-react';

export default function MarksheetSlipModal({
    isOpen,
    onClose,
    student = {},
    result = {},
    exam = {},
    settings = {}
}) {
    if (!isOpen) return null;

    const centerName = settings.center_name || 'Ullash Coaching Center';
    const studentName = student?.name || student?.user?.name || 'Arafat Hassan';
    const studentId = student?.student_id || 'UCCA-HMATH-0001';
    const batchName = exam?.batch?.name || student?.batch?.name || 'Academic Batch';
    const examTitle = exam?.title || result?.exam?.title || 'Weekly Evaluation Test';
    const examDate = exam?.exam_date || result?.exam?.exam_date || new Date().toISOString().split('T')[0];

    const obtainedMarks = Number(result?.obtained_marks ?? 0).toFixed(2);
    const totalMarks = Number(result?.total_marks ?? 100).toFixed(2);
    const percentage = Number(result?.percentage ?? ((obtainedMarks / totalMarks) * 100)).toFixed(2);
    const grade = result?.grade || 'A+';
    const gpa = Number(result?.gpa ?? 5.00).toFixed(2);
    const isPassed = (result?.pass_status ?? 'pass') === 'pass';

    const defaultRemark = grade === 'A+'
        ? 'Outstanding academic performance! Keep maintaining this high standard.'
        : grade === 'A'
        ? 'Very good mastery of concepts. Continue practice for even higher consistency.'
        : grade === 'B'
        ? 'Good effort. Additional focused revision recommended on core topics.'
        : 'Needs dedicated attention and regular practice on fundamental concepts.';

    const remark = result?.remarks || defaultRemark;

    const handlePrint = () => {
        window.print();
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:m-0 print:bg-white print:fixed print:inset-0">
            {/* Embedded Print Stylesheet */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden !important;
                    }
                    #marksheet-printable-slip, #marksheet-printable-slip * {
                        visibility: visible !important;
                    }
                    #marksheet-printable-slip {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 24px !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: #ffffff !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    @page {
                        size: A4 portrait;
                        margin: 10mm;
                    }
                }
            `}</style>

            {/* Modal Dialog Container */}
            <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col print:shadow-none print:border-none print:max-w-none print:w-full print:rounded-none">

                {/* Top Action Header (Hidden during Print) */}
                <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
                    <div className="flex items-center gap-2">
                        <Award size={16} className="text-emerald-400" />
                        <span className="text-xs font-bold tracking-tight">Academic Marksheet Slip</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] transition-colors cursor-pointer shadow-xs"
                        >
                            <Printer size={13} /> Print marksheet
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-white rounded-[3px] transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Marksheet Printable Slip Container */}
                <div
                    id="marksheet-printable-slip"
                    className="relative bg-white p-6 sm:p-9 space-y-4 text-slate-900 overflow-hidden print:p-8 print:m-0"
                    style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                >
                    {/* TOP LEFT DECORATIVE ACCENT WAVES */}
                    <div className="absolute top-0 left-0 w-44 sm:w-56 h-24 sm:h-32 overflow-hidden pointer-events-none select-none">
                        <svg viewBox="0 0 180 100" fill="none" className="w-full h-full">
                            <path d="M0 0 L135 0 C90 40 45 75 0 98 Z" fill="#046a38" />
                            <path d="M0 26 C40 32 75 22 120 0 C130 0 140 0 148 0 C96 36 50 68 0 76 Z" fill="#f59e0b" opacity="0.95" />
                        </svg>
                    </div>

                    {/* HEADER: LOGO, INSTITUTION NAME & TITLE BADGE */}
                    <div className="text-center relative z-10 pt-1 space-y-1">
                        {/* Center Emblem / Logo */}
                        <div className="flex justify-center mb-1">
                            <CoachingEmblemLogo />
                        </div>

                        {/* Coaching Center Title */}
                        <h2 className="text-2xl sm:text-[26px] font-black text-[#046a38] tracking-tight leading-snug">
                            {centerName}
                        </h2>

                        {/* Subtitle with accent lines */}
                        <div className="flex items-center justify-center gap-3 pt-0.5">
                            <span className="h-[1px] w-14 sm:w-20 bg-[#046a38]/40"></span>
                            <span className="text-[10px] sm:text-[11.5px] font-bold text-slate-700 tracking-[0.24em] uppercase">
                                Academic Evaluation Marksheet
                            </span>
                            <span className="h-[1px] w-14 sm:w-20 bg-[#046a38]/40"></span>
                        </div>

                        {/* Marksheet Slip Badge */}
                        <div className="flex items-center justify-center gap-2 pt-1.5 pb-1">
                            <div className="flex items-center gap-1">
                                <span className="h-[2px] w-7 sm:w-10 bg-amber-400 rounded-full inline-block"></span>
                                <span className="h-[2px] w-3.5 sm:w-5 bg-amber-400 rounded-full inline-block"></span>
                            </div>
                            <span className="bg-[#046a38] text-white text-[11px] sm:text-[11.5px] font-black tracking-widest px-5 sm:px-6 py-0.5 rounded-full uppercase shadow-xs">
                                Marksheet Slip
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="h-[2px] w-3.5 sm:w-5 bg-amber-400 rounded-full inline-block"></span>
                                <span className="h-[2px] w-7 sm:w-10 bg-amber-400 rounded-full inline-block"></span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 1: STUDENT METADATA & GRADE MEDAL */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-stretch justify-between gap-4 relative z-10">
                        {/* Left Details List */}
                        <div className="flex-1 space-y-2.5 text-xs">
                            <div className="flex items-center">
                                <div className="flex items-center gap-2.5 w-32 shrink-0 text-slate-600 font-medium">
                                    <User size={15} className="text-slate-500 shrink-0" />
                                    <span>Student Name</span>
                                </div>
                                <span className="text-slate-400 font-bold mr-2.5">:</span>
                                <b className="text-slate-900 font-black text-sm tracking-tight">{studentName}</b>
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center gap-2.5 w-32 shrink-0 text-slate-600 font-medium">
                                    <Contact size={15} className="text-slate-500 shrink-0" />
                                    <span>Student ID</span>
                                </div>
                                <span className="text-slate-400 font-bold mr-2.5">:</span>
                                <span className="inline-block bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] px-2.5 py-0.5 rounded-[4px] font-mono text-xs font-extrabold shadow-2xs">
                                    {studentId}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center gap-2.5 w-32 shrink-0 text-slate-600 font-medium">
                                    <Layers size={15} className="text-slate-500 shrink-0" />
                                    <span>Batch</span>
                                </div>
                                <span className="text-slate-400 font-bold mr-2.5">:</span>
                                <b className="text-slate-800 font-bold text-xs">{batchName}</b>
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center gap-2.5 w-32 shrink-0 text-slate-600 font-medium">
                                    <FileText size={15} className="text-slate-500 shrink-0" />
                                    <span>Examination</span>
                                </div>
                                <span className="text-slate-400 font-bold mr-2.5">:</span>
                                <b className="text-slate-800 font-bold text-xs leading-snug">{examTitle}</b>
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center gap-2.5 w-32 shrink-0 text-slate-600 font-medium">
                                    <Calendar size={15} className="text-slate-500 shrink-0" />
                                    <span>Exam Date</span>
                                </div>
                                <span className="text-slate-400 font-bold mr-2.5">:</span>
                                <span className="text-slate-700 font-bold text-xs font-mono">{examDate}</span>
                            </div>
                        </div>

                        {/* Right Divider & Laurel Wreath Grade Medal */}
                        <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4 flex items-center justify-center shrink-0 w-full sm:w-36">
                            <GradeMedal grade={grade} />
                        </div>
                    </div>

                    {/* SECTION 2: PERFORMANCE METRIC 2-COLUMN CARDS */}
                    <div className="grid grid-cols-2 gap-3.5 sm:gap-4 relative z-10">
                        {/* Obtained Marks Card */}
                        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 text-center flex flex-col items-center justify-between shadow-2xs">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                                <ClipboardCheck size={16} className="text-[#16a34a]" />
                                <span>Obtained Marks</span>
                            </div>

                            <div className="my-1.5">
                                <span className="text-2xl sm:text-4xl font-black text-[#15803d] tracking-tight">
                                    {obtainedMarks}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-slate-400 ml-1">
                                    / {totalMarks}
                                </span>
                            </div>

                            <div className="w-24 h-[1px] bg-[#bbf7d0] my-2"></div>

                            <span className="inline-block px-4 py-0.5 rounded-full bg-white border border-[#bbf7d0] text-[#15803d] font-black text-xs shadow-2xs">
                                {percentage}%
                            </span>
                        </div>

                        {/* Grade & GPA Card */}
                        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 text-center flex flex-col items-center justify-between shadow-2xs">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                                <GraduationCap size={16} className="text-slate-700" />
                                <span>Grade & GPA</span>
                            </div>

                            <div className="my-1.5">
                                <span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                    {grade}
                                </span>
                                <span className="text-sm sm:text-base font-bold text-slate-500 ml-1.5">
                                    ({gpa})
                                </span>
                            </div>

                            <div className="w-24 h-[1px] bg-slate-200 my-2"></div>

                            <span className={`inline-flex items-center gap-1 px-4 py-0.5 rounded-full bg-white border font-black text-xs shadow-2xs ${
                                isPassed ? 'border-emerald-200 text-[#15803d]' : 'border-rose-200 text-rose-700'
                            }`}>
                                {isPassed ? (
                                    <CheckCircle2 size={13} className="text-[#15803d]" />
                                ) : (
                                    <XCircle size={13} className="text-rose-600" />
                                )}
                                <span>{isPassed ? 'PASSED' : 'FAILED'}</span>
                            </span>
                        </div>
                    </div>

                    {/* SECTION 3: INSTRUCTOR REMARK CARD */}
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 flex items-start gap-2.5 text-xs relative z-10 shadow-2xs">
                        <MessageSquareText size={16} className="text-[#16a34a] shrink-0 mt-0.5" />
                        <div className="text-slate-800 leading-relaxed">
                            <b className="text-slate-900 font-black">Instructor Remark: </b>
                            <span>{remark}</span>
                        </div>
                    </div>

                    {/* SECTION 4: SIGNATURES & OFFICIAL SEAL (Clean blank space for physical signature) */}
                    <div className="grid grid-cols-3 items-end pt-8 pb-3 text-center relative z-10">
                        {/* Evaluator Signature (Physical signature line, clean blank space above) */}
                        <div className="flex flex-col items-center">
                            <div className="h-12 sm:h-14 w-full"></div>
                            <div className="w-28 sm:w-36 border-t border-slate-700"></div>
                            <p className="text-[11px] sm:text-[11.5px] font-bold text-slate-900 mt-1.5">
                                Evaluator Signature
                            </p>
                        </div>

                        {/* Official Coaching Seal / Rubber Stamp in Center */}
                        <div className="flex flex-col items-center justify-center">
                            <OfficialCoachingSeal centerName={centerName} />
                        </div>

                        {/* Controller / Seal Signature (Physical signature line, clean blank space above) */}
                        <div className="flex flex-col items-center">
                            <div className="h-12 sm:h-14 w-full"></div>
                            <div className="w-28 sm:w-36 border-t border-slate-700"></div>
                            <p className="text-[11px] sm:text-[11.5px] font-bold text-slate-900 mt-1.5">
                                Controller / Seal
                            </p>
                        </div>
                    </div>

                    {/* BOTTOM DECORATIVE WAVES */}
                    <div className="absolute bottom-0 left-0 w-full h-8 sm:h-10 overflow-hidden pointer-events-none select-none">
                        <svg viewBox="0 0 400 32" fill="none" preserveAspectRatio="none" className="w-full h-full">
                            <path d="M0 32 L400 32 L400 18 C320 8 240 26 160 14 C100 4 40 22 0 10 Z" fill="#046a38" />
                            <path d="M0 22 C40 28 100 12 160 20 C240 28 320 14 400 22 L400 32 L0 32 Z" fill="#f59e0b" opacity="0.9" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

/**
 * Top Coaching Center Emblem Logo
 */
function CoachingEmblemLogo() {
    return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-xs">
                {/* Academic Cap (Top Gold) */}
                <path d="M50 12 L72 20 L50 28 L28 20 Z" fill="#d97706" />
                <path d="M38 24.5 L38 31 C38 34.5 43.5 37 50 37 C56.5 37 62 34.5 62 31 L62 24.5" fill="#b45309" opacity="0.9" />
                <path d="M70 21 L74 34 L72 34.5 L68 22 Z" fill="#92400e" />

                {/* Open Book in Center */}
                <g transform="translate(25, 34)">
                    <path d="M25 6 C17 3 7 4 2 7 L2 40 C7 37 17 36 25 39 C33 36 43 37 48 40 L48 7 C43 4 33 3 25 6 Z" fill="#046a38" />
                    <path d="M25 8 C18 5 9 6 4 9 L4 38 C9 35 18 34 25 37 C32 34 41 35 46 38 L46 9 C41 6 32 5 25 8 Z" fill="#ffffff" />
                    <line x1="25" y1="8" x2="25" y2="37" stroke="#046a38" strokeWidth="1.5" />
                    <text x="25" y="27" fill="#046a38" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                        U
                    </text>
                </g>

                {/* Laurel Leaves (Left side) */}
                <g fill="#046a38">
                    <path d="M22 40 C17 38 14 42 16 46 C19 44 21 42 22 40 Z" />
                    <path d="M19 50 C14 49 12 54 15 57 C17 55 19 52 19 50 Z" />
                    <path d="M18 60 C14 60 13 65 16 68 C18 65 19 62 18 60 Z" />
                    <path d="M22 70 C19 72 20 77 24 78 C24 75 24 72 22 70 Z" />
                </g>

                {/* Laurel Leaves (Right side) */}
                <g fill="#046a38">
                    <path d="M78 40 C83 38 86 42 84 46 C81 44 79 42 78 40 Z" />
                    <path d="M81 50 C86 49 88 54 85 57 C83 55 81 52 81 50 Z" />
                    <path d="M82 60 C86 60 87 65 84 68 C82 65 81 62 82 60 Z" />
                    <path d="M78 70 C81 72 80 77 76 78 C76 75 76 72 78 70 Z" />
                </g>
            </svg>
        </div>
    );
}

/**
 * Golden Laurel Wreath Medal for Grade
 */
function GradeMedal({ grade = 'A+' }) {
    return (
        <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-xs">
                {/* Top Radiating Rays in Gold */}
                <g stroke="#d97706" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="50" y1="7" x2="50" y2="2" />
                    <line x1="39" y1="10" x2="35" y2="5" />
                    <line x1="61" y1="10" x2="65" y2="5" />
                    <line x1="29" y1="16" x2="24" y2="12" />
                    <line x1="71" y1="16" x2="76" y2="12" />
                    <line x1="22" y1="26" x2="16" y2="23" />
                    <line x1="78" y1="26" x2="84" y2="23" />
                </g>

                {/* Laurel Wreath Leaves (Left Arc in Gold) */}
                <g fill="#f59e0b">
                    <path d="M30 22 C24 24 23 30 27 33 C29 30 30 26 30 22 Z" />
                    <path d="M24 33 C18 36 18 42 23 45 C24 41 25 37 24 33 Z" />
                    <path d="M22 45 C16 49 17 55 23 57 C24 53 24 49 22 45 Z" />
                    <path d="M25 57 C20 62 23 68 29 69 C29 64 28 60 25 57 Z" />
                    <path d="M32 68 C28 73 33 78 38 78 C38 74 36 70 32 68 Z" />
                    <path d="M41 76 C38 80 44 84 49 83 C48 79 45 76 41 76 Z" />
                </g>

                {/* Laurel Wreath Leaves (Right Arc in Gold) */}
                <g fill="#f59e0b">
                    <path d="M70 22 C76 24 77 30 73 33 C71 30 70 26 70 22 Z" />
                    <path d="M76 33 C82 36 82 42 77 45 C76 41 75 37 76 33 Z" />
                    <path d="M78 45 C84 49 83 55 77 57 C76 53 76 49 78 45 Z" />
                    <path d="M75 57 C80 62 77 68 71 69 C71 64 72 60 75 57 Z" />
                    <path d="M68 68 C72 73 67 78 62 78 C62 74 64 70 68 68 Z" />
                    <path d="M59 76 C62 80 56 84 51 83 C52 79 55 76 59 76 Z" />
                </g>

                {/* Center Circle Glow / Frame */}
                <circle cx="50" cy="48" r="22" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />

                {/* Grade Text */}
                <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fill="#046a38"
                    fontSize="21"
                    fontWeight="900"
                    fontFamily="sans-serif"
                    letterSpacing="-0.5"
                >
                    {grade}
                </text>

                {/* Bottom Ribbon Tails (Dark Green) */}
                <g fill="#046a38">
                    <path d="M43 78 L34 96 L42 92 L47 96 L47 78 Z" />
                    <path d="M57 78 L66 96 L58 92 L53 96 L53 78 Z" />
                    <ellipse cx="50" cy="79" rx="6" ry="4" fill="#034d28" />
                </g>
            </svg>
        </div>
    );
}

/**
 * Circular Official Seal / Rubber Stamp of Coaching Center
 */
function OfficialCoachingSeal({ centerName = 'ULLASH COACHING CENTER' }) {
    const uppercaseName = (centerName || 'ULLASH COACHING CENTER').toUpperCase();

    return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative select-none">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-2xs">
                {/* Outer Concentric Circles */}
                <circle cx="50" cy="50" r="47" stroke="#046a38" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="43" stroke="#046a38" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                <circle cx="50" cy="50" r="28" stroke="#046a38" strokeWidth="1.5" />

                {/* Circular Text Paths */}
                <defs>
                    <path
                        id="sealTopArc"
                        d="M 14,50 A 36,36 0 1,1 86,50"
                        fill="none"
                    />
                    <path
                        id="sealBottomArc"
                        d="M 86,50 A 36,36 0 0,1 14,50"
                        fill="none"
                    />
                </defs>

                {/* Top Arc Text */}
                <text fontSize="5.2" fontWeight="900" fill="#046a38" letterSpacing="0.8">
                    <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
                        {uppercaseName}
                    </textPath>
                </text>

                {/* Bottom Arc Text */}
                <text fontSize="5.2" fontWeight="800" fill="#046a38" letterSpacing="1">
                    <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
                        ★ EST. 2018 ★
                    </textPath>
                </text>

                {/* Center Book & 'U' Logo in Seal */}
                <g transform="translate(38, 38) scale(0.24)">
                    <path
                        d="M50 15 C34 9 14 11 4 17 L4 83 C14 77 34 75 50 81 C66 75 86 77 96 83 L96 17 C86 11 66 9 50 15 Z"
                        fill="#046a38"
                    />
                    <path
                        d="M50 19 C36 13 18 15 8 21 L8 79 C18 73 36 71 50 77 C64 71 82 73 92 79 L92 21 C82 15 64 13 50 19 Z"
                        fill="#ffffff"
                    />
                    <line x1="50" y1="19" x2="50" y2="77" stroke="#046a38" strokeWidth="3" />
                    <text x="50" y="58" fill="#046a38" fontSize="34" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                        U
                    </text>
                </g>
            </svg>
        </div>
    );
}

