import React from 'react';
import { useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Plus, Trash2, Layers } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Notify from '@/Utils/Notify';
import { cn } from '@/lib/utils';

export default function AcademicClassForm({ academic_class = null }) {
    const isEdit = !!academic_class;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: academic_class?.name || '',
        numeric_value: academic_class?.numeric_value || '',
        sections: academic_class?.sections?.length > 0 
            ? academic_class.sections.map(s => ({ id: s.id, name: s.name, capacity: s.capacity })) 
            : [{ name: '', capacity: 40 }]
    });

    const handleAddSection = () => {
        setData('sections', [...data.sections, { name: '', capacity: 40 }]);
    };

    const handleRemoveSection = (index) => {
        const newSections = [...data.sections];
        newSections.splice(index, 1);
        setData('sections', newSections);
    };

    const handleSectionChange = (index, field, value) => {
        const newSections = [...data.sections];
        newSections[index][field] = value;
        setData('sections', newSections);
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(route('admin.classes.update', academic_class.id), {
                onSuccess: () => Notify.success('Updated', 'Class and Sections updated successfully.'),
            });
        } else {
            post(route('admin.classes.store'), {
                onSuccess: () => Notify.success('Created', 'Class and Sections created successfully.'),
            });
        }
    };

    return (
        <form onSubmit={submit} className="max-w-5xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Class Details Panel */}
                <div className="md:col-span-5 space-y-6">
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-5">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                            <Layers size={18} className="text-[#008060]" />
                            <h3 className="text-[15px] font-bold text-slate-800">Class Information</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Class Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g., Class One, Standard 10"
                                    className={cn(
                                        "w-full h-[40px] px-3 bg-white border rounded-[4px] text-[14px] text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-[#008060]/20",
                                        errors.name ? "border-red-400 focus:border-red-400" : "border-slate-300 focus:border-[#008060]"
                                    )}
                                />
                                {errors.name && <p className="text-[12px] text-red-500 mt-1 font-medium">{errors.name}</p>}
                                <p className="text-[11px] text-slate-500 mt-1">The display name of the class (e.g. Class Six).</p>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Numeric Value <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    value={data.numeric_value}
                                    onChange={e => setData('numeric_value', e.target.value)}
                                    placeholder="e.g., 1, 6, 10"
                                    min="1"
                                    className={cn(
                                        "w-full h-[40px] px-3 bg-white border rounded-[4px] text-[14px] text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-[#008060]/20",
                                        errors.numeric_value ? "border-red-400 focus:border-red-400" : "border-slate-300 focus:border-[#008060]"
                                    )}
                                />
                                {errors.numeric_value && <p className="text-[12px] text-red-500 mt-1 font-medium">{errors.numeric_value}</p>}
                                <p className="text-[11px] text-slate-500 mt-1">Used for sorting classes in ascending order.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections Panel */}
                <div className="md:col-span-7">
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-5 h-full">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <h3 className="text-[15px] font-bold text-slate-800">Associated Sections</h3>
                                <span className="bg-[#e4f1ef] text-[#008060] px-2 py-0.5 rounded-full text-[11px] font-bold">
                                    {data.sections.length} Sections
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddSection}
                                className="h-[28px] px-3 bg-white border border-slate-300 text-slate-700 rounded-[3px] text-[12px] font-bold hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center gap-1.5 shadow-sm"
                            >
                                <Plus size={14} /> Add Section
                            </button>
                        </div>

                        <div className="space-y-3 mt-4">
                            {data.sections.map((section, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 border border-slate-200 rounded-[4px] bg-slate-50/50 hover:bg-slate-50 transition-colors relative group">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Section Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={section.name}
                                                onChange={e => handleSectionChange(index, 'name', e.target.value)}
                                                placeholder="e.g. A, Rose, Morning"
                                                className={cn(
                                                    "w-full h-[36px] px-3 bg-white border rounded-[3px] text-[13px] text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-[#008060]/20",
                                                    errors[`sections.${index}.name`] ? "border-red-400 focus:border-red-400" : "border-slate-300 focus:border-[#008060]"
                                                )}
                                                required
                                            />
                                            {errors[`sections.${index}.name`] && <p className="text-[11px] text-red-500 mt-1">{errors[`sections.${index}.name`]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Capacity</label>
                                            <input
                                                type="number"
                                                value={section.capacity}
                                                onChange={e => handleSectionChange(index, 'capacity', e.target.value)}
                                                placeholder="e.g. 40"
                                                min="1"
                                                className="w-full h-[36px] px-3 bg-white border border-slate-300 rounded-[3px] text-[13px] text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-[22px]">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSection(index)}
                                            className="h-[36px] w-[36px] flex items-center justify-center bg-white border border-slate-200 text-[#ff4d4f] rounded-[3px] hover:bg-[#fff1f0] hover:border-[#ff4d4f] transition-all cursor-pointer opacity-50 group-hover:opacity-100"
                                            title="Remove Section"
                                            disabled={data.sections.length === 1}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {data.sections.length === 0 && (
                                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-[4px]">
                                    <p className="text-[13px] font-medium text-slate-500">No sections added yet.</p>
                                    <button
                                        type="button"
                                        onClick={handleAddSection}
                                        className="mt-2 text-[13px] font-bold text-[#008060] hover:underline"
                                    >
                                        + Add the first section
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="h-[44px] px-8 bg-[#008060] text-white rounded-[4px] text-[14px] font-bold shadow hover:bg-[#006e52] transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    <Save size={18} />
                    {isEdit ? 'Update Class & Sections' : 'Save Class & Sections'}
                </button>
            </div>
        </form>
    );
}
