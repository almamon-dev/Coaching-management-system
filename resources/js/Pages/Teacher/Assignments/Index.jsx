import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { BookOpen, Plus, Trash2, Search, X, RotateCcw, ChevronDown, Check, FileText } from 'lucide-react';
import AssignmentToolbar from './Components/AssignmentToolbar';
import AssignmentPagination from './Components/AssignmentPagination';
import AssignmentModal from './Components/AssignmentModal';

export default function Index({ auth, assignments, classes, sections, subjects, filters }) {
    // Column Management
    const allColumns = [
        { id: 'title', label: 'Title' },
        { id: 'subject', label: 'Subject' },
        { id: 'class', label: 'Class & Section' },
        { id: 'due_date', label: 'Due Date' },
        { id: 'attachment', label: 'Attachment' },
        { id: 'created_at', label: 'Created At' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(['title', 'subject', 'class', 'due_date', 'attachment']);
    const toggleColumn = (id) => setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    // Data Management
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedIds, setSelectedIds] = useState([]);

    // Modal Management
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('teacher.assignments.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handlePerPageChange = (val) => {
        router.get(route('teacher.assignments.index'), { ...filters, per_page: val, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        router.get(route('teacher.assignments.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    // Selection Logic
    const availableIds = assignments?.data?.map(a => a.id) || [];
    const isAllSelected = selectedIds.length === availableIds.length && availableIds.length > 0;

    const toggleSelectAll = () => {
        if (selectedIds.length > 0) setSelectedIds([]);
        else setSelectedIds(availableIds);
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.length} assignments?`)) {
            Notify.error('Not Implemented', 'Bulk delete backend route needs to be added.');
        }
    };

    // Form Logic
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const deleteAssignment = (assignment) => {
        if (confirm(`Are you sure you want to delete assignment ${assignment.title}?`)) {
            router.delete(route('teacher.assignments.destroy', assignment.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(id => id !== assignment.id));
                    Notify.success('Deleted', 'Assignment deleted successfully.');
                }
            });
        }
    };

    return (
        <TeacherLayout user={auth?.user}>
            <Head title="Assignments" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Assignments</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage homework and assignments for your classes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={openModal}
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#006e52] transition-colors flex items-center gap-2 shadow-[0_1px_0_rgba(0,0,0,0.05)]"
                    >
                        <Plus size={16} /> Add Assignment
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[6px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex flex-col h-auto">
                <AssignmentToolbar
                    search={search}
                    setSearch={setSearch}
                    handleReset={handleReset}
                    columns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    selectedIds={selectedIds}
                    handleClearSelection={() => setSelectedIds([])}
                    handleBulkDelete={handleBulkDelete}
                />

                <div className="flex-1 overflow-auto bg-white relative custom-scrollbar">
                    <table className="w-full text-left border-collapse font-sans min-w-[800px] border-t-0 [&_tr>*:first-child]:border-l-0 [&_tr>*:last-child]:border-r-0 [&_tr:last-child>td]:border-b-0">
                        <thead>
                            <tr className="bg-[#0bd462] text-white">
                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[36px] text-center">
                                    <div className="flex items-center justify-center">
                                        <div
                                            onClick={toggleSelectAll}
                                            className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center cursor-pointer transition-colors
                                                ${isAllSelected ? 'bg-white text-[#0bd462] border-white' : 'bg-transparent border-white hover:border-white/70'}`}
                                        >
                                            {isAllSelected && <Check size={10} strokeWidth={3} className="text-[#0bd462]" />}
                                        </div>
                                    </div>
                                </th>
                                {visibleColumns.includes('title') && <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] whitespace-nowrap">Title</th>}
                                {visibleColumns.includes('subject') && <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] whitespace-nowrap">Subject</th>}
                                {visibleColumns.includes('class') && <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] whitespace-nowrap">Class & Section</th>}
                                {visibleColumns.includes('due_date') && <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] whitespace-nowrap">Due Date</th>}
                                {visibleColumns.includes('attachment') && <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] whitespace-nowrap">Attachment</th>}
                                {visibleColumns.includes('created_at') && <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] whitespace-nowrap">Created At</th>}
                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[70px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments?.data?.length > 0 ? (
                                assignments.data.map((assignment) => {
                                    const isSelected = selectedIds.includes(assignment.id);
                                    return (
                                        <tr key={assignment.id} className={isSelected ? "bg-[#e8f7e8]" : "bg-white hover:bg-slate-50/40"}>
                                            <td className="py-1.5 px-2 border border-[#e5e7e5] w-[36px] text-center">
                                                <div className="flex items-center justify-center">
                                                    <div
                                                        onClick={() => toggleSelect(assignment.id)}
                                                        className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center cursor-pointer transition-colors
                                                            ${isSelected ? 'bg-[#0bd462] border-[#0bd462]' : 'bg-white border-[#8c9196] hover:border-[#5c5f62]'}`}
                                                    >
                                                        {isSelected && <Check size={10} strokeWidth={3} className="text-white" />}
                                                    </div>
                                                </div>
                                            </td>
                                            {visibleColumns.includes('title') && (
                                                <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                                    <div className="text-[12.5px] text-[#333] font-medium">{assignment.title}</div>
                                                    {assignment.description && <div className="text-[11.5px] text-[#666] mt-0.5 truncate max-w-[200px]">{assignment.description}</div>}
                                                </td>
                                            )}
                                            {visibleColumns.includes('subject') && (
                                                <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] text-[#333] whitespace-nowrap">
                                                    {assignment.subject?.name}
                                                </td>
                                            )}
                                            {visibleColumns.includes('class') && (
                                                <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] text-[#333] whitespace-nowrap">
                                                    {assignment.academic_class?.name} - {assignment.section?.name}
                                                </td>
                                            )}
                                            {visibleColumns.includes('due_date') && (
                                                <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] text-[#333] whitespace-nowrap">
                                                    {new Date(assignment.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                            )}
                                            {visibleColumns.includes('attachment') && (
                                                <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                                    {assignment.file_path ? (
                                                        <a href={`/storage/${assignment.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11.5px] text-[#008f39] font-bold hover:underline">
                                                            <FileText size={13} /> View
                                                        </a>
                                                    ) : (
                                                        <span className="text-[11.5px] text-[#6d7175]">-</span>
                                                    )}
                                                </td>
                                            )}
                                            {visibleColumns.includes('created_at') && (
                                                <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] text-[#6d7175] whitespace-nowrap">
                                                    {new Date(assignment.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                            )}
                                            <td className="py-1.5 px-2 border border-[#e5e7e5] text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => deleteAssignment(assignment)} className="p-1 text-[#6d7175] hover:text-[#bf0711] hover:bg-[#fbeae5] rounded transition-colors" title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-[#6d7175]">
                                            <BookOpen size={32} className="mb-2 text-[#d1d1d1]" />
                                            <p className="text-[14px] font-medium text-[#202223]">No assignments found</p>
                                            <p className="text-[13px] mt-1">Try changing the filters or create a new assignment.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AssignmentPagination paginator={assignments} perPage={filters?.per_page || '10'} handlePerPageChange={handlePerPageChange} />
            </div>

            <AssignmentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                classes={classes}
                sections={sections}
                subjects={subjects}
            />
        </TeacherLayout>
    );
}
