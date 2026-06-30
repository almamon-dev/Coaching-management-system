import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal/Modal';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import SecondaryButton from '@/Components/Button/SecondaryButton';
import Notify from '@/Utils/Notify';

export default function AssignmentModal({ isOpen, onClose, classes, sections, subjects }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        academic_class_id: '',
        section_id: '',
        subject_id: '',
        due_date: '',
        attachment: null,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            reset();
        }
    }, [isOpen]);

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.assignments.store'), {
            forceFormData: true,
            onSuccess: () => {
                onClose();
                Notify.success('Created', 'Assignment created successfully.');
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                <h2 className="text-[18px] font-bold text-[#202223] mb-4">Create New Assignment</h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-[12px] font-bold text-[#202223] mb-1">Title</label>
                        <TextInput
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full text-[13px] h-[36px]"
                            placeholder="E.g., Algebra Chapter 1 Exercise"
                            required
                        />
                        {errors.title && <div className="text-red-500 text-[11px] mt-1">{errors.title}</div>}
                    </div>
                    
                    <div>
                        <label className="block text-[12px] font-bold text-[#202223] mb-1">Description (Optional)</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full border-[#d1d1d1] focus:border-[#008060] focus:ring-[#008060] rounded-[4px] shadow-sm text-[13px]"
                            rows="3"
                            placeholder="Instructions for students..."
                        ></textarea>
                        {errors.description && <div className="text-red-500 text-[11px] mt-1">{errors.description}</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1">Class</label>
                            <SelectInput
                                value={data.academic_class_id}
                                onChange={e => setData('academic_class_id', e.target.value)}
                                options={classes}
                                placeholder="Select Class"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1">Section</label>
                            <SelectInput
                                value={data.section_id}
                                onChange={e => setData('section_id', e.target.value)}
                                options={sections.filter(s => String(s.academic_class_id) === String(data.academic_class_id))}
                                placeholder="Select Section"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1">Subject</label>
                            <SelectInput
                                value={data.subject_id}
                                onChange={e => setData('subject_id', e.target.value)}
                                options={subjects}
                                placeholder="Select Subject"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1">Due Date</label>
                            <TextInput
                                type="date"
                                value={data.due_date}
                                onChange={e => setData('due_date', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[12px] font-bold text-[#202223] mb-1">Attachment (Optional)</label>
                        <input
                            type="file"
                            onChange={e => setData('attachment', e.target.files[0])}
                            className="block w-full text-[13px] text-[#6d7175] file:mr-4 file:py-2 file:px-4 file:rounded-[4px] file:border-0 file:text-[12px] file:font-semibold file:bg-[#f1f8f5] file:text-[#008060] hover:file:bg-[#e4f1ec] transition-colors cursor-pointer border border-[#d1d1d1] rounded-[4px] p-1"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                        />
                        {errors.attachment && <div className="text-red-500 text-[11px] mt-1">{errors.attachment}</div>}
                        <p className="text-[11px] text-[#6d7175] mt-1">Allowed formats: PDF, DOC, JPG, PNG, ZIP. Max size: 10MB.</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#ebebeb]">
                        <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing} className="bg-[#008060] hover:bg-[#006e52]">
                            Save Assignment
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
