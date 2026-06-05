import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft, User, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Notify from '@/Utils/Notify';

export default function StudentCreatePage({ auth, classes }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        academic_class_id: '',
        section_id: '',
        roll_number: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_email: '',
        guardian_relation: '',
        dob: '',
        gender: '',
        blood_group: '',
        address: '',
    });

    const [availableSections, setAvailableSections] = useState([]);

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setData('academic_class_id', classId);
        
        // Find sections for this class
        const selectedClass = classes.find(c => c.id == classId);
        if (selectedClass && selectedClass.sections) {
            setAvailableSections(selectedClass.sections);
        } else {
            setAvailableSections([]);
        }
        setData('section_id', ''); // Reset section
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.students.store'), {
            onSuccess: () => Notify.success('Success', 'Student registered successfully.'),
            onError: () => Notify.error('Validation Error', 'Please check the form for errors.'),
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Student Registration" />
            
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.students.index')} className="h-[32px] w-[32px] flex items-center justify-center border border-[#d1d1d1] rounded-[3px] text-[#6d7175] hover:text-[#202223] hover:border-[#8c9196] transition-all bg-white shadow-sm">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Student Admission</h1>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="max-w-5xl space-y-6 pb-12">
                
                {/* 1. Personal Details */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                        <User size={18} className="text-[#008060]" />
                        <h2 className="text-[15px] font-bold text-slate-800">Student Login & Personal Details</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px]", errors.name ? "border-red-400" : "border-slate-300")} />
                            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px]", errors.email ? "border-red-400" : "border-slate-300")} />
                            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px]", errors.phone ? "border-red-400" : "border-slate-300")} />
                            {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Date of Birth</label>
                            <input type="date" value={data.dob} onChange={e => setData('dob', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px]", errors.dob ? "border-red-400" : "border-slate-300")} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px] bg-white", errors.gender ? "border-red-400" : "border-slate-300")}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <p className="text-[11px] text-red-500 mt-1">{errors.gender}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Blood Group</label>
                            <select value={data.blood_group} onChange={e => setData('blood_group', e.target.value)} className="w-full h-[38px] px-3 border border-slate-300 rounded text-[13.5px] bg-white">
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option><option value="A-">A-</option>
                                <option value="B+">B+</option><option value="B-">B-</option>
                                <option value="O+">O+</option><option value="O-">O-</option>
                                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px]", errors.password ? "border-red-400" : "border-slate-300")} />
                            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full h-[38px] px-3 border border-slate-300 rounded text-[13.5px]" />
                        </div>
                    </div>
                </div>

                {/* 2. Academic Details */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                        <BookOpen size={18} className="text-[#008060]" />
                        <h2 className="text-[15px] font-bold text-slate-800">Academic Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Class <span className="text-red-500">*</span></label>
                            <select value={data.academic_class_id} onChange={handleClassChange} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px] bg-white", errors.academic_class_id ? "border-red-400" : "border-slate-300")}>
                                <option value="">Select Class</option>
                                {classes?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.academic_class_id && <p className="text-[11px] text-red-500 mt-1">{errors.academic_class_id}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Section <span className="text-red-500">*</span></label>
                            <select value={data.section_id} onChange={e => setData('section_id', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px] bg-white", errors.section_id ? "border-red-400" : "border-slate-300")}>
                                <option value="">Select Section</option>
                                {availableSections.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            {errors.section_id && <p className="text-[11px] text-red-500 mt-1">{errors.section_id}</p>}
                        </div>
                            {/* Removed roll_number input */}
                    </div>
                </div>

                {/* 3. Guardian Information */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                        <Users size={18} className="text-[#008060]" />
                        <h2 className="text-[15px] font-bold text-slate-800">Guardian Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Guardian Name <span className="text-red-500">*</span></label>
                            <input type="text" value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px]", errors.guardian_name ? "border-red-400" : "border-slate-300")} />
                            {errors.guardian_name && <p className="text-[11px] text-red-500 mt-1">{errors.guardian_name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Relation with Student <span className="text-red-500">*</span></label>
                            <input type="text" value={data.guardian_relation} onChange={e => setData('guardian_relation', e.target.value)} placeholder="e.g. Father, Mother" className={cn("w-full h-[38px] px-3 border rounded text-[13.5px]", errors.guardian_relation ? "border-red-400" : "border-slate-300")} />
                            {errors.guardian_relation && <p className="text-[11px] text-red-500 mt-1">{errors.guardian_relation}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Guardian Phone <span className="text-red-500">*</span></label>
                            <input type="text" value={data.guardian_phone} onChange={e => setData('guardian_phone', e.target.value)} className={cn("w-full h-[38px] px-3 border rounded text-[13.5px]", errors.guardian_phone ? "border-red-400" : "border-slate-300")} />
                            {errors.guardian_phone && <p className="text-[11px] text-red-500 mt-1">{errors.guardian_phone}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Guardian Email</label>
                            <input type="email" value={data.guardian_email} onChange={e => setData('guardian_email', e.target.value)} className="w-full h-[38px] px-3 border border-slate-300 rounded text-[13.5px]" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Full Address</label>
                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows="3" className="w-full p-3 border border-slate-300 rounded text-[13.5px] custom-scrollbar"></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="h-[44px] px-8 bg-[#008060] text-white rounded-[4px] text-[14px] font-bold shadow hover:bg-[#006e52] transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        <Save size={18} />
                        Register Student
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
