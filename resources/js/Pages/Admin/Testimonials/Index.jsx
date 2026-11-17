import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Award, Plus, Edit, Trash2, Quote, X } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import SecondaryButton from '@/Components/Button/SecondaryButton';

export default function TestimonialsIndex({ testimonials }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        institution: '',
        batch: 'HSC Science Batch',
        badge: 'GPA 5.00 (Golden A+)',
        quote: '',
        initials: '',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        sort_order: 1,
        status: 'published',
    });

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setData({
            name: item.name || '',
            institution: item.institution || '',
            batch: item.batch || '',
            badge: item.badge || '',
            quote: item.quote || '',
            initials: item.initials || '',
            color: item.color || 'bg-emerald-100 text-emerald-800 border-emerald-300',
            sort_order: item.sort_order || 1,
            status: item.status || 'published',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            put(route('admin.testimonials.update', editingItem.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.testimonials.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this success story?')) {
            router.delete(route('admin.testimonials.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Student Success Stories Management" />

            <div className="w-full space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                                Website CMS
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                            Student Success Stories Management
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage student feedback, college placements, and achiever reviews displayed on the website.
                        </p>
                    </div>

                    <PrimaryButton
                        onClick={openCreateModal}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[36px] px-4 flex items-center gap-2 rounded-[3px]"
                    >
                        <Plus size={16} />
                        <span>Add Success Story</span>
                    </PrimaryButton>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {testimonials.data && testimonials.data.length > 0 ? (
                        testimonials.data.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-white p-4 sm:p-5 rounded-[4px] border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all group"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-[2px] text-[10px] font-bold">
                                            <Award size={11} className="text-amber-600 shrink-0" />
                                            <span>{item.badge}</span>
                                        </span>
                                        <Quote size={16} className="text-emerald-400 shrink-0" />
                                    </div>

                                    <p className="text-xs text-slate-600 italic line-clamp-4 leading-relaxed">
                                        "{item.quote}"
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${item.color}`}>
                                            {item.initials || item.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-[#16a34a] transition-colors">{item.name}</h4>
                                            <p className="text-[10px] text-[#16a34a] truncate font-medium">{item.institution}</p>
                                            <p className="text-[9.5px] text-slate-400 font-mono truncate">{item.batch}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(item)}
                                            className="p-1 text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50 rounded-[3px] transition-colors cursor-pointer"
                                            title="Edit Story"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-[3px] transition-colors cursor-pointer"
                                            title="Delete Story"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-12 text-center bg-white rounded-[4px] border border-dashed border-slate-300 text-slate-500 text-xs">
                            No success stories found. Click "Add Success Story" to create one.
                        </div>
                    )}
                </div>

                {/* Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[4px] border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        {editingItem ? 'Edit Success Story' : 'Add Success Story'}
                                    </h2>
                                    <p className="text-[11px] text-slate-500">Provide student feedback and academic achievement data.</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)} 
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-[3px] cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <InputLabel value="Student Name *" />
                                    <TextInput
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Ariful Islam"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="College / School" />
                                        <TextInput
                                            value={data.institution}
                                            onChange={(e) => setData('institution', e.target.value)}
                                            placeholder="e.g. Dhaka College"
                                        />
                                        <InputError message={errors.institution} />
                                    </div>
                                    <div>
                                        <InputLabel value="Batch" />
                                        <TextInput
                                            value={data.batch}
                                            onChange={(e) => setData('batch', e.target.value)}
                                            placeholder="e.g. HSC Science Batch"
                                        />
                                        <InputError message={errors.batch} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Achievement Badge" />
                                        <TextInput
                                            value={data.badge}
                                            onChange={(e) => setData('badge', e.target.value)}
                                            placeholder="e.g. GPA 5.00 (Golden A+)"
                                        />
                                        <InputError message={errors.badge} />
                                    </div>
                                    <div>
                                        <InputLabel value="Publication Status" />
                                        <SelectInput
                                            value={data.status}
                                            onChange={(val) => setData('status', val)}
                                            options={[
                                                { id: 'published', name: 'Published (Visible on Web)' },
                                                { id: 'draft', name: 'Draft (Hidden)' }
                                            ]}
                                        />
                                        <InputError message={errors.status} />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel value="Review / Quote *" />
                                    <TextArea
                                        value={data.quote}
                                        onChange={(e) => setData('quote', e.target.value)}
                                        rows={3}
                                        placeholder="Student's feedback or success experience with our center..."
                                        required
                                    />
                                    <InputError message={errors.quote} />
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-[36px] px-4 text-xs rounded-[3px]"
                                    >
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[36px] px-5 rounded-[3px]"
                                    >
                                        {editingItem ? 'Update Story' : 'Save Story'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
