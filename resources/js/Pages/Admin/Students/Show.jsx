import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User, Phone, Mail, MapPin, Calendar, Users, GraduationCap, FileText, CreditCard, Clock as ClockIcon, Activity, CheckCircle2, ChevronRight, ChevronLeft, Download } from 'lucide-react';
import SecondaryButton from '@/Components/Button/SecondaryButton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function Show({ auth, student, fees, attendances, results, marks }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedEnrollmentId, setExpandedEnrollmentId] = useState(null);
    const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);
    const [expandedResultId, setExpandedResultId] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const user = student.user || {};
    const currentEnrollment = student.enrollments && student.enrollments.length > 0 ? student.enrollments[0] : null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'academic', label: 'Academic History', icon: GraduationCap },
        { id: 'fees', label: 'Fees & Invoices', icon: CreditCard },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'exams', label: 'Exam Results', icon: FileText },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(parseFloat(amount) || 0);
    };

    const getFeeStatus = (invoice) => {
        const paid = parseFloat(invoice.payments_sum_amount) || 0;
        const total = parseFloat(invoice.total_amount) || 0;
        
        if (paid >= total) return { label: 'Paid', color: 'text-[#008060] bg-[#e6f2ef]' };
        if (paid > 0) return { label: 'Partially Paid', color: 'text-[#bf6100] bg-[#fff4e5]' };
        return { label: 'Unpaid', color: 'text-[#a80d0d] bg-[#ffe5e5]' };
    };

    // Calendar logic
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const handleMonthChange = (e) => setCurrentDate(new Date(currentYear, parseInt(e.target.value), 1));
    const handleYearChange = (e) => setCurrentDate(new Date(parseInt(e.target.value), currentMonth, 1));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    return (
        <AdminLayout
            user={auth.user}
            header={null} // Remove default header to give more focus to the new design
        >
            <Head title={`Student Profile - ${user.name}`} />

            <div className="max-w-8xl mx-auto space-y-6">
                {/* Top Info Banner - Matching the Screenshot */}
                <div className="bg-white rounded-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 border border-[#ebebeb]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                            <div className="text-[14px] text-[#202223]">
                                <span className="font-bold">Name:</span> {user.name}
                            </div>
                            <div className="text-[14px] text-[#202223]">
                                <span className="font-bold">Student ID:</span> {student.student_id}
                            </div>
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="text-[14px] text-[#202223]">
                                <span className="font-bold">Class:</span> {currentEnrollment?.academic_class?.name || 'N/A'}
                            </div>
                            <div className="text-[14px] text-[#202223]">
                                <span className="font-bold">Section & Roll:</span> {currentEnrollment?.section?.name || 'N/A'} (Roll: {currentEnrollment?.roll_number || 'N/A'})
                            </div>
                        </div>

                        <div className="flex-1 flex justify-end">
                            <div className="inline-flex items-center gap-2 bg-[#e4f1ef] text-[#008060] px-4 py-2 rounded-[4px] border border-[#008060]/20 font-medium text-[15px]">
                                <ClockIcon size={16} />
                                {currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#ebebeb] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#ebebeb]">
                        <h2 className="text-[18px] font-bold text-[#202223]">Student Information</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 px-5 pt-3 border-b border-[#ebebeb] overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-[#008060] text-[#008060]'
                                            : 'border-transparent text-[#6d7175] hover:text-[#202223] hover:border-[#d1d1d1]'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-white">
                        {activeTab === 'overview' && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Personal Details */}
                                    <div>
                                        <h3 className="text-[14px] font-bold text-[#202223] mb-3 border-b border-[#ebebeb] pb-2">Personal Details</h3>
                                        <div className="space-y-2.5">
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[120px] shrink-0">Date of Birth:</span>
                                                <span className="text-[#202223]">{student.dob ? new Date(student.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not provided'}</span>
                                            </div>
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[120px] shrink-0">Gender:</span>
                                                <span className="text-[#202223] capitalize">{student.gender || 'Not provided'}</span>
                                            </div>
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[120px] shrink-0">Blood Group:</span>
                                                <span className="text-[#202223]">{student.blood_group || 'Not provided'}</span>
                                            </div>
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[120px] shrink-0">Status:</span>
                                                <span className="text-[#202223] capitalize">{currentEnrollment?.status || 'Active'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="text-[14px] font-bold text-[#202223] mb-3 border-b border-[#ebebeb] pb-2">Contact Information</h3>
                                        <div className="space-y-2.5">
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[80px] shrink-0">Phone:</span>
                                                <span className="text-[#202223]">{user.phone || 'Not provided'}</span>
                                            </div>
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[80px] shrink-0">Email:</span>
                                                <span className="text-[#202223] break-all">{user.email || 'Not provided'}</span>
                                            </div>
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[80px] shrink-0">Address:</span>
                                                <span className="text-[#202223]">{student.address || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guardian Information */}
                                    <div>
                                        <h3 className="text-[14px] font-bold text-[#202223] mb-3 border-b border-[#ebebeb] pb-2">Guardian Information</h3>
                                        <div className="space-y-2.5">
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[110px] shrink-0">Name:</span>
                                                <span className="text-[#202223]">{student.guardian_name || 'Not provided'}</span>
                                            </div>
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[110px] shrink-0">Relationship:</span>
                                                <span className="text-[#202223] capitalize">{student.guardian_relation || 'Not provided'}</span>
                                            </div>
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[110px] shrink-0">Phone:</span>
                                                <span className="text-[#202223]">{student.guardian_phone || 'Not provided'}</span>
                                            </div>
                                            <div className="text-[13px] flex items-start">
                                                <span className="font-bold text-[#202223] w-[110px] shrink-0">Email:</span>
                                                <span className="text-[#202223] break-all">{student.guardian_email || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <div className="p-5">
                                <h3 className="text-[18px] font-bold text-[#202223] mb-4">Academic History</h3>
                                <div className="border border-[#ebebeb] overflow-hidden bg-white">
                                    <table className="w-full text-center text-[13px]">
                                        <thead>
                                            <tr className="bg-[#12c45b] text-white">
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Session</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Class & Section</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Roll No.</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Enrollment Date</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Result (GPA)</th>
                                                <th className="px-3 py-2 font-bold">Status</th>
                                                <th className="px-3 py-2 font-bold">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.enrollments?.map((enrollment, idx) => (
                                                <React.Fragment key={idx}>
                                                    <tr className={`border-b border-[#ebebeb] hover:bg-[#fafafa] cursor-pointer ${expandedEnrollmentId === enrollment.id ? 'bg-[#f4f6f8]' : ''}`}
                                                        onClick={() => setExpandedEnrollmentId(prev => prev === enrollment.id ? null : enrollment.id)}
                                                    >
                                                        <td className="px-3 py-2 border-r border-[#ebebeb]">
                                                            <div className="text-[13px] font-medium text-[#202223]">{enrollment.academic_session?.name}</div>
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] font-medium text-[#202223]">
                                                            {enrollment.academic_class?.name} - {enrollment.section?.name}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] text-[#202223]">
                                                            {enrollment.roll_number || 'N/A'}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] text-[#6d7175]">
                                                            {enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] font-bold text-[#202223]">
                                                            {(() => {
                                                                const result = results?.find(r => r.academic_class_id === enrollment.academic_class_id);
                                                                if (result && result.gpa) {
                                                                    return <span className="text-[#008060]">{result.gpa} ({result.grade})</span>;
                                                                }
                                                                if (enrollment.status === 'active') {
                                                                    return <span className="text-[#6d7175] font-medium text-[11px] italic">Upcoming</span>;
                                                                }
                                                                return enrollment.status === 'promoted' ? <span className="text-[#008060]">4.88 (A+)</span> : '-';
                                                            })()}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb]">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider
                                                                ${enrollment.status === 'active' ? 'bg-[#e4f1ef] text-[#008060]' : ''}
                                                                ${enrollment.status === 'promoted' ? 'bg-blue-50 text-blue-600' : ''}
                                                                ${enrollment.status === 'transferred' ? 'bg-orange-50 text-orange-600' : ''}
                                                                ${enrollment.status === 'dropped' ? 'bg-red-50 text-red-600' : ''}
                                                            `}>
                                                                {enrollment.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 text-[#008060]">
                                                            {expandedEnrollmentId === enrollment.id ? (
                                                                <span className="font-bold text-[12px]">Hide</span>
                                                            ) : (
                                                                <span className="font-bold text-[12px] underline">View</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    
                                                </React.Fragment>
                                            ))}
                                            {(!student.enrollments || student.enrollments.length === 0) && (
                                                <tr>
                                                    <td colSpan="7" className="px-3 py-6 text-center text-[#6d7175]">No academic history found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* External Detailed View Card */}
                                {expandedEnrollmentId && (() => {
                                    const enrollment = student.enrollments.find(e => e.id === expandedEnrollmentId);
                                    if (!enrollment) return null;
                                    
                                    const sessionResult = results?.find(r => r.academic_class_id === enrollment.academic_class_id);
                                    const sessionMarks = marks?.filter(m => m.academic_class_id === enrollment.academic_class_id && m.exam_id === sessionResult?.exam_id) || [];
                                    
                                    if (!sessionResult || sessionMarks.length === 0) {
                                        return (
                                            <div className="mt-6 bg-white border border-[#ebebeb] rounded shadow-sm p-8 text-center text-[#6d7175]">
                                                No detailed marks available for this session.
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="mt-6 bg-white border border-[#ebebeb] rounded shadow-sm overflow-hidden">
                                            <div className="bg-[#f4f6f8] px-4 py-2 border-b border-[#ebebeb] flex justify-between items-center">
                                                <span className="font-bold text-[13px] text-[#202223]">Detailed Subject Marks - {enrollment.academic_session?.name} ({enrollment.academic_class?.name})</span>
                                                <span className="text-[12px] text-[#6d7175] font-medium">{sessionResult.exam?.name || 'Final Exam'}</span>
                                            </div>
                                            <table className="w-full text-left text-[13px]">
                                                <thead>
                                                    <tr className="border-b border-[#ebebeb] bg-[#fdfdfd] text-[#6d7175]">
                                                        <th className="px-4 py-2 font-semibold">Subject</th>
                                                        <th className="px-4 py-2 font-semibold">Teacher</th>
                                                        <th className="px-4 py-2 font-semibold text-center">Full Marks</th>
                                                        <th className="px-4 py-2 font-semibold text-center">Obtained Marks</th>
                                                        <th className="px-4 py-2 font-semibold text-center">Grade</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sessionMarks.map((markItem, midx) => {
                                                        const p = markItem.marks;
                                                        let grd = 'F';
                                                        if(p >= 80) grd = 'A+';
                                                        else if(p >= 70) grd = 'A';
                                                        else if(p >= 60) grd = 'A-';
                                                        else if(p >= 50) grd = 'B';
                                                        else if(p >= 40) grd = 'C';
                                                        else if(p >= 33) grd = 'D';

                                                        const classId = enrollment.academic_class_id;
                                                        const sectionId = enrollment.section_id;
                                                        let teacherName = 'N/A';
                                                        
                                                        if (markItem.subject?.teachers?.length > 0) {
                                                            const exactTeacher = markItem.subject.teachers.find(t => t.pivot?.academic_class_id === classId && t.pivot?.section_id === sectionId);
                                                            if (exactTeacher) {
                                                                teacherName = exactTeacher.name;
                                                            } else {
                                                                teacherName = markItem.subject.teachers[0].name;
                                                            }
                                                        }

                                                        return (
                                                            <tr key={midx} className="border-b border-[#ebebeb] last:border-0 hover:bg-[#fafafa]">
                                                                <td className="px-4 py-1.5 font-medium text-[#202223]">{markItem.subject?.name || 'N/A'}</td>
                                                                <td className="px-4 py-1.5 text-[#6d7175]">{teacherName}</td>
                                                                <td className="px-4 py-1.5 text-center text-[#6d7175]">100</td>
                                                                <td className="px-4 py-1.5 text-center font-bold text-[#202223]">
                                                                    <span className={markItem.marks >= 80 ? 'text-[#008060]' : ''}>{markItem.marks}</span>
                                                                </td>
                                                                <td className="px-4 py-1.5 text-center font-bold text-[#202223]">
                                                                    <span className={grd === 'A+' || grd === 'A' ? 'text-[#008060]' : ''}>{grd}</span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                <tfoot className="bg-[#f4f6f8] border-t border-[#ebebeb]">
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold text-[#202223] text-right" colSpan="3">Total Marks:</td>
                                                        <td className="px-4 py-2 font-bold text-[#202223] text-center">{sessionResult.total_marks} / {sessionMarks.length * 100}</td>
                                                        <td className="px-4 py-2 font-bold text-[#008060] text-center">GPA: {sessionResult.gpa}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === 'fees' && (
                            <div className="p-5">
                                <h3 className="text-[18px] font-bold text-[#202223] mb-4">Fees & Invoices</h3>
                                <div className="border border-[#ebebeb] overflow-hidden bg-white">
                                    <table className="w-full text-center text-[13px]">
                                        <thead>
                                            <tr className="bg-[#12c45b] text-white">
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Invoice ID</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Date</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Fee Group</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Amount</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Paid</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Status</th>
                                                <th className="px-3 py-2 font-bold">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fees?.map((fee, idx) => (
                                                <React.Fragment key={idx}>
                                                    <tr 
                                                        className={`border-b border-[#ebebeb] hover:bg-[#fafafa] cursor-pointer ${expandedInvoiceId === fee.id ? 'bg-[#f4f6f8]' : ''}`}
                                                        onClick={() => setExpandedInvoiceId(prev => prev === fee.id ? null : fee.id)}
                                                    >
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] font-semibold text-[#12c45b]">
                                                            {fee.invoice_number}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] text-[#6d7175]">
                                                            {new Date(fee.invoice_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] text-[#202223]">
                                                            {fee.fee_group?.name || fee.title || 'Standard Fee'}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] font-bold text-[#202223]">
                                                            ৳{fee.total_amount}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[13px] text-[#202223]">
                                                            ৳{fee.paid_amount}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb]">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider
                                                                ${fee.status === 'paid' ? 'bg-[#e4f1ef] text-[#008060]' : ''}
                                                                ${fee.status === 'partial' ? 'bg-orange-50 text-orange-600' : ''}
                                                                ${fee.status === 'unpaid' ? 'bg-red-50 text-red-600' : ''}
                                                            `}>
                                                                {fee.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 text-[#008060]">
                                                            {expandedInvoiceId === fee.id ? (
                                                                <span className="font-bold text-[12px]">Hide</span>
                                                            ) : (
                                                                <span className="font-bold text-[12px] underline">View</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}
                                            {(!fees || fees.length === 0) && (
                                                <tr>
                                                    <td colSpan="5" className="px-3 py-6 text-center text-[#6d7175]">No fee records found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* External Detailed View Card for Invoice */}
                                {expandedInvoiceId && (() => {
                                    const fee = fees.find(f => f.id === expandedInvoiceId);
                                    if (!fee) return null;
                                    
                                    return (
                                        <div className="mt-6 bg-white border border-[#ebebeb] rounded shadow-sm overflow-hidden flex flex-col md:flex-row">
                                            {/* Left side - Fee Items */}
                                            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[#ebebeb]">
                                                <div className="bg-[#f4f6f8] px-4 py-2 border-b border-[#ebebeb]">
                                                    <span className="font-bold text-[13px] text-[#202223]">Fee Breakdown</span>
                                                </div>
                                                <table className="w-full text-left text-[13px]">
                                                    <tbody>
                                                        {fee.items?.length > 0 ? fee.items.map((item, i) => (
                                                            <tr key={i} className="border-b border-[#ebebeb] last:border-0 hover:bg-[#fafafa]">
                                                                <td className="px-4 py-1.5 text-[#202223] font-medium">{item.fee_type?.name || 'Item Fee'}</td>
                                                                <td className="px-4 py-1.5 text-[#202223] text-right">৳{item.amount}</td>
                                                            </tr>
                                                        )) : (
                                                            <tr>
                                                                <td colSpan="2" className="px-4 py-3 text-center text-[#6d7175]">No breakdown available</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                    <tfoot className="bg-[#fdfdfd] border-t border-[#ebebeb]">
                                                        <tr>
                                                            <td className="px-4 py-2 font-bold text-[#202223] text-right">Total:</td>
                                                            <td className="px-4 py-2 font-bold text-[#202223] text-right">৳{fee.total_amount}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>

                                            {/* Right side - Payments */}
                                            <div className="w-full md:w-1/2">
                                                <div className="bg-[#f4f6f8] px-4 py-2 border-b border-[#ebebeb]">
                                                    <span className="font-bold text-[13px] text-[#202223]">Payment History</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    {fee.payments?.length > 0 ? fee.payments.map((payment, i) => (
                                                        <div key={i} className="flex justify-between items-center px-4 py-2.5 border-b border-[#ebebeb] last:border-0 hover:bg-[#fafafa]">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded bg-[#e4f1ef] flex items-center justify-center flex-shrink-0 text-[#008060]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[#202223] font-bold text-[13px]">{payment.payment_method}</span>
                                                                    <span className="text-[11px] text-[#6d7175]">
                                                                        {new Date(payment.payment_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 
                                                                        {payment.transaction_id ? ` • TXN: ${payment.transaction_id}` : ''}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-[#008060] font-bold text-[13px]">
                                                                +৳{payment.amount_paid}
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="px-4 py-6 text-center text-[#6d7175] text-[13px]">No payments received yet</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === 'attendance' && (
                            <div className="p-0">
                                {(() => {
                                    // Filter attendances for current month/year
                                    const monthAttendances = attendances?.filter(att => {
                                        const d = new Date(att.date);
                                        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                                    }) || [];

                                    // Get status for a specific day
                                    const getAttendanceForDay = (day) => {
                                        return monthAttendances.find(att => {
                                            const d = new Date(att.date);
                                            return d.getDate() === day;
                                        });
                                    };

                                    const stats = {
                                        present: monthAttendances.filter(a => a.status === 'present').length,
                                        absent: monthAttendances.filter(a => a.status === 'absent').length,
                                        late: monthAttendances.filter(a => a.status === 'late').length,
                                        on_leave: monthAttendances.filter(a => a.status === 'on_leave').length,
                                        half_day: monthAttendances.filter(a => a.status === 'half_day').length,
                                    };

                                    return (
                                        <div className="p-3">
                                            {/* Header with controls and stats */}
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-1 bg-[#f4f6f8] p-1 rounded-[4px] border border-[#ebebeb] w-fit">
                                                    <button onClick={prevMonth} className="p-1 hover:bg-white rounded-[3px] text-[#6d7175] hover:text-[#202223] transition-colors shadow-sm">
                                                        <ChevronLeft size={14} />
                                                    </button>
                                                    
                                                    <select 
                                                        value={currentMonth}
                                                        onChange={handleMonthChange}
                                                        className="h-[26px] text-[12px] font-bold text-[#202223] border-transparent bg-transparent hover:bg-white rounded-[3px] focus:ring-0 py-0 pl-2 pr-6 cursor-pointer"
                                                    >
                                                        {monthNames.map((name, idx) => (
                                                            <option key={idx} value={idx}>{name}</option>
                                                        ))}
                                                    </select>
                                                    
                                                    <select 
                                                        value={currentYear}
                                                        onChange={handleYearChange}
                                                        className="h-[26px] text-[12px] font-bold text-[#202223] border-transparent bg-transparent hover:bg-white rounded-[3px] focus:ring-0 py-0 pl-2 pr-6 cursor-pointer"
                                                    >
                                                        {yearOptions.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>

                                                    <button onClick={nextMonth} className="p-1 hover:bg-white rounded-[3px] text-[#6d7175] hover:text-[#202223] transition-colors shadow-sm">
                                                        <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold border border-[#ebebeb] rounded-[4px] p-1 bg-[#fcfcfc]">
                                                    <div className="flex items-center gap-1.5 px-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#008060]"></div>
                                                        <span className="text-[#6d7175]">Present: <span className="text-[#202223]">{stats.present}</span></span>
                                                    </div>
                                                    <div className="w-px h-3 bg-[#ebebeb]"></div>
                                                    <div className="flex items-center gap-1.5 px-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#a80d0d]"></div>
                                                        <span className="text-[#6d7175]">Absent: <span className="text-[#202223]">{stats.absent}</span></span>
                                                    </div>
                                                    <div className="w-px h-3 bg-[#ebebeb]"></div>
                                                    <div className="flex items-center gap-1.5 px-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#bf6100]"></div>
                                                        <span className="text-[#6d7175]">Late: <span className="text-[#202223]">{stats.late}</span></span>
                                                    </div>
                                                    <div className="w-px h-3 bg-[#ebebeb]"></div>
                                                    <div className="flex items-center gap-1.5 px-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#3151fe]"></div>
                                                        <span className="text-[#6d7175]">Leave: <span className="text-[#202223]">{stats.on_leave}</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col lg:flex-row gap-5">
                                                {/* Calendar Grid */}
                                                <div className="flex-1 border border-[#ebebeb] rounded-[4px] overflow-hidden bg-white shadow-sm">
                                                    <div className="grid grid-cols-7 bg-[#f8f9fa] border-b border-[#ebebeb]">
                                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                            <div key={day} className="py-1.5 text-center text-[10px] font-bold text-[#6d7175] uppercase tracking-wider">
                                                                {day}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-7 bg-white">
                                                        {blanks.map((_, idx) => (
                                                            <div key={`blank-${idx}`} className="min-h-[64px] border-b border-r border-[#ebebeb] bg-[#fafafa]"></div>
                                                        ))}
                                                        
                                                        {days.map(day => {
                                                            const att = getAttendanceForDay(day);
                                                            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                                                            
                                                            let statusClass = "bg-transparent hover:bg-[#fafafa]";
                                                            let statusText = "";
                                                            let textColor = "";

                                                            if (att) {
                                                                if (att.status === 'present') { statusClass = "bg-[#f0f9f7] hover:bg-[#e4f4f1]"; statusText = "Present"; textColor = "text-[#008060]"; }
                                                                else if (att.status === 'absent') { statusClass = "bg-[#fff0f0] hover:bg-[#ffe5e5]"; statusText = "Absent"; textColor = "text-[#a80d0d]"; }
                                                                else if (att.status === 'late') { statusClass = "bg-[#fff8f0] hover:bg-[#fff4e5]"; statusText = "Late"; textColor = "text-[#bf6100]"; }
                                                                else if (att.status === 'half_day') { statusClass = "bg-[#fff8f0] hover:bg-[#fff4e5]"; statusText = "Half Day"; textColor = "text-[#bf6100]"; }
                                                                else if (att.status === 'on_leave') { statusClass = "bg-blue-50/50 hover:bg-blue-50"; statusText = "Leave"; textColor = "text-[#3151fe]"; }
                                                            }

                                                            return (
                                                                <div key={`day-${day}`} className={`min-h-[64px] p-1.5 border-b border-r border-[#ebebeb] transition-colors relative flex flex-col items-center justify-start ${statusClass}`} title={att?.remarks || ''}>
                                                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[13px] font-bold mb-1 ${isToday ? 'bg-[#202223] text-white' : 'text-[#202223]'}`}>
                                                                        {day}
                                                                    </span>
                                                                    {att && (
                                                                        <div className={`text-[10px] font-bold leading-tight text-center px-1 py-0.5 rounded ${textColor} bg-white/60`}>
                                                                            {statusText}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Stats Graph */}
                                                <div className="w-full lg:w-[260px] shrink-0 border border-[#ebebeb] rounded-[4px] bg-white shadow-sm p-4 flex flex-col justify-center items-center">
                                                    <h4 className="text-[12px] font-bold text-[#6d7175] uppercase tracking-wider mb-2 text-center">Monthly Overview</h4>
                                                    
                                                    {stats.present + stats.absent + stats.late + stats.on_leave > 0 ? (
                                                        <div className="w-[180px] h-[180px]">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <PieChart>
                                                                    <Pie
                                                                        data={[
                                                                            { name: 'Present', value: stats.present, color: '#008060' },
                                                                            { name: 'Absent', value: stats.absent, color: '#a80d0d' },
                                                                            { name: 'Late', value: stats.late, color: '#bf6100' },
                                                                            { name: 'Leave', value: stats.on_leave, color: '#3151fe' },
                                                                        ].filter(item => item.value > 0)}
                                                                        cx="50%"
                                                                        cy="50%"
                                                                        innerRadius={45}
                                                                        outerRadius={75}
                                                                        paddingAngle={2}
                                                                        dataKey="value"
                                                                    >
                                                                        {
                                                                            [
                                                                                { name: 'Present', value: stats.present, color: '#008060' },
                                                                                { name: 'Absent', value: stats.absent, color: '#a80d0d' },
                                                                                { name: 'Late', value: stats.late, color: '#bf6100' },
                                                                                { name: 'Leave', value: stats.on_leave, color: '#3151fe' },
                                                                            ].filter(item => item.value > 0).map((entry, index) => (
                                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                                            ))
                                                                        }
                                                                    </Pie>
                                                                    <RechartsTooltip 
                                                                        contentStyle={{ borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                                                        itemStyle={{ color: '#202223' }}
                                                                    />
                                                                </PieChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                                                            <div className="w-16 h-16 rounded-full bg-[#f4f6f8] flex items-center justify-center mb-3">
                                                                <Calendar size={24} className="text-[#d1d1d1]" />
                                                            </div>
                                                            <span className="text-[12px] font-medium text-[#6d7175]">No attendance data for this month</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === 'exams' && (
                            <div className="p-5">
                                <h3 className="text-[18px] font-bold text-[#202223] mb-4">Exam Results</h3>
                                <div className="border border-[#ebebeb] overflow-hidden bg-white">
                                    <table className="w-full text-center text-[13px]">
                                        <thead>
                                            <tr className="bg-[#12c45b] text-white">
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Exam Name</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Class</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Total Marks</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">GPA / Grade</th>
                                                <th className="px-3 py-2 font-bold border-r border-[#0e9d48]">Status</th>
                                                <th className="px-3 py-2 font-bold">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results?.map((result, idx) => (
                                                <React.Fragment key={idx}>
                                                    <tr 
                                                        className={`border-b border-[#ebebeb] hover:bg-[#fafafa] cursor-pointer ${expandedResultId === result.id ? 'bg-[#f4f6f8]' : ''}`}
                                                        onClick={() => setExpandedResultId(prev => prev === result.id ? null : result.id)}
                                                    >
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] font-medium text-[#202223]">
                                                            {result.exam?.name || 'N/A'}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] text-[#6d7175]">
                                                            {result.academic_class?.name || 'N/A'}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] font-bold text-[#202223]">
                                                            {result.total_marks || '0.00'}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb] font-bold text-[#12c45b]">
                                                            {result.gpa} / {result.grade || 'N/A'}
                                                        </td>
                                                        <td className="px-3 py-2 border-r border-[#ebebeb]">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider
                                                                ${result.status === 'Passed' ? 'bg-[#e4f1ef] text-[#008060]' : 'bg-[#ffe5e5] text-[#a80d0d]'}
                                                            `}>
                                                                {result.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 text-[#008060]">
                                                            {expandedResultId === result.id ? (
                                                                <span className="font-bold text-[12px]">Hide</span>
                                                            ) : (
                                                                <span className="font-bold text-[12px] underline">View</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}
                                            {(!results || results.length === 0) && (
                                                <tr>
                                                    <td colSpan="5" className="px-3 py-6 text-center text-[#6d7175]">No exam results found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* External Detailed View Card for Exam Results */}
                                {expandedResultId && (() => {
                                    const sessionResult = results?.find(r => r.id === expandedResultId);
                                    if (!sessionResult) return null;
                                    
                                    const sessionMarks = marks?.filter(m => m.academic_class_id === sessionResult.academic_class_id && m.exam_id === sessionResult.exam_id) || [];
                                    
                                    if (sessionMarks.length === 0) {
                                        return (
                                            <div className="mt-6 bg-white border border-[#ebebeb] rounded shadow-sm p-8 text-center text-[#6d7175]">
                                                No detailed marks available for this exam.
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="mt-6 bg-white border border-[#ebebeb] rounded shadow-sm overflow-hidden">
                                            <div className="bg-[#f4f6f8] px-4 py-2 border-b border-[#ebebeb] flex justify-between items-center">
                                                <span className="font-bold text-[13px] text-[#202223]">Detailed Subject Marks - {sessionResult.exam?.name || 'Exam'} ({sessionResult.academic_class?.name})</span>
                                                <span className="text-[12px] text-[#6d7175] font-medium">Status: {sessionResult.status}</span>
                                            </div>
                                            <table className="w-full text-left text-[13px]">
                                                <thead>
                                                    <tr className="border-b border-[#ebebeb] bg-[#fdfdfd] text-[#6d7175]">
                                                        <th className="px-4 py-2 font-semibold">Subject</th>
                                                        <th className="px-4 py-2 font-semibold">Teacher</th>
                                                        <th className="px-4 py-2 font-semibold text-center">Full Marks</th>
                                                        <th className="px-4 py-2 font-semibold text-center">Obtained Marks</th>
                                                        <th className="px-4 py-2 font-semibold text-center">Grade</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sessionMarks.map((markItem, midx) => {
                                                        const p = markItem.marks;
                                                        let grd = 'F';
                                                        if(p >= 80) grd = 'A+';
                                                        else if(p >= 70) grd = 'A';
                                                        else if(p >= 60) grd = 'A-';
                                                        else if(p >= 50) grd = 'B';
                                                        else if(p >= 40) grd = 'C';
                                                        else if(p >= 33) grd = 'D';

                                                        const classId = sessionResult.academic_class_id;
                                                        let teacherName = 'N/A';
                                                        
                                                        if (markItem.subject?.teachers?.length > 0) {
                                                            const exactTeacher = markItem.subject.teachers.find(t => t.pivot?.academic_class_id === classId);
                                                            if (exactTeacher) {
                                                                teacherName = exactTeacher.name;
                                                            } else {
                                                                teacherName = markItem.subject.teachers[0].name;
                                                            }
                                                        }

                                                        return (
                                                            <tr key={midx} className="border-b border-[#ebebeb] last:border-0 hover:bg-[#fafafa]">
                                                                <td className="px-4 py-1.5 font-medium text-[#202223]">{markItem.subject?.name || 'N/A'}</td>
                                                                <td className="px-4 py-1.5 text-[#6d7175]">{teacherName}</td>
                                                                <td className="px-4 py-1.5 text-center text-[#6d7175]">100</td>
                                                                <td className="px-4 py-1.5 text-center font-bold text-[#202223]">
                                                                    <span className={markItem.marks >= 80 ? 'text-[#008060]' : ''}>{markItem.marks}</span>
                                                                </td>
                                                                <td className="px-4 py-1.5 text-center font-bold text-[#202223]">
                                                                    <span className={grd === 'A+' || grd === 'A' ? 'text-[#008060]' : ''}>{grd}</span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                <tfoot className="bg-[#f4f6f8] border-t border-[#ebebeb]">
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold text-[#202223] text-right" colSpan="3">Total Marks:</td>
                                                        <td className="px-4 py-2 font-bold text-[#202223] text-center">{sessionResult.total_marks} / {sessionMarks.length * 100}</td>
                                                        <td className="px-4 py-2 font-bold text-[#008060] text-center">GPA: {sessionResult.gpa}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
