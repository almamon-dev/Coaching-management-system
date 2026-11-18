import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Save, Building, UserCheck, Phone, Mail, MapPin, 
    Coins, Calendar, FileText, CheckCircle2 
} from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/Button/PrimaryButton';

export default function SettingsIndex({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        coaching_mode: settings.coaching_mode || 'single',
        center_name: settings.center_name || 'Ullash Coaching Center',
        center_tagline: settings.center_tagline || 'Excellence in Coaching & Learning',
        phone: settings.phone || '+880 1711-000000',
        email: settings.email || 'info@ullashcoaching.com',
        address: settings.address || 'House 42, Road 11, Block E, Banani, Dhaka',
        currency_symbol: settings.currency_symbol || '৳',
        academic_year: settings.academic_year || '2026',
        receipt_footer_note: settings.receipt_footer_note || 'Thank you for choosing Ullash Coaching Center.',
        contact_phone_alt: settings.contact_phone_alt || '',
        contact_office_hours: settings.contact_office_hours || '',
        footer_about: settings.footer_about || '',
        facebook_url: settings.facebook_url || '',
        whatsapp_number: settings.whatsapp_number || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="General Settings & Operations" />

            <div className="w-full space-y-6">
                {/* Header Title Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                                System Configuration
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                            General Settings & Configuration
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Configure coaching operation mode, institution branding, and official communication details.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <PrimaryButton 
                            onClick={handleSubmit} 
                            disabled={processing}
                            className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[36px] px-4 flex items-center gap-2 rounded-[3px]"
                        >
                            <Save size={15} />
                            <span>Save Configuration</span>
                        </PrimaryButton>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    {/* COACHING OPERATION MODE CARD */}
                    <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-[4px] bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                                    <UserCheck size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Coaching Operation Mode</h3>
                                    <p className="text-[11px] text-slate-500">Switch between Single Teacher coaching and Multi-Teacher institute workflows.</p>
                                </div>
                            </div>
                            <div className="w-48">
                                <SelectInput
                                    value={data.coaching_mode}
                                    onChange={(value) => setData('coaching_mode', value)}
                                    options={[
                                        { id: 'single', name: 'Single Teacher Mode' },
                                        { id: 'multi', name: 'Multi-Teacher Institute' },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div
                                onClick={() => setData('coaching_mode', 'single')}
                                className={`p-4 rounded-[4px] border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                    data.coaching_mode === 'single'
                                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${
                                    data.coaching_mode === 'single' ? 'bg-[#16a34a] text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <UserCheck size={16} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 text-xs">Single Teacher Mode</p>
                                        {data.coaching_mode === 'single' && (
                                            <span className="text-[10px] bg-[#16a34a] text-white px-1.5 py-0.2 rounded font-bold">Active</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                        Single teacher operates all classes and batches. Teacher management is streamlined, and focus is kept on batches, routines, and admissions.
                                    </p>
                                </div>
                            </div>

                            <div
                                onClick={() => setData('coaching_mode', 'multi')}
                                className={`p-4 rounded-[4px] border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                    data.coaching_mode === 'multi'
                                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${
                                    data.coaching_mode === 'multi' ? 'bg-[#16a34a] text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <Building size={16} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 text-xs">Multi-Teacher Institute Mode</p>
                                        {data.coaching_mode === 'multi' && (
                                            <span className="text-[10px] bg-[#16a34a] text-white px-1.5 py-0.2 rounded font-bold">Active</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                        Enables full Teacher Management, role-based staff assignments, individual teacher attendance, and multi-instructor batch allocation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INSTITUTION BRANDING & INFORMATION CARD */}
                    <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-[4px] bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                                <Building size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Institution Branding & Information</h3>
                                <p className="text-[11px] text-slate-500">Contact details and identity presented on receipts, invoices, and footers.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <InputLabel value="Center Name *" />
                                <TextInput
                                    value={data.center_name}
                                    onChange={(e) => setData('center_name', e.target.value)}
                                    placeholder="Ullash Coaching Center"
                                    required
                                />
                                <InputError message={errors.center_name} />
                            </div>

                            <div>
                                <InputLabel value="Center Tagline / Slogan" />
                                <TextInput
                                    value={data.center_tagline}
                                    onChange={(e) => setData('center_tagline', e.target.value)}
                                    placeholder="Excellence in Coaching & Learning"
                                />
                                <InputError message={errors.center_tagline} />
                            </div>

                            <div>
                                <InputLabel value="Contact Hotline Phone *" />
                                <TextInput
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+880 1711-000000"
                                    required
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div>
                                <InputLabel value="Official Email *" />
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="info@ullashcoaching.com"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <InputLabel value="Currency Symbol *" />
                                <TextInput
                                    value={data.currency_symbol}
                                    onChange={(e) => setData('currency_symbol', e.target.value)}
                                    placeholder="৳"
                                    required
                                />
                                <InputError message={errors.currency_symbol} />
                            </div>

                            <div>
                                <InputLabel value="Academic Session / Year *" />
                                <TextInput
                                    value={data.academic_year}
                                    onChange={(e) => setData('academic_year', e.target.value)}
                                    placeholder="2026"
                                    required
                                />
                                <InputError message={errors.academic_year} />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <InputLabel value="Campus Physical Address *" />
                                <TextInput
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="House 42, Road 11, Block E, Banani, Dhaka"
                                    required
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div>
                                <InputLabel value="Alternative Phone / Counseling" />
                                <TextInput
                                    value={data.contact_phone_alt}
                                    onChange={(e) => setData('contact_phone_alt', e.target.value)}
                                    placeholder="+880 1812-345678"
                                />
                                <InputError message={errors.contact_phone_alt} />
                            </div>

                            <div>
                                <InputLabel value="WhatsApp Number" />
                                <TextInput
                                    value={data.whatsapp_number}
                                    onChange={(e) => setData('whatsapp_number', e.target.value)}
                                    placeholder="+8801712345678"
                                />
                                <InputError message={errors.whatsapp_number} />
                            </div>

                            <div>
                                <InputLabel value="Office & Counseling Hours" />
                                <TextInput
                                    value={data.contact_office_hours}
                                    onChange={(e) => setData('contact_office_hours', e.target.value)}
                                    placeholder="Sat - Thu: 8:00 AM - 8:00 PM"
                                />
                                <InputError message={errors.contact_office_hours} />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Facebook Page URL" />
                                <TextInput
                                    value={data.facebook_url}
                                    onChange={(e) => setData('facebook_url', e.target.value)}
                                    placeholder="https://facebook.com/ullashcoaching"
                                />
                                <InputError message={errors.facebook_url} />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <InputLabel value="Website Footer Mission Statement" />
                                <TextArea
                                    value={data.footer_about}
                                    onChange={(e) => setData('footer_about', e.target.value)}
                                    rows={2}
                                    placeholder="Ullash Coaching Center is committed to providing quality education, academic excellence, and a brighter future for every student."
                                />
                                <InputError message={errors.footer_about} />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <InputLabel value="Receipt & Invoice Footer Note" />
                                <TextArea
                                    value={data.receipt_footer_note}
                                    onChange={(e) => setData('receipt_footer_note', e.target.value)}
                                    rows={2}
                                    placeholder="Thank you for choosing Ullash Coaching Center."
                                />
                                <InputError message={errors.receipt_footer_note} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="w-full py-4 bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <CheckCircle2 size={16} className="text-[#16a34a]" />
                            <span>Changes apply instantly across the administration portal and student receipts.</span>
                        </div>

                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[38px] px-6 flex items-center gap-2 rounded-[3px] shadow-sm"
                        >
                            <Save size={16} />
                            <span>Save Configuration</span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
