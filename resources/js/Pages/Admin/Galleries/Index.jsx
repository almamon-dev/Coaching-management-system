import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Image as ImageIcon, Plus, Edit, Trash2, X } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import SecondaryButton from '@/Components/Button/SecondaryButton';
import ImageUpload from '@/Components/Form/ImageUpload';

export default function GalleriesIndex({ galleries }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        category: 'SPORTS',
        image: null,
        sort_order: 1,
        status: 'published',
    });

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setData({
            title: '',
            category: 'SPORTS',
            image: null,
            sort_order: 1,
            status: 'published',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setData({
            title: item.title || '',
            category: item.category || 'SPORTS',
            image: item.image || null,
            sort_order: item.sort_order || 1,
            status: item.status || 'published',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            if (data.image instanceof File) {
                router.post(route('admin.galleries.update', editingItem.id), {
                    ...data,
                    _method: 'put',
                }, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        reset();
                    },
                });
            } else {
                put(route('admin.galleries.update', editingItem.id), {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        reset();
                    },
                });
            }
        } else {
            post(route('admin.galleries.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this photo from the gallery?')) {
            router.delete(route('admin.galleries.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Website Photo Gallery Management" />

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
                            School Life & Gallery Management
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage photos displayed in the "School Life & Activities" bento grid on the landing page.
                        </p>
                    </div>

                    <PrimaryButton
                        onClick={openCreateModal}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[36px] px-4 flex items-center gap-2 rounded-[3px]"
                    >
                        <Plus size={16} />
                        <span>Add New Photo</span>
                    </PrimaryButton>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {galleries.data && galleries.data.length > 0 ? (
                        galleries.data.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-emerald-300 transition-all group"
                            >
                                <div>
                                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                                        <img
                                            src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.currentTarget.src = '/images/coaching/coaching_01.jpg'; }}
                                        />
                                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#009ca6] text-white text-[10px] font-bold rounded-[2px] uppercase tracking-wider shadow-xs">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="p-3.5 space-y-1">
                                        <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1 group-hover:text-[#16a34a] transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span>Order: #{item.sort_order}</span>
                                            <span className={`capitalize font-semibold ${item.status === 'published' ? 'text-[#16a34a]' : 'text-slate-400'}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 border-t border-slate-100 flex items-center justify-end gap-1 bg-slate-50/50">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(item)}
                                        className="p-1.5 text-slate-600 hover:text-[#16a34a] hover:bg-emerald-50 rounded-[3px] transition-colors cursor-pointer"
                                        title="Edit Photo"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-[3px] transition-colors cursor-pointer"
                                        title="Delete Photo"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-12 text-center bg-white rounded-[4px] border border-dashed border-slate-300 text-slate-500 text-xs">
                            No gallery photos found. Click "Add New Photo" to create one.
                        </div>
                    )}
                </div>

                {/* Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                        <div className="bg-white rounded-[4px] border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-5 text-xs my-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        {editingItem ? 'Edit Gallery Photo' : 'Add New Photo'}
                                    </h2>
                                    <p className="text-[11px] text-slate-500">Provide photo details for the website gallery grid.</p>
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
                                    <InputLabel value="Photo Title *" />
                                    <TextInput
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Annual Athletics Meet"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Category Tag *" />
                                        <SelectInput
                                            value={data.category}
                                            onChange={(val) => setData('category', val)}
                                            options={[
                                                { id: 'SPORTS', name: 'SPORTS' },
                                                { id: 'CULTURE', name: 'CULTURE' },
                                                { id: 'ACADEMICS', name: 'ACADEMICS' },
                                                { id: 'FACILITIES', name: 'FACILITIES' },
                                                { id: 'CAMPUS', name: 'CAMPUS' }
                                            ]}
                                        />
                                        <InputError message={errors.category} />
                                    </div>
                                    <div>
                                        <InputLabel value="Display Order" />
                                        <TextInput
                                            type="number"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', parseInt(e.target.value) || 1)}
                                        />
                                        <InputError message={errors.sort_order} />
                                    </div>
                                </div>

                                <div>
                                    <ImageUpload
                                        label="Gallery Photo *"
                                        value={data.image}
                                        onChange={(file) => setData('image', file)}
                                        recommended="Recommended: 800x600px (4:3) or 16:9 banner"
                                        placeholder="Upload or drag gallery photo here"
                                        aspectRatio="video"
                                        error={errors.image}
                                    />
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
                                        {editingItem ? 'Update Photo' : 'Save Photo'}
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
