import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Notify from '@/Utils/Notify';
import SelectInput from '@/Components/Form/SelectInput';
import TextInput from '@/Components/Form/TextInput';
import { Save, User, Briefcase, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Create({ auth, subjects, departments, designations }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        gender: '',
        password: '',
        password_confirmation: '',
        designation: '',
        department: '',
        joining_date: '',
        qualifications: '',
        specializations: [],
    });

    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState(false);

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

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.teachers.store'), {
            onSuccess: () => {
                Notify.success('Success', 'Teacher registered successfully.');
            },
        });
    };

    const subjectOptions = subjects.map(s => ({
        id: s.id.toString(),
        name: `${s.name} (${s.code})`
    }));

    const tabs = [
        { id: 'general', label: 'General Details', icon: User },
        { id: 'professional', label: 'Professional Info', icon: Briefcase },
        { id: 'security', label: 'Security & Access', icon: Lock },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Register Teacher" />

            <form onSubmit={submit}>
                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Add New Teacher</h1>
                        <p className="text-[#008060] text-[13px] mt-0.5 font-bold">Create a detailed profile for your faculty staff.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.teachers.index')}
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
                            Register Teacher
                        </button>
                    </div>
                </div>

                {/* Main Layout Area */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* Left Sidebar Menu */}
                    <div className="w-full md:w-[240px] shrink-0 bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
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
                        
                        {/* Tab 1: General */}
                        {activeTab === 'general' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Basic Information</h2>
                                    <p className="text-[#6d7175] text-[12px]">Configure the essential details of the teacher including name and contact info.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Full Name</label>
                                        <TextInput
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. John Doe"
                                            required
                                        />
                                        {errors.name && <div className="text-red-500 text-[11px] mt-1">{errors.name}</div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Email Address</label>
                                        <TextInput
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. john@school.edu"
                                            required
                                        />
                                        {errors.email && <div className="text-red-500 text-[11px] mt-1">{errors.email}</div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Phone Number</label>
                                        <TextInput
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. +1 234 567 890"
                                            required
                                        />
                                        {errors.phone && <div className="text-red-500 text-[11px] mt-1">{errors.phone}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Gender</label>
                                        <SelectInput
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            options={[
                                                { id: '', name: 'Select Gender...' },
                                                { id: 'male', name: 'Male' },
                                                { id: 'female', name: 'Female' },
                                                { id: 'other', name: 'Other' },
                                            ]}
                                            className="w-full"
                                        />
                                        {errors.gender && <div className="text-red-500 text-[11px] mt-1">{errors.gender}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Joining Date</label>
                                        <TextInput
                                            type="date"
                                            value={data.joining_date}
                                            onChange={e => setData('joining_date', e.target.value)}
                                            className="w-full"
                                        />
                                        {errors.joining_date && <div className="text-red-500 text-[11px] mt-1">{errors.joining_date}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Professional */}
                        {activeTab === 'professional' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Academic Profile</h2>
                                    <p className="text-[#6d7175] text-[12px]">Set the professional designation, department, and specialized subjects.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Designation</label>
                                        <SelectInput
                                            value={data.designation}
                                            onChange={(e) => setData('designation', e.target.value)}
                                            options={[{ id: '', name: 'Select Designation...' }, ...designations]}
                                            className="w-full"
                                        />
                                        {errors.designation && <div className="text-red-500 text-[11px] mt-1">{errors.designation}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Department</label>
                                        <SelectInput
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            options={[{ id: '', name: 'Select Department...' }, ...departments]}
                                            className="w-full"
                                        />
                                        {errors.department && <div className="text-red-500 text-[11px] mt-1">{errors.department}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-[12px] font-bold text-slate-700">Teacher Specializations (Subjects)</label>
                                            <span className="text-[#008060] text-[11px] font-bold cursor-pointer hover:underline flex items-center gap-1">
                                                <Briefcase size={12} /> View Available Subjects
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mb-2">Select the subjects this teacher specializes in. These subjects will be available when assigning this teacher to a class.</p>
                                        <SelectInput
                                            multiple
                                            options={subjectOptions}
                                            value={data.specializations}
                                            onChange={(e) => setData('specializations', e.target.value)}
                                            placeholder="Search and select subjects..."
                                            className="w-full"
                                        />
                                        {errors.specializations && <div className="text-red-500 text-[11px] mt-1">{errors.specializations}</div>}
                                    </div>

                                    <div className="md:col-span-2 mt-2">
                                        <h3 className="text-[13px] font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">Additional Details</h3>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Qualifications</label>
                                        <textarea
                                            value={data.qualifications}
                                            onChange={e => setData('qualifications', e.target.value)}
                                            className="w-full border border-slate-300 rounded-[3px] text-[13px] p-3 focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
                                            placeholder="e.g. MSc in Mathematics, B.Ed."
                                            rows={4}
                                        />
                                        {errors.qualifications && <div className="text-red-500 text-[11px] mt-1">{errors.qualifications}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Security */}
                        {activeTab === 'security' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Account Security</h2>
                                    <p className="text-[#6d7175] text-[12px]">Set up the login credentials for the teacher's dashboard access.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-[12px] font-bold text-slate-700">New Password</label>
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
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Confirm Password</label>
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
                                            <p className="text-[12px] text-[#008060]/80">This password will grant the teacher access to their dedicated dashboard where they can manage classes, attendance, and grades.</p>
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
