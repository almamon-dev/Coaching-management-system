import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { ArrowLeft } from 'lucide-react';

// Custom Hooks
import { useTicketDetails } from './Hooks/useTicketDetails';

// Partials
import TicketDetailsChat from './Partials/TicketDetailsChat';
import TicketDetailsSidebar from './Partials/TicketDetailsSidebar';

/**
 * Page Component: TicketDetailsPage
 * 
 * Orchestrates the full chat dialog thread split layout for support tickets.
 * Adheres to standard administrative practices by delegating all chat handlers
 * to useTicketDetails and presentational pieces to chat and sidebar partials.
 */
const TicketDetailsPage = ({ auth, ticket }) => {
    const {
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
    } = useTicketDetails(ticket);

    return (
        <StudentLayout user={auth?.user}>
            <Head title={`Ticket #${ticket.ticket_id} - ${ticket.subject}`} />

            <div className="space-y-4">
                {/* --- Back to Tickets Link --- */}
                <div className="flex items-center">
                    <Link
                        href={route('dashboard.tickets.index')}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[#008060] transition-colors group"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Ticket List
                    </Link>
                </div>

                {/* --- Header Section --- */}
                <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-[#008060] block bg-[#008060]/5 px-2 py-0.5 rounded-[2px]">
                                Ticket ID: #{ticket.ticket_id}
                            </span>
                            <span className={`px-2 py-0.5 border rounded-full text-[9.5px] font-bold capitalize tracking-tight ${getStatusBadgeClass(ticket.status)}`}>
                                {ticket.status.replace("_", " ")}
                            </span>
                        </div>
                        <h1 className="text-[17px] font-bold text-[#202223] tracking-tight">
                            {ticket.subject}
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 text-[12px] shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        <div>
                            <span className="text-[9.5px] font-bold text-slate-400 block">Created On</span>
                            <span className="font-bold text-slate-700 block mt-0.5">
                                {new Date(ticket.created_at).toLocaleDateString(undefined, {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-200" />
                        <div>
                            <span className="text-[9.5px] font-bold text-slate-400 block">Priority</span>
                            <span className={`px-1.5 py-0.5 border rounded-[2px] text-[9.5px] font-bold capitalize tracking-tight mt-0.5 inline-block ${getPriorityBadgeClass(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- Split-Pane Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                    {/* --- Left Column: Chat Conversation Thread (Span 8) --- */}
                    <div className="lg:col-span-8">
                        <TicketDetailsChat
                            auth={auth}
                            ticket={ticket}
                            data={data}
                            setData={setData}
                            processing={processing}
                            errors={errors}
                            filePreviews={filePreviews}
                            chatEndRef={chatEndRef}
                            handleFileChange={handleFileChange}
                            removeFile={removeFile}
                            handleReplySubmit={handleReplySubmit}
                        />
                    </div>

                    {/* --- Right Column: Ticket Metadata Card (Span 4) --- */}
                    <div className="lg:col-span-4">
                        <TicketDetailsSidebar
                            ticket={ticket}
                            getPriorityBadgeClass={getPriorityBadgeClass}
                        />
                    </div>

                </div>

            </div>
        </StudentLayout>
    );
};

export default TicketDetailsPage;
