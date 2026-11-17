import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Plus, Edit, Trash2, MapPin, Clock, X, Image as ImageIcon } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import SecondaryButton from '@/Components/Button/SecondaryButton';
import ImageUpload from '@/Components/Form/ImageUpload';

export default function EventsIndex({ events }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        date: '',
        time: '10:00 AM',
        location: 'Campus Ground',
        color: 'rose',
        image: null,
        description: '',
        status: 'published',
    });

    const openCreateModal = () => {
        setEditingEvent(null);
        reset();
        setData({
            title: '',
            date: '',
            time: '10:00 AM',
            location: 'Campus Ground',
            color: 'rose',
            image: null,
            description: '',
            status: 'published',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (event) => {
        setEditingEvent(event);
        setData({
            title: event.title || '',
            date: event.date ? event.date.substring(0, 10) : '',
            time: event.time || '',
            location: event.location || '',
            color: event.color || 'rose',
            image: event.image || null,
            description: event.description || '',
            status: event.status || 'published',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingEvent) {
            if (data.image instanceof File) {
                router.post(route('admin.events.update', editingEvent.id), {
                    ...data,
                    _method: 'put',
                }, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        reset();
                    },
                });
            } else {
                put(route('admin.events.update', editingEvent.id), {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        reset();
                    },
                });
            }
        } else {
            post(route('admin.events.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(route('admin.events.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Website Events Management" />

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
                            Website Events Management
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage upcoming seminars, festivals, and campus sports events displayed on the public landing page.
                        </p>
                    </div>

                    <PrimaryButton
                        onClick={openCreateModal}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-xs h-[36px] px-4 flex items-center gap-2 rounded-[3px]"
                    >
                        <Plus size={16} />
                        <span>Add New Event</span>
                    </PrimaryButton>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {events.data && events.data.length > 0 ? (
                        events.data.map((evt) => (
                            <div 
                                key={evt.id} 
                                className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-emerald-300 transition-all group"
                            >
                                <div>
                                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                                        <img
                                            src={evt.image || '/images/event_harvest.png'}
                                            alt={evt.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.currentTarget.src = '/images/event_harvest.png'; }}
                                        />
                                        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold rounded-[2px] uppercase tracking-wider text-white shadow-xs ${
                                            evt.status === 'published' ? 'bg-[#16a34a]' : 'bg-slate-600'
                                        }`}>
                                            {evt.status}
                                        </span>
                                    </div>

                                    <div className="p-4 space-y-2">
                                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                                            <span className="flex items-center gap-1 text-[#16a34a] font-bold">
                                                <Calendar size={13} />
                                                <span>{evt.date ? new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}</span>
                                            </span>
                                            {evt.time && (
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    <span>{evt.time}</span>
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-[#16a34a] transition-colors">
                                            {evt.title}
                                        </h3>

                                        {evt.location && (
                                            <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                                                <MapPin size={12} className="text-slate-400 shrink-0" />
                                                <span>{evt.location}</span>
                                            </p>
                                        )}

                                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                            {evt.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-3 border-t border-slate-100 flex items-center justify-end gap-1 bg-slate-50/50">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(evt)}
                                        className="p-1.5 text-slate-600 hover:text-[#16a34a] hover:bg-emerald-50 rounded-[3px] transition-colors cursor-pointer"
                                        title="Edit Event"
                                    >
                                        <Edit size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(evt.id)}
                                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-[3px] transition-colors cursor-pointer"
                                        title="Delete Event"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-12 text-center bg-white rounded-[4px] border border-dashed border-slate-300 text-slate-500 text-xs">
                            No events found. Click "Add New Event" to create one.
                        </div>
                    )}
                </div>

                {/* Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                        <div className="bg-white rounded-[4px] border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 text-xs my-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        {editingEvent ? 'Edit Event' : 'Add New Event'}
                                    </h2>
                                    <p className="text-[11px] text-slate-500">Provide event scheduling information for the website.</p>
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
                                    <InputLabel value="Event Title *" />
                                    <TextInput
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Annual Sports Day 2027"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Date *" />
                                        <TextInput
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.date} />
                                    </div>
                                    <div>
                                        <InputLabel value="Time (e.g. 10:00 AM)" />
                                        <TextInput
                                            value={data.time}
                                            onChange={(e) => setData('time', e.target.value)}
                                            placeholder="10:00 AM"
                                        />
                                        <InputError message={errors.time} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Location / Venue" />
                                        <TextInput
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="e.g. Main Auditorium"
                                        />
                                        <InputError message={errors.location} />
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
                                    <InputLabel value="Accent Color Theme" />
                                    <SelectInput
                                        value={data.color}
                                        onChange={(val) => setData('color', val)}
                                        options={[
                                            { id: 'rose', name: 'Rose Red' },
                                            { id: 'emerald', name: 'Emerald Green' },
                                            { id: 'blue', name: 'Royal Blue' },
                                            { id: 'amber', name: 'Amber Gold' }
                                        ]}
                                    />
                                    <InputError message={errors.color} />
                                </div>

                                <div>
                                    <ImageUpload
                                        label="Event Cover Image"
                                        value={data.image}
                                        onChange={(file) => setData('image', file)}
                                        recommended="Recommended: 800x500px (16:9 ratio)"
                                        placeholder="Upload or drag event cover photo here"
                                        aspectRatio="video"
                                        error={errors.image}
                                    />
                                </div>

                                <div>
                                    <InputLabel value="Event Description *" />
                                    <TextArea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        placeholder="Detailed event summary and invite..."
                                        required
                                    />
                                    <InputError message={errors.description} />
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
                                        {editingEvent ? 'Update Event' : 'Create Event'}
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
