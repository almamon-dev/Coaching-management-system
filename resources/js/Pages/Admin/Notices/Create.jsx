import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';
import Input from '@/Components/ui/Input';
import Label from '@/Components/ui/Label';
import Select from '@/Components/ui/Select';
import Notify from '@/Utils/Notify';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        type: 'notice',
        target_audience: 'all',
        status: 'published',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.notices.store'), {
            onSuccess: () => {
                // Success is handled via flash in layout
            },
            onError: (err) => {
                if(Object.keys(err).length > 0) {
                    Notify.error('Validation Error', 'Please check the form for errors.');
                }
            }
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Create Notice" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.notices.index')} className="p-2 border border-[#ebebeb] rounded shadow-sm hover:bg-slate-50 transition-colors text-[#202223]">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Create Notice</h1>
                        <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Publish a new notice or announcement to the school.</p>
                    </div>
                </div>
                <button
                    type="submit"
                    form="createNoticeForm"
                    disabled={processing}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm disabled:opacity-70"
                >
                    <Save size={14} strokeWidth={2.5} /> Save Notice
                </button>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] max-w-3xl">
                <form id="createNoticeForm" onSubmit={submit} className="p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="title" value="Notice Title" required />
                                <Input
                                    id="title"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="e.g. Eid-ul-Fitr Holiday Announcement"
                                    required
                                />
                                {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                            </div>

                            <div>
                                <Label htmlFor="type" value="Notice Type" required />
                                <Select
                                    id="type"
                                    className="mt-1 block w-full"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    required
                                    options={[
                                        { value: 'notice', label: 'Notice' },
                                        { value: 'announcement', label: 'Announcement' }
                                    ]}
                                />
                                {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type}</div>}
                            </div>

                            <div>
                                <Label htmlFor="target_audience" value="Target Audience" required />
                                <Select
                                    id="target_audience"
                                    className="mt-1 block w-full"
                                    value={data.target_audience}
                                    onChange={e => setData('target_audience', e.target.value)}
                                    required
                                    options={[
                                        { value: 'all', label: 'All Users (Public)' },
                                        { value: 'teacher', label: 'Teachers Only' },
                                        { value: 'student', label: 'Students Only' }
                                    ]}
                                />
                                {errors.target_audience && <div className="text-red-500 text-xs mt-1">{errors.target_audience}</div>}
                            </div>
                            
                            <div className="md:col-span-2">
                                <Label htmlFor="content" value="Notice Content" required />
                                <textarea
                                    id="content"
                                    rows="6"
                                    className="mt-1 block w-full border-[#d2d5d8] rounded-[3px] shadow-sm focus:border-[#008060] focus:ring focus:ring-[#008060] focus:ring-opacity-20 text-[13px]"
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    placeholder="Write the full description of the notice here..."
                                    required
                                ></textarea>
                                {errors.content && <div className="text-red-500 text-xs mt-1">{errors.content}</div>}
                            </div>

                            <div>
                                <Label htmlFor="status" value="Publish Status" required />
                                <Select
                                    id="status"
                                    className="mt-1 block w-full"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    required
                                    options={[
                                        { value: 'published', label: 'Published (Immediate)' },
                                        { value: 'draft', label: 'Draft (Save for later)' }
                                    ]}
                                />
                                {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                                <p className="text-xs text-slate-500 mt-1">Published notices will immediately notify the target audience.</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
