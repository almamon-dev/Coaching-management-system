import React, { useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, FileText, Check, AlertTriangle } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Generate({ auth, classes, feeGroups }) {
    const { data, setData, post, processing, errors } = useForm({
        academic_class_id: '',
        fee_group_id: '',
        title: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        note: ''
    });

    // Filter groups by selected class
    const availableGroups = useMemo(() => {
        if (!data.academic_class_id) return [];
        return feeGroups.filter(g => g.academic_class_id == data.academic_class_id || g.academic_class_id === null);
    }, [data.academic_class_id, feeGroups]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.fee-invoices.bulk-store'));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.fee-invoices.index')} className="w-8 h-8 flex items-center justify-center rounded-[3px] border border-[#d1d1d1] bg-white text-[#6d7175] hover:text-[#202223] hover:border-[#8c9196] transition-all">
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h2 className="text-[18px] font-bold text-[#202223] tracking-tight">Generate Bulk Invoices</h2>
                            <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Create fee invoices for all students in a class.</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Generate Bulk Invoices" />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={submit} className="bg-white rounded-[4px] shadow-sm border border-[#ebebeb] p-6">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#ebebeb]">
                        <div className="w-8 h-8 rounded-full bg-[#e4f1ef] flex items-center justify-center text-[#008060]">
                            <FileText size={16} />
                        </div>
                        <h3 className="text-[14px] font-bold text-[#202223]">Invoice Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1.5">Academic Class <span className="text-red-500">*</span></label>
                            <SelectInput
                                value={data.academic_class_id}
                                onChange={e => {
                                    setData(prev => ({
                                        ...prev, 
                                        academic_class_id: e.target.value,
                                        fee_group_id: '' // reset group
                                    }));
                                }}
                                options={[{ id: '', name: 'Select Class...' }, ...classes.map(c => ({ id: c.id, name: c.name }))]}
                                className="w-full h-[36px]"
                            />
                            {errors.academic_class_id && <p className="text-[11px] text-red-500 mt-1">{errors.academic_class_id}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1.5">Fee Package / Group <span className="text-red-500">*</span></label>
                            <SelectInput
                                value={data.fee_group_id}
                                onChange={e => setData('fee_group_id', e.target.value)}
                                options={[{ id: '', name: 'Select Package...' }, ...availableGroups.map(g => ({ id: g.id, name: g.name }))]}
                                className="w-full h-[36px]"
                                disabled={!data.academic_class_id}
                            />
                            {errors.fee_group_id && <p className="text-[11px] text-red-500 mt-1">{errors.fee_group_id}</p>}
                            {!data.academic_class_id && <p className="text-[11px] text-[#6d7175] mt-1 italic">Select a class first to view available packages.</p>}
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-[12px] font-bold text-[#202223] mb-1.5">Invoice Title <span className="text-red-500">*</span></label>
                        <TextInput
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="e.g. Monthly Fee - January 2026"
                            className="w-full h-[36px]"
                        />
                        {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1.5">Invoice Date <span className="text-red-500">*</span></label>
                            <TextInput
                                type="date"
                                value={data.invoice_date}
                                onChange={e => setData('invoice_date', e.target.value)}
                                className="w-full h-[36px]"
                            />
                            {errors.invoice_date && <p className="text-[11px] text-red-500 mt-1">{errors.invoice_date}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1.5">Due Date <span className="text-red-500">*</span></label>
                            <TextInput
                                type="date"
                                value={data.due_date}
                                onChange={e => setData('due_date', e.target.value)}
                                className="w-full h-[36px]"
                            />
                            {errors.due_date && <p className="text-[11px] text-red-500 mt-1">{errors.due_date}</p>}
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-[12px] font-bold text-[#202223] mb-1.5">Additional Notes (Optional)</label>
                        <textarea
                            value={data.note}
                            onChange={e => setData('note', e.target.value)}
                            className="w-full border border-[#d1d1d1] rounded-[3px] focus:border-[#008060] focus:ring-0 text-[13px] p-2 resize-y min-h-[80px]"
                            placeholder="Visible on the invoice..."
                        />
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-[4px] p-3 mb-6 flex gap-3 items-start">
                        <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                        <div className="text-[12px] text-amber-800">
                            <strong>Note:</strong> Generating bulk invoices will create individual billing records for <em>all active students</em> in the selected class. This action cannot be undone, but you can manually cancel or delete invoices later if no payment is received.
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#ebebeb] flex justify-end">
                        <PrimaryButton
                            type="submit"
                            disabled={processing || !data.academic_class_id || !data.fee_group_id}
                            className="h-[36px] px-6 !bg-[#008060] hover:!bg-[#006e52] text-white font-bold text-[13px] tracking-wide"
                        >
                            {processing ? 'Generating...' : 'Generate Invoices'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
