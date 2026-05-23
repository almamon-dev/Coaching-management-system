import React from 'react';
import { MapPin, Edit2, Trash2, Check } from 'lucide-react';

const AddressCard = ({ addr, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-[4px] border border-slate-200 shadow-sm flex flex-col group transition-all hover:border-[#081621]/30 hover:shadow-md relative">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                        <MapPin size={12} className="text-[#3749bb]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#081621] uppercase tracking-wider">{addr.type}</span>
                </div>
                {addr.is_primary && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-white uppercase tracking-widest bg-[#081621] px-2 py-0.5 rounded-full">
                        <Check size={8} strokeWidth={4} /> Primary
                    </span>
                )}
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1">
                <div className="space-y-3">
                    <div>
                        <h3 className="text-[14px] font-bold text-[#081621] mb-1">{addr.name}</h3>
                        <div className="space-y-0.5">
                            <p className="text-[13px] text-slate-600 leading-relaxed">{addr.address}</p>
                            <p className="text-[13px] text-slate-500">{addr.city}{addr.post_code ? `, ${addr.post_code}` : ''}</p>
                            {addr.area && <p className="text-[12px] text-slate-400 font-medium">{addr.area}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Actions */}
            <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                <button 
                    onClick={() => onEdit(addr)}
                    className="flex-1 h-9 flex items-center justify-center gap-2 text-[12px] font-bold text-[#3749bb] hover:bg-[#3749bb]/5 rounded-[4px] transition-all border border-transparent hover:border-[#3749bb]/10"
                >
                    <Edit2 size={13} /> Edit
                </button>
                <button 
                    onClick={() => onDelete(addr.id)}
                    className="flex-1 h-9 flex items-center justify-center gap-2 text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-[4px] transition-all border border-transparent hover:border-red-100"
                >
                    <Trash2 size={13} /> Remove
                </button>
            </div>
        </div>
    );
};

export default AddressCard;
