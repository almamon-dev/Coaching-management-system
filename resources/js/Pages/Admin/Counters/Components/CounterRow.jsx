import { Check, Trash2, SquarePen, Monitor, Calendar, FileText } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/Common/StatusDropdown';

const CounterRow = ({ counter, isSelected, toggleSelect, handleDelete, visibleColumns }) => {
    return (
        <tr className={cn(
            "group transition-colors h-[48px] text-[12px]",
            isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
        )}>
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => toggleSelect(counter.id)}
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
            
            {visibleColumns.includes('name') && (
                <td className="px-4 py-1 font-bold text-[#202223] truncate">
                    <div className="flex items-center gap-2">
                        <Monitor size={14} className="text-slate-400 shrink-0" />
                        <span>{counter.name}</span>
                    </div>
                </td>
            )}

            {visibleColumns.includes('description') && (
                <td className="px-4 py-1 text-slate-500 font-medium truncate">
                    {counter.description || <span className="italic text-slate-300">No description provided</span>}
                </td>
            )}

            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    <StatusDropdown
                        value={counter.is_active === 1 || counter.is_active === true || counter.is_active === '1' ? 1 : 0}
                        options={[
                            { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                            { label: 'Offline', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                        ]}
                        onChange={(newVal) => {
                            router.patch(route('admin.counters.status', counter.id), {
                                is_active: newVal === 1
                            }, { preserveScroll: true });
                        }}
                    />
                </td>
            )}

            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center whitespace-nowrap text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(counter.created_at).toLocaleDateString()}
                    </span>
                </td>
            )}

            <td className="px-6 py-1 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route("admin.counters.edit", counter.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                        title="Edit Desk"
                    >
                        <SquarePen size={12} />
                    </Link>
                    <button
                        onClick={() => handleDelete(counter.id, counter.name)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Desk"
                        type="button"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CounterRow;
