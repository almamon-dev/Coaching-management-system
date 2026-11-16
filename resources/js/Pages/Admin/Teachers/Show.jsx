import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, UserCheck, BookOpen, Calendar, Clock, Phone, Mail, MapPin } from 'lucide-react';

export default function TeacherShow({ teacher }) {
    return (
        <AdminLayout>
            <Head title={`Teacher Profile - ${teacher.name}`} />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{teacher.name}</h1>
                    <p className="text-sm text-slate-500">{teacher.designation || 'Instructor'} • {teacher.teacher_id}</p>
                </div>
                <Link
                    href={route('admin.teachers.index')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                >
                    <ArrowLeft size={15} /> Back to Teachers
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">{teacher.name}</h2>
                            <span className="inline-block px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                                {teacher.status}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs text-slate-600">
                        <div>
                            <span className="text-slate-400 font-semibold uppercase block text-[10px]">Specialization</span>
                            <span className="font-bold text-slate-800">{teacher.specialization || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-semibold uppercase block text-[10px]">Qualification</span>
                            <span className="font-bold text-slate-800">{teacher.qualification || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Phone size={14} className="text-emerald-600" />
                            <span>{teacher.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-emerald-600" />
                            <span>{teacher.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-emerald-600" />
                            <span>{teacher.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Assigned Batches */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        Assigned Batches ({teacher.batches?.length || 0})
                    </h3>
                    {teacher.batches?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {teacher.batches.map((b) => (
                                <div key={b.id} className="p-4 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <BookOpen size={11} /> {b.course?.title || 'Subject'}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-500 capitalize">{b.status}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">{b.name}</h4>
                                    <div className="text-xs text-slate-600 space-y-1 pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={13} className="text-emerald-600" /> {b.class_days || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-emerald-600" /> {b.class_time || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 py-6 text-center">No batches assigned to this teacher yet.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

