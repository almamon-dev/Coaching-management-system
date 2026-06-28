import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Notify from '@/Utils/Notify';
import SelectInput from '@/Components/Form/SelectInput';
import TextInput from '@/Components/Form/TextInput';
import { Save, User, BookOpen, Users, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

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

    const [activeTab, setActiveTab] = useState('personal');
    const [showPassword, setShowPassword] = useState(false);
    const [availableSections, setAvailableSections] = useState([]);

    const generatePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData(prev => ({
            ...prev,
            password: pass,
            password_confirmation: pass
        }));
    };

    const handleClassChange = (val) => {
        const classId = val;
        setData('academic_class_id', classId);
        
        const selectedClass = classes.find(c => c.id == classId);
        if (selectedClass && selectedClass.sections) {
            setAvailableSections(selectedClass.sections);
        } else {
            setAvailableSections([]);
        }
        setData('section_id', '');
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.students.store'), {
            onSuccess: () => Notify.success('Success', 'Student registered successfully.'),
            onError: () => Notify.error('Validation Error', 'Please check the form for errors.'),
        });
    };

    const tabs = [
        { id: 'personal', label: 'Personal Details', icon: User },
        { id: 'academic', label: 'Academic Info', icon: BookOpen },
        { id: 'guardian', label: 'Guardian Info', icon: Users },
        { id: 'security', label: 'Security & Access', icon: Lock },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Student Admission" />
            
            <form onSubmit={submit}>
                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Student Admission</h1>
                        <p className="text-[#008060] text-[13px] mt-0.5 font-bold">Create a detailed profile for the new student.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.students.index')}
                            className="px-4 py-2 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            className="px-4 py-2 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Save size={14} /> Save as Draft
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-[#008060] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                        >
                            <CheckCircle2 size={16} />
                            Register Student
                        </button>
                    </div>
                </div>

                {/* Main Layout Area */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* Left Sidebar Menu */}
                    <div className="w-full md:w-[240px] shrink-0 bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden sticky top-[90px]">
                        <div className="flex flex-col py-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-5 py-3 text-[13px] font-bold transition-all relative
                                            ${isActive ? 'text-[#008060] bg-[#f9fbfb]' : 'text-[#6d7175] hover:bg-slate-50 hover:text-slate-900'}
                                        `}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#008060]" />
                                        )}
                                        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                        {tab.label}
                                        {isActive && <span className="ml-auto text-[#008060]">›</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-6">
                        
                        {/* Tab 1: Personal Details */}
                        {activeTab === 'personal' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Basic Information</h2>
                                    <p className="text-[#6d7175] text-[12px]">Configure the essential personal details of the student.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. John Doe"
                                            required={activeTab === 'personal'}
                                        />
                                        {errors.name && <div className="text-red-500 text-[11px] mt-1">{errors.name}</div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. student@school.edu"
                                            required={activeTab === 'personal'}
                                        />
                                        {errors.email && <div className="text-red-500 text-[11px] mt-1">{errors.email}</div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. +1 234 567 890"
                                            required={activeTab === 'personal'}
                                        />
                                        {errors.phone && <div className="text-red-500 text-[11px] mt-1">{errors.phone}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Date of Birth</label>
                                        <TextInput
                                            type="date"
                                            value={data.dob}
                                            onChange={e => setData('dob', e.target.value)}
                                            className="w-full"
                                        />
                                        {errors.dob && <div className="text-red-500 text-[11px] mt-1">{errors.dob}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                                        <SelectInput
                                            value={data.gender}
                                            onChange={e => setData('gender', e.target.value)}
                                            options={[
                                                { id: '', name: 'Select Gender' },
                                                { id: 'male', name: 'Male' },
                                                { id: 'female', name: 'Female' },
                                                { id: 'other', name: 'Other' }
                                            ]}
                                            className="w-full"
                                            showSearch={false}
                                        />
                                        {errors.gender && <div className="text-red-500 text-[11px] mt-1">{errors.gender}</div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Blood Group</label>
                                        <SelectInput
                                            value={data.blood_group}
                                            onChange={e => setData('blood_group', e.target.value)}
                                            options={[
                                                { id: '', name: 'Select Blood Group' },
                                                { id: 'A+', name: 'A+' }, { id: 'A-', name: 'A-' },
                                                { id: 'B+', name: 'B+' }, { id: 'B-', name: 'B-' },
                                                { id: 'O+', name: 'O+' }, { id: 'O-', name: 'O-' },
                                                { id: 'AB+', name: 'AB+' }, { id: 'AB-', name: 'AB-' }
                                            ]}
                                            className="w-full"
                                            showSearch={false}
                                        />
                                        {errors.blood_group && <div className="text-red-500 text-[11px] mt-1">{errors.blood_group}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Academic */}
                        {activeTab === 'academic' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Academic Information</h2>
                                    <p className="text-[#6d7175] text-[12px]">Enroll the student in a specific class and section.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Class <span className="text-red-500">*</span></label>
                                        <SelectInput
                                            value={data.academic_class_id}
                                            onChange={e => handleClassChange(e.target.value)}
                                            options={[{ id: '', name: 'Select Class' }, ...classes.map(c => ({ id: c.id.toString(), name: c.name }))]}
                                            className="w-full"
                                            showSearch={true}
                                        />
                                        {errors.academic_class_id && <div className="text-red-500 text-[11px] mt-1">{errors.academic_class_id}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Section <span className="text-red-500">*</span></label>
                                        <SelectInput
                                            value={data.section_id}
                                            onChange={e => setData('section_id', e.target.value)}
                                            options={[{ id: '', name: 'Select Section' }, ...availableSections.map(s => ({ id: s.id.toString(), name: s.name }))]}
                                            disabled={!data.academic_class_id}
                                            className="w-full"
                                            showSearch={false}
                                        />
                                        {errors.section_id && <div className="text-red-500 text-[11px] mt-1">{errors.section_id}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Guardian */}
                        {activeTab === 'guardian' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Guardian Information</h2>
                                    <p className="text-[#6d7175] text-[12px]">Provide emergency contact and guardian details for the student.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Guardian Name <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="text"
                                            value={data.guardian_name}
                                            onChange={e => setData('guardian_name', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. Robert Doe"
                                        />
                                        {errors.guardian_name && <div className="text-red-500 text-[11px] mt-1">{errors.guardian_name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Relation with Student <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="text"
                                            value={data.guardian_relation}
                                            onChange={e => setData('guardian_relation', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. Father, Mother, Uncle"
                                        />
                                        {errors.guardian_relation && <div className="text-red-500 text-[11px] mt-1">{errors.guardian_relation}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Guardian Phone <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="text"
                                            value={data.guardian_phone}
                                            onChange={e => setData('guardian_phone', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. +1 234 567 890"
                                        />
                                        {errors.guardian_phone && <div className="text-red-500 text-[11px] mt-1">{errors.guardian_phone}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Guardian Email</label>
                                        <TextInput
                                            type="email"
                                            value={data.guardian_email}
                                            onChange={e => setData('guardian_email', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. robert@example.com"
                                        />
                                        {errors.guardian_email && <div className="text-red-500 text-[11px] mt-1">{errors.guardian_email}</div>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Full Address</label>
                                        <textarea
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            className="w-full border border-[#d1d1d1] rounded-[3px] text-[13px] p-3 focus:border-[#008060] focus:ring-1 focus:ring-[#008060] resize-none"
                                            placeholder="Enter complete residential address"
                                            rows={3}
                                        />
                                        {errors.address && <div className="text-red-500 text-[11px] mt-1">{errors.address}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 4: Security */}
                        {activeTab === 'security' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Account Security</h2>
                                    <p className="text-[#6d7175] text-[12px]">Set up the login credentials for the student's dashboard access.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-[12px] font-bold text-slate-700">New Password <span className="text-red-500">*</span></label>
                                            <button 
                                                type="button" 
                                                onClick={generatePassword}
                                                className="text-[11px] text-[#008060] font-bold hover:underline"
                                            >
                                                Generate Password
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <TextInput
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                className="w-full pr-8"
                                                placeholder="Minimum 8 characters"
                                                required={activeTab === 'security'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2.5 top-[8px] text-slate-400 hover:text-slate-600 transition-colors"
                                                tabIndex="-1"
                                            >
                                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                        {errors.password && <div className="text-red-500 text-[11px] mt-1">{errors.password}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <TextInput
                                                type={showPassword ? "text" : "password"}
                                                value={data.password_confirmation}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                className="w-full pr-8"
                                                placeholder="Re-enter password"
                                                required={activeTab === 'security'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2.5 top-[8px] text-slate-400 hover:text-slate-600 transition-colors"
                                                tabIndex="-1"
                                            >
                                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2 bg-[#f0f9f7] border border-[#008060]/20 rounded-[4px] p-4 flex items-start gap-3 mt-4">
                                        <Lock className="text-[#008060] shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <h4 className="text-[13px] font-bold text-[#008060] mb-1">Secure Login Access</h4>
                                            <p className="text-[12px] text-[#008060]/80">This password will grant the student access to their dedicated dashboard where they can check routines, attendance, and exam results.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
