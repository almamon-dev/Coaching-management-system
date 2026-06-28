import React, { useState } from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import { 
    Building2, 
    Mail, 
    Phone, 
    Globe, 
    MapPin, 
    Clock, 
    Plus,
    Calendar, 
    Trash2, 
    Store,
    Info
} from 'lucide-react';

export default function CompanySettings({ settings }) {
    const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayOptions = DAYS.map(day => ({ id: day, name: day }));
    
    const TIMES = [
        '-', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
        '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
    ];
    const timeOptions = TIMES.map(t => ({ id: t, name: t }));
    
    const statusOptions = [
        { id: 'Open', name: 'Open' },
        { id: 'Closed', name: 'Closed' }
    ];

    const { data, setData, post, processing, errors } = useForm({
        company_name: settings.company_name || '',
        legal_name: settings.legal_name || '',
        established_since: settings.established_since || '',
        company_email: settings.company_email || '',
        company_phone: settings.company_phone || '',
        registration_no: settings.registration_no || '',
        tax_id: settings.tax_id || '',
        website: settings.website || '',
        address: settings.address || '',
        is_operating_active: settings.is_operating_active ?? true,
        business_hours: settings.business_hours || [
            { from_day: 'Saturday', to_day: 'Thursday', start_time: '09:00 AM', end_time: '06:00 PM', status: 'Open' },
            { from_day: 'Friday', to_day: 'Friday', start_time: '-', end_time: '-', status: 'Closed' }
        ]
    });

    const handleBusinessHourChange = (index, field, value) => {
        const newHours = [...data.business_hours];
        newHours[index][field] = value;
        setData('business_hours', newHours);
    };

    const addBusinessHourRange = () => {
        setData('business_hours', [
            ...data.business_hours, 
            { from_day: 'Saturday', to_day: 'Thursday', start_time: '09:00 AM', end_time: '06:00 PM', status: 'Open' }
        ]);
    };

    const removeBusinessHourRange = (index) => {
        if (data.business_hours.length > 1) {
            setData('business_hours', data.business_hours.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout 
            title="Company Profile" 
            subtitle="Manage your business identity, contact details and operating hours."
            processing={processing}
            onSave={handleSubmit}
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Identity & Contact */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Legal Identity Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Building2 size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Legal Identity</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Business registration and legal naming.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[13px] font-bold text-slate-700">Display Name</label>
                                <TextInput 
                                    value={data.company_name}
                                    onChange={e => setData('company_name', e.target.value)}
                                    className="rounded-[4px]"
                                    placeholder="e.g. Lee Auto Parts"
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[13px] font-bold text-slate-700">Legal Name</label>
                                <TextInput 
                                    value={data.legal_name}
                                    onChange={e => setData('legal_name', e.target.value)}
                                    className="rounded-[4px]"
                                    placeholder="e.g. Lee Automotive Group Ltd."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Established Since</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Calendar size={16} />
                                    </div>
                                    <TextInput 
                                        type="date" 
                                        value={data.established_since}
                                        onChange={e => setData('established_since', e.target.value)}
                                        className="pl-10 rounded-[4px]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Registration No.</label>
                                <TextInput 
                                    value={data.registration_no}
                                    onChange={e => setData('registration_no', e.target.value)}
                                    className="rounded-[4px]"
                                    placeholder="e.g. REG-12345678"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Tax / VAT ID</label>
                                <TextInput 
                                    value={data.tax_id}
                                    onChange={e => setData('tax_id', e.target.value)}
                                    className="rounded-[4px]"
                                    placeholder="e.g. TAX-99887766"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Official Website</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Globe size={16} />
                                    </div>
                                    <TextInput 
                                        value={data.website}
                                        onChange={e => setData('website', e.target.value)}
                                        className="pl-10 rounded-[4px]"
                                        placeholder="www.yourcompany.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Location Section */}
                    <div className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Mail size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Contact & Location</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Official communication channels and address.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Official Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Mail size={16} />
                                    </div>
                                    <TextInput 
                                        type="email" 
                                        value={data.company_email}
                                        onChange={e => setData('company_email', e.target.value)}
                                        className="pl-10 rounded-[4px]"
                                        placeholder="support@company.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Phone size={16} />
                                    </div>
                                    <TextInput 
                                        value={data.company_phone}
                                        onChange={e => setData('company_phone', e.target.value)}
                                        className="pl-10 rounded-[4px]"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[13px] font-bold text-slate-700">Physical Address</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 text-slate-400 z-10">
                                        <MapPin size={16} />
                                    </div>
                                    <textarea 
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-[4px] border border-[#d1d1d1] focus:border-[#008060] transition-all text-[13px] font-medium text-[#202223] outline-none min-h-[100px] resize-none bg-white"
                                        placeholder="Enter full office address"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Hours */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Operating Status Card */}
                    <div className="bg-slate-50/50 rounded-[6px] border border-slate-100 p-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#008060] border border-slate-100">
                                <Clock size={18} />
                            </div>
                            <h2 className="text-[14px] font-bold text-slate-900">Operating Status</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Live Status Toggle */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-[4px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#008060] border border-emerald-100">
                                        <Store size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-slate-800 leading-none mt-1">Store status</p>
                                        <span className={`text-[10px] font-bold ${data.is_operating_active ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            {data.is_operating_active ? 'Currently active' : 'Currently inactive'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setData('is_operating_active', !data.is_operating_active)}
                                    className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${data.is_operating_active ? 'bg-[#008060]' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${data.is_operating_active ? 'left-[22px]' : 'left-[2px]'}`} />
                                </button>
                            </div>

                            {/* Business Hours List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[12px] font-bold text-slate-700 tracking-tight">Business hours</h3>
                                    <button 
                                        type="button"
                                        onClick={addBusinessHourRange}
                                        className="text-[11px] font-bold text-[#008060] hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                                    >
                                        + Add Range
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    {data.business_hours.map((item, idx) => (
                                        <div key={idx} className="p-4 bg-white border border-slate-100 rounded-[4px] space-y-4 relative group shadow-sm transition-all hover:border-[#008060]/30">
                                            {data.business_hours.length > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => removeBusinessHourRange(idx)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-rose-500 rounded-full flex items-center justify-center shadow-md hover:bg-rose-50 hover:border-rose-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400">From</label>
                                                    <SelectInput 
                                                        value={item.from_day}
                                                        onChange={(e) => handleBusinessHourChange(idx, 'from_day', e.target.value)}
                                                        options={dayOptions}
                                                        className="h-[36px]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400">To</label>
                                                    <SelectInput 
                                                        value={item.to_day}
                                                        onChange={(e) => handleBusinessHourChange(idx, 'to_day', e.target.value)}
                                                        options={dayOptions}
                                                        className="h-[36px]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400">Opens</label>
                                                    <SelectInput 
                                                        value={item.start_time}
                                                        disabled={item.status === 'Closed'}
                                                        onChange={(e) => handleBusinessHourChange(idx, 'start_time', e.target.value)}
                                                        options={timeOptions}
                                                        className="h-[36px]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400">Closes</label>
                                                    <SelectInput 
                                                        value={item.end_time}
                                                        disabled={item.status === 'Closed'}
                                                        onChange={(e) => handleBusinessHourChange(idx, 'end_time', e.target.value)}
                                                        options={timeOptions}
                                                        className="h-[36px]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.status === 'Open' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {item.status}
                                                </span>
                                                <div className="w-24">
                                                    <SelectInput 
                                                        value={item.status}
                                                        onChange={(e) => handleBusinessHourChange(idx, 'status', e.target.value)}
                                                        options={statusOptions}
                                                        className="h-[32px] text-[11px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </form>
        </SettingsLayout>
    );
}
