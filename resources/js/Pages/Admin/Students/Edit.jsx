import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, User, Save, BookOpen, Calendar, Clock, CheckCircle } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';

export default function StudentEdit({ student, courses = [], batches = [] }) {
    const initialBatchIds = (student.batches && student.batches.length > 0)
        ? student.batches.map(b => b.id)
        : (student.batch_id ? [student.batch_id] : []);

    const { data, setData, put, processing, errors } = useForm({
        name: student.name || '',
        dob: student.dob || '',
        gender: student.gender || 'male',
        phone: student.phone || '',
        email: student.email || '',
        address: student.address || '',
        guardian_name: student.guardian_name || '',
        guardian_phone: student.guardian_phone || '',
        school_college: student.school_college || '',
        batch_ids: initialBatchIds,
        course_id: student.course_id || '',
        batch_id: student.batch_id || '',
        status: student.status || 'active',
        notes: student.notes || '',
    });

    const selectedBatches = batches.filter(b => data.batch_ids.includes(b.id));
    const totalMonthlyFee = selectedBatches.reduce((sum, b) => {
        const c = courses.find(course => String(course.id) === String(b.course_id));
        return sum + Number(c?.fee || 0);
    }, 0);

    const handleCourseBatchToggle = (courseId, batchId) => {
        let currentBatchIds = [...data.batch_ids];
        const existingBatchForCourse = batches.find(
            b => String(b.course_id) === String(courseId) && currentBatchIds.includes(b.id)
        );

        if (batchId === '' || batchId === null) {
            if (existingBatchForCourse) {
                currentBatchIds = currentBatchIds.filter(id => id !== existingBatchForCourse.id);
            }
        } else {
            if (existingBatchForCourse) {
                currentBatchIds = currentBatchIds.filter(id => id !== existingBatchForCourse.id);
            }
            currentBatchIds.push(Number(batchId));
        }

        const primaryBatch = batches.find(b => b.id === currentBatchIds[0]);

        setData(prev => ({
            ...prev,
            batch_ids: currentBatchIds,
            batch_id: primaryBatch?.id || '',
            course_id: primaryBatch?.course_id || '',
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.students.update', student.id));
    };

    const statusOptions = [
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
        { id: 'passed_out', name: 'Passed Out' },
        { id: 'dropped', name: 'Dropped' },
    ];

    const genderOptions = [
        { id: 'male', name: 'Male' },
        { id: 'female', name: 'Female' },
        { id: 'other', name: 'Other' },
    ];

    return (
        <AdminLayout>
            <Head title={`Edit Student - ${student.name}`} />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Student</h1>
                    <p className="text-sm text-slate-500">Update student profile, guardian details & enrolled subjects/batches.</p>
                </div>
                <Link
                    href={route('admin.students.show', student.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                >
                    <ArrowLeft size={15} /> Back to Profile
                </Link>
            </div>

            <form onSubmit={submit} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm max-w-4xl space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <User size={16} className="text-emerald-600" /> Student Profile (ID: {student.student_id})
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {student.student_id}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="name" value="Full Name *" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="gender" value="Gender *" />
                        <SelectInput
                            id="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            options={genderOptions}
                            required
                        />
                        <InputError message={errors.gender} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="dob" value="Date of Birth" />
                        <TextInput
                            id="dob"
                            type="date"
                            value={data.dob}
                            onChange={(e) => setData('dob', e.target.value)}
                        />
                        <InputError message={errors.dob} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Student Mobile Phone" />
                        <TextInput
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <InputError message={errors.phone} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="school_college" value="School / College" />
                        <TextInput
                            id="school_college"
                            value={data.school_college}
                            onChange={(e) => setData('school_college', e.target.value)}
                        />
                        <InputError message={errors.school_college} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="guardian_name" value="Guardian Name" />
                        <TextInput
                            id="guardian_name"
                            value={data.guardian_name}
                            onChange={(e) => setData('guardian_name', e.target.value)}
                        />
                        <InputError message={errors.guardian_name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="guardian_phone" value="Guardian Phone" />
                        <TextInput
                            id="guardian_phone"
                            value={data.guardian_phone}
                            onChange={(e) => setData('guardian_phone', e.target.value)}
                        />
                        <InputError message={errors.guardian_phone} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Enrollment Status *" />
                        <SelectInput
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            options={statusOptions}
                            required
                        />
                        <InputError message={errors.status} className="mt-1" />
                    </div>
                </div>

                {/* MULTI-SUBJECT & MULTI-BATCH ASSIGNMENT */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <BookOpen size={16} className="text-emerald-600" />
                                Enrolled Subjects & Batches ({data.batch_ids.length})
                            </h3>
                            <p className="text-xs text-slate-500">
                                Check or uncheck subjects to add or remove this student from batches.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 self-start sm:self-auto">
                            Total Monthly Tuition: ৳{totalMonthlyFee.toLocaleString()} / mo
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {courses.map((course) => {
                            const courseBatches = batches.filter(
                                b => String(b.course_id) === String(course.id)
                            );
                            const activeBatchForCourse = courseBatches.find(
                                b => data.batch_ids.includes(b.id)
                            );
                            const isEnrolled = Boolean(activeBatchForCourse);

                            return (
                                <div
                                    key={course.id}
                                    className={`p-3.5 rounded-lg border transition-all ${
                                        isEnrolled
                                            ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/20'
                                            : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`edit_course_check_${course.id}`}
                                                checked={isEnrolled}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        const defaultBatch = courseBatches[0];
                                                        if (defaultBatch) {
                                                            handleCourseBatchToggle(course.id, defaultBatch.id);
                                                        }
                                                    } else {
                                                        handleCourseBatchToggle(course.id, '');
                                                    }
                                                }}
                                                className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a] border-slate-300 cursor-pointer"
                                            />
                                            <label
                                                htmlFor={`edit_course_check_${course.id}`}
                                                className="font-bold text-slate-900 text-xs cursor-pointer select-none"
                                            >
                                                {course.title}
                                            </label>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 tabular-nums">
                                            ৳{Number(course.fee || 0).toLocaleString()}/mo
                                        </span>
                                    </div>

                                    {isEnrolled && (
                                        <div className="mt-2 pt-2 border-t border-emerald-100">
                                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                Select Batch:
                                            </label>
                                            <select
                                                value={activeBatchForCourse?.id || ''}
                                                onChange={(e) => handleCourseBatchToggle(course.id, e.target.value)}
                                                className="w-full text-xs font-semibold rounded border-slate-200 bg-white text-slate-800 py-1 px-2 focus:border-[#16a34a] focus:ring-0 outline-none"
                                            >
                                                {courseBatches.map((b) => (
                                                    <option key={b.id} value={b.id}>
                                                        {b.name} ({b.class_time || 'Schedule'})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="address" value="Residential Address" />
                    <TextArea
                        id="address"
                        rows={2}
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />
                    <InputError message={errors.address} className="mt-1" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <Link
                        href={route('admin.students.show', student.id)}
                        className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing || data.batch_ids.length === 0}
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                    >
                        <Save size={15} /> Save Changes
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
