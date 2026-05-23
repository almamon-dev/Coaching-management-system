import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Calendar } from 'lucide-react';

const UsageExpiryTab = ({ data, setData, errors }) => {
    return (
        <div className="space-y-6 max-w-7xl">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <InputLabel value="Usage Limit per User" />
                    <TextInput
                        type="number"
                        className="w-full"
                        placeholder="e.g. 1"
                        value={data.usage_limit}
                        onChange={e => setData('usage_limit', e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 mt-1   ">How many times one user can apply this coupon.</p>
                    <InputError message={errors.usage_limit} />
                </div>
                <div>
                    <InputLabel value="Coupon Expiry Date" />
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <TextInput
                            type="date"
                            className="w-full pl-10"
                            value={data.expires_at}
                            onChange={e => setData('expires_at', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.expires_at} />
                </div>
            </div>
            <div>
                <InputLabel value="Coupon Status" />
                <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={data.status === 1}
                            onChange={() => setData('status', 1)}
                            className="text-[#ef4a23] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[13px] font-bold text-slate-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={data.status === 0}
                            onChange={() => setData('status', 0)}
                            className="text-[#ef4a23] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[13px] font-bold text-slate-700">Inactive</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default UsageExpiryTab;
