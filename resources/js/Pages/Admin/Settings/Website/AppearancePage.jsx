import React from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import { 
    Palette, 
    Moon, 
    Sun, 
    Monitor, 
    Type, 
    Layout, 
    Box,
    CheckCircle2
} from 'lucide-react';

export default function Appearance({ settings = {} }) {
    const { data, setData, post, processing } = useForm({
        primary_color: settings.primary_color || '#008060',
        secondary_color: settings.secondary_color || '#1a1c1d',
        theme_mode: settings.theme_mode || 'system',
        layout_density: settings.layout_density || 'compact',
        border_radius: settings.border_radius || '4px',
        font_family: settings.font_family || 'Inter',
    });

    const themes = [
        { id: 'light', name: 'Light', icon: Sun },
        { id: 'dark', name: 'Dark', icon: Moon },
        { id: 'system', name: 'System', icon: Monitor },
    ];

    const densities = [
        { id: 'compact', name: 'Compact', desc: 'Higher information density' },
        { id: 'comfortable', name: 'Comfortable', desc: 'More breathing room' },
    ];

    const fonts = ['Inter', 'Outfit', 'Roboto', 'Plus Jakarta Sans', 'Public Sans'];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout
            title="Branding & Appearance"
            subtitle="Customize your store identity and administrative interface style."
            processing={processing}
            onSave={handleSubmit}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Colors & Typography */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Brand Colors */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Palette size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Brand Colors</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Define your store's primary visual identity.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5 p-3 bg-slate-50/50 rounded-[4px] border border-slate-100">
                                <label className="text-[13px] font-bold text-slate-700">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="color" 
                                        value={data.primary_color}
                                        onChange={e => setData('primary_color', e.target.value)}
                                        className="w-10 h-10 rounded-[4px] border-none cursor-pointer bg-transparent"
                                    />
                                    <input 
                                        type="text" 
                                        value={data.primary_color}
                                        onChange={e => setData('primary_color', e.target.value)}
                                        className="flex-1 h-[32px] px-3 bg-white border border-slate-200 rounded-[4px] text-[12px] font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 p-3 bg-slate-50/50 rounded-[4px] border border-slate-100">
                                <label className="text-[13px] font-bold text-slate-700">Secondary Color</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="color" 
                                        value={data.secondary_color}
                                        onChange={e => setData('secondary_color', e.target.value)}
                                        className="w-10 h-10 rounded-[4px] border-none cursor-pointer bg-transparent"
                                    />
                                    <input 
                                        type="text" 
                                        value={data.secondary_color}
                                        onChange={e => setData('secondary_color', e.target.value)}
                                        className="flex-1 h-[32px] px-3 bg-white border border-slate-200 rounded-[4px] text-[12px] font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Theme */}
                <div className="space-y-4">
                    {/* Interface Theme */}
                    <div className="p-4 bg-slate-50/50 rounded-[4px] border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2">
                            <Monitor size={16} className="text-slate-400" />
                            <h3 className="text-[13px] font-bold text-slate-700">Interface Theme</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {themes.map(theme => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => setData('theme_mode', theme.id)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-[4px] border transition-all ${data.theme_mode === theme.id 
                                        ? 'bg-white border-[#008060] shadow-sm' 
                                        : 'bg-white/50 border-slate-100 text-slate-500'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <theme.icon size={14} className={data.theme_mode === theme.id ? 'text-[#008060]' : 'text-slate-400'} />
                                        <span className="text-[12px] font-bold">{theme.name}</span>
                                    </div>
                                    {data.theme_mode === theme.id && <CheckCircle2 size={14} className="text-[#008060]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
