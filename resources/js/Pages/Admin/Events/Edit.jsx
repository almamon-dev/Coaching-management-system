import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';

export default function Edit({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: event.title || '',
        description: event.description || '',
        image: null,
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        contact_person: event.contact_person || '',
        contact_phone: event.contact_phone || '',
        registration_required: event.registration_required || 'no',
        registration_deadline: event.registration_deadline || '',
        status: event.status || 'pending',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.events.update', event.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Event" />
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.events.index')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={18} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Edit Event</h1>
                        <p className="text-[13px] text-[#6d7175] mt-0.5 font-medium">Update event information</p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Event Title *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                            placeholder="e.g. Annual Science Fair"
                        />
                        {errors.title && <p className="text-red-500 text-[11px] mt-1">{errors.title}</p>}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Description *</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060] min-h-[120px]"
                            placeholder="Event details..."
                        />
                        {errors.description && <p className="text-red-500 text-[11px] mt-1">{errors.description}</p>}
                    </div>

                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Event Date *</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                        />
                        {errors.date && <p className="text-red-500 text-[11px] mt-1">{errors.date}</p>}
                    </div>

                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Event Time</label>
                        <input
                            type="time"
                            value={data.time}
                            onChange={e => setData('time', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                        />
                        {errors.time && <p className="text-red-500 text-[11px] mt-1">{errors.time}</p>}
                    </div>

                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Location *</label>
                        <input
                            type="text"
                            value={data.location}
                            onChange={e => setData('location', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                            placeholder="e.g. Main Auditorium"
                        />
                        {errors.location && <p className="text-red-500 text-[11px] mt-1">{errors.location}</p>}
                    </div>

                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Status *</label>
                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                        >
                            <option value="pending">Pending</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-[11px] mt-1">{errors.status}</p>}
                    </div>

                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Contact Person</label>
                        <input
                            type="text"
                            value={data.contact_person}
                            onChange={e => setData('contact_person', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                        />
                        {errors.contact_person && <p className="text-red-500 text-[11px] mt-1">{errors.contact_person}</p>}
                    </div>

                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Contact Phone</label>
                        <input
                            type="text"
                            value={data.contact_phone}
                            onChange={e => setData('contact_phone', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                        />
                        {errors.contact_phone && <p className="text-red-500 text-[11px] mt-1">{errors.contact_phone}</p>}
                    </div>
                    
                    <div className="col-span-1">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Registration Required *</label>
                        <select
                            value={data.registration_required}
                            onChange={e => setData('registration_required', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                        >
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {errors.registration_required && <p className="text-red-500 text-[11px] mt-1">{errors.registration_required}</p>}
                    </div>

                    {data.registration_required === 'yes' && (
                        <div className="col-span-1">
                            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Registration Deadline</label>
                            <input
                                type="date"
                                value={data.registration_deadline}
                                onChange={e => setData('registration_deadline', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                            />
                            {errors.registration_deadline && <p className="text-red-500 text-[11px] mt-1">{errors.registration_deadline}</p>}
                        </div>
                    )}
                    
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Event Image (Optional - Upload to replace)</label>
                        {event.image && (
                            <div className="mb-2">
                                <img src={`/storage/${event.image}`} alt="Event" className="h-20 w-32 object-cover rounded" />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={e => setData('image', e.target.files[0])}
                            className="w-full px-3 py-2 border border-slate-300 rounded-[3px] text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
                            accept="image/*"
                        />
                        {errors.image && <p className="text-red-500 text-[11px] mt-1">{errors.image}</p>}
                    </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
                    <Link href={route('admin.events.index')}>
                        <button type="button" className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-[3px] hover:bg-slate-50 transition-colors shadow-sm">
                            Cancel
                        </button>
                    </Link>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="px-4 py-2 text-[13px] font-medium text-white bg-[#3151fe] rounded-[3px] hover:bg-[#1a39d1] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                    >
                        <Save size={14} /> Update Event
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
