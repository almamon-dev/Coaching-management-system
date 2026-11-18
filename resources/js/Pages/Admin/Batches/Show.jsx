import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, Clock, Users, BookOpen,
    UserCheck, MapPin, CheckCircle, ClipboardCheck,
    Phone, School, Layers, Eye
} from 'lucide-react';

export default function BatchShow({ batch }) {
    const { settings } = usePage().props;
    const coachingMode = settings?.coaching_mode || 'single';
    const isMultiTeacher = coachingMode === 'multi';

    const students = batch.students || [];
    const routines = batch.class_routines || batch.classRoutines || [];

    return (
        <AdminLayout>
            <Head title={`${batch.name} - Batch Overview`} />

            {/* TOP HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{batch.name}</h1>
                        <span className="text-xs font-bold text-[#16a34a] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            {batch.course?.title || 'Course'}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${
                            batch.status === 'active'
                                ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                            {batch.status}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Course: <b className="text-slate-700">{batch.course?.title || 'Academic Course'}</b> • Schedule: <b className="text-slate-700">{batch.class_days || 'Regular'}</b>
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <Link
                        href={route('admin.batches.index')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[3px] transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Batches
                    </Link>
                    <Link
                        href={route('admin.attendance.index', { batch_id: batch.id })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-xs transition-all"
                    >
                        <ClipboardCheck size={14} /> Mark Attendance
                    </Link>
                </div>
            </div>

            {/* BATCH BANNER IMAGE (IF AVAILABLE) */}
            {batch.image && (
                <div className="mb-6 rounded-[4px] overflow-hidden border border-slate-200/90 shadow-2xs h-44 sm:h-56 bg-slate-100">
                    <img
                        src={batch.image}
                        alt={batch.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* BATCH HIGHLIGHT METRICS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <Users size={14} className="text-[#16a34a]" /> Enrolled Students
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-1">
                        {batch.students_count || students.length}
                        <span className="text-xs font-normal text-slate-400"> / {batch.max_students} Capacity</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <Clock size={14} className="text-[#16a34a]" /> Class Schedule
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1.5">
                        {batch.class_days || 'Regular'}
                    </div>
                    <div className="text-[10.5px] text-slate-400">Scheduled class days</div>
                </div>

                <div className="bg-white p-4 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <BookOpen size={14} className="text-[#16a34a]" /> Subject / Program
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1.5 truncate">
                        {batch.course?.title || 'Academic Course'}
                    </div>
                    <div className="text-[10.5px] text-[#16a34a] font-semibold">{batch.course?.code || 'Standard'}</div>
                </div>

                <div className="bg-white p-4 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <UserCheck size={14} className="text-[#16a34a]" /> Course Instructor
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1.5 truncate">
                        {batch.teacher?.name || 'Academic Faculty'}
                    </div>
                    <div className="text-[10.5px] text-slate-400 truncate">{batch.teacher?.specialization || 'Instructor'}</div>
                </div>
            </div>

            {/* ENROLLED STUDENTS LIST */}
            <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Enrolled Students ({students.length})</h2>
                        <p className="text-[11px] text-slate-500">Students registered in this batch with roll numbers and contact info.</p>
                    </div>
                    <Link
                        href={route('admin.students.index', { batch_id: batch.id })}
                        className="text-xs font-bold text-[#16a34a] hover:underline"
                    >
                        Filter in Student Management →
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600">
                            <tr>
                                <th className="px-4 py-2.5">Roll</th>
                                <th className="px-4 py-2.5">Student Name</th>
                                <th className="px-4 py-2.5">Student ID</th>
                                <th className="px-4 py-2.5">College / School</th>
                                <th className="px-4 py-2.5">Student Phone</th>
                                <th className="px-4 py-2.5">Guardian Info</th>
                                <th className="px-4 py-2.5 text-center">Status</th>
                                <th className="px-4 py-2.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {students.length > 0 ? (
                                students.map((s, idx) => {
                                    const rollNum = s.pivot?.roll_number || strPad(idx + 1, 2);
                                    return (
                                        <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-4 py-2.5 font-bold text-slate-900 tabular-nums">
                                                {rollNum}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <Link
                                                    href={route('admin.students.show', s.id)}
                                                    className="font-bold text-slate-900 hover:text-[#16a34a] transition-colors"
                                                >
                                                    {s.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-[#16a34a] whitespace-nowrap">
                                                {s.student_id}
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-600 text-[11px]">
                                                {s.school_college || '—'}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-[11px] text-slate-700">
                                                {s.phone}
                                            </td>
                                            <td className="px-4 py-2.5 text-[11px] text-slate-600">
                                                <span>{s.guardian_name}</span>
                                                {s.guardian_phone && <span className="block text-slate-400 font-mono">{s.guardian_phone}</span>}
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                                    {s.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <Link
                                                    href={route('admin.students.show', s.id)}
                                                    className="inline-flex items-center gap-1 text-slate-600 hover:text-[#16a34a] font-semibold text-[11px] hover:underline"
                                                >
                                                    <Eye size={12} /> View Profile
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-xs">
                                        No students enrolled in this batch yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CLASS ROUTINES FOR THIS BATCH */}
            {routines.length > 0 && (
                <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-4 space-y-3">
                    <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Scheduled Routines for this Batch</h2>
                            <p className="text-[11px] text-slate-500">Upcoming and current class sessions.</p>
                        </div>
                        <Link
                            href={route('admin.class-routines.index')}
                            className="text-xs font-bold text-[#16a34a] hover:underline"
                        >
                            All Class Routines →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {routines.map((r) => (
                            <div key={r.id} className="p-3 bg-slate-50/80 rounded-[3px] border border-slate-200/80 space-y-1 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-800">{r.class_date}</span>
                                    <span className="text-[10px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-[2px]">
                                        {r.status || 'scheduled'}
                                    </span>
                                </div>
                                <div className="text-[#16a34a] font-semibold text-[11px]">{r.start_time} - {r.end_time}</div>
                                <div className="text-slate-500 text-[10.5px]">Room: {r.room || batch.room}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

function strPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
