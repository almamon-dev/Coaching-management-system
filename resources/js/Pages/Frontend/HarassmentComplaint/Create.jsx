import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { ChevronRight, Upload, AlertCircle, Shield, CheckCircle, Phone, Lock, EyeOff } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import Checkbox from '@/Components/Form/Checkbox';
import RichTextEditor from '@/Components/Form/RichTextEditor';
import SelectInput from '@/Components/Form/SelectInput';

export default function Create() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        role: '',
        description: '',
        attachment: null,
    });

    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleAnonymousChange = (e) => {
        setIsAnonymous(e.target.checked);
        if (e.target.checked) {
            setData({ ...data, name: '', email: '', phone: '', role: '' });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('complaints.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <FrontendLayout>
            <Head title="File a Report - Sexual Harassment Prevention" />

            {/* Page Header */}
            <div className="bg-slate-900 py-6 md:py-8 relative overflow-hidden font-inter print:hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 max-w-8xl relative z-10">
                    <div className="flex items-center gap-2 text-[#16a34a] font-bold text-[10px] uppercase tracking-wider mb-2">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={10} />
                        <span className="text-slate-400">Sexual Harassment Prevention</span>
                    </div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight max-w-4xl">
                        File a Confidential Report
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-16 bg-slate-50 font-inter">
                <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Form */}
                        <div className="md:col-span-2 space-y-8">
                            
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 md:p-8">
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold text-slate-900 mb-2">Incident Details</h2>
                                        <p className="text-[14px] text-slate-500">
                                            Our institution has zero tolerance for sexual harassment. Please use this secure form to report any incident. You may choose to remain completely anonymous.
                                        </p>
                                    </div>

                                    {recentlySuccessful ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-white text-[#16a34a] rounded-full flex items-center justify-center mb-4 shadow-sm">
                                                <CheckCircle size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#16a34a] mb-2">Report Submitted Successfully</h3>
                                            <p className="text-[#15803d] text-[13px] max-w-md mx-auto">
                                                Your report has been securely transmitted to the Prevention Committee. We take these matters very seriously and will initiate a review immediately.
                                            </p>
                                            <button 
                                                onClick={() => window.location.href = '/'}
                                                className="mt-6 px-6 py-2.5 bg-[#16a34a] text-white text-[13px] rounded-md font-bold hover:bg-[#15803d] transition-colors shadow-sm"
                                            >
                                                Return to Homepage
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={submit} className="space-y-6">
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6">
                                                <label className="flex items-start gap-3 cursor-pointer">
                                                    <div className="pt-0.5">
                                                        <Checkbox 
                                                            checked={isAnonymous}
                                                            onChange={handleAnonymousChange}
                                                            className="w-4 h-4 rounded-[2px] border-[#c9cccf] text-[#16a34a] focus:ring-[#16a34a]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="block text-[14px] font-bold text-slate-800 mb-0.5">Submit Anonymously</span>
                                                        <span className="block text-[13px] text-slate-500 leading-relaxed">
                                                            If checked, your personal information will not be collected. However, providing contact information allows us to follow up if we need more details to effectively investigate.
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>

                                            {!isAnonymous && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                                                    <div>
                                                        <InputLabel value="Full Name" />
                                                        <TextInput
                                                            value={data.name}
                                                            onChange={e => setData('name', e.target.value)}
                                                            placeholder="Enter your full name"
                                                            className="!h-10 !text-[14px] focus:border-[#16a34a]"
                                                        />
                                                        <InputError message={errors.name} className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <InputLabel value="Your Role / Affiliation" />
                                                        <SelectInput
                                                            name="role"
                                                            value={data.role}
                                                            onChange={e => setData('role', e.target.value)}
                                                            options={[
                                                                { id: 'Student', name: 'Student' },
                                                                { id: 'Teacher / Faculty', name: 'Teacher / Faculty' },
                                                                { id: 'Staff', name: 'Staff' },
                                                                { id: 'Parent / Guardian', name: 'Parent / Guardian' },
                                                                { id: 'Other', name: 'Other' },
                                                            ]}
                                                            placeholder="Select your role..."
                                                        />
                                                        <InputError message={errors.role} className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <InputLabel value="Email Address" />
                                                        <TextInput
                                                            type="email"
                                                            value={data.email}
                                                            onChange={e => setData('email', e.target.value)}
                                                            placeholder="Enter your email"
                                                            className="!h-10 !text-[14px] focus:border-[#16a34a]"
                                                        />
                                                        <InputError message={errors.email} className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <InputLabel value="Phone Number" />
                                                        <TextInput
                                                            type="tel"
                                                            value={data.phone}
                                                            onChange={e => setData('phone', e.target.value)}
                                                            placeholder="Enter your phone number"
                                                            className="!h-10 !text-[14px] focus:border-[#16a34a]"
                                                        />
                                                        <InputError message={errors.phone} className="mt-1" />
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <InputLabel value="Description of Incident *" />
                                                <p className="text-[13px] text-slate-500 mb-2">
                                                    Please provide as much detail as possible, including dates, times, locations, and names of individuals involved.
                                                </p>
                                                <RichTextEditor
                                                    value={data.description}
                                                    onChange={val => setData('description', val)}
                                                    placeholder="Describe what happened..."
                                                />
                                                <InputError message={errors.description} className="mt-1" />
                                            </div>

                                            <div className="pt-4">
                                                <InputLabel value="Supporting Evidence (Optional)" />
                                                <p className="text-[13px] text-slate-500 mb-2">
                                                    Upload any relevant screenshots, documents, or photos that can aid the investigation (Max 5MB).
                                                </p>
                                                
                                                <div className="relative border border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="file"
                                                        onChange={e => setData('attachment', e.target.files[0])}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                    />
                                                    <div className="flex flex-col items-center justify-center pointer-events-none">
                                                        <Upload size={24} className="text-slate-400 mb-2" />
                                                        <span className="text-[14px] font-bold text-[#16a34a] mb-0.5">
                                                            {data.attachment ? data.attachment.name : 'Click or drag file to upload'}
                                                        </span>
                                                        <span className="text-[12px] text-slate-500">
                                                            Supported formats: PDF, JPG, PNG, DOCX
                                                        </span>
                                                    </div>
                                                </div>
                                                <InputError message={errors.attachment} className="mt-1" />
                                            </div>

                                            <div className="pt-6 border-t border-slate-200">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full md:w-auto px-8 py-3 bg-[#16a34a] text-white text-[14px] font-bold rounded-md hover:bg-[#15803d] transition-colors focus:ring-4 focus:ring-[#16a34a]/30 disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Shield size={18} />
                                                    {processing ? 'Submitting Securely...' : 'Submit Confidential Report'}
                                                </button>
                                                <p className="mt-4 text-center md:text-left text-[12px] text-slate-500">
                                                    By submitting this form, you affirm that the information provided is true and accurate to the best of your knowledge.
                                                </p>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Confidentiality Info */}
                        <div className="md:col-span-1">
                            <div className="bg-slate-900 rounded-xl shadow-md p-6 text-white sticky top-24">
                                <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-4 flex items-center gap-2">
                                    <Lock size={20} className="text-[#16a34a]"/> Privacy Assured
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <EyeOff className="text-white/70 shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-[14px] text-white/90 mb-1">Strict Confidentiality</p>
                                            <p className="text-[13px] text-white/70 leading-relaxed">
                                                All reports submitted through this portal are strictly confidential and will only be reviewed by the authorized Prevention Committee members.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <AlertCircle className="text-white/70 shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-[14px] text-white/90 mb-1">Protection against Retaliation</p>
                                            <p className="text-[13px] text-white/70 leading-relaxed">
                                                Our institution prohibits any form of retaliation against individuals who report incidents in good faith.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <Phone className="text-white/70 shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-[14px] text-white/90 mb-1">Emergency Contacts</p>
                                            <p className="text-[13px] text-white/70 leading-relaxed">
                                                If you are in immediate physical danger, please contact local law enforcement or the emergency hotline (999) immediately.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-white/20">
                                    <p className="text-[12px] text-white/60 italic leading-relaxed">
                                        * The information you provide will be used solely for the purpose of investigating and resolving your complaint.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
