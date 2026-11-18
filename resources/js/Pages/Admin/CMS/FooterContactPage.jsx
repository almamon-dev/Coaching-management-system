import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import TextArea from '@/Components/Form/TextArea';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import {
    Save, MapPin, Phone, Mail, Clock, MessageSquare,
    Share2, ExternalLink, Globe, CheckCircle2, ShieldCheck
} from 'lucide-react';

export default function FooterContactPage({ settings = {} }) {
    const centerName = settings.center_name || 'Ullash Coaching Center';

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        center_name: settings.center_name || 'Ullash Coaching Center',
        phone: settings.phone || '+880 1712-345678',
        contact_phone_alt: settings.contact_phone_alt || '+880 1812-345678',
        email: settings.email || 'info@ullashcoachingcenter.com',
        address: settings.address || 'House 123, Road 5, Mirpur-10, Dhaka-1216, Bangladesh',
        contact_office_hours: settings.contact_office_hours || 'Saturday - Thursday: 8:00 AM - 8:00 PM (Friday Closed)',
        contact_title: settings.contact_title || 'Contact Our Campus',
        contact_subtitle: settings.contact_subtitle || 'Have questions about admissions, batch schedules, or fee structures? Reach out to our academic counseling desk today.',
        contact_counseling_note: settings.contact_counseling_note || 'Walk-in academic counseling and batch placement discussions are open daily during office hours.',
        contact_map_embed: settings.contact_map_embed || '',
        footer_about: settings.footer_about || `${centerName} is committed to providing quality education, academic excellence, and a brighter future for every student through personalized mentorship and rigorous evaluations.`,
        footer_copyright: settings.footer_copyright || `© ${new Date().getFullYear()} ${centerName}. All Rights Reserved.`,
        facebook_url: settings.facebook_url || '',
        youtube_url: settings.youtube_url || '',
        instagram_url: settings.instagram_url || '',
        linkedin_url: settings.linkedin_url || '',
        twitter_url: settings.twitter_url || '',
        telegram_url: settings.telegram_url || '',
        tiktok_url: settings.tiktok_url || '',
        whatsapp_number: settings.whatsapp_number || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.cms.footer-contact.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Footer & Contact CMS" />

            <div className="w-full space-y-6 max-w-7xl mx-auto font-inter">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#16a34a] border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                                Website CMS
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-slate-500 text-xs font-semibold">Footer & Contact Management</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                            Footer & Contact Us CMS
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Dynamically manage campus contact details, counseling hours, social media profiles, and website footer information.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/#contact"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-[3px] hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                            <span>Preview Contact</span>
                            <ExternalLink size={13} />
                        </a>
                        <PrimaryButton
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold px-4 py-2 rounded-[3px] shadow-sm flex items-center gap-2"
                        >
                            <Save size={15} />
                            <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                        </PrimaryButton>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-[4px] flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in fade-in">
                        <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />
                        <span>Footer and Contact information have been successfully updated across the website!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CARD 1: Official Campus Contact Details */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-5 md:p-6 space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-[#047857] flex items-center justify-center shrink-0">
                                <Phone size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Official Campus Contact Information</h3>
                                <p className="text-[11px] text-slate-500">Visible on the website header, footer, contact section, and admission desk.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <InputLabel value="Coaching Center Name *" />
                                <TextInput
                                    value={data.center_name}
                                    onChange={(e) => setData('center_name', e.target.value)}
                                    placeholder="Ullash Coaching Center"
                                    required
                                />
                                <InputError message={errors.center_name} />
                            </div>

                            <div>
                                <InputLabel value="Primary Hotline Phone *" />
                                <TextInput
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+880 1712-345678"
                                    required
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div>
                                <InputLabel value="Alternative / Counseling Phone" />
                                <TextInput
                                    value={data.contact_phone_alt}
                                    onChange={(e) => setData('contact_phone_alt', e.target.value)}
                                    placeholder="+880 1812-345678"
                                />
                                <InputError message={errors.contact_phone_alt} />
                            </div>

                            <div>
                                <InputLabel value="Official Contact Email *" />
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="info@ullashcoachingcenter.com"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Office & Counseling Hours *" />
                                <TextInput
                                    value={data.contact_office_hours}
                                    onChange={(e) => setData('contact_office_hours', e.target.value)}
                                    placeholder="Saturday - Thursday: 8:00 AM - 8:00 PM (Friday Closed)"
                                    required
                                />
                                <InputError message={errors.contact_office_hours} />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <InputLabel value="Campus Physical Address *" />
                                <TextInput
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="House 123, Road 5, Mirpur-10, Dhaka-1216, Bangladesh"
                                    required
                                />
                                <InputError message={errors.address} />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Contact Section Headings & Counseling Notes */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-5 md:p-6 space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-[4px] bg-teal-50 text-[#009ca6] flex items-center justify-center shrink-0">
                                <MapPin size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Contact Us Section & Map Settings</h3>
                                <p className="text-[11px] text-slate-500">Configure headings, notes, and Google Maps embed for the contact section.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Contact Section Main Title" />
                                <TextInput
                                    value={data.contact_title}
                                    onChange={(e) => setData('contact_title', e.target.value)}
                                    placeholder="Contact Our Campus"
                                />
                                <InputError message={errors.contact_title} />
                            </div>

                            <div>
                                <InputLabel value="Google Maps Embed URL (Iframe src link)" />
                                <TextInput
                                    value={data.contact_map_embed}
                                    onChange={(e) => setData('contact_map_embed', e.target.value)}
                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Leave empty to display clean interactive location cards.</p>
                                <InputError message={errors.contact_map_embed} />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Contact Section Subtitle / Description" />
                                <TextArea
                                    value={data.contact_subtitle}
                                    onChange={(e) => setData('contact_subtitle', e.target.value)}
                                    rows={2}
                                    placeholder="Have questions about admissions, batch schedules, or fee structures? Reach out to our academic team today."
                                />
                                <InputError message={errors.contact_subtitle} />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Walk-in Counseling & Placement Note" />
                                <TextArea
                                    value={data.contact_counseling_note}
                                    onChange={(e) => setData('contact_counseling_note', e.target.value)}
                                    rows={2}
                                    placeholder="Walk-in academic counseling and batch placement discussions are open daily during office hours."
                                />
                                <InputError message={errors.contact_counseling_note} />
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: Social Media & Direct Messaging */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-5 md:p-6 space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Share2 size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Social Media & Messaging Channels</h3>
                                    <p className="text-[11px] text-slate-500">Links are 100% dynamic. Leave any input blank to automatically hide that icon from the website footer & contact page.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <InputLabel value="Facebook Page URL" />
                                <TextInput
                                    value={data.facebook_url}
                                    onChange={(e) => setData('facebook_url', e.target.value)}
                                    placeholder="https://facebook.com/..."
                                />
                                <InputError message={errors.facebook_url} />
                            </div>

                            <div>
                                <InputLabel value="YouTube Channel URL" />
                                <TextInput
                                    value={data.youtube_url}
                                    onChange={(e) => setData('youtube_url', e.target.value)}
                                    placeholder="https://youtube.com/@..."
                                />
                                <InputError message={errors.youtube_url} />
                            </div>

                            <div>
                                <InputLabel value="Instagram Profile URL" />
                                <TextInput
                                    value={data.instagram_url}
                                    onChange={(e) => setData('instagram_url', e.target.value)}
                                    placeholder="https://instagram.com/..."
                                />
                                <InputError message={errors.instagram_url} />
                            </div>

                            <div>
                                <InputLabel value="LinkedIn Page URL" />
                                <TextInput
                                    value={data.linkedin_url}
                                    onChange={(e) => setData('linkedin_url', e.target.value)}
                                    placeholder="https://linkedin.com/company/..."
                                />
                                <InputError message={errors.linkedin_url} />
                            </div>

                            <div>
                                <InputLabel value="Twitter / X Profile URL" />
                                <TextInput
                                    value={data.twitter_url}
                                    onChange={(e) => setData('twitter_url', e.target.value)}
                                    placeholder="https://x.com/..."
                                />
                                <InputError message={errors.twitter_url} />
                            </div>

                            <div>
                                <InputLabel value="Telegram Channel / Group" />
                                <TextInput
                                    value={data.telegram_url}
                                    onChange={(e) => setData('telegram_url', e.target.value)}
                                    placeholder="https://t.me/..."
                                />
                                <InputError message={errors.telegram_url} />
                            </div>

                            <div>
                                <InputLabel value="TikTok Profile URL" />
                                <TextInput
                                    value={data.tiktok_url}
                                    onChange={(e) => setData('tiktok_url', e.target.value)}
                                    placeholder="https://tiktok.com/@..."
                                />
                                <InputError message={errors.tiktok_url} />
                            </div>

                            <div>
                                <InputLabel value="WhatsApp Direct Number" />
                                <TextInput
                                    value={data.whatsapp_number}
                                    onChange={(e) => setData('whatsapp_number', e.target.value)}
                                    placeholder="+88017XXXXXXXX"
                                />
                                <InputError message={errors.whatsapp_number} />
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: Footer About & Copyright Information */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs p-5 md:p-6 space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-[4px] bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <Globe size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Website Footer Content</h3>
                                <p className="text-[11px] text-slate-500">Configure the mission paragraph and copyright statement in the footer.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <InputLabel value="Footer About & Mission Bio (Column 1)" />
                                <TextArea
                                    value={data.footer_about}
                                    onChange={(e) => setData('footer_about', e.target.value)}
                                    rows={3}
                                    placeholder="Ullash Coaching Center is committed to providing quality education, academic excellence, and a brighter future for every student."
                                />
                                <InputError message={errors.footer_about} />
                            </div>

                            <div>
                                <InputLabel value="Footer Copyright Notice (Bottom Strip)" />
                                <TextInput
                                    value={data.footer_copyright}
                                    onChange={(e) => setData('footer_copyright', e.target.value)}
                                    placeholder={`© ${new Date().getFullYear()} ${centerName}. All Rights Reserved.`}
                                />
                                <InputError message={errors.footer_copyright} />
                            </div>
                        </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="bg-slate-900 text-slate-400 p-5 rounded-[4px] border border-slate-800 space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                            Live Footer & Contact Preview
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div>
                                <p className="font-bold text-white mb-1">{data.center_name}</p>
                                <p className="text-slate-400 leading-relaxed text-[11px]">{data.footer_about}</p>
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">Contact</p>
                                <p className="text-slate-300">Hotline: {data.phone}</p>
                                <p className="text-slate-300">Email: {data.email}</p>
                                <p className="text-slate-400 mt-1">{data.address}</p>
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">Counseling Hours</p>
                                <p className="text-slate-300">{data.contact_office_hours}</p>
                                <div className="mt-2 text-[10px] text-slate-500">
                                    {data.footer_copyright}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="pt-2 flex justify-end">
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold px-6 py-2.5 rounded-[3px] shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={16} />
                            <span>{processing ? 'Saving Settings...' : 'Save Footer & Contact Settings'}</span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
