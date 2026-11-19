import React, { useState, useEffect, useMemo } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar, ClipboardCheck, Wallet, Award,
    BookMarked, FileCode, Bell, CheckCircle2, XCircle,
    User, Layers, Clock, MapPin, Printer, Eye, X, 
    FileText, Check, ArrowRight, TrendingUp, AlertCircle,
    BookOpen, Filter, CheckCheck, BarChart2,
    Video, Play, FileArchive, Download, ExternalLink, Search, Sparkles
} from 'lucide-react';
import MarksheetSlipModal from '@/Components/Marksheet/MarksheetSlipModal';

export default function StudentDashboard({ 
    student, 
    currentTab = 'overview',
    enrolledBatches = [],
    routines = [], 
    attendances = [], 
    attendancePercentage = 100, 
    invoices = [], 
    payments = [], 
    totalPaid = 0, 
    totalDue = 0, 
    results = [], 
    assignments = [], 
    studyMaterials = [], 
    notices = [] 
}) {
    const { settings } = usePage().props;
    const centerName = settings?.center_name || 'Ullash Coaching Center';
    const [activeTab, setActiveTab] = useState(currentTab || 'overview');
    const [selectedMarksheet, setSelectedMarksheet] = useState(null);

    // BATCH & MONTH FILTERS
    const [selectedBatchId, setSelectedBatchId] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all'); // 'YYYY-MM' or 'all'

    // STUDY MATERIALS FILTER & VIDEO MODAL
    const [materialSearch, setMaterialSearch] = useState('');
    const [materialTypeFilter, setMaterialTypeFilter] = useState('all');
    const [activeVideoModal, setActiveVideoModal] = useState(null);

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
    };

    // Sync tab when prop changes or on initial mount
    useEffect(() => {
        if (currentTab) {
            setActiveTab(currentTab);
        }
    }, [currentTab]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', newTab);
            window.history.replaceState({}, '', url.toString());
        }
    };

    // Fallback batch list if enrolledBatches is empty
    const batchesList = enrolledBatches && enrolledBatches.length > 0
        ? enrolledBatches
        : (student?.batch ? [student.batch] : []);

    const activeBatchName = selectedBatchId === 'all'
        ? 'All Batches'
        : batchesList.find(b => String(b.id) === String(selectedBatchId))?.name || 'Selected Batch';

    // Extract available distinct months from attendances ('YYYY-MM')
    const availableMonths = useMemo(() => {
        const monthSet = new Set();
        attendances.forEach(att => {
            if (att.date && att.date.length >= 7) {
                monthSet.add(att.date.slice(0, 7));
            }
        });
        return Array.from(monthSet).sort().reverse();
    }, [attendances]);

    const formatMonthName = (monthStr) => {
        if (!monthStr || monthStr === 'all') return 'All Months';
        const [year, month] = monthStr.split('-');
        const date = new Date(Number(year), Number(month) - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const getBatchImage = (batch) => {
        if (batch?.image) return batch.image;
        if (batch?.display_image) return batch.display_image;
        const title = ((batch?.course?.title || batch?.name || '')).toLowerCase();
        if (title.includes('physics')) return '/images/batches/batch_physics.jpg';
        if (title.includes('higher math') || title.includes('math')) return '/images/batches/batch_higher_math.jpg';
        if (title.includes('chemistry')) return '/images/batches/batch_chemistry.jpg';
        if (title.includes('ict')) return '/images/batches/batch_ict.jpg';
        if (title.includes('class 9') || title.includes('cls9')) return '/images/batches/batch_class9.jpg';
        if (title.includes('class 10') || title.includes('ssc')) return '/images/batches/batch_class10.jpg';
        return '/images/batches/batch_revision.jpg';
    };

    // Filtered Attendances based on Batch & Month
    const filteredAttendances = useMemo(() => {
        return attendances.filter(att => {
            const matchesBatch = selectedBatchId === 'all' || String(att.batch_id) === String(selectedBatchId);
            const matchesMonth = selectedMonth === 'all' || (att.date && att.date.startsWith(selectedMonth));
            return matchesBatch && matchesMonth;
        });
    }, [attendances, selectedBatchId, selectedMonth]);

    // Dynamic Attendance Stats for selected Batch & Month
    const attendanceStats = useMemo(() => {
        const total = filteredAttendances.length;
        const present = filteredAttendances.filter(a => a.status === 'present').length;
        const late = filteredAttendances.filter(a => a.status === 'late').length;
        const absent = filteredAttendances.filter(a => a.status === 'absent').length;
        const leave = filteredAttendances.filter(a => a.status === 'leave' || a.status === 'on_leave').length;
        const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;
        return { total, present, late, absent, leave, rate };
    }, [filteredAttendances]);

    // Batch-wise Attendance rates (for each batch)
    const batchAttendanceRates = useMemo(() => {
        const map = {};
        batchesList.forEach(b => {
            const batchAtts = attendances.filter(a => String(a.batch_id) === String(b.id));
            const total = batchAtts.length;
            const attended = batchAtts.filter(a => a.status === 'present' || a.status === 'late').length;
            map[b.id] = total > 0 ? Math.round((attended / total) * 100) : 100;
        });
        return map;
    }, [batchesList, attendances]);

    // Filtered Results based on Batch
    const filteredResults = useMemo(() => {
        return results.filter(res => {
            if (selectedBatchId === 'all') return true;
            return String(res.exam?.batch_id) === String(selectedBatchId);
        });
    }, [results, selectedBatchId]);

    // Dynamic Results Stats for selected Batch
    const resultsStats = useMemo(() => {
        const total = filteredResults.length;
        const passed = filteredResults.filter(r => r.pass_status === 'pass').length;
        const avgMarks = total > 0
            ? (filteredResults.reduce((sum, r) => sum + Number(r.obtained_marks || 0), 0) / total).toFixed(1)
            : '0.0';
        const avgGpa = total > 0
            ? (filteredResults.reduce((sum, r) => sum + Number(r.gpa || 0), 0) / total).toFixed(2)
            : '0.00';
        const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
        return { total, passed, avgMarks, avgGpa, passRate };
    }, [filteredResults]);

    // Filtered Routines based on Batch
    const filteredRoutines = useMemo(() => {
        return routines.filter(r => {
            if (selectedBatchId === 'all') return true;
            return String(r.batch_id) === String(selectedBatchId);
        });
    }, [routines, selectedBatchId]);

    const todayDateStr = new Date().toISOString().slice(0, 10);
    const todaysRoutines = filteredRoutines.filter(r => r.class_date === todayDateStr);
    const activeLatestResult = filteredResults.length > 0 ? filteredResults[0] : (results[0] || null);

    const getGradeBadge = (grade) => {
        switch (grade) {
            case 'A+':
            case 'A':
                return 'bg-emerald-50 text-[#16a34a] border-emerald-200';
            case 'A-':
            case 'B':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'C':
            case 'D':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-rose-50 text-rose-600 border-rose-200';
        }
    };

    return (
        <StudentLayout activeTab={activeTab} onTabChange={handleTabChange}>
            <Head title={`Student Portal - ${student?.name || 'Dashboard'}`} />

            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-4">
                    {/* Welcome Banner Card */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-[4px] p-4 sm:p-5 border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-[2px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Student Portal
                                </span>
                                <span className="text-xs text-slate-400 font-mono">
                                    ID: {student?.student_id || 'UCCA-STUDENT'}
                                </span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                                Welcome back, {student?.name}!
                            </h2>
                            <p className="text-xs text-slate-300 max-w-xl">
                                Enrolled in <b className="text-white">{batchesList.length} active coaching {batchesList.length === 1 ? 'batch' : 'batches'}</b>. Currently viewing: <b className="text-emerald-400">{activeBatchName}</b>.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => handleTabChange('routine')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                                <Calendar size={13} />
                                <span>Class routine</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTabChange('results')}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5 border border-white/10"
                            >
                                <Award size={13} />
                                <span>View results</span>
                            </button>
                        </div>
                    </div>

                    {/* 4 SUMMARY STATS CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white p-3.5 rounded-[4px] border border-slate-200/80 shadow-2xs">
                            <span className="text-[11px] text-slate-400 font-medium block">
                                {selectedBatchId === 'all' ? 'Overall Attendance' : 'Batch Attendance'}
                            </span>
                            <div className="text-xl font-black text-[#16a34a] mt-0.5">
                                {selectedBatchId === 'all' ? attendancePercentage : (batchAttendanceRates[selectedBatchId] ?? 100)}%
                            </div>
                            <span className="text-[10.5px] text-slate-500 font-medium truncate block">
                                {selectedBatchId === 'all' ? 'Across all batches' : activeBatchName}
                            </span>
                        </div>

                        <div className="bg-white p-3.5 rounded-[4px] border border-slate-200/80 shadow-2xs">
                            <span className="text-[11px] text-slate-400 font-medium block">Enrolled batches</span>
                            <div className="text-base font-bold text-slate-900 mt-0.5">
                                {batchesList.length} Active {batchesList.length === 1 ? 'Batch' : 'Batches'}
                            </div>
                            <span className="text-[10.5px] text-[#16a34a] font-medium">
                                {batchesList.map(b => b.name).join(' • ').slice(0, 32)}...
                            </span>
                        </div>

                        <div className="bg-white p-3.5 rounded-[4px] border border-slate-200/80 shadow-2xs">
                            <span className="text-[11px] text-slate-400 font-medium block">Total fees paid</span>
                            <div className="text-xl font-black text-slate-900 mt-0.5">৳ {Number(totalPaid || 0).toLocaleString()}</div>
                            <span className="text-[10.5px] text-[#16a34a] font-semibold">Verified receipts</span>
                        </div>

                        <div className="bg-white p-3.5 rounded-[4px] border border-slate-200/80 shadow-2xs">
                            <span className="text-[11px] text-slate-400 font-medium block">Pending due</span>
                            <div className={`text-xl font-black mt-0.5 ${Number(totalDue) > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                                ৳ {Number(totalDue || 0).toLocaleString()}
                            </div>
                            <span className="text-[10.5px] text-slate-400">
                                {Number(totalDue) > 0 ? 'Payment required' : 'All clear'}
                            </span>
                        </div>
                    </div>

                    {/* TWO-COLUMN DASHBOARD WIDGETS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* LEFT COLUMN (2 Cols) */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Today's Schedule Card */}
                            <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <Clock size={15} className="text-[#16a34a]" />
                                        <h3 className="text-xs font-bold text-slate-900">Today's class schedule</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange('routine')}
                                        className="text-[11px] font-bold text-[#16a34a] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Full routine</span>
                                        <ArrowRight size={11} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {todaysRoutines.length > 0 ? (
                                        todaysRoutines.map(r => (
                                            <div key={r.id} className="p-3 bg-slate-50/70 hover:bg-slate-50 rounded-[3px] border border-slate-200 flex justify-between items-center transition-colors">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-900 block">{r.subject?.name || 'Class Lecture'}</span>
                                                    <span className="text-[11px] text-slate-500">Teacher: {r.teacher?.name || 'Instructor'} • Room: {r.room || 'Room 101'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block text-[11px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-[2px]">
                                                        {r.start_time} - {r.end_time}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : filteredRoutines.length > 0 ? (
                                        filteredRoutines.slice(0, 2).map(r => (
                                            <div key={r.id} className="p-3 bg-slate-50/70 hover:bg-slate-50 rounded-[3px] border border-slate-200 flex justify-between items-center transition-colors">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-900 block">{r.subject?.name || 'Class Lecture'}</span>
                                                    <span className="text-[11px] text-slate-500">Teacher: {r.teacher?.name || 'Instructor'} • Room: {r.room || 'Room 101'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-slate-400 block">{r.class_date}</span>
                                                    <span className="inline-block text-[11px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-[2px] mt-0.5">
                                                        {r.start_time} - {r.end_time}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-slate-400 text-xs py-5">
                                            No classes scheduled for today.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Enrolled Batches Section (No card-in-card) */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between pb-0.5">
                                    <div className="flex items-center gap-2">
                                        <Layers size={15} className="text-[#16a34a]" />
                                        <h3 className="text-xs font-bold text-slate-900">My enrolled batches ({batchesList.length})</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange('batches')}
                                        className="text-[11px] font-bold text-[#16a34a] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Manage batches</span>
                                        <ArrowRight size={11} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {batchesList.map(batch => {
                                        const batchRate = batchAttendanceRates[batch.id] ?? 100;
                                        return (
                                            <div 
                                                key={batch.id} 
                                                className="bg-white rounded-[4px] overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xs flex flex-col sm:flex-row group transition-all"
                                            >
                                                {/* Left Image with Badges */}
                                                <div className="sm:w-44 md:w-48 relative h-36 sm:h-auto overflow-hidden shrink-0 bg-slate-100">
                                                    <img 
                                                        src={getBatchImage(batch)} 
                                                        alt={batch.name} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => { e.currentTarget.src = '/images/batches/batch_revision.jpg'; }}
                                                    />
                                                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs rounded-[3px] px-2 py-0.5 text-center shadow-xs border border-slate-200/90">
                                                        <span className="block text-[9px] font-bold text-[#047857] uppercase tracking-wider leading-none">
                                                            {batch.category || batch.course?.category || 'Academic'}
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-2.5 left-2.5 bg-[#047857]/90 backdrop-blur-xs rounded-[3px] px-1.5 py-0.5 text-center">
                                                        <span className="block font-mono text-[9px] text-white tracking-wider font-semibold">
                                                            {batch.code || batch.course?.code || `BATCH-${batch.id}`}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right Content */}
                                                <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-2.5">
                                                    <div>
                                                        {/* Routine Row */}
                                                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 mb-1.5">
                                                            <span className="flex items-center gap-1.5 text-slate-600">
                                                                <Calendar size={13} className="text-[#16a34a]" />
                                                                <span>{batch.class_days || 'Regular Days'}</span>
                                                            </span>
                                                            {batch.class_time && (
                                                                <span className="flex items-center gap-1.5 text-slate-600">
                                                                    <Clock size={13} className="text-[#16a34a]" />
                                                                    <span>{batch.class_time}</span>
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Batch Title */}
                                                        <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#16a34a] transition-colors">
                                                            {batch.name}
                                                        </h4>

                                                        {/* Course & Instructor */}
                                                        <div className="text-[11px] font-medium text-[#16a34a] mt-0.5">
                                                            {batch.course?.title || 'Academic Course'}
                                                            {batch.teacher?.name && (
                                                                <span className="text-slate-500 font-normal ml-2">
                                                                    • Instructor: <span className="text-slate-700 font-medium">{batch.teacher.name}</span>
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Description */}
                                                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mt-1.5">
                                                            {batch.description || batch.course?.description || 'Expert-guided coaching program with comprehensive syllabus coverage and exam-focused revision.'}
                                                        </p>
                                                    </div>

                                                    {/* Stats & Quick Actions */}
                                                    <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                                            <span>Duration: <strong className="text-slate-700 font-semibold">{batch.duration || batch.course?.duration || '12 Months'}</strong></span>
                                                            <span className="text-slate-300">•</span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                                                {batchRate}% Attendance
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedBatchId(String(batch.id));
                                                                    handleTabChange('routine');
                                                                }}
                                                                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-[#16a34a] bg-slate-100 hover:bg-emerald-50 rounded-[3px] transition-colors cursor-pointer"
                                                            >
                                                                Schedule
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedBatchId(String(batch.id));
                                                                    handleTabChange('attendance');
                                                                }}
                                                                className="px-2.5 py-1 text-xs font-bold text-[#16a34a] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-[3px] transition-colors cursor-pointer"
                                                            >
                                                                Attendance
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedBatchId(String(batch.id));
                                                                    handleTabChange('results');
                                                                }}
                                                                className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-[3px] transition-colors cursor-pointer"
                                                            >
                                                                Results
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (1 Col) */}
                        <div className="space-y-4">
                            {/* Latest Result Card */}
                            <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <Award size={15} className="text-[#16a34a]" />
                                        <h3 className="text-xs font-bold text-slate-900">Latest exam performance</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange('results')}
                                        className="text-[11px] font-bold text-[#16a34a] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>All results</span>
                                        <ArrowRight size={11} />
                                    </button>
                                </div>

                                {activeLatestResult ? (
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-xs font-bold text-slate-900 block">{activeLatestResult.exam?.title}</span>
                                            <span className="text-[11px] text-slate-400">
                                                {activeLatestResult.exam?.batch?.name || 'Batch'} • {activeLatestResult.exam?.exam_date}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-center">
                                            <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-[3px]">
                                                <span className="text-[10px] text-emerald-800 font-semibold block">Obtained score</span>
                                                <div className="text-lg font-black text-[#16a34a] mt-0.5">
                                                    {activeLatestResult.obtained_marks}
                                                    <span className="text-[11px] font-normal text-slate-400"> / {activeLatestResult.total_marks}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-500">{activeLatestResult.percentage}%</span>
                                            </div>

                                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[3px]">
                                                <span className="text-[10px] text-slate-600 font-semibold block">Grade & GPA</span>
                                                <div className="text-lg font-black text-slate-900 mt-0.5">
                                                    {activeLatestResult.grade}
                                                    <span className="text-[11px] font-normal text-slate-500"> ({Number(activeLatestResult.gpa).toFixed(2)})</span>
                                                </div>
                                                <span className={`text-[10px] font-bold ${activeLatestResult.pass_status === 'pass' ? 'text-emerald-700' : 'text-rose-600'}`}>
                                                    {activeLatestResult.pass_status === 'pass' ? 'PASSED' : 'FAILED'}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedMarksheet(activeLatestResult)}
                                            className="w-full py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                                        >
                                            <FileText size={12} />
                                            <span>View official marksheet</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-400 text-xs py-5">
                                        No published exam results available yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: MY BATCHES */}
            {activeTab === 'batches' && (
                <div className="space-y-3.5">
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-3.5 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">My enrolled batches</h3>
                            <p className="text-xs text-slate-500">All coaching batches you are currently active in.</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200">
                            {batchesList.length} Active {batchesList.length === 1 ? 'batch' : 'batches'}
                        </span>
                    </div>

                    {batchesList.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3.5">
                            {batchesList.map(batch => {
                                const rate = batchAttendanceRates[batch.id] ?? 100;
                                return (
                                    <div 
                                        key={batch.id} 
                                        className="bg-white rounded-[4px] overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xs flex flex-col sm:flex-row group transition-all"
                                    >
                                        {/* Left Image with Badges */}
                                        <div className="sm:w-48 md:w-56 relative h-40 sm:h-auto overflow-hidden shrink-0 bg-slate-100">
                                            <img 
                                                src={getBatchImage(batch)} 
                                                alt={batch.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.currentTarget.src = '/images/batches/batch_revision.jpg'; }}
                                            />
                                            <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs rounded-[3px] px-2 py-0.5 text-center shadow-xs border border-slate-200/90">
                                                <span className="block text-[9.5px] font-bold text-[#047857] uppercase tracking-wider leading-none">
                                                    {batch.category || batch.course?.category || 'Academic'}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-2.5 left-2.5 bg-[#047857]/90 backdrop-blur-xs rounded-[3px] px-1.5 py-0.5 text-center">
                                                <span className="block font-mono text-[9.5px] text-white tracking-wider font-semibold">
                                                    {batch.code || batch.course?.code || `BATCH-${batch.id}`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Content */}
                                        <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                                            <div>
                                                {/* Routine Row */}
                                                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mb-1.5">
                                                    <span className="flex items-center gap-1.5 text-slate-600">
                                                        <Calendar size={13} className="text-[#16a34a]" />
                                                        <span>{batch.class_days || 'Regular Days'}</span>
                                                    </span>
                                                    {batch.class_time && (
                                                        <span className="flex items-center gap-1.5 text-slate-600">
                                                            <Clock size={13} className="text-[#16a34a]" />
                                                            <span>{batch.class_time}</span>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <h4 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#16a34a] transition-colors">
                                                    {batch.name}
                                                </h4>

                                                {/* Course & Instructor */}
                                                <div className="text-xs font-medium text-[#16a34a] mt-0.5">
                                                    {batch.course?.title || 'Academic Course'}
                                                    {batch.teacher?.name && (
                                                        <span className="text-slate-500 font-normal ml-2">
                                                            • Instructor: <span className="text-slate-700 font-medium">{batch.teacher.name}</span>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mt-2">
                                                    {batch.description || batch.course?.description || 'Expert-guided coaching program with comprehensive syllabus coverage and exam-focused revision.'}
                                                </p>
                                            </div>

                                            {/* Stats & Action buttons */}
                                            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span>Duration: <strong className="text-slate-700 font-semibold">{batch.duration || batch.course?.duration || '12 Months'}</strong></span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-[3px] bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                                        {rate}% Verified Attendance
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedBatchId(String(batch.id));
                                                            handleTabChange('routine');
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[3px] transition-colors cursor-pointer"
                                                    >
                                                        Schedule
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedBatchId(String(batch.id));
                                                            handleTabChange('attendance');
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-[#16a34a] border border-emerald-200 rounded-[3px] transition-colors cursor-pointer"
                                                    >
                                                        Attendance
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedBatchId(String(batch.id));
                                                            handleTabChange('results');
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-[3px] transition-colors cursor-pointer"
                                                    >
                                                        Results
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[4px] border border-slate-200/80 p-8 text-center text-xs text-slate-400">
                            No active batch enrollments found.
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: EXAMS & RESULTS */}
            {activeTab === 'results' && (
                <div className="space-y-4">
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden">
                        {/* Header with Integrated Batch Dropdown Filter */}
                        <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-slate-900">Exam performance & marksheets</h3>
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                        {filteredResults.length} Published {filteredResults.length === 1 ? 'Result' : 'Results'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">Official published test scores, GPAs, and marksheets.</p>
                            </div>

                            {batchesList.length > 1 && (
                                <div className="flex items-center gap-2 shrink-0">
                                    <label htmlFor="results-batch-filter" className="text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                                        <Layers size={13} className="text-[#16a34a]" />
                                        <span>Batch:</span>
                                    </label>
                                    <select
                                        id="results-batch-filter"
                                        value={selectedBatchId}
                                        onChange={(e) => setSelectedBatchId(e.target.value)}
                                        className="h-8 pl-2.5 pr-8 bg-white border border-slate-200 rounded-[3px] text-xs font-bold text-slate-800 focus:border-[#16a34a] focus:ring-0 cursor-pointer shadow-2xs"
                                    >
                                        <option value="all">All Batches</option>
                                        {batchesList.map(b => (
                                            <option key={b.id} value={String(b.id)}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedBatchId !== 'all' && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBatchId('all')}
                                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 4 Dynamic Metric Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-white border-b border-slate-200">
                            <div className="p-3 bg-slate-50 rounded-[3px] border border-slate-200/80">
                                <span className="text-[11px] font-medium text-slate-500 block">Tests Taken</span>
                                <div className="text-xl font-black text-slate-900 mt-0.5">{resultsStats.total}</div>
                                <span className="text-[10px] text-slate-400">Published evaluations</span>
                            </div>
                            <div className="p-3 bg-emerald-50/60 rounded-[3px] border border-emerald-100">
                                <span className="text-[11px] font-semibold text-emerald-800 block">Average Score</span>
                                <div className="text-xl font-black text-[#16a34a] mt-0.5">{resultsStats.avgMarks}</div>
                                <span className="text-[10px] text-emerald-700">Out of 100 max</span>
                            </div>
                            <div className="p-3 bg-indigo-50/60 rounded-[3px] border border-indigo-100">
                                <span className="text-[11px] font-semibold text-indigo-800 block">Average GPA</span>
                                <div className="text-xl font-black text-indigo-700 mt-0.5">{resultsStats.avgGpa}</div>
                                <span className="text-[10px] text-indigo-600">5.00 Scale</span>
                            </div>
                            <div className="p-3 bg-emerald-50/60 rounded-[3px] border border-emerald-100">
                                <span className="text-[11px] font-semibold text-emerald-800 block">Pass Rate</span>
                                <div className="text-xl font-black text-[#16a34a] mt-0.5">{resultsStats.passRate}%</div>
                                <span className="text-[10px] text-emerald-700">{resultsStats.passed} Passed tests</span>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600">
                                    <tr>
                                        <th className="px-3.5 py-2.5">Exam title</th>
                                        <th className="px-3.5 py-2.5">Batch / Course</th>
                                        <th className="px-3.5 py-2.5 text-center">Exam date</th>
                                        <th className="px-3.5 py-2.5 text-center">Obtained marks</th>
                                        <th className="px-3.5 py-2.5 text-center">Percentage</th>
                                        <th className="px-3.5 py-2.5 text-center">Grade</th>
                                        <th className="px-3.5 py-2.5 text-center">GPA</th>
                                        <th className="px-3.5 py-2.5 text-center">Status</th>
                                        <th className="px-3.5 py-2.5 text-right">Marksheet</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/80 bg-white">
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map(res => {
                                            const isPassed = res.pass_status === 'pass';
                                            return (
                                                <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                        <span className="font-bold text-slate-900 block">{res.exam?.title}</span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-600 text-[11px]">
                                                        <span className="inline-block px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 font-medium">
                                                            {res.exam?.batch?.name || res.exam?.course?.title || 'Coaching Batch'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap text-slate-600 text-[11px] font-mono">
                                                        {res.exam?.exam_date || '—'}
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                                        <span className="font-bold text-slate-900 tabular-nums">{res.obtained_marks}</span>
                                                        <span className="text-[11px] text-slate-400"> / {res.total_marks}</span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap font-medium text-slate-700 tabular-nums">
                                                        {res.percentage}%
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                                        <span className={`inline-block px-2 py-0.5 rounded-[3px] font-bold text-[11px] border ${getGradeBadge(res.grade)}`}>
                                                            {res.grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap font-bold text-slate-800 tabular-nums">
                                                        {Number(res.gpa).toFixed(2)}
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold capitalize border ${
                                                            isPassed
                                                                ? 'bg-emerald-50 text-[#16a34a] border-emerald-200'
                                                                : 'bg-rose-50 text-rose-600 border-rose-200'
                                                        }`}>
                                                            {isPassed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                                            {isPassed ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedMarksheet(res)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer shadow-2xs"
                                                        >
                                                            <FileText size={12} />
                                                            <span>View marksheet</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-xs">
                                                No published exam results found for {activeBatchName}.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: CLASS ROUTINE */}
            {activeTab === 'routine' && (
                <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900">Upcoming class schedule</h3>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200 shrink-0">
                                    {filteredRoutines.length} Scheduled {filteredRoutines.length === 1 ? 'class' : 'classes'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Live routine for all your enrolled coaching batches.</p>
                        </div>

                        {batchesList.length > 1 && (
                            <div className="flex items-center gap-2 shrink-0">
                                <label htmlFor="routine-batch-filter" className="text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                                    <Layers size={13} className="text-[#16a34a]" />
                                    <span>Batch:</span>
                                </label>
                                <select
                                    id="routine-batch-filter"
                                    value={selectedBatchId}
                                    onChange={(e) => setSelectedBatchId(e.target.value)}
                                    className="h-8 pl-2.5 pr-8 bg-white border border-slate-200 rounded-[3px] text-xs font-bold text-slate-800 focus:border-[#16a34a] focus:ring-0 cursor-pointer shadow-2xs"
                                >
                                    <option value="all">All Batches</option>
                                    {batchesList.map(b => (
                                        <option key={b.id} value={String(b.id)}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                {selectedBatchId !== 'all' && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBatchId('all')}
                                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 text-xs pt-1">
                        {filteredRoutines.length > 0 ? (
                            filteredRoutines.map(r => (
                                <div key={r.id} className="p-3 bg-slate-50/70 hover:bg-slate-50 rounded-[3px] border border-slate-200 flex justify-between items-center transition-colors">
                                    <div>
                                        <div className="font-bold text-slate-900">{r.subject?.name || 'Class Lecture'}</div>
                                        <div className="text-[11px] text-slate-500">
                                            Teacher: {r.teacher?.name || 'Instructor'} • Classroom: <b className="text-slate-700">{r.room || 'Room 101'}</b>
                                        </div>
                                    </div>
                                    <div className="text-right font-semibold text-[#16a34a]">
                                        <div className="font-mono text-xs">{r.class_date}</div>
                                        <div className="text-[10.5px] text-slate-500 font-normal">{r.start_time} - {r.end_time}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-400 py-6">No routines scheduled for {activeBatchName}.</div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 5: ATTENDANCE (BATCH-WISE & MONTH FILTER) */}
            {activeTab === 'attendance' && (
                <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden space-y-0">
                    {/* Header */}
                    <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Attendance history & records</h3>
                            <p className="text-xs text-slate-500">Batch-wise attendance tracking and monthly evaluation.</p>
                        </div>
                        <span className="text-xs font-bold text-[#16a34a] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
                            {attendanceStats.rate}% Attendance ({attendanceStats.present + attendanceStats.late}/{attendanceStats.total} Classes)
                        </span>
                    </div>

                    {/* Filter Bar: Batch & Month Dropdowns */}
                    <div className="p-3 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            {/* Batch Filter Dropdown */}
                            {batchesList.length > 1 ? (
                                <div className="flex items-center gap-2 shrink-0">
                                    <label htmlFor="att-batch-filter" className="text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                                        <Layers size={13} className="text-[#16a34a]" />
                                        <span>Batch:</span>
                                    </label>
                                    <select
                                        id="att-batch-filter"
                                        value={selectedBatchId}
                                        onChange={(e) => setSelectedBatchId(e.target.value)}
                                        className="h-8 pl-2.5 pr-8 bg-white border border-slate-200 rounded-[3px] text-xs font-bold text-slate-800 focus:border-[#16a34a] focus:ring-0 cursor-pointer shadow-2xs"
                                    >
                                        <option value="all">All Batches</option>
                                        {batchesList.map(b => (
                                            <option key={b.id} value={String(b.id)}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <Layers size={13} className="text-[#16a34a]" />
                                    <span>Batch:</span>
                                    <b className="text-slate-900">{batchesList[0]?.name || activeBatchName}</b>
                                </div>
                            )}

                            {/* Month Filter Selector */}
                            <div className="flex items-center gap-2 shrink-0">
                                <label htmlFor="att-month-filter" className="text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                                    <Calendar size={13} className="text-slate-400" />
                                    <span>Month:</span>
                                </label>
                                <select
                                    id="att-month-filter"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="h-8 pl-2.5 pr-8 bg-white border border-slate-200 rounded-[3px] text-xs font-bold text-slate-800 focus:border-[#16a34a] focus:ring-0 cursor-pointer shadow-2xs"
                                >
                                    <option value="all">All Months</option>
                                    {availableMonths.map(m => (
                                        <option key={m} value={m}>
                                            {formatMonthName(m)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(selectedBatchId !== 'all' || selectedMonth !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedBatchId('all');
                                        setSelectedMonth('all');
                                    }}
                                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 4 Dynamic Attendance Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-white border-b border-slate-200">
                        <div className="p-3 bg-slate-50 rounded-[3px] border border-slate-200/80">
                            <span className="text-[11px] font-medium text-slate-500 block">Total Classes</span>
                            <div className="text-xl font-black text-slate-900 mt-0.5">{attendanceStats.total}</div>
                            <span className="text-[10px] text-slate-400">Scheduled sessions</span>
                        </div>
                        <div className="p-3 bg-emerald-50/60 rounded-[3px] border border-emerald-100">
                            <span className="text-[11px] font-semibold text-emerald-800 block">Present Count</span>
                            <div className="text-xl font-black text-[#16a34a] mt-0.5">{attendanceStats.present}</div>
                            <span className="text-[10px] text-emerald-700 font-bold">{attendanceStats.rate}% attendance rate</span>
                        </div>
                        <div className="p-3 bg-amber-50/60 rounded-[3px] border border-amber-100">
                            <span className="text-[11px] font-semibold text-amber-800 block">Late Arrivals</span>
                            <div className="text-xl font-black text-amber-700 mt-0.5">{attendanceStats.late}</div>
                            <span className="text-[10px] text-amber-600">Recorded late entries</span>
                        </div>
                        <div className="p-3 bg-rose-50/60 rounded-[3px] border border-rose-100">
                            <span className="text-[11px] font-semibold text-rose-800 block">Absent Days</span>
                            <div className="text-xl font-black text-rose-700 mt-0.5">{attendanceStats.absent}</div>
                            <span className="text-[10px] text-rose-600">Missed classes</span>
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600">
                                <tr>
                                    <th className="px-3.5 py-2.5">Date</th>
                                    <th className="px-3.5 py-2.5">Day</th>
                                    <th className="px-3.5 py-2.5">Batch</th>
                                    <th className="px-3.5 py-2.5">Attendance Status</th>
                                    <th className="px-3.5 py-2.5">Class Notes & Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredAttendances.length > 0 ? (
                                    filteredAttendances.map(att => {
                                        const dayName = att.date ? new Date(att.date).toLocaleDateString('en-US', { weekday: 'short' }) : '—';
                                        return (
                                            <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-3.5 py-2.5 font-bold text-slate-900 whitespace-nowrap font-mono">
                                                    {att.date}
                                                </td>
                                                <td className="px-3.5 py-2.5 text-slate-500 font-medium whitespace-nowrap">
                                                    {dayName}
                                                </td>
                                                <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-[11px]">
                                                        <BookOpen size={10} className="text-[#16a34a]" />
                                                        <span>{att.batch?.name || student?.batch?.name || 'Academic Batch'}</span>
                                                    </span>
                                                </td>
                                                <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold capitalize border ${
                                                        att.status === 'present'
                                                            ? 'bg-emerald-50 text-[#16a34a] border-emerald-200'
                                                            : att.status === 'late'
                                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                            : att.status === 'absent'
                                                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                                                            : 'bg-purple-50 text-purple-700 border-purple-200'
                                                    }`}>
                                                        {att.status === 'present' && <CheckCircle2 size={11} className="text-[#16a34a]" />}
                                                        {att.status === 'late' && <Clock size={11} className="text-amber-600" />}
                                                        {att.status === 'absent' && <XCircle size={11} className="text-rose-600" />}
                                                        <span>{att.status}</span>
                                                    </span>
                                                </td>
                                                <td className="px-3.5 py-2.5 text-slate-600 text-[11.5px]">
                                                    {att.remark || att.remarks || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-xs">
                                            No attendance logs found for {activeBatchName} in {formatMonthName(selectedMonth)}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 6: FEES & INVOICES */}
            {activeTab === 'fees' && (
                <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Fee invoices & payments</h3>
                            <p className="text-xs text-slate-500">Payment receipts and upcoming monthly tuition dues.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600">
                                <tr>
                                    <th className="px-3.5 py-2.5">Invoice no</th>
                                    <th className="px-3.5 py-2.5">Fee title</th>
                                    <th className="px-3.5 py-2.5 text-right">Net amount</th>
                                    <th className="px-3.5 py-2.5 text-right">Paid</th>
                                    <th className="px-3.5 py-2.5 text-right">Due</th>
                                    <th className="px-3.5 py-2.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/80 bg-white">
                                {invoices.length > 0 ? (
                                    invoices.map(inv => (
                                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-3.5 py-2.5 font-mono font-bold text-slate-800">{inv.invoice_no || inv.invoice_number || `INV-${inv.id}`}</td>
                                            <td className="px-3.5 py-2.5 text-slate-900 font-medium">{inv.title || inv.fee_type?.name || 'Monthly Tuition Fee'}</td>
                                            <td className="px-3.5 py-2.5 text-right font-medium">৳ {Number(inv.net_amount ?? inv.amount ?? 0).toLocaleString()}</td>
                                            <td className="px-3.5 py-2.5 text-right text-[#16a34a] font-bold">৳ {Number(inv.paid_amount ?? 0).toLocaleString()}</td>
                                            <td className={`px-3.5 py-2.5 text-right font-bold ${Number(inv.due_amount) > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                                ৳ {Number(inv.due_amount ?? 0).toLocaleString()}
                                            </td>
                                            <td className="px-3.5 py-2.5 text-center">
                                                <span className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold capitalize border ${
                                                    inv.status === 'paid' ? 'bg-emerald-50 text-[#16a34a] border-emerald-200' :
                                                    inv.status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-rose-50 text-rose-600 border-rose-200'
                                                }`}>
                                                    {inv.status || 'unpaid'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">No fee invoices generated yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 7: ASSIGNMENTS */}
            {activeTab === 'assignments' && (
                <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Course assignments</h3>
                            <p className="text-xs text-slate-500">Homework and problem sets given by your teachers.</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        {assignments.length > 0 ? (
                            assignments.map(a => {
                                const submission = a.submissions && a.submissions[0];
                                return (
                                    <div key={a.id} className="p-3.5 bg-slate-50/70 rounded-[4px] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                                        <div>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-slate-200/80 text-slate-700 inline-block mb-1">
                                                {a.subject?.name || 'General Subject'}
                                            </span>
                                            <h4 className="font-bold text-slate-900">{a.title}</h4>
                                            <p className="text-slate-500 text-[11px] mt-0.5">{a.description}</p>
                                            <div className="text-slate-400 text-[10.5px] mt-1">Due date: {a.due_date} • Full marks: {a.total_marks}</div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                            {submission ? (
                                                <span className="px-2.5 py-1 rounded-[3px] text-[11px] font-bold bg-emerald-50 text-[#16a34a] border border-emerald-200 flex items-center gap-1">
                                                    <Check size={12} /> Submitted ({submission.status})
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-[3px] text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    Pending submission
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-slate-400 py-6">No assignments currently assigned.</div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 8: STUDY MATERIALS & DIGITAL LEARNING HUB */}
            {activeTab === 'materials' && (() => {
                const videoCount = studyMaterials.filter(m => (m.file_type || '').toUpperCase() === 'VIDEO').length;
                const zipCount = studyMaterials.filter(m => ['ZIP', 'RAR', '7Z'].includes((m.file_type || '').toUpperCase())).length;
                const pdfCount = studyMaterials.filter(m => (m.file_type || '').toUpperCase() === 'PDF').length;
                const otherCount = studyMaterials.length - (videoCount + zipCount + pdfCount);

                const filtered = studyMaterials.filter((m) => {
                    const matchesSearch = !materialSearch ||
                        m.title?.toLowerCase().includes(materialSearch.toLowerCase()) ||
                        m.description?.toLowerCase().includes(materialSearch.toLowerCase()) ||
                        m.subject?.name?.toLowerCase().includes(materialSearch.toLowerCase());

                    const type = (m.file_type || '').toUpperCase();
                    let matchesType = true;
                    if (materialTypeFilter === 'video') matchesType = type === 'VIDEO';
                    else if (materialTypeFilter === 'zip') matchesType = ['ZIP', 'RAR', '7Z'].includes(type);
                    else if (materialTypeFilter === 'pdf') matchesType = type === 'PDF';
                    else if (materialTypeFilter === 'other') matchesType = !['VIDEO', 'ZIP', 'RAR', '7Z', 'PDF'].includes(type);

                    return matchesSearch && matchesType;
                });

                return (
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-4">
                        {/* Header Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <BookOpen size={17} className="text-[#16a34a]" />
                                    <span>Study Materials & Lecture Resources</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Access lecture sheets, video classes, ZIP resource packages, and board revision guides.
                                </p>
                            </div>

                            {/* Search Box */}
                            <div className="relative w-full sm:w-64">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={materialSearch}
                                    onChange={(e) => setMaterialSearch(e.target.value)}
                                    placeholder="Search topic, chapter..."
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
                                />
                                {materialSearch && (
                                    <button
                                        onClick={() => setMaterialSearch('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pb-1">
                            <button
                                type="button"
                                onClick={() => setMaterialTypeFilter('all')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                                    materialTypeFilter === 'all'
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                All Resources ({studyMaterials.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setMaterialTypeFilter('video')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                                    materialTypeFilter === 'video'
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
                                }`}
                            >
                                <Video size={12} />
                                <span>Videos ({videoCount})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMaterialTypeFilter('zip')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                                    materialTypeFilter === 'zip'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                                }`}
                            >
                                <FileArchive size={12} />
                                <span>ZIP Bundles ({zipCount})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMaterialTypeFilter('pdf')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                                    materialTypeFilter === 'pdf'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
                                }`}
                            >
                                <FileText size={12} />
                                <span>PDF Sheets ({pdfCount})</span>
                            </button>
                            {otherCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setMaterialTypeFilter('other')}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                                        materialTypeFilter === 'other'
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'bg-emerald-50 text-[#16a34a] hover:bg-emerald-100 border border-emerald-200/60'
                                    }`}
                                >
                                    Other Notes ({otherCount})
                                </button>
                            )}
                        </div>

                        {/* Materials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {filtered.length > 0 ? (
                                filtered.map((m) => {
                                    const typeUpper = (m.file_type || '').toUpperCase();
                                    const isVideo = typeUpper === 'VIDEO';
                                    const isZip = ['ZIP', 'RAR', '7Z'].includes(typeUpper);
                                    const isPdf = typeUpper === 'PDF';
                                    const targetUrl = m.file_path || m.link_url || '#';
                                    const isLocalFile = targetUrl.startsWith('/storage');

                                    // 1. VIDEO CARD FORMAT
                                    if (isVideo) {
                                        return (
                                            <div
                                                key={m.id}
                                                className="rounded-[4px] border border-purple-200/80 bg-white hover:border-purple-400 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden group"
                                            >
                                                {/* Video Preview Banner */}
                                                <div className="h-28 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative p-3 flex flex-col justify-between text-white">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-purple-500/80 text-white backdrop-blur-xs flex items-center gap-1">
                                                            <Video size={10} /> Video Class
                                                        </span>
                                                        {m.subject?.name && (
                                                            <span className="text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded text-purple-200">
                                                                {m.subject.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveVideoModal(m)}
                                                            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-purple-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform cursor-pointer"
                                                        >
                                                            <Play size={18} className="ml-0.5" />
                                                        </button>
                                                    </div>
                                                    <span className="text-[10px] text-purple-200/80 truncate">
                                                        {m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB') : 'Interactive Lesson'}
                                                    </span>
                                                </div>

                                                <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5">
                                                    <div>
                                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                                                            {m.title}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                            {m.description || 'Watch recorded concept lecture, numerical solutions and problem discussion.'}
                                                        </p>
                                                    </div>

                                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveVideoModal(m)}
                                                            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 cursor-pointer"
                                                        >
                                                            <Play size={13} />
                                                            <span>Watch in Portal</span>
                                                        </button>
                                                        {targetUrl !== '#' && (
                                                            <a
                                                                href={targetUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                                                            >
                                                                <span>Direct link</span>
                                                                <ExternalLink size={10} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // 2. ZIP ARCHIVE CARD FORMAT
                                    if (isZip) {
                                        return (
                                            <div
                                                key={m.id}
                                                className="rounded-[4px] border border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all p-3.5 flex flex-col justify-between gap-3 group"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                                            <FileArchive size={11} /> Complete ZIP Bundle
                                                        </span>
                                                        {m.subject?.name && (
                                                            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                                                {m.subject.name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-[4px] bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/80 group-hover:scale-105 transition-transform">
                                                            <FileArchive size={20} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                                                                {m.title}
                                                            </h4>
                                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                                {m.description || 'Full package containing lecture notes, formula cheat-sheets, and practice problem sets.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                                                    <span className="text-[10.5px] text-slate-400">
                                                        {m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB') : 'Archive Ready'}
                                                    </span>
                                                    <a
                                                        href={targetUrl}
                                                        download
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-[3px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <Download size={13} />
                                                        <span>Download Bundle (.zip)</span>
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // 3. PDF LECTURE SHEET CARD FORMAT
                                    if (isPdf) {
                                        return (
                                            <div
                                                key={m.id}
                                                className="rounded-[4px] border border-rose-200/80 bg-white hover:border-rose-400 shadow-2xs hover:shadow-xs transition-all p-3.5 flex flex-col justify-between gap-3 group"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                                            <FileText size={11} /> PDF Document
                                                        </span>
                                                        {m.subject?.name && (
                                                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                                                {m.subject.name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-[4px] bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 group-hover:scale-105 transition-transform">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors leading-snug">
                                                                {m.title}
                                                            </h4>
                                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                                {m.description || 'Board standard concise lecture summary and solution guidelines.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                                    <span className="text-[10.5px] text-slate-400">
                                                        {m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB') : 'PDF Available'}
                                                    </span>
                                                    <a
                                                        href={targetUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-[3px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <Download size={13} />
                                                        <span>Download PDF</span>
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // 4. GENERAL DOCUMENT / NOTE / OTHER FORMAT
                                    return (
                                        <div
                                            key={m.id}
                                            className="rounded-[4px] border border-slate-200 bg-white hover:border-[#16a34a] shadow-2xs hover:shadow-xs transition-all p-3.5 flex flex-col justify-between gap-3 group"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-2">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                                        {m.file_type || 'Resource'}
                                                    </span>
                                                    {m.subject?.name && (
                                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                                            {m.subject.name}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-[4px] bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#16a34a] transition-colors leading-snug">
                                                            {m.title}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                            {m.description || 'Downloadable academic resource file.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-[10.5px] text-slate-400">
                                                    {m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB') : 'Ready'}
                                                </span>
                                                <a
                                                    href={targetUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <Download size={13} />
                                                    <span>Get Resource</span>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-1 md:col-span-2 text-center py-10 bg-slate-50/50 rounded-[4px] border border-dashed border-slate-200">
                                    <BookOpen size={28} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm font-bold text-slate-700">No study materials found</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {materialSearch ? 'Try a different search keyword.' : 'Study materials uploaded by teachers will appear here.'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Interactive In-Portal Video Player Modal */}
                        {activeVideoModal && (
                            <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
                                <div className="bg-slate-900 max-w-3xl w-full rounded-[4px] shadow-2xl border border-slate-800 overflow-hidden text-white animate-in fade-in">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white">
                                                <Play size={12} className="ml-0.5" />
                                            </div>
                                            <h4 className="text-xs sm:text-sm font-bold truncate max-w-md">
                                                {activeVideoModal.title}
                                            </h4>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveVideoModal(null)}
                                            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    <div className="p-2 sm:p-4 bg-black">
                                        {(() => {
                                            const videoUrl = activeVideoModal.file_path || activeVideoModal.link_url || '';
                                            const ytEmbed = getYouTubeEmbedUrl(videoUrl);

                                            if (ytEmbed) {
                                                return (
                                                    <iframe
                                                        src={ytEmbed}
                                                        title={activeVideoModal.title}
                                                        className="w-full aspect-video rounded-[3px] border-0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                );
                                            }

                                            if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.endsWith('.ogg') || videoUrl.startsWith('/storage/')) {
                                                return (
                                                    <video
                                                        src={videoUrl}
                                                        controls
                                                        autoPlay
                                                        className="w-full aspect-video rounded-[3px] bg-black"
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                );
                                            }

                                            return (
                                                <div className="py-12 text-center space-y-3">
                                                    <Video size={40} className="mx-auto text-purple-400 opacity-80" />
                                                    <p className="text-sm font-bold">External Video Resource</p>
                                                    <p className="text-xs text-slate-400">Click below to open the video in a dedicated tab.</p>
                                                    <a
                                                        href={videoUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded"
                                                    >
                                                        <span>Open Video Link</span>
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {activeVideoModal.description && (
                                        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
                                            <p>{activeVideoModal.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* TAB 9: NOTICE BOARD */}
            {activeTab === 'notices' && (
                <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Notice board</h3>
                            <p className="text-xs text-slate-500">Important notices and announcements from administration.</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        {notices.length > 0 ? (
                            notices.map(n => (
                                <div key={n.id} className="p-3.5 bg-slate-50/70 rounded-[4px] border border-slate-200 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-slate-900">{n.title}</h4>
                                        <span className="text-[10.5px] text-slate-400">{n.published_at || n.created_at?.slice(0, 10)}</span>
                                    </div>
                                    <p className="text-slate-600 text-[11px] whitespace-pre-line">{n.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-400 py-6">No notices published.</div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL: OFFICIAL STUDENT MARKSHEET SLIP VIEW (PRINTABLE) */}
            <MarksheetSlipModal
                isOpen={!!selectedMarksheet}
                onClose={() => setSelectedMarksheet(null)}
                student={student}
                result={selectedMarksheet}
                exam={selectedMarksheet?.exam}
                settings={settings}
            />
        </StudentLayout>
    );
}
