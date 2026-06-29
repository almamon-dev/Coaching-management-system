import React from 'react';
import { 
    Send, X, FileText, Paperclip, ExternalLink, ShieldCheck, AlertTriangle, User, Shield 
} from 'lucide-react';
import RichTextEditor from '@/Components/Form/RichTextEditor';
import InputError from '@/Components/Form/InputError';

/**
 * Component: TicketDetailsChat
 * 
 * Renders a high-fidelity card-based message feed in a structured helpdesk format.
 * Incorporates left vertical borders for agents, clean role badges, 
 * full-width messages, and a matching rich text editor.
 */
export default function TicketDetailsChat({
    auth,
    ticket,
    data,
    setData,
    processing,
    errors,
    filePreviews,
    chatEndRef,
    handleFileChange,
    removeFile,
    handleReplySubmit
}) {
    const isClosed = ticket.status === 'closed';

    return (
        <div className="space-y-4">
            
            {/* Header bar of Chat thread */}
            <div className="bg-white border border-[#ebebeb] rounded-[4px] px-5 py-3.5 flex items-center justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[12px] font-bold text-slate-700">Ticket Messages</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                    Total Messages: {ticket.messages.length}
                </span>
            </div>

            {/* Natural Stacking Message Cards */}
            <div className="space-y-4">
                {[...ticket.messages]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((message) => {
                    const isCustomer = message.sender_id === auth.user.id;
                    return (
                        <div 
                            key={message.id} 
                            className={`bg-white border border-[#ebebeb] rounded-[4px] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-200 ${
                                isCustomer 
                                    ? '' 
                                    : 'border-l-[3px] border-l-[#008060]'
                            }`}
                        >
                            {/* Card Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/20">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm border ${
                                        isCustomer 
                                            ? 'bg-[#e4f1ef] border-[#d6ebe7] text-[#008060]' 
                                            : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                                    }`}>
                                        {message.sender?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[12.5px] font-bold text-slate-800">
                                                {message.sender?.name}
                                            </span>
                                            {isCustomer ? (
                                                <span className="bg-slate-100 text-slate-600 text-[8.5px] font-bold px-1.5 py-0.5 rounded-[2px]">
                                                    Owner
                                                </span>
                                            ) : (
                                                <span className="bg-[#008060]/5 text-[#008060] border border-[#008060]/10 text-[8.5px] font-bold px-1.5 py-0.5 rounded-[2px] flex items-center gap-1">
                                                    <Shield size={9} />
                                                    Operator
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                                            {new Date(message.created_at).toLocaleString(undefined, { 
                                                weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Message Body */}
                            <div className="p-5 text-[13px] text-slate-700 font-medium leading-relaxed ql-editor !min-h-0 !h-auto !p-5">
                                <div dangerouslySetInnerHTML={{ __html: message.message }} />

                                {/* Attachments inside card body */}
                                {message.attachments?.length > 0 && (
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
                                                            download 
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
                <div ref={chatEndRef} />
            </div>

            {/* Reply Editor Card */}
            <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
                
                {/* Editor Header */}
                <div className="border-b border-slate-100 px-5 py-3.5 bg-slate-50/20 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-slate-700">Reply to Ticket</span>
                    <span className="text-[10.5px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-[2px]">New Message</span>
                </div>

                {/* Editor Card Header (User Info) */}
                <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#e4f1ef] border border-[#d6ebe7] text-[#008060] flex items-center justify-center shadow-xs">
                        <User size={13} />
                    </div>
                    <div>
                        <span className="text-[12px] font-bold text-slate-800 block leading-none">{auth.user.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1 leading-none">{auth.user.email}</span>
                    </div>
                </div>

                {/* Editor Body */}
                <div className="p-5">
                    {isClosed ? (
                        <div className="p-4 bg-slate-50 border border-dashed border-[#ebebeb] rounded-[3px] text-center text-slate-500 font-bold text-[11px] flex items-center justify-center gap-2">
                            <AlertTriangle size={15} className="text-amber-500" />
                            This support ticket has been closed. Please open a new ticket.
                        </div>
                    ) : (
                        <form onSubmit={handleReplySubmit} className="space-y-4">
                            <div className="space-y-3.5">
                                <RichTextEditor
                                    value={data.message}
                                    onChange={val => setData('message', val)}
                                    placeholder="Type your message to the support representative..."
                                />
                                
                                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                                    {/* Attachments Trigger Button */}
                                    <label className="h-[32px] px-3.5 bg-white border border-[#d1d1d1] text-slate-600 hover:text-[#008060] hover:border-[#008060] rounded-[3px] font-bold text-[11px] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm hover:bg-slate-50" title="Attach file">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,application/pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            disabled={processing || data.attachments.length >= 3}
                                        />
                                        <Paperclip size={13} />
                                        Add Attachments...
                                    </label>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing || !data.message.trim() || data.message.trim() === '<p><br></p>'}
                                        className="h-[32px] px-5 bg-[#008060] hover:bg-[#006e52] text-white rounded-[3px] font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50 active:scale-95"
                                    >
                                        <Send size={11} />
                                        Send Message
                                    </button>
                                </div>
                            </div>

                            {/* Selected Attachments list */}
                            {filePreviews.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                                    {filePreviews.map((file, index) => (
                                        <div key={index} className="border border-[#ebebeb] p-1.5 rounded-[3px] flex items-center gap-2 relative bg-slate-50 text-[11px] pr-6">
                                            {file.url ? (
                                                <img src={file.url} className="w-6 h-6 rounded-[1px] object-cover" alt="preview" />
                                            ) : (
                                                <FileText size={12} className="text-slate-400" />
                                            )}
                                            <span className="font-bold text-[#202223] truncate max-w-[120px]">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                                            >
                                                <X size={8} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <InputError message={errors.message} />
                        </form>
                    )}
                </div>

            </div>

        </div>
    );
}
