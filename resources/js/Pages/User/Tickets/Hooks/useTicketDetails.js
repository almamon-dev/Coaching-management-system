import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Custom Hook: useTicketDetails
 * 
 * Encapulates chat reply form data, automatic message window scrolling, 
 * attachment files management, and badge status styles.
 */
export const useTicketDetails = (ticket) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        attachments: [],
    });

    const [filePreviews, setFilePreviews] = useState([]);
    const chatEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket.messages]);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        if (data.attachments.length + files.length > 3) {
            alert("You can upload a maximum of 3 attachments.");
            return;
        }

        const newAttachments = [...data.attachments, ...files];
        setData('attachments', newAttachments);

        const newPreviews = files.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type,
            url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));
        setFilePreviews(prev => [...prev, ...newPreviews]);
    }, [data.attachments, setData]);

    const removeFile = useCallback((index) => {
        const updatedAttachments = data.attachments.filter((_, i) => i !== index);
        setData('attachments', updatedAttachments);
        
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    }, [data.attachments, setData]);

    const handleReplySubmit = useCallback((e) => {
        if (e) e.preventDefault();
        post(route('dashboard.tickets.reply', ticket.id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setFilePreviews([]);
            }
        });
    }, [post, ticket.id, reset]);

    // Priority badge styles
    const getPriorityBadgeClass = useCallback((level) => {
        switch (level) {
            case "urgent":
                return "bg-rose-50 text-rose-700 border-rose-100 font-bold";
            case "high":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "medium":
                return "bg-sky-50 text-sky-700 border-sky-100";
            case "low":
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    }, []);

    // Status badge styles
    const getStatusBadgeClass = useCallback((statusState) => {
        switch (statusState) {
            case "open":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "in_progress":
                return "bg-yellow-50 text-yellow-800 border-yellow-100";
            case "resolved":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "closed":
            default:
                return "bg-slate-100 text-slate-500 border-slate-200";
        }
    }, []);

    return {
        data,
        setData,
        processing,
        errors,
        filePreviews,
        chatEndRef,
        handleFileChange,
        removeFile,
        handleReplySubmit,
        getPriorityBadgeClass,
        getStatusBadgeClass
    };
};
