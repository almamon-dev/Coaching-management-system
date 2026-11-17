import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import TextArea from '@/Components/Form/TextArea';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import { 
    FileText, Save, CheckCircle2, AlertCircle, 
    ListOrdered, FileCheck, Clock, MapPin, ExternalLink 
} from 'lucide-react';

export default function AdmissionPage({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        admission_title: settings.admission_title || 'Admission Instructions',
        admission_subtitle: settings.admission_subtitle || 'All procedures, required documents, and important guidelines for new student enrollment.',
        admission_alert_title: settings.admission_alert_title || 'Online Admission Notice',
        admission_alert_text: settings.admission_alert_text || "Please note that all admission procedures must be completed physically at the coaching center administration office by the student's parents or legal guardians.",
        admission_alert_enabled: settings.admission_alert_enabled || 'yes',
        admission_step1_title: settings.admission_step1_title || 'Collect Admission Form',
        admission_step1_desc: settings.admission_step1_desc || 'Admission forms are available at the coaching center main office during working hours. You must collect the form by paying the nominal fee.',
        admission_step2_title: settings.admission_step2_title || 'Required Documents',
        admission_step2_desc: settings.admission_step2_desc || 'Fill out the admission form properly and attach the necessary documents listed below.',
        admission_documents: settings.admission_documents || "3 copies of recent passport size photographs of the student.\nPhotocopy of the student's Birth Certificate (Online verifiable).\nPhotocopy of parents' NID cards.\nTransfer Certificate (TC) from previous institution (if applicable).\nPrevious academic transcripts or report cards.",
        admission_step3_title: settings.admission_step3_title || 'Submission & Assessment / Interview',
        admission_step3_desc: settings.admission_step3_desc || "Submit the completed application form along with all required documents to the administrative office. A brief interview may be taken to assess the student's primary academic level.",
        admission_office_hours: settings.admission_office_hours || "Saturday - Thursday: 09:00 AM - 08:00 PM\n(Closed on Friday & Govt. Holidays)",
        admission_phone: settings.admission_phone || '+880 1711-000000 / +880 1911-000000',
        admission_email: settings.admission_email || 'admission@ullashcoaching.com',
        admission_location: settings.admission_location || 'Administration Office, 2nd Floor, Main Campus Building',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.cms.admission.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Admission Instructions CMS" />

            <div className="w-full space-y-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#16a34a] border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                                Website CMS
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-slate-500 text-xs font-semibold">Public Page Content</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                            Admission Instructions CMS
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage the admission steps, documents, alert notices, and office guidelines displayed on the public admissions page.
                        </p>
                    </div>

                    <a
                        href={route('admissions')}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] border border-slate-200 bg-white text-slate-700 hover:text-[#16a34a] hover:border-emerald-300 text-xs font-bold transition-all shadow-2xs self-start sm:self-center"
                    >
                        <span>View Live Page</span>
                        <ExternalLink size={13} />
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Header Banner & Subtitle */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-50 text-[#16a34a] rounded-[3px]">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800">
                                        Admission Page Header
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        Page title and introductory message displayed in the hero banner.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <InputLabel value="Page Title *" />
                                <TextInput
                                    value={data.admission_title}
                                    onChange={(e) => setData('admission_title', e.target.value)}
                                    placeholder="Admission Instructions"
                                    required
                                />
                                <InputError message={errors.admission_title} />
                            </div>

                            <div>
                                <InputLabel value="Page Subtitle / Tagline" />
                                <TextArea
                                    value={data.admission_subtitle}
                                    onChange={(e) => setData('admission_subtitle', e.target.value)}
                                    rows={2}
                                    placeholder="All procedures, required documents, and important guidelines for new student enrollment."
                                />
                                <InputError message={errors.admission_subtitle} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Notice / Alert Banner */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-[3px]">
                                <AlertCircle size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Special Notice / Alert Banner
                                </h2>
                                <p className="text-[11px] text-slate-400">
                                    Prominent highlighted alert at the top of the instructions page.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <InputLabel value="Show Alert Banner?" />
                                <SelectInput
                                    value={data.admission_alert_enabled}
                                    onChange={(val) => setData('admission_alert_enabled', val)}
                                    options={[
                                        { id: 'yes', name: 'Yes - Show Alert Banner' },
                                        { id: 'no', name: 'No - Hide Alert Banner' }
                                    ]}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Alert Headline *" />
                                <TextInput
                                    value={data.admission_alert_title}
                                    onChange={(e) => setData('admission_alert_title', e.target.value)}
                                    placeholder="Online Admission Notice"
                                />
                                <InputError message={errors.admission_alert_title} />
                            </div>

                            <div className="md:col-span-3">
                                <InputLabel value="Alert Description" />
                                <TextArea
                                    value={data.admission_alert_text}
                                    onChange={(e) => setData('admission_alert_text', e.target.value)}
                                    rows={2}
                                    placeholder="Detailed notice text..."
                                />
                                <InputError message={errors.admission_alert_text} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Three Admission Steps */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-6">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-[3px]">
                                <ListOrdered size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    3-Step Admission Process
                                </h2>
                                <p className="text-[11px] text-slate-400">
                                    Detailed step-by-step guidance for students and parents.
                                </p>
                            </div>
                        </div>

                        {/* Step 1 */}
                        <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/80 space-y-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-[3px] inline-block">
                                Step 1 Configuration
                            </span>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <InputLabel value="Step 1 Title" />
                                    <TextInput
                                        value={data.admission_step1_title}
                                        onChange={(e) => setData('admission_step1_title', e.target.value)}
                                        placeholder="Collect Admission Form"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Step 1 Instructions / Description" />
                                    <TextArea
                                        value={data.admission_step1_desc}
                                        onChange={(e) => setData('admission_step1_desc', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 & Documents */}
                        <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/80 space-y-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-[3px] inline-block">
                                Step 2 Configuration & Required Documents
                            </span>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <InputLabel value="Step 2 Title" />
                                    <TextInput
                                        value={data.admission_step2_title}
                                        onChange={(e) => setData('admission_step2_title', e.target.value)}
                                        placeholder="Required Documents"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Step 2 Short Description" />
                                    <TextArea
                                        value={data.admission_step2_desc}
                                        onChange={(e) => setData('admission_step2_desc', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <InputLabel value="Required Documents List (One item per line)" />
                                        <span className="text-[11px] text-slate-400">Put each document on a new line</span>
                                    </div>
                                    <TextArea
                                        value={data.admission_documents}
                                        onChange={(e) => setData('admission_documents', e.target.value)}
                                        rows={5}
                                        placeholder="3 copies passport size photographs&#10;Birth Certificate photocopy&#10;Parents NID photocopy"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/80 space-y-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-[3px] inline-block">
                                Step 3 Configuration
                            </span>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <InputLabel value="Step 3 Title" />
                                    <TextInput
                                        value={data.admission_step3_title}
                                        onChange={(e) => setData('admission_step3_title', e.target.value)}
                                        placeholder="Submission & Assessment / Interview"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Step 3 Instructions / Description" />
                                    <TextArea
                                        value={data.admission_step3_desc}
                                        onChange={(e) => setData('admission_step3_desc', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Office Information & Support Card */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 text-slate-700 rounded-[3px]">
                                <Clock size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Office Location & Admission Helpline
                                </h2>
                                <p className="text-[11px] text-slate-400">
                                    Physical office hours and contact numbers for parents to visit.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Office Location & Room *" />
                                <TextInput
                                    value={data.admission_location}
                                    onChange={(e) => setData('admission_location', e.target.value)}
                                    placeholder="Administration Office, 2nd Floor, Main Building"
                                />
                            </div>
                            <div>
                                <InputLabel value="Office Hours & Days *" />
                                <TextArea
                                    value={data.admission_office_hours}
                                    onChange={(e) => setData('admission_office_hours', e.target.value)}
                                    rows={2}
                                    placeholder="Saturday - Thursday: 09:00 AM - 08:00 PM"
                                />
                            </div>
                            <div>
                                <InputLabel value="Admission Helpline Phone" />
                                <TextInput
                                    value={data.admission_phone}
                                    onChange={(e) => setData('admission_phone', e.target.value)}
                                    placeholder="+880 1711-000000 / +880 1911-000000"
                                />
                            </div>
                            <div>
                                <InputLabel value="Admission Support Email" />
                                <TextInput
                                    value={data.admission_email}
                                    onChange={(e) => setData('admission_email', e.target.value)}
                                    placeholder="admission@ullashcoaching.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Save Action Bar */}
                    <div className="py-4 bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <CheckCircle2 size={16} className="text-[#16a34a]" />
                            <span>Changes apply instantly to the public admissions page upon saving.</span>
                        </div>

                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[38px] px-6 flex items-center gap-2 rounded-[3px] shadow-sm cursor-pointer"
                        >
                            <Save size={16} />
                            <span>Save Instructions</span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

