import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, Save, Info, Plus, X, Trash2,
    Sparkles, ListChecks, CheckCircle2, Send,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Notify from '@/Utils/Notify';

const ToggleSwitch = ({ enabled, onToggle, label }) => (
    <div className="flex items-center gap-2 cursor-pointer group/opt select-none" onClick={onToggle}>
        <div className={cn(
            "relative inline-flex h-4 w-8 shrink-0 items-center rounded-full transition-all duration-300 ease-in-out",
            enabled ? "bg-[#008060]" : "bg-slate-200"
        )}>
            <span className={cn(
                "inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-sm",
                enabled ? "translate-x-[18px]" : "translate-x-[4px]"
            )} />
        </div>
        {label && <span className="text-[10px] font-bold text-slate-500 group-hover/opt:text-[#081621] transition-colors tracking-tight">{label}</span>}
    </div>
);

export default function Edit({ auth, preset }) {
    const { data, setData, post, processing, errors } = useForm({
        name: preset.name || '',
        fields: preset.fields || [
            { name: '', type: 'text', unit: '', placeholder: '', options: '', is_required: false, show_in_filter: true }
        ],
        _method: 'PUT'
    });

    const addField = () => {
        setData('fields', [
            ...data.fields,
            { name: '', type: 'text', unit: '', placeholder: '', options: '', is_required: false, show_in_filter: true }
        ]);
    };

    const removeField = (index) => {
        setData('fields', data.fields.filter((_, i) => i !== index));
    };

    const updateField = (index, key, value) => {
        const newFields = [...data.fields];
        newFields[index][key] = value;
        setData('fields', newFields);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.attribute-presets.update', preset.id), {
            onSuccess: () => Notify.success('Preset Updated!', 'The attribute preset has been updated successfully.'),
            onError: () => Notify.error('Failed!', 'Please check the form for errors.'),
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title={`Edit Preset: ${preset.name}`} />

            <div className="min-h-screen">
                {/* 1. Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#081621]">Edit Attribute Preset</h1>
                        <p className="text-[#666666] text-sm mt-1 font-medium">Modify the reusable attribute template for your categories.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.categories.attribute-presets.index')}
                            className="h-[38px] px-5 bg-white border border-slate-200 rounded-[3px] text-[#666666] font-bold text-[12px] flex items-center gap-2 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            form="preset-edit-form"
                            disabled={processing}
                            className="h-[38px] px-5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#006e52] transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                            Update Preset
                        </button>
                    </div>
                </div>

                <form id="preset-edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    {/* Left Column: Form Fields (Col 1-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Preset Name Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Sparkles size={16} className="text-[#008060]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Preset Configuration</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-1">
                                    <InputLabel value="Preset Name" required />
                                    <TextInput
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`w-full ${errors.name ? 'border-rose-500' : ''}`}
                                        placeholder="e.g. Gaming Laptop Specs"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>
                        </div>

                        {/* Attribute Fields Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ListChecks size={16} className="text-[#008060]" />
                                    <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Attribute Fields</h3>
                                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#e4f1ef] text-[#008060] font-bold">
                                        {data.fields.length}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="h-[28px] px-3 bg-[#008060]/5 text-[#008060] rounded-[3px] text-[11px] font-bold flex items-center gap-1.5 hover:bg-[#008060]/10 transition-all active:scale-95"
                                >
                                    <Plus size={14} /> Add Field
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {data.fields.length > 0 ? (
                                    data.fields.map((field, idx) => (
                                        <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-[1px] p-5 relative group transition-all animate-in slide-in-from-top-2">

                                            {/* Remove Button */}
                                            {data.fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeField(idx)}
                                                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-100"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="space-y-1">
                                                    <InputLabel value="Field Name" />
                                                    <TextInput
                                                        value={field.name}
                                                        onChange={e => updateField(idx, 'name', e.target.value)}
                                                        placeholder="e.g. RAM Capacity"
                                                        className="w-full text-[12px]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <InputLabel value="Input Type" />
                                                    <SelectInput
                                                        value={field.type}
                                                        onChange={e => updateField(idx, 'type', e.target.value)}
                                                        className="w-full text-[12px]"
                                                    >
                                                        <option value="text">Text (Single Line)</option>
                                                        <option value="number">Number Only</option>
                                                        <option value="dropdown_single">Dropdown (Select)</option>
                                                        <option value="dropdown_multiple">Multi-Select (Tags)</option>
                                                        <option value="boolean">Switch (Yes/No)</option>
                                                    </SelectInput>
                                                </div>
                                                <div className="space-y-1">
                                                    <InputLabel value="Unit (Suffix)" />
                                                    <TextInput
                                                        value={field.unit}
                                                        onChange={e => updateField(idx, 'unit', e.target.value)}
                                                        placeholder="e.g. GB, MHz"
                                                        className="w-full text-[12px]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Options — only for dropdowns */}
                                            {(field.type === 'dropdown_single' || field.type === 'dropdown_multiple') && (
                                                <div className="mb-4 pt-4 border-t border-slate-100">
                                                    <InputLabel value="Options (press Enter to add)" />
                                                    <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-[1px] border border-slate-200 min-h-[40px] mt-1 shadow-sm">
                                                        {field.options ? field.options.split('\n').filter(Boolean).map((opt, i) => (
                                                            <div key={i} className="flex items-center gap-1.5 bg-[#e4f1ef] border border-[#d1e9e5] px-2 py-0.5 rounded-[2px] text-[10px] font-bold text-[#008060]">
                                                                {opt}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const filtered = field.options.split('\n').filter(o => o !== opt);
                                                                        updateField(idx, 'options', filtered.join('\n'));
                                                                    }}
                                                                    className="text-[#008060]/60 hover:text-rose-500 transition-colors"
                                                                >
                                                                    <X size={10} />
                                                                </button>
                                                            </div>
                                                        )) : null}
                                                        <input
                                                            type="text"
                                                            placeholder="Type and press Enter..."
                                                            className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 text-[11px] font-medium h-6 p-0 shadow-none outline-none"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    const val = e.target.value.trim();
                                                                    if (val) {
                                                                        const current = field.options ? field.options.split('\n').filter(Boolean) : [];
                                                                        if (!current.includes(val)) {
                                                                            updateField(idx, 'options', [...current, val].join('\n'));
                                                                            e.target.value = '';
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Toggles */}
                                            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                                                <ToggleSwitch
                                                    enabled={field.is_required}
                                                    onToggle={() => updateField(idx, 'is_required', !field.is_required)}
                                                    label="Required Field"
                                                />
                                                <ToggleSwitch
                                                    enabled={field.show_in_filter}
                                                    onToggle={() => updateField(idx, 'show_in_filter', !field.show_in_filter)}
                                                    label="Show in Filters"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-16 text-center border border-dashed border-slate-200 rounded-[1px] bg-slate-50/30">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100 shadow-sm">
                                            <ListChecks size={24} />
                                        </div>
                                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">No fields added yet</p>
                                        <button
                                            type="button"
                                            onClick={addField}
                                            className="mt-3 text-[#008060] font-bold text-[12px] hover:underline flex items-center gap-1.5 mx-auto"
                                        >
                                            <Plus size={14} /> Create First Field
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Col 9-12) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Info Card */}
                        <div className="bg-[#081621] text-white p-8 rounded-[1px] shadow-xl relative overflow-hidden group min-h-[320px] flex flex-col justify-between animate-in fade-in duration-500">
                            <div className="absolute -right-6 -top-6 text-white/5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                <ListChecks size={200} strokeWidth={1} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-[12px] font-bold mb-6 flex items-center gap-2.5 text-[#008060]">
                                    <div className="w-6 h-6 bg-[#008060]/10 flex items-center justify-center rounded-[1px]">
                                        <Info size={14} />
                                    </div>
                                    Preset Benefits
                                </h4>
                                <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                                    Presets allow you to define a standardized set of attributes that can be applied to any category, ensuring consistency and saving time during product setup.
                                </p>
                            </div>
                            <div className="relative z-10 pt-8 mt-8 border-t border-white/5 space-y-4">
                                {[
                                    'Reusable across categories',
                                    'Consistent product specs',
                                    'Streamlined data entry',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 group/item">
                                        <div className="w-8 h-8 rounded-[1px] bg-[#008060]/10 flex items-center justify-center text-[#008060] group-hover/item:bg-[#008060] group-hover/item:text-white transition-all duration-300 border border-[#008060]/20">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-300 group-hover/item:text-white transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm p-6 animate-in fade-in duration-500">
                             <h4 className="text-[11px] font-bold text-[#081621] mb-4">Metadata</h4>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 font-bold">Created</span>
                                    <span className="text-[11px] text-[#081621] font-bold">
                                        {preset.created_at ? new Date(preset.created_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 font-bold">Last Update</span>
                                    <span className="text-[11px] text-[#081621] font-bold">
                                        {preset.updated_at ? new Date(preset.updated_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                             </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
