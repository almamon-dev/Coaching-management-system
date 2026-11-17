import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import TextArea from '@/Components/Form/TextArea';
import ImageUpload from '@/Components/Form/ImageUpload';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import { 
    Sparkles, Save, CheckCircle2, ExternalLink, 
    Users, Award, BookOpen, TrendingUp, Layers
} from 'lucide-react';

export default function LandingPage({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        hero_title: settings.hero_title || 'Build Your Future With Quality Education',
        hero_subtitle: settings.hero_subtitle || 'At Ullash Coaching Center, we believe every student has the potential to achieve greatness. Our experienced teachers, structured learning programs, and student-focused guidance help learners build strong academic foundations and achieve their goals.',
        hero_banner_image: null,
        stat_students: settings.stat_students || '500+',
        stat_teachers: settings.stat_teachers || '20+',
        stat_courses: settings.stat_courses || '10+',
        stat_success: settings.stat_success || '95%',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.cms.landing.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Landing Page CMS" />

            <div className="w-full space-y-6 max-w-7xl mx-auto font-inter">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#16a34a] border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                                Website CMS
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-slate-500 text-xs font-semibold">Homepage Content</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                            Landing Page CMS
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage the main hero banner, headline, introductory copy, and achievement statistics on the homepage.
                        </p>
                    </div>

                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] border border-slate-200 bg-white text-slate-700 hover:text-[#16a34a] hover:border-emerald-300 text-xs font-bold transition-all shadow-2xs self-start sm:self-center"
                    >
                        <span>View Live Homepage</span>
                        <ExternalLink size={13} />
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Hero Banner Section */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-[3px]">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800">
                                        Hero Banner Section
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        The top headline, description paragraph, and main visual background banner on the guest home page.
                                    </p>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[3px] border border-emerald-200 hidden sm:inline-block">
                                Top of Homepage
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-7 space-y-4">
                                <div>
                                    <InputLabel value="Hero Headline Title *" />
                                    <TextInput
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        placeholder="Build Your Future With Quality Education"
                                        required
                                    />
                                    <InputError message={errors.hero_title} />
                                </div>

                                <div>
                                    <InputLabel value="Hero Subtitle / Description Paragraph *" />
                                    <TextArea
                                        value={data.hero_subtitle}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                        rows={4}
                                        placeholder="At Ullash Coaching Center, we believe every student has the potential..."
                                        required
                                    />
                                    <InputError message={errors.hero_subtitle} />
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <ImageUpload
                                    label="Hero Banner Image"
                                    value={data.hero_banner_image}
                                    currentImageUrl={settings.hero_banner_image || '/images/banner.png'}
                                    onChange={(file) => setData('hero_banner_image', file)}
                                    recommended="Recommended: 1920x800px (High resolution landscape photo)"
                                    placeholder="Upload New Banner Photo"
                                    aspectRatio="wide"
                                    error={errors.hero_banner_image}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Achievement Statistics Section */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-6 space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-[3px]">
                                    <TrendingUp size={18} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800">
                                        Homepage Achievement Statistics
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        Four highlight metrics shown directly below the hero banner.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-[4px] border border-slate-200/80 bg-slate-50/50 space-y-2">
                                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                                    <Users size={15} />
                                    <span>Total Students</span>
                                </div>
                                <TextInput
                                    value={data.stat_students}
                                    onChange={(e) => setData('stat_students', e.target.value)}
                                    placeholder="500+"
                                />
                            </div>

                            <div className="p-4 rounded-[4px] border border-slate-200/80 bg-slate-50/50 space-y-2">
                                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
                                    <Award size={15} />
                                    <span>Expert Teachers</span>
                                </div>
                                <TextInput
                                    value={data.stat_teachers}
                                    onChange={(e) => setData('stat_teachers', e.target.value)}
                                    placeholder="20+"
                                />
                            </div>

                            <div className="p-4 rounded-[4px] border border-slate-200/80 bg-slate-50/50 space-y-2">
                                <div className="flex items-center gap-1.5 text-purple-700 text-xs font-bold">
                                    <BookOpen size={15} />
                                    <span>Active Courses</span>
                                </div>
                                <TextInput
                                    value={data.stat_courses}
                                    onChange={(e) => setData('stat_courses', e.target.value)}
                                    placeholder="10+"
                                />
                            </div>

                            <div className="p-4 rounded-[4px] border border-slate-200/80 bg-slate-50/50 space-y-2">
                                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
                                    <Layers size={15} />
                                    <span>Success Rate</span>
                                </div>
                                <TextInput
                                    value={data.stat_success}
                                    onChange={(e) => setData('stat_success', e.target.value)}
                                    placeholder="95%"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="w-full py-4 bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <CheckCircle2 size={16} className="text-[#16a34a]" />
                            <span>Changes apply instantly to the live homepage upon saving.</span>
                        </div>

                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[38px] px-6 flex items-center gap-2 rounded-[3px] shadow-sm"
                        >
                            <Save size={16} />
                            <span>Save Landing Page CMS</span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

