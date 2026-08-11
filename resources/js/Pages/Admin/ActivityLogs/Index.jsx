import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { History, Shield, Clock } from 'lucide-react';

export default function ActivityLogIndex({ logs }) {
    return (
        <AdminLayout>
            <Head title="System Activity Logs" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activity Audit Logs</h1>
                    <p className="text-sm text-slate-500">Track all operational actions performed across the coaching management system.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="p-3">User</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Action</th>
                                <th className="p-3">Module</th>
                                <th className="p-3">Description</th>
                                <th className="p-3 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {logs.data.length > 0 ? (
                                logs.data.map((l) => (
                                    <tr key={l.id} className="hover:bg-slate-50/50">
                                        <td className="p-3 font-bold text-slate-900">{l.user_name || 'System'}</td>
                                        <td className="p-3"><span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 uppercase text-[10px]">{l.user_role}</span></td>
                                        <td className="p-3 font-bold text-emerald-700">{l.action}</td>
                                        <td className="p-3 text-slate-600">{l.module}</td>
                                        <td className="p-3 text-slate-600">{l.description}</td>
                                        <td className="p-3 text-right text-slate-400">{l.created_at}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="p-6 text-center text-slate-400">No activity logs recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
