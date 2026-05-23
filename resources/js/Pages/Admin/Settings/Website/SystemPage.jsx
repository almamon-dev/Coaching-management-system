import React, { useRef, useState } from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { 
    Globe, 
    Image as ImageIcon, 
    Settings, 
    Monitor, 
    Upload,
    Info
} from 'lucide-react';

export default function WebsiteSystem({ settings, timezones }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        site_tagline: settings.site_tagline || '',
        site_url: settings.site_url || '',
        timezone: settings.timezone || 'UTC',
        maintenance_mode: settings.maintenance_mode ?? false,
        force_ssl: settings.force_ssl ?? true,
        site_logo: null,
        site_favicon: null,
        _method: 'POST'
    });

    const [previews, setPreviews] = useState({
        logo: settings.site_logo || null,
        favicon: settings.site_favicon || null
    });

    const logoInputRef = useRef(null);
    const faviconInputRef = useRef(null);

    const handleFileChange = (type, e) => {
        const file = e.target.files[0];
        if (file) {
            setData(type === 'logo' ? 'site_logo' : 'site_favicon', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = (type) => {
        setData(type === 'logo' ? 'site_logo' : 'site_favicon', null);
        setPreviews(prev => ({ ...prev, [type]: settings[`site_${type}`] || null }));
        if (type === 'logo') logoInputRef.current.value = '';
        else faviconInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const timezoneOptions = timezones.map(tz => ({ id: tz, name: tz }));

    return (
        <SettingsLayout 
            title="Website System" 
            subtitle="Configure your website's primary identity and operational status."
            processing={processing}
            onSave={handleSubmit}
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Settings size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Basic Information</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Core branding and site metadata.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[13px] font-bold text-slate-700">Website Name</label>
                                <TextInput 
                                    value={data.site_name}
                                    onChange={e => setData('site_name', e.target.value)}
                                    placeholder="e.g. My Awesome Store"
                                    className="rounded-[4px]"
                                />
                                {errors.site_name && <p className="text-rose-500 text-[11px] font-medium">{errors.site_name}</p>}
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[13px] font-bold text-slate-700">Site Tagline</label>
                                <TextInput 
                                    value={data.site_tagline}
                                    onChange={e => setData('site_tagline', e.target.value)}
                                    placeholder="e.g. Best Gadgets Online"
                                    className="rounded-[4px]"
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[13px] font-bold text-slate-700">Application URL</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                        <Globe size={16} />
                                    </div>
                                    <TextInput 
                                        value={data.site_url}
                                        onChange={e => setData('site_url', e.target.value)}
                                        className="pl-10 bg-slate-50 text-slate-400 rounded-[4px]"
                                        readOnly
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">This URL is fixed based on your server configuration and used for system routing.</p>
                            </div>
                        </div>
                    </div>

                    {/* System Configuration Section */}
                    <div className="pt-4 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-slate-700">System Timezone</label>
                                <SelectInput 
                                    value={data.timezone}
                                    onChange={e => setData('timezone', e.target.value)}
                                    options={timezoneOptions}
                                    placeholder="Select Timezone"
                                    direction="up"
                                    className="rounded-[4px]"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5 flex items-center justify-between p-3 bg-slate-50/50 rounded-[4px] border border-slate-100">
                                    <div>
                                        <label className="text-[13px] font-bold text-slate-700 block leading-none">Maintenance Mode</label>
                                        <span className={`text-[10px] font-bold transition-colors ${data.maintenance_mode ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {data.maintenance_mode ? 'System is Offline' : 'System is Online'}
                                        </span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setData('maintenance_mode', !data.maintenance_mode)}
                                        className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${data.maintenance_mode ? 'bg-rose-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${data.maintenance_mode ? 'left-[22px]' : 'left-[2px]'}`} />
                                    </button>
                                </div>

                                <div className="space-y-1.5 flex items-center justify-between p-3 bg-slate-50/50 rounded-[4px] border border-slate-100">
                                    <div>
                                        <label className="text-[13px] font-bold text-slate-700 block leading-none">Force HTTPS (SSL)</label>
                                        <span className={`text-[10px] font-bold transition-colors ${data.force_ssl ? 'text-[#008060]' : 'text-slate-400'}`}>
                                            {data.force_ssl ? 'SSL Security Active' : 'SSL Security Disabled'}
                                        </span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setData('force_ssl', !data.force_ssl)}
                                        className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${data.force_ssl ? 'bg-[#008060]' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${data.force_ssl ? 'left-[22px]' : 'left-[2px]'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                {/* Right Column - Visual Branding */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-50/30 rounded-[6px] border border-slate-100 p-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#008060] border border-slate-100">
                                <ImageIcon size={18} />
                            </div>
                            <h2 className="text-[14px] font-bold text-slate-900">Visual Branding</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Website Logo */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[12px] font-bold text-slate-700 tracking-tight">Main logo</label>
                                    {previews.logo && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeFile('logo')}
                                            className="text-[10px] font-bold text-rose-500 hover:underline"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                                <div 
                                    onClick={() => logoInputRef.current.click()}
                                    className="group relative cursor-pointer"
                                >
                                    <div className="w-full h-[120px] rounded-[4px] border-2 border-dashed border-slate-200 bg-white flex items-center justify-center overflow-hidden transition-all group-hover:border-[#008060]/40 group-hover:bg-slate-50/50">
                                        {previews.logo ? (
                                            <img src={previews.logo} alt="Logo" className="max-w-full max-h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <Upload size={20} />
                                                <span className="text-[10px] font-bold tracking-widest">Upload logo</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={logoInputRef} className="hidden" onChange={e => handleFileChange('logo', e)} />
                                </div>
                            </div>

                            {/* Favicon */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[12px] font-bold text-slate-700 tracking-tight">Favicon</label>
                                    {previews.favicon && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeFile('favicon')}
                                            className="text-[10px] font-bold text-rose-500 hover:underline"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                                <div 
                                    onClick={() => faviconInputRef.current.click()}
                                    className="group relative cursor-pointer"
                                >
                                    <div className="w-full h-[80px] rounded-[4px] border-2 border-dashed border-slate-200 bg-white flex items-center justify-center overflow-hidden transition-all group-hover:border-[#008060]/40 group-hover:bg-slate-50/50">
                                        {previews.favicon ? (
                                            <img src={previews.favicon} alt="Favicon" className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <Upload size={18} />
                                                <span className="text-[10px] font-bold tracking-widest">Site icon</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={faviconInputRef} className="hidden" onChange={e => handleFileChange('favicon', e)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </SettingsLayout>
    );
}
