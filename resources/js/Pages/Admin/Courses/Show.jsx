import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft, Edit, BookOpen, Layers, Users, Clock, Calendar,
    Wallet, GraduationCap, FileText, UserCheck
} from 'lucide-react';

export default function CourseShow({ course }) {
    const { settings } = usePage().props;
    const isMultiTeacher = (settings?.coaching_mode || 'single') === 'multi';

    return (
        <AdminLayout>
            <Head title={`${course.title} - Subject Details`} />

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{course.title}</h1>
                        <span className="text-xs font-bold text-[#16a34a] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            {course.code}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${
                            course.status === 'active'
                                ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                            {course.status}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        {course.category ? `${course.category} • ` : ''}Full subject details, syllabus breakdown & assigned batches.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <Link
                        href={route('admin.courses.index')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[3px] transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Subjects
                    </Link>
                    <Link
                        href={route('admin.courses.edit', course.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-xs transition-all"
                    >
                        <Edit size={14} /> Edit Subject
                    </Link>
                </div>
            </div>

            {/* SUMMARY METRICS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase">
                        <Wallet size={13} className="text-[#16a34a]" /> Monthly Fee
                    </div>
                    <div className="text-lg font-black text-[#16a34a] mt-1">
                        ৳ {parseFloat(course.fee || 0).toLocaleString()}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase">
                        <Wallet size={13} className="text-amber-600" /> Admission Fee
                    </div>
                    <div className="text-lg font-black text-amber-600 mt-1">
                        ৳ {parseFloat(course.admission_fee || 0).toLocaleString()}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase">
                        <Clock size={13} className="text-slate-500" /> Duration
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">
                        {course.duration || '—'}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase">
                        <BookOpen size={13} className="text-[#16a34a]" /> Lectures & Lessons
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">
                        {course.total_lectures || 0} Lec • {course.total_lessons || 0} Les
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase">
                        <Layers size={13} className="text-indigo-600" /> Batches
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">
                        {course.batches_count || 0}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase">
                        <Users size={13} className="text-blue-600" /> Students
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">
                        {course.students_count || 0}
                    </div>
                </div>
            </div>

            {/* OVERVIEW & SYLLABUS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-lg border border-slate-200/80 space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                        <FileText size={16} className="text-[#16a34a]" /> Subject Description
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {course.description || 'No description added for this subject yet.'}
                    </p>
                </div>

                <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200/80 space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                        <GraduationCap size={16} className="text-[#16a34a]" /> Syllabus & Lecture Breakdown
                    </h2>
                    <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {course.syllabus_details || 'No syllabus breakdown added yet.'}
                    </div>
                </div>
            </div>

            {/* ASSIGNED BATCHES */}
            <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Batches under {course.title}</h2>
                        <p className="text-xs text-slate-500">All scheduled batches and enrolled student counts.</p>
                    </div>
                    <Link
                        href={route('admin.batches.index')}
                        className="text-xs font-bold text-[#16a34a] hover:underline"
                    >
                        Manage Batches →
                    </Link>
                </div>

                {course.batches && course.batches.length > 0 ? (
                    <div className="divide-y divide-slate-200/80">
                        {course.batches.map((b) => (
                            <div key={b.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 text-xs">{b.name}</span>
                                        <span className="px-2 py-0.5 text-[10.5px] font-bold rounded-full capitalize bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                            {b.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-[11.5px] text-slate-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} className="text-[#16a34a]" /> {b.class_days || 'N/A'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} className="text-[#16a34a]" /> {b.class_time || 'N/A'}
                                        </span>
                                        {isMultiTeacher && (
                                            <span className="flex items-center gap-1 text-indigo-700 font-semibold">
                                                <UserCheck size={12} /> {b.teacher?.name || 'Unassigned'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-[#16a34a] shrink-0">
                                    {b.students_count || 0} / {b.max_students} Students
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-xs text-slate-500">
                        No batches created for this subject yet.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

