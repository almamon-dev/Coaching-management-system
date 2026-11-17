import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import TextArea from '@/Components/Form/TextArea';
import ImageUpload from '@/Components/Form/ImageUpload';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import { 
    Building2, Save, CheckCircle2, Target, Award, 
    Sparkles, ExternalLink, Image as ImageIcon 
} from 'lucide-react';

export default function AboutPage({ settings = {} }) {
    const centerName = settings.center_name || 'Ullash Coaching Center';

    const { data, setData, post, processing, errors } = useForm({
        about_header_title: settings.about_header_title || 'About Our Institution',
        about_header_subtitle: settings.about_header_subtitle || 'Committed to providing comprehensive coaching, personal care, and building a solid foundation for academic and professional success.',
        about_title: settings.about_title || 'Empowering Minds, Inspiring Excellence',
        about_text: settings.about_text || `${centerName} is a leading academic coaching institution dedicated to providing comprehensive education, structured evaluation, and rigorous academic guidance for students from Junior classes up to College (HSC) level. With a team of university-educated, experienced subject specialists, we focus on fundamental conceptual clarity, daily practice, and regular mock exams to ensure every student achieves their fullest potential.`,
        about_mission_title: settings.about_mission_title || 'Our Mission',
        about_mission_text: settings.about_mission_text || 'To mentor, guide, and empower every student with conceptual clarity, disciplined study habits, and rigorous exam preparation, enabling them to achieve outstanding academic results and develop strong character.',
        about_vision_title: settings.about_vision_title || 'Our Vision',
        about_vision_text: settings.about_vision_text || 'To be recognized as the premier coaching institution in the country, fostering an inspiring academic environment where talent is nurtured, potential is realized, and future leaders are prepared for global challenges.',
        about_stat_heritage: settings.about_stat_heritage || '15+ Years',
        about_stat_success: settings.about_stat_success || '98%',
        about_stat_students: settings.about_stat_students || '10,000+',
        about_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.cms.about.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="About Page CMS" />

            <div className="w-full space-y-6 max-w-7xl mx-auto font-inter">
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
                            About Page CMS
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage the story, mission, vision, statistics, and campus image displayed on the public About Us page.
                        </p>
                    </div>

                    <a
                        href={route('about-us')}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] border border-slate-200 bg-white text-slate-700 hover:text-[#16a34a] hover:border-emerald-300 text-xs font-bold transition-all shadow-2xs self-start sm:self-center"
                    >
                        <span>View Live Page</span>
                        <ExternalLink size={13} />
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Page Header Banner */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-50 text-[#16a34a] rounded-[3px]">
                                <Building2 size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Hero Banner Settings
                                </h2>
                                <p className="text-[11px] text-slate-400">
                                    Top banner title and subtitle displayed on the public About Us page.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <InputLabel value="Header Title *" />
                                <TextInput
                                    value={data.about_header_title}
                                    onChange={(e) => setData('about_header_title', e.target.value)}
                                    placeholder="About Our Institution"
                                    required
                                />
                                <InputError message={errors.about_header_title} />
                            </div>

                            <div>
                                <InputLabel value="Header Subtitle / Description" />
                                <TextArea
                                    value={data.about_header_subtitle}
                                    onChange={(e) => setData('about_header_subtitle', e.target.value)}
                                    rows={2}
                                    placeholder="Committed to providing comprehensive coaching..."
                                />
                                <InputError message={errors.about_header_subtitle} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Who We Are & Story */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-[3px]">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Story & Core Philosophy
                                </h2>
                                <p className="text-[11px] text-slate-400">
                                    Institutional background, educational approach, and campus photograph.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-7 space-y-4">
                                <div>
                                    <InputLabel value="Section Headline *" />
                                    <TextInput
                                        value={data.about_title}
                                        onChange={(e) => setData('about_title', e.target.value)}
                                        placeholder="Empowering Minds, Inspiring Excellence"
                                        required
                                    />
                                    <InputError message={errors.about_title} />
                                </div>

                                <div>
                                    <InputLabel value="Full Story & Narrative *" />
                                    <TextArea
                                        value={data.about_text}
                                        onChange={(e) => setData('about_text', e.target.value)}
                                        rows={6}
                                        placeholder="Detailed description of the coaching center..."
                                        required
                                    />
                                    <InputError message={errors.about_text} />
                                </div>
                            </div>

                            <div className="md:col-span-5 space-y-3">
                                <InputLabel value="Campus / Activity Image" />
                                <ImageUpload
                                    value={data.about_image}
                                    onChange={(file) => setData('about_image', file)}
                                    defaultImage={settings.about_image || '/images/about.png'}
                                    helpText="Upload a high-quality campus or classroom photo."
                                />
                                <InputError message={errors.about_image} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Mission & Vision */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-cyan-50 text-[#009ca6] rounded-[3px]">
                                <Target size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Mission & Vision Cards
                                </h2>
                                <p className="text-[11px] text-slate-400">
                                    Define the core purpose and long-term aspirational goals of the institution.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Mission */}
                            <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/80 space-y-3">
                                <div>
                                    <InputLabel value="Mission Headline *" />
                                    <TextInput
                                        value={data.about_mission_title}
                                        onChange={(e) => setData('about_mission_title', e.target.value)}
                                        placeholder="Our Mission"
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Mission Statement *" />
                                    <TextArea
                                        value={data.about_mission_text}
                                        onChange={(e) => setData('about_mission_text', e.target.value)}
                                        rows={4}
                                        placeholder="To mentor, guide, and empower every student..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Vision */}
                            <div className="p-4 bg-slate-50/70 rounded-[4px] border border-slate-200/80 space-y-3">
                                <div>
                                    <InputLabel value="Vision Headline *" />
                                    <TextInput
                                        value={data.about_vision_title}
                                        onChange={(e) => setData('about_vision_title', e.target.value)}
                                        placeholder="Our Vision"
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Vision Statement *" />
                                    <TextArea
                                        value={data.about_vision_text}
                                        onChange={(e) => setData('about_vision_text', e.target.value)}
                                        rows={4}
                                        placeholder="To be recognized as the premier coaching institution..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Key Highlights & Statistics */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-[3px]">
                                <Award size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Statistics & Key Achievements
                                </h2>
                                <p className="text-[11px] text-slate-400">
                                    Quantifiable milestones displayed in the about story section.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <InputLabel value="Educational Heritage" />
                                <TextInput
                                    value={data.about_stat_heritage}
                                    onChange={(e) => setData('about_stat_heritage', e.target.value)}
                                    placeholder="15+ Years"
                                />
                            </div>
                            <div>
                                <InputLabel value="Success Track Record" />
                                <TextInput
                                    value={data.about_stat_success}
                                    onChange={(e) => setData('about_stat_success', e.target.value)}
                                    placeholder="98%"
                                />
                            </div>
                            <div>
                                <InputLabel value="Students Mentored" />
                                <TextInput
                                    value={data.about_stat_students}
                                    onChange={(e) => setData('about_stat_students', e.target.value)}
                                    placeholder="10,000+"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Save Action Bar */}
                    <div className="py-4 bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <CheckCircle2 size={16} className="text-[#16a34a]" />
                            <span>Changes apply instantly to the public About Us page upon saving.</span>
                        </div>

                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[38px] px-6 flex items-center gap-2 rounded-[3px] shadow-sm cursor-pointer"
                        >
                            <Save size={16} />
                            <span>Save About Page Settings</span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

