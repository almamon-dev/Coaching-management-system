import React from 'react';
import { Link } from '@inertiajs/react';
import { Calendar, Eye, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/StatusDropdown';

const RepairRow = ({
    repair,
    isSelected,
    toggleSelect,
    technicians,
    handleQuickAssign,
    handleQuickStatus,
    visibleColumns = [],
    handleDelete
}) => {

    const statusOptions = [
        { label: 'Pending', value: 'pending', color: 'text-slate-700', dot: 'bg-slate-500', bg: 'bg-slate-100' },
        { label: 'Received', value: 'approved', color: 'text-blue-700', dot: 'bg-blue-500', bg: 'bg-blue-50' },
        { label: 'Diagnosing', value: 'diagnosing', color: 'text-amber-700', dot: 'bg-amber-500', bg: 'bg-amber-50' },
        { label: 'Awaiting Quote', value: 'awaiting_quote', color: 'text-purple-700', dot: 'bg-purple-500', bg: 'bg-purple-50' },
        { label: 'Repairing', value: 'repairing', color: 'text-indigo-700', dot: 'bg-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Testing QC', value: 'testing', color: 'text-sky-700', dot: 'bg-sky-500', bg: 'bg-sky-50' },
        { label: 'Ready', value: 'ready', color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
        { label: 'Completed', value: 'completed', color: 'text-emerald-700', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Cancelled', value: 'cancelled', color: 'text-rose-700', dot: 'bg-rose-500', bg: 'bg-rose-50' }
    ];

    return (
        <tr className={cn(
            "group transition-colors h-[48px]",
            isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
        )}>
            {/* Selection Checkbox */}
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => toggleSelect && toggleSelect(repair.id)}
                    className={cn(
                        "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                        isSelected
                            ? "bg-[#008060] border-[#008060]"
                            : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                    )}
                >
                    {isSelected && <Check size={11} strokeWidth={4} className="text-white" />}
                </div>
            </td>

            {/* Ticket Column */}
            {visibleColumns.includes('ticket') && (
                <td className="px-4 py-1 font-bold text-[#202223] text-[12px] w-[140px] truncate leading-tight">
                    {repair.ticket_number}
                    <span className="block mt-0.5 text-[8.5px] font-extrabold tracking-wider bg-amber-50 text-amber-600 border border-amber-200/40 py-0.5 px-1.5 rounded-[3px] w-fit uppercase">
                        Token: {repair.token_number || ('T-' + String(repair.id).padStart(3, '0'))}
                    </span>
                </td>
            )}

            {/* Customer Column */}
            {visibleColumns.includes('customer') && (
                <td className="px-4 py-1 w-[200px]">
                    <div className="font-bold text-[#202223] text-[12px] truncate leading-none">{repair.customer?.name}</div>
                    <div className="text-[10px] text-[#6d7175] mt-1 font-semibold truncate leading-none">{repair.customer?.phone || repair.customer?.email}</div>
                </td>
            )}

            {/* Gadget Specifications Column */}
            {visibleColumns.includes('gadget') && (
                <td className="px-4 py-1 w-[280px]">
                    {repair.brand ? (
                        <div className="flex flex-col min-w-0 leading-tight">
                            <div className="font-bold text-[#202223] text-[12px] truncate">{repair.brand} {repair.model_name}</div>
                            <div className="text-[10px] text-[#6d7175] mt-0.5 font-semibold truncate">
                                {repair.device_type} {repair.serial_number && `• S/N: ${repair.serial_number}`} • {repair.counter_name || ('Counter ' + ((repair.id % 3) + 1))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col min-w-0 leading-tight">
                            <div className="font-bold text-slate-400 italic text-[12px]">Unregistered Token</div>
                            <div className="text-[10px] text-[#008060] font-extrabold mt-0.5 uppercase tracking-wide">
                                Proceed to {repair.counter_name || ('Counter ' + ((repair.id % 3) + 1))}
                            </div>
                        </div>
                    )}
                </td>
            )}


            {/* Date Logged Column */}
            {visibleColumns.includes('date') && (
                <td className="px-4 py-1 text-center w-[120px] whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[#6d7175] text-[11px] font-semibold">
                        <Calendar size={11} className="text-[#6d7175]" />
                        {new Date(repair.created_at).toLocaleDateString()}
                    </span>
                </td>
            )}

            {/* Technician Column */}
            {visibleColumns.includes('technician') && (
                <td className="px-4 py-1 w-[160px]">
                    <div className="relative">
                        <select
                            value={repair.technician_id || ""}
                            onChange={e => handleQuickAssign && handleQuickAssign(repair.id, e.target.value)}
                            className="text-[11.5px] font-bold text-[#202223] border border-[#d1d1d1] rounded-[3px] focus:border-[#008060] focus:ring-0 py-1 pl-2 pr-6 bg-white hover:bg-slate-50 transition-colors w-full cursor-pointer h-[28px] leading-tight select-none appearance-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236d7175' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                                backgroundSize: '12px',
                                backgroundPosition: 'calc(100% - 6px) center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <option value="" className="font-bold text-[#6d7175]">Unassigned</option>
                            {technicians.map(t => (
                                <option key={t.id} value={t.id} className="font-medium text-[#202223]">{t.name}</option>
                            ))}
                        </select>
                    </div>
                </td>
            )}

            {/* Pipeline Status Column */}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center w-[140px]">
                    <StatusDropdown
                        value={repair.status}
                        options={statusOptions}
                        onChange={(newVal) => {
                            handleQuickStatus && handleQuickStatus(repair.id, newVal);
                        }}
                    />
                </td>
            )}

            {/* Bill Cost Column */}
            {visibleColumns.includes('cost') && (
                <td className="px-4 py-1 text-right font-bold text-[#202223] text-[12px] w-[120px] whitespace-nowrap">
                    {repair.total_cost > 0 ? (
                        <span>৳ {Number(repair.total_cost).toLocaleString()}</span>
                    ) : (
                        <span className="text-[#bababa] italic text-[11px] font-normal">Unquoted</span>
                    )}
                </td>
            )}

            {/* View & Delete Action Column */}
            <td className="px-6 py-1 text-center w-[100px]">
                <div className="flex items-center justify-center gap-1">
                    <Link
                        href={route('admin.repairs.show', repair.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                        title="Open Engineer Workspace"
                    >
                        <Eye size={12} />
                    </Link>
                    <button
                        onClick={() => handleDelete && handleDelete(repair.id, repair.ticket_number)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Ticket"
                        type="button"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default RepairRow;
