/**
 * CategoryAttributesPage Component
 * 
 * Technical interface for managing custom product attribute schemas
 * for specific categories. Supports presets and dynamic field generation.
 */
import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import {
    Plus, ArrowLeft, Save, Info, Sparkles, 
    RefreshCcw, X, Trash2, Settings2, Check
} from 'lucide-react';

// Shared Components
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import Notify from '@/Utils/Notify';
import { cn } from "@/lib/utils";

const CategoryAttributesPage = ({ auth, category, categories }) => {
    const [dynamicPresets, setDynamicPresets] = useState([]);
    const [selectedPresetId, setSelectedPresetId] = useState('');

    const { data, setData, post, processing } = useForm({
        attributes: category.attributes?.map(attr => ({
            id: attr.id,
            name: attr.name,
            slug: attr.slug || attr.name.toLowerCase().replace(/ /g, '_'),
            type: attr.type || 'text',
            unit: attr.unit || '',
            placeholder: attr.placeholder || '',
            options: attr.values?.map(v => v.value).join('\n') || '',
            is_required: attr.is_required ? true : false,
            show_in_filter: attr.show_in_filter !== undefined ? (attr.show_in_filter ? true : false) : true,
            is_slug_manual: !!attr.slug,
            is_editing: false
        })) || []
    });

    React.useEffect(() => {
        fetch(route('admin.categories.attribute-presets.get'))
            .then(res => res.json())
            .then(data => setDynamicPresets(data));
    }, []);

    const addField = () => {
        setData('attributes', [
            ...data.attributes,
            {
                name: '', slug: '', type: 'text', unit: '', placeholder: '',
                options: '', is_required: false, show_in_filter: true,
                is_slug_manual: false, is_editing: true // New attributes are editable by default
            }
        ]);
    };

    const removeField = (index) => {
        setData('attributes', data.attributes.filter((_, i) => i !== index));
    };

    const updateField = (index, key, value) => {
        const newAttrs = [...data.attributes];
        newAttrs[index][key] = value;

        // If updating name, and slug hasn't been manually edited, sync slug
        if (key === 'name' && !newAttrs[index].is_slug_manual) {
            newAttrs[index].slug = value.toLowerCase()
                .replace(/[^\w ]+/g, '') // Remove non-alphanumeric except spaces
                .replace(/ +/g, '_');    // Replace spaces with underscores
        }

        // If user manually edits the slug, mark it as manual
        if (key === 'slug') {
            newAttrs[index].is_slug_manual = true;
        }

        setData('attributes', newAttrs);
    };

    const applyPreset = () => {
        if (!selectedPresetId) {
            Notify.warning('Selection Required', 'Please select a template from the dropdown.');
            return;
        }
        const selectedPreset = dynamicPresets.find(p => String(p.id) === String(selectedPresetId));
        if (selectedPreset && selectedPreset.fields) {
            const mappedFields = selectedPreset.fields.map(f => ({
                ...f,
                slug: f.name.toLowerCase().replace(/ /g, '_'),
                is_slug_manual: false,
                is_editing: true // Make them editable when loaded
            }));

            // Just update the local state, don't auto-save
            setData('attributes', [...data.attributes, ...mappedFields]);
            Notify.success('Template Loaded!', 'Attributes added to the list. Don\'t forget to save changes.');
            setSelectedPresetId(''); // Reset selection
        }
    };

    const toggleEditing = (index) => {
        const newAttrs = [...data.attributes];
        newAttrs[index].is_editing = !newAttrs[index].is_editing;
        setData('attributes', newAttrs);
    };

    const addOption = (index, option) => {
        const val = option.trim();
        if (!val) return;
        const current = data.attributes[index].options ? data.attributes[index].options.split('\n').filter(Boolean) : [];
        if (!current.includes(val)) {
            updateField(index, 'options', [...current, val].join('\n'));
        }
    };

    const removeOption = (attrIndex, optionIndex) => {
        const current = data.attributes[attrIndex].options.split('\n').filter(Boolean);
        const filtered = current.filter((_, i) => i !== optionIndex);
        updateField(attrIndex, 'options', filtered.join('\n'));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const returnTo = new URLSearchParams(window.location.search).get('return_to');

        post(route('admin.categories.attributes.update', category.id), {
            onSuccess: () => {
                Notify.success('Successfully saved!', 'Attribute changes are now live.');
                if (window.opener) {
                    // If it's a popup/new tab, notify and close after a delay
                    setTimeout(() => window.close(), 1000);
                } else if (returnTo) {
                    window.location.href = returnTo;
                }
            },
            onError: () => Notify.error('Failed!', 'Failed to update attributes.'),
        });
    };

    const ToggleSwitch = ({ enabled, onToggle, label }) => (
        <div className="flex items-center gap-2 cursor-pointer group/opt select-none" onClick={onToggle}>
            <div
                className={cn(
                    "relative inline-flex h-4 w-8 shrink-0 items-center rounded-full transition-all duration-300 ease-in-out",
                    enabled ? "bg-[#ef4a23]" : "bg-slate-200"
                )}
            >
                <span
                    className={cn(
                        "inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-sm",
                        enabled ? "translate-x-[18px]" : "translate-x-[4px]"
                    )}
                />
            </div>
            {label && <span className="text-[10px] font-bold text-slate-500 group-hover/opt:text-[#081621] transition-colors tracking-tight">{label}</span>}
        </div>
    );

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Manage Attributes - ${category.name}`} />

            <div className="min-h-screen pb-20 bg-[#fbfbfb]">
                {/* Slim Header */}
                <div className="w-full mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <div>
                            <h1 className="text-[16px] font-bold text-[#081621] tracking-tight">Manage Attributes</h1>
                            <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">Category Editor &bull; {category.name}</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="h-9 px-6 bg-[#081621] text-white rounded-[1px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#ef4a23] transition-all shadow-sm disabled:opacity-50"
                    >
                        <Save size={14} />
                        {processing ? 'Saving...' : 'Save Schema'}
                    </Button>
                </div>
                <div className="w-full mx-auto px-6 mt-6">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Sidebar: Sticky Controls */}
                        <div className="w-full lg:w-[300px] lg:sticky lg:top-6 space-y-3">
                            <div className="bg-white border border-slate-200/60 rounded-[1px] p-5 shadow-sm">
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel value="Category Context" className="text-slate-400 text-[11px]" />
                                        <div className="relative group">
                                            <SelectInput
                                                value={category.id}
                                                onChange={(e) => window.location.href = route('admin.categories.attributes.manage', e.target.value)}
                                                className="w-full bg-slate-50/50 border-slate-100 rounded-[1px] text-[12px] font-bold text-[#081621] h-9 px-2.5 focus:ring-0 focus:border-[#ef4a23] transition-all"
                                                options={categories.map(c => ({ id: c.id, name: c.name }))}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <InputLabel value="Apply Preset" className="text-slate-400 text-[11px] mb-0" />
                                            <Link
                                                href={route('admin.categories.attribute-presets.index')}
                                                target="_blank"
                                                className="text-[10px] font-bold text-[#ef4a23] hover:text-[#081621] transition-colors"
                                            >
                                                Manage &rarr;
                                            </Link>
                                        </div>
                                        <div className="space-y-2">
                                            <SelectInput
                                                value={selectedPresetId}
                                                onChange={(e) => setSelectedPresetId(e.target.value)}
                                                className="w-full bg-slate-50/50 border-slate-100 rounded-[1px] text-[12px] font-bold text-[#081621] h-[38px] px-2.5 focus:ring-4 focus:ring-[#ef4a23]/5 focus:border-[#ef4a23] transition-all"
                                                placeholder="Select template..."
                                                options={dynamicPresets.map(p => ({ id: p.id, name: p.name }))}
                                            />
                                            <Button
                                                type="button"
                                                onClick={applyPreset}
                                                className="w-full h-8 bg-slate-100 hover:bg-[#ef4a23] text-slate-600 hover:text-white rounded-[1px] text-[11px] font-bold transition-all flex items-center justify-center gap-2 group"
                                            >
                                                <RefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                                Load Template
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-50">
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-300">Active Fields</span>
                                            <span className="text-slate-500">{data.attributes.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Canvas: Attributes Editor */}
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h2 className="text-[14px] font-bold text-[#081621]">Defined Fields</h2>
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="text-[12px] font-bold text-[#ef4a23] hover:text-[#081621] transition-colors flex items-center gap-1.5"
                                >
                                    <Plus size={14} /> Add New Attribute
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.attributes.length > 0 ? (
                                    data.attributes.map((attr, idx) => (
                                        <div key={idx} className={cn(
                                            "bg-white border rounded-[1px] p-5 transition-all relative group shadow-sm",
                                            attr.is_editing ? "border-[#ef4a23]/30 ring-1 ring-[#ef4a23]/5" : "border-slate-200/60"
                                        )}>

                                            {/* Absolute Actions for Professional Look */}
                                            <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleEditing(idx)}
                                                    className={cn(
                                                        "w-7 h-7 rounded-[1px] transition-all duration-200",
                                                        attr.is_editing
                                                            ? "bg-[#ef4a23] text-white shadow-md shadow-[#ef4a23]/20 hover:bg-[#ef4a23]/90"
                                                            : "text-slate-400 hover:text-[#081621] hover:bg-slate-100"
                                                    )}
                                                >
                                                    {attr.is_editing ? <Save size={13} /> : <Settings2 size={13} />}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeField(idx)}
                                                    className="w-7 h-7 text-slate-400 hover:text-white hover:bg-red-500 rounded-[1px] transition-all duration-200"
                                                >
                                                    <Trash2 size={13} />
                                                </Button>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="space-y-1">
                                                        <InputLabel value="Label Name" className="text-slate-400 text-[11px]" />
                                                        <TextInput
                                                            value={attr.name}
                                                            disabled={!attr.is_editing}
                                                            onChange={e => updateField(idx, 'name', e.target.value)}
                                                            className="h-[38px] border-slate-200 focus:border-[#ef4a23] focus:ring-4 focus:ring-[#ef4a23]/5 rounded-[2px] font-medium text-[13px]"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <InputLabel value="Technical Slug" className="text-slate-300 text-[11px]" />
                                                        <div className="h-[38px] flex items-center px-4 text-[11px] font-bold text-slate-300 bg-slate-50/30 rounded-[2px] border border-slate-100">
                                                            {attr.slug || 'auto-generated'}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <InputLabel value="Data Type" className="text-slate-400 text-[11px]" />
                                                        <SelectInput
                                                            value={attr.type}
                                                            disabled={!attr.is_editing}
                                                            onChange={e => updateField(idx, 'type', e.target.value)}
                                                            className="h-[38px] border-slate-200 focus:border-[#ef4a23] focus:ring-4 focus:ring-[#ef4a23]/5 rounded-[2px] font-medium text-[13px]"
                                                            options={[
                                                                { id: 'text', name: 'Text Input' },
                                                                { id: 'number', name: 'Numeric' },
                                                                { id: 'dropdown_single', name: 'Single Selection' },
                                                                { id: 'dropdown_multiple', name: 'Multi Selection' },
                                                                { id: 'boolean', name: 'Boolean (Yes/No)' },
                                                            ]}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <InputLabel value="Unit" className="text-slate-400 text-[11px]" />
                                                        <TextInput
                                                            value={attr.unit}
                                                            disabled={!attr.is_editing}
                                                            onChange={e => updateField(idx, 'unit', e.target.value)}
                                                            placeholder="GB, MHz, mAh"
                                                            className="h-[38px] border-slate-200 focus:border-[#ef4a23] focus:ring-4 focus:ring-[#ef4a23]/5 rounded-[2px] font-medium text-[13px]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sub-settings for selection types */}
                                            {(attr.type?.includes('dropdown') && attr.is_editing) && (
                                                <div className="mt-3 pt-3 border-t border-slate-50 animate-in slide-in-from-top-1 duration-300">
                                                    <InputLabel value="Options (Enter to add)" className="text-[10px] text-slate-400 mb-1.5" />
                                                    <div className="flex flex-wrap gap-1 p-2 bg-slate-50/30 rounded-[1px] border border-slate-100">
                                                        {attr.options ? attr.options.split('\n').filter(Boolean).map((opt, i) => (
                                                            <div key={i} className="flex items-center gap-1 bg-white border border-slate-100 px-1.5 py-0.5 rounded-[1px] text-[10px] font-bold text-[#081621]">
                                                                {opt}
                                                                <button type="button" onClick={() => removeOption(idx, i)} className="text-slate-300 hover:text-red-500">
                                                                    <X size={10} />
                                                                </button>
                                                            </div>
                                                        )) : (
                                                            <span className="text-[10px] text-slate-300 italic px-1"></span>
                                                        )}
                                                        <TextInput
                                                            type="text"
                                                            placeholder="..."
                                                            className="flex-1 min-w-[60px] bg-transparent border-none focus:ring-0 text-[10px] font-bold h-5 p-0"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    addOption(idx, e.target.value);
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Advanced Switches */}
                                            {attr.is_editing && (
                                                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-6">
                                                    <ToggleSwitch
                                                        enabled={attr.is_required}
                                                        onToggle={() => updateField(idx, 'is_required', !attr.is_required)}
                                                        label="Required"
                                                    />
                                                    <ToggleSwitch
                                                        enabled={attr.show_in_filter}
                                                        onToggle={() => updateField(idx, 'show_in_filter', !attr.show_in_filter)}
                                                        label="Filterable"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 border border-dashed border-slate-200 rounded-[1px] flex flex-col items-center justify-center bg-white text-center animate-in fade-in duration-700">
                                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <Sparkles size={18} className="text-[#ef4a23]/30" />
                                        </div>
                                        <h3 className="text-[13px] font-bold text-slate-700 mb-1">No specification schema</h3>
                                        <p className="text-[11px] text-slate-400 max-w-[260px] leading-normal mb-5">
                                            This category doesn't have any custom attributes defined yet.
                                        </p>
                                        <button
                                            onClick={addField}
                                            className="text-[11px] font-bold text-[#ef4a23] hover:text-[#081621] underline underline-offset-4 decoration-[#ef4a23]/30 hover:decoration-[#081621] transition-all"
                                        >
                                            + Create First Attribute Field
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoryAttributesPage;
