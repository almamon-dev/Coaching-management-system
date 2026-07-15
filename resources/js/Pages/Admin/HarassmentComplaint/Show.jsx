import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, ShieldAlert, FileText, User, Calendar, Phone, Mail, Download, Clock, ShieldCheck, ShieldBan } from 'lucide-react';
import SelectInput from '@/Components/Form/SelectInput';
import Notify from '@/Utils/Notify';

export default function Show({ auth, complaint }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: complaint.status
    });

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        patch(route('admin.harassment-complaints.update-status', complaint.id), {
            preserveScroll: true,
            onSuccess: () => {
                Notify.success('Success', 'Complaint status updated successfully');
            }
        });
    };

    const isAnonymous = !complaint.name && !complaint.email && !complaint.phone;

    return (
        <AdminLayout user={auth?.user}>
            <Head title={`Complaint Details - #CMP-${complaint.id.toString().padStart(4, '0')}`} />
            
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.harassment-complaints.index')} className="p-2 border border-slate-200 rounded-[3px] hover:bg-slate-50 transition-colors text-slate-500">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                            Complaint Details <span className="text-slate-400 font-normal">#CMP-{complaint.id.toString().padStart(4, '0')}</span>
                        </h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Area - Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <h2 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                                <FileText size={16} className="text-slate-500" /> Incident Description
                            </h2>
                            <span className="text-[12px] text-slate-500 tabular-nums flex items-center gap-1.5">
                                <Calendar size={14} /> 
                                {new Date(complaint.created_at).toLocaleString('en-GB', { 
                                    day: '2-digit', month: 'short', year: 'numeric', 
                                    hour: '2-digit', minute: '2-digit' 
                                })}
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed" 
                                dangerouslySetInnerHTML={{ __html: complaint.description }} 
                            />
                        </div>
                    </div>

                    {complaint.attachment && (
                        <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                                    <Download size={16} className="text-slate-500" /> Attached Evidence
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-[3px] bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[13px] text-slate-800">Evidence File</p>
                                            <p className="text-[11px] text-slate-500">Uploaded by Reporter</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={`/storage/${complaint.attachment}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-[3px] transition-colors"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Meta and Status */}
                <div className="space-y-6">
                    
                    {/* Status Management */}
                    <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 bg-slate-50">
                            <h2 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                                <ShieldAlert size={16} className="text-red-500" /> Status Management
                            </h2>
                        </div>
                        <div className="p-5">
                            <form onSubmit={handleStatusUpdate}>
                                <div className="mb-4">
                                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Update Current Status</label>
                                    <SelectInput
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        options={[
                                            { id: 'pending', name: 'Pending Review' },
                                            { id: 'investigating', name: 'Investigating' },
                                            { id: 'resolved', name: 'Resolved / Closed' },
                                        ]}
                                    />
                                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={processing || data.status === complaint.status}
                                    className="w-full px-4 py-2 bg-[#008060] disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300 text-white font-bold text-[13px] rounded-[3px] transition-colors"
                                >
                                    {processing ? 'Saving...' : 'Update Status'}
                                </button>
                            </form>
                            
                            <div className="mt-5 p-4 bg-slate-50 border border-slate-100 rounded-[3px]">
                                <h3 className="text-[11px] font-bold uppercase text-slate-500 mb-2">Status Timeline Indicator</h3>
                                <ul className="space-y-2 text-[12px]">
                                    <li className={`flex items-center gap-2 ${complaint.status === 'pending' ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                                        <Clock size={14} /> Pending Review
                                    </li>
                                    <li className={`flex items-center gap-2 ${complaint.status === 'investigating' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                                        <ShieldBan size={14} /> Investigating
                                    </li>
                                    <li className={`flex items-center gap-2 ${complaint.status === 'resolved' ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
                                        <ShieldCheck size={14} /> Resolved
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Reporter Information */}
                    <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 bg-slate-50">
                            <h2 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                                <User size={16} className="text-slate-500" /> Reporter Information
                            </h2>
                        </div>
                        <div className="p-5">
                            {isAnonymous ? (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <User size={20} className="text-slate-400" />
                                    </div>
                                    <h3 className="font-bold text-[14px] text-slate-800">Anonymous Submission</h3>
                                    <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                                        The reporter chose to remain completely anonymous. No contact information was provided.
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    <li>
                                        <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Full Name</span>
                                        <div className="flex items-center gap-2 text-[14px] text-slate-800 font-medium">
                                            <User size={14} className="text-slate-400" /> {complaint.name || 'Not Provided'}
                                        </div>
                                    </li>
                                    <li>
                                        <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Role / Affiliation</span>
                                        <div className="text-[13px] text-slate-800 bg-slate-100 inline-block px-2 py-0.5 rounded-[2px] font-bold">
                                            {complaint.role || 'Not Provided'}
                                        </div>
                                    </li>
                                    <li>
                                        <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Contact Email</span>
                                        <div className="flex items-center gap-2 text-[13px] text-slate-800">
                                            <Mail size={14} className="text-slate-400" /> {complaint.email || 'Not Provided'}
                                        </div>
                                    </li>
                                    <li>
                                        <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Phone Number</span>
                                        <div className="flex items-center gap-2 text-[13px] text-slate-800">
                                            <Phone size={14} className="text-slate-400" /> {complaint.phone || 'Not Provided'}
                                        </div>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
