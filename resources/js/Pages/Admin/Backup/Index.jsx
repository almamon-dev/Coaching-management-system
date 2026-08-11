import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Database, Download, RefreshCw } from 'lucide-react';

export default function BackupIndex({ backups }) {
    const { post, processing } = useForm();

    const handleGenerate = () => {
        post(route('admin.backup.generate'));
    };

    return (
        <AdminLayout>
            <Head title="Database Backup Management" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Database Backup & Security</h1>
                    <p className="text-sm text-slate-500">Create one-click database backups to safeguard student & financial records.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={processing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm"
                >
                    <RefreshCw size={16} /> Create Instant Backup
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="p-4">Backup Filename</th>
                                <th className="p-4">File Size</th>
                                <th className="p-4">Created Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {backups.length > 0 ? (
                                backups.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50/50">
                                        <td className="p-4 font-bold text-slate-900">{b.filename}</td>
                                        <td className="p-4 text-slate-600">{b.file_size}</td>
                                        <td className="p-4 text-slate-500">{b.created_at}</td>
                                        <td className="p-4 text-right">
                                            <button className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800">
                                                <Download size={14} /> Download SQL
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No backup records created.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
