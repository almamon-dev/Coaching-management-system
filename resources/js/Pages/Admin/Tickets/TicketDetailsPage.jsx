import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeft, Send, ShieldAlert, CheckCircle,
    Lock, Globe, Image, Paperclip, AlertCircle,
    User, Mail, Phone, Calendar, Headset, LifeBuoy,
    X, FileText, ExternalLink
} from "lucide-react";

// Reusable Components from Workspace
import SelectInput from "@/Components/SelectInput";
import TextArea from "@/Components/TextArea";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import RichTextEditor from "@/Components/RichTextEditor";

export default function TicketDetailsPage({ ticket, agents = [] }) {
    const [isInternal, setIsInternal] = useState(false);
    const [filePreviews, setFilePreviews] = useState([]);

    // Form state for new message reply
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
        is_internal: false,
        attachments: []
    });

    // Form state for quick status/priority/assignee updates
    const handleStatusChange = (status) => {
        router.patch(route("admin.tickets.status", ticket.id), { status }, {
            preserveScroll: true
        });
    };

    const handlePriorityChange = (priority) => {
        router.patch(route("admin.tickets.priority", ticket.id), { priority }, {
            preserveScroll: true
        });
    };

    const handleAssigneeChange = (assigned_to) => {
        router.patch(route("admin.tickets.assign", ticket.id), { assigned_to }, {
            preserveScroll: true
        });
    };

    // Submitting chat reply
    const handleSubmitReply = (e) => {
        e.preventDefault();

        // Match the React state variable to form key
        data.is_internal = isInternal;

        post(route("admin.tickets.reply", ticket.id), {
            forceFormData: true,
            onSuccess: () => {
                reset("message", "attachments");
                setFilePreviews([]);
                // Reset file input
                const fileInput = document.getElementById("attachment-upload");
                if (fileInput) fileInput.value = "";
            },
            preserveScroll: true
        });
    };

    // File attachments handler
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (data.attachments.length + files.length > 3) {
            alert("You can upload a maximum of 3 attachments.");
            return;
        }

        const newAttachments = [...data.attachments, ...files];
        setData("attachments", newAttachments);

        const newPreviews = files.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            type: file.type,
            url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null
        }));
        setFilePreviews(prev => [...prev, ...newPreviews]);
    };

    // Remove pre-upload file
    const removeFile = (index) => {
        const updatedAttachments = data.attachments.filter((_, i) => i !== index);
        setData("attachments", updatedAttachments);
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Format file sizes helper
    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    // Priority badges colors
    const getPriorityBadgeClass = (level) => {
        switch (level) {
            case "urgent":
                return "bg-rose-50 text-rose-700 border-rose-100 font-bold";
            case "high":
                return "bg-amber-50 text-amber-700 border-amber-100 font-bold";
            case "medium":
                return "bg-sky-50 text-sky-700 border-sky-100 font-bold";
            case "low":
            default:
                return "bg-slate-50 text-slate-600 border-slate-100 font-bold";
        }
    };

    // Status badges colors
    const getStatusBadgeClass = (statusState) => {
        switch (statusState) {
            case "open":
                return "bg-blue-50 text-blue-700 border-blue-150 font-bold";
            case "in_progress":
                return "bg-yellow-50 text-yellow-800 border-yellow-150 font-bold";
            case "resolved":
                return "bg-emerald-50 text-emerald-700 border-emerald-150 font-bold";
            case "closed":
            default:
                return "bg-slate-100 text-slate-500 border-slate-200 font-bold";
        }
    };

    return (
        <AdminLayout>
            <Head title={`Support Ticket #${ticket.ticket_id}`} />

            <div className="min-h-screen">

                {/* 1. Page Header (Shopify Layout Style) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="flex items-center flex-wrap gap-2">
                                <span className="text-[10px] font-bold text-[#ef4a23] uppercase tracking-widest">SUPPORT TICKET</span>
                                <span className={`px-2 py-0.5 border rounded-full text-[9px] uppercase tracking-tight ${getPriorityBadgeClass(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                                <span className={`px-2 py-0.5 border rounded-full text-[9px] uppercase tracking-tight ${getStatusBadgeClass(ticket.status)}`}>
                                    {ticket.status.replace("_", " ")}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-[#081621] mt-1 leading-tight">
                                #{ticket.ticket_id}: {ticket.subject}
                            </h1>
                        </div>
                    </div>
                    {/* Right side back button */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.tickets.index")}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 h-[38px] px-4 rounded-[3px] text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm"
                        >
                            <ArrowLeft size={14} className="text-slate-500" />
                            Back to Tickets
                        </Link>
                    </div>
                </div>

                {/* 2. Split Pane Layout (Cols 12: Col-8 Form / Col-4 Sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">

                    {/* Left Column: Thread & Reply Console (Col 1-8) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* A. Discussion Thread Card */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Headset size={16} className="text-[#008060]" />
                                <h3 className="text-[14px] font-bold text-[#081621]">Discussion Thread</h3>
                            </div>

                            <div className="p-6 space-y-6">
                                {ticket.messages && ticket.messages.map((message) => {
                                    const isCustomer = message.sender?.user_type !== "admin";
                                    const isMsgInternal = message.is_internal;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 max-w-[90%] ${isMsgInternal
                                                ? "mx-auto w-full max-w-full bg-amber-50/50 border border-amber-100 rounded-sm p-4.5"
                                                : isCustomer
                                                    ? "mr-auto"
                                                    : "ml-auto flex-row-reverse"
                                                }`}
                                        >
                                            {/* Avatar */}
                                            {!isMsgInternal && (
                                                <div className="shrink-0">
                                                    {message.sender?.profile_picture ? (
                                                        <img
                                                            src={message.sender.profile_picture}
                                                            alt={message.sender.name}
                                                            className="w-9 h-9 rounded-[1px] object-cover border border-slate-200"
                                                        />
                                                    ) : (
                                                        <div className={`w-9 h-9 rounded-[1px] flex items-center justify-center font-bold text-xs uppercase border ${isCustomer
                                                            ? "bg-slate-100 text-slate-600 border-slate-200"
                                                            : "bg-[#f0f9f7] text-[#008060] border-emerald-100"
                                                            }`}>
                                                            {message.sender?.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Message Bubble Body */}
                                            <div className="flex-1 space-y-1">
                                                <div className={`flex items-center gap-2 ${isCustomer ? "justify-start" : "justify-end"} ${isMsgInternal && "!justify-start"}`}>
                                                    <span className="text-xs font-bold text-slate-700">
                                                        {message.sender?.name}
                                                    </span>
                                                    {isMsgInternal && (
                                                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-[1px] uppercase flex items-center gap-0.5">
                                                            <Lock size={8} />
                                                            Internal Note
                                                        </span>
                                                    )}
                                                    {!isMsgInternal && !isCustomer && (
                                                        <span className="bg-emerald-50 text-[#008060] text-[9px] font-bold px-1.5 py-0.5 rounded-[1px] border border-emerald-100 uppercase">
                                                            Support Agent
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {new Date(message.created_at).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`p-4 rounded-sm text-[13.5px] leading-relaxed break-words ql-editor !min-h-0 !h-auto !p-4 ${isMsgInternal
                                                        ? "bg-transparent text-slate-700 !p-0"
                                                        : isCustomer
                                                            ? "bg-slate-50 border border-slate-200 text-slate-800"
                                                            : "bg-[#f0f9f7] text-slate-800 border-l-[3px] border-[#008060]"
                                                        }`}
                                                    dangerouslySetInnerHTML={{ __html: message.message }}
                                                />

                                                {/* Attachments */}
                                                {message.attachments && message.attachments.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                                                        {message.attachments.map((file) => {
                                                            const isImg = file.mime_type.startsWith('image/');
                                                            return (
                                                                <div key={file.id} className="max-w-[210px] border border-slate-200/80 rounded-[4px] bg-white overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] group relative transition-all hover:border-[#008060]">
                                                                    {isImg ? (
                                                                        <a href={file.url} target="_blank" rel="noreferrer" className="block relative">
                                                                            <img src={file.url} alt={file.file_name} className="w-full h-[100px] object-cover" />
                                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center text-white text-[10px] font-bold gap-1">
                                                                                View Large <ExternalLink size={10} />
                                                                            </div>
                                                                        </a>
                                                                    ) : (
                                                                        <a
                                                                            href={file.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-2 flex items-center gap-2 text-slate-700 hover:text-[#008060] transition-colors"
                                                                        >
                                                                            <div className="w-7 h-7 bg-slate-50 rounded-[3px] flex items-center justify-center text-slate-400 shrink-0">
                                                                                <FileText size={14} />
                                                                            </div>
                                                                            <div className="overflow-hidden">
                                                                                <span className="text-[11px] font-bold block truncate leading-tight w-[120px]">{file.file_name}</span>
                                                                                <span className="text-[9px] text-slate-400 block mt-0.5">Download Attachment</span>
                                                                            </div>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* B. Response Input Console Card */}
                        {ticket.status !== "closed" ? (
                            <form onSubmit={handleSubmitReply} className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">

                                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Send size={16} className="text-[#008060]" />
                                        <h3 className="text-[14px] font-bold text-[#081621]">Reply Console</h3>
                                    </div>

                                    {/* Public vs Internal Switch */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setIsInternal(false)}
                                            className={`h-[32px] px-4 rounded-[3px] text-[12px] font-bold transition-all flex items-center gap-1.5 ${!isInternal ? 'bg-[#008060] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            <Globe size={12} />
                                            Public Reply
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsInternal(true)}
                                            className={`h-[32px] px-4 rounded-[3px] text-[12px] font-bold transition-all flex items-center gap-1.5 ${isInternal ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            <Lock size={12} />
                                            Internal Note
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {isInternal && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-[1px] p-4 flex items-start gap-2.5 text-amber-800 text-xs leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                            <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-600" />
                                            <div>
                                                <span className="font-bold">Private Collaboration:</span> This note will be visible only to agents and administrators. The customer will never receive notifications or see this text.
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <RichTextEditor
                                            value={data.message}
                                            onChange={(val) => setData("message", val)}
                                            placeholder={isInternal ? "Type an internal note for other agents..." : "Type your response to the customer here..."}
                                            className={
                                                isInternal
                                                    ? "bg-[#fffbeb] border-amber-200 focus-within:border-amber-500"
                                                    : "bg-white border-slate-200 focus-within:border-[#008060]"
                                            }
                                        />
                                        <InputError message={errors.message} />
                                    </div>

                                    {/* Selected Previews */}
                                    {filePreviews.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pb-3 pt-1">
                                            {filePreviews.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2 pr-1.5 py-1 rounded-[3px] text-[11px] font-bold text-slate-600 shadow-xs animate-in zoom-in-95 duration-150">
                                                    {file.url ? (
                                                        <img src={file.url} className="w-5 h-5 rounded-[2px] object-cover shrink-0" />
                                                    ) : (
                                                        <FileText size={12} className="text-slate-400 shrink-0" />
                                                    )}
                                                    <span className="truncate max-w-[120px]">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="w-4 h-4 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                                        {/* Attachment Input */}
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="attachment-upload"
                                                className="border border-slate-200 hover:bg-slate-50 text-[#666666] h-[38px] px-5 rounded-[3px] text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                            >
                                                <Paperclip size={13} />
                                                Attach Screenshot
                                            </label>
                                            <input
                                                id="attachment-upload"
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*,application/pdf"
                                            />
                                        </div>

                                        {/* Submit button */}
                                        <button
                                            type="submit"
                                            disabled={processing || !data.message.trim()}
                                            className={`h-[38px] px-5 rounded-[3px] text-[12px] font-bold flex items-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 ${isInternal
                                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                                : "bg-[#008060] text-white hover:bg-[#006e52]"
                                                }`}
                                        >
                                            <Send size={13} />
                                            {isInternal ? "Post Note" : "Send Response"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-slate-100 rounded-[1px] border border-slate-200 p-6 text-center text-slate-500 flex items-center justify-center gap-2 shadow-sm animate-in fade-in duration-300">
                                <Lock size={15} />
                                <span className="text-[12px] font-bold text-slate-500">This support ticket is closed. Re-open it in the control console to reply.</span>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Ticket Actions & Profiles (Col-4) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* 1. Live Ticket State Actions */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300 relative z-20">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <LifeBuoy size={16} className="text-[#008060]" />
                                <h3 className="text-[14px] font-bold text-[#081621]">Control Console</h3>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Status Control */}
                                <div className="space-y-2 relative z-30">
                                    <InputLabel value="Ticket Status" />
                                    <SelectInput
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        showSearch={false}
                                        className="w-full"
                                    >
                                        <option value="open">🔵 Open (New)</option>
                                        <option value="in_progress">🟡 In Progress</option>
                                        <option value="resolved">🟢 Resolved</option>
                                        <option value="closed">⚪ Closed</option>
                                    </SelectInput>
                                </div>

                                {/* Priority Control */}
                                <div className="space-y-2 relative z-20">
                                    <InputLabel value="Urgency Priority" />
                                    <SelectInput
                                        value={ticket.priority}
                                        onChange={(e) => handlePriorityChange(e.target.value)}
                                        showSearch={false}
                                        className="w-full"
                                    >
                                        <option value="low">⚪ Low</option>
                                        <option value="medium">🔵 Medium</option>
                                        <option value="high">🟠 High</option>
                                        <option value="urgent">🚨 Urgent</option>
                                    </SelectInput>
                                </div>

                                {/* Assignee Selection Control */}
                                <div className="space-y-2 relative z-10">
                                    <InputLabel value="Assigned Agent" />
                                    <SelectInput
                                        value={ticket.assigned_to || ""}
                                        onChange={(e) => handleAssigneeChange(e.target.value || null)}
                                        showSearch={true}
                                        placeholder="Unassigned"
                                        className="w-full"
                                    >
                                        <option value="">Unassigned</option>
                                        {agents.map((agent) => (
                                            <option key={agent.id} value={agent.id}>
                                                👤 {agent.name}
                                            </option>
                                        ))}
                                    </SelectInput>
                                </div>
                            </div>
                        </div>

                        {/* 2. Customer Profile Panel */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300 relative z-10">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <User size={16} className="text-[#008060]" />
                                <h3 className="text-[14px] font-bold text-[#081621]">Customer Profile</h3>
                            </div>

                            <div className="p-6">
                                {ticket.customer ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {ticket.customer.profile_picture ? (
                                                <img
                                                    src={ticket.customer.profile_picture}
                                                    alt={ticket.customer.name}
                                                    className="w-12 h-12 rounded-[1px] object-cover border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-[1px] bg-slate-50 flex items-center justify-center text-[#008060] font-bold text-sm uppercase border border-slate-200">
                                                    {ticket.customer.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-bold text-slate-800 leading-tight">{ticket.customer.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Customer Client</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 pt-4 space-y-3">
                                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                                <Mail size={13} className="text-slate-400 shrink-0" />
                                                <span className="truncate font-medium">{ticket.customer.email}</span>
                                            </div>
                                            {ticket.customer.phone && (
                                                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                                    <Phone size={13} className="text-slate-400 shrink-0" />
                                                    <span className="font-medium">{ticket.customer.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 italic font-medium">No customer profile linked.</div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
