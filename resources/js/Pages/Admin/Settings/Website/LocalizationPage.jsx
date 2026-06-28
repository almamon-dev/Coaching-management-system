import React from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import { Globe2, Clock, Calendar, Coins, Hash } from 'lucide-react';
import { toast } from 'react-toastify';
import SelectInput from '@/Components/Form/SelectInput';

export default function Localization({ settings = {} }) {
    const { data, setData, post, processing } = useForm({
        timezone: settings.timezone || '(UTC+06:00) Astana, Dhaka',
        default_language: settings.default_language || 'English (US)',
        date_format: settings.date_format || 'DD/MM/YYYY',
        time_format: settings.time_format || '12-hour',
        currency: settings.currency || 'EUR (€)',
        currency_position: settings.currency_position || 'Left',
        thousand_separator: settings.thousand_separator || ',',
        decimal_separator: settings.decimal_separator || '.',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectChange = (name, value) => {
        setData(name, value);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('admin.settings.website.localization.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Localization settings updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update localization settings.');
            }
        });
    };

    // Prepare static dropdown options
    const languageOptions = [
        { id: 'English (US)', name: 'English (US)' },
        { id: 'Bengali (বাংলা)', name: 'Bengali (বাংলা)' },
    ];

    const timezoneOptions = [
        { id: '(UTC+06:00) Astana, Dhaka', name: '(UTC+06:00) Astana, Dhaka' },
        { id: '(UTC+00:00) London, UTC', name: '(UTC+00:00) London, UTC' },
        { id: '(UTC-05:00) Eastern Time (US & Canada)', name: '(UTC-05:00) Eastern Time (US & Canada)' },
        { id: '(UTC+09:00) Tokyo, Seoul', name: '(UTC+09:00) Tokyo, Seoul' },
    ];

    const currencyOptions = [
        { id: 'USD ($)', name: 'USD ($)' },
        { id: 'BDT (৳)', name: 'BDT (৳)' },
        { id: 'EUR (€)', name: 'EUR (€)' },
        { id: 'GBP (£)', name: 'GBP (£)' },
        { id: 'INR (₹)', name: 'INR (₹)' },
    ];

    const currencyPosOptions = [
        { id: 'Left', name: 'Left ($100)' },
        { id: 'Right', name: 'Right (100$)' },
        { id: 'Left with Space', name: 'Left with Space ($ 100)' },
        { id: 'Right with Space', name: 'Right with Space (100 $)' },
    ];

    const dateFormatOptions = [
        { id: 'DD/MM/YYYY', name: 'DD/MM/YYYY (31/01/2026)' },
        { id: 'MM/DD/YYYY', name: 'MM/DD/YYYY (01/31/2026)' },
        { id: 'YYYY-MM-DD', name: 'YYYY-MM-DD (2026-01-31)' },
        { id: 'MMMM D, YYYY', name: 'MMMM D, YYYY (Jan 31, 2026)' },
    ];

    const timeFormatOptions = [
        { id: '12-hour', name: '12-hour (09:00 PM)' },
        { id: '24-hour', name: '24-hour (21:00)' },
    ];

    return (
        <SettingsLayout
            title="Localization & Regional Settings"
            subtitle="Configure your store language, timezone, date-time formats, and currency settings."
            processing={processing}
            onSave={handleSubmit}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Regional & Currency */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Regional & Language */}
                    <div className="p-4 bg-slate-50/50 rounded-[4px] border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Globe2 size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Regional & Language</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Set your default system language and timezone.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Default Language</label>
                                <SelectInput
                                    name="default_language"
                                    value={data.default_language}
                                    onChange={(e) => handleSelectChange('default_language', e.target.value)}
                                    options={languageOptions}
                                    showSearch={false}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">System Timezone</label>
                                <SelectInput
                                    name="timezone"
                                    value={data.timezone}
                                    onChange={(e) => handleSelectChange('timezone', e.target.value)}
                                    options={timezoneOptions}
                                    showSearch={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Currency & Financials */}
                    <div className="p-4 bg-slate-50/50 rounded-[4px] border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Coins size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Currency & Financials</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Manage default currency settings and layout display.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Default Currency</label>
                                <SelectInput
                                    name="currency"
                                    value={data.currency}
                                    onChange={(e) => handleSelectChange('currency', e.target.value)}
                                    options={currencyOptions}
                                    showSearch={false}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Currency Symbol Position</label>
                                <SelectInput
                                    name="currency_position"
                                    value={data.currency_position}
                                    onChange={(e) => handleSelectChange('currency_position', e.target.value)}
                                    options={currencyPosOptions}
                                    showSearch={false}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Thousand Separator</label>
                                <div className="relative">
                                    <input
                                        name="thousand_separator"
                                        type="text"
                                        value={data.thousand_separator}
                                        onChange={handleInputChange}
                                        className="w-full h-[32px] pl-9 pr-3 bg-white border border-slate-200 rounded-[4px] text-[12px] focus:outline-none focus:border-[#008060]"
                                    />
                                    <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Decimal Separator</label>
                                <div className="relative">
                                    <input
                                        name="decimal_separator"
                                        type="text"
                                        value={data.decimal_separator}
                                        onChange={handleInputChange}
                                        className="w-full h-[32px] pl-9 pr-3 bg-white border border-slate-200 rounded-[4px] text-[12px] focus:outline-none focus:border-[#008060]"
                                    />
                                    <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Date & Time Formatting */}
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50/50 rounded-[4px] border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[#008060]" />
                            <h3 className="text-[13px] font-bold text-slate-700">Date & Time Formatting</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-slate-600">System Date Format</label>
                                <SelectInput
                                    name="date_format"
                                    value={data.date_format}
                                    onChange={(e) => handleSelectChange('date_format', e.target.value)}
                                    options={dateFormatOptions}
                                    showSearch={false}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-slate-600">System Time Format</label>
                                <SelectInput
                                    name="time_format"
                                    value={data.time_format}
                                    onChange={(e) => handleSelectChange('time_format', e.target.value)}
                                    options={timeFormatOptions}
                                    showSearch={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
