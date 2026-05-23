import React from 'react';
import { MapPin } from 'lucide-react';

const AddressEmptyState = () => {
    return (
        <div className="bg-white p-20 rounded-[4px] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-dashed border-slate-200">
                <MapPin size={40} className="text-slate-200" />
            </div>
            <h3 className="text-[16px] font-bold text-[#081621]">No Address Found</h3>
            <p className="text-[13px] text-slate-500 mt-2 max-w-[300px]">You haven't saved any addresses yet.</p>
        </div>
    );
};

export default AddressEmptyState;
