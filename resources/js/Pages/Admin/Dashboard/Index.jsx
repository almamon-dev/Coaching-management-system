import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Users, GraduationCap, ClipboardCheck } from 'lucide-react';

export default function Index({ auth, stats }) {
    return (
        <AdminLayout user={auth?.user}>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">School Management Dashboard</h1>
                        <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Welcome back, {auth.user.name}. Here's the overview of your school today.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.students.create')}
                            className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] text-[12px] font-bold shadow-sm shadow-[#008060]/10 hover:bg-[#006e52] transition-all flex items-center gap-2"
                        >
                            <Plus size={14} /> New Admission
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Total Users</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stats?.users || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users size={24} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Total Students</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stats?.students || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <GraduationCap size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Total Teachers</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stats?.teachers || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <ClipboardCheck size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
