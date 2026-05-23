import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Hash } from 'lucide-react';

const BasicInfoTab = ({ data, setData, errors }) => {
    const generateCode = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let part1 = '';
        let part2 = '';
        for (let i = 0; i < 4; i++) {
            part1 += letters.charAt(Math.floor(Math.random() * letters.length));
            part2 += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        setData('code', `${part1}-${part2}`);
    };

    return (
        <div className="space-y-6  max-w-7xl">
            <div>
                <InputLabel value="Coupon Title (Internal Display Name)" />
                <TextInput
                    className="w-full"
                    placeholder="e.g. Winter Mega Discount"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                />
                <InputError message={errors.title} />
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <InputLabel value="Promo Coupon Code (ABCD-1234)" />
                    <button
                        type="button"
                        onClick={generateCode}
                        className="text-[11px] font-bold text-[#ef4a23] hover:underline"
                    >
                        Generate Random Code
                    </button>
                </div>
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <TextInput
                        className="w-full pl-10"
                        placeholder="ABCD-1234"
                        value={data.code}
                        onChange={e => setData('code', e.target.value.toUpperCase())}
                    />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-bold italic">This is the code users will enter to claim their discount or balance.</p>
                <InputError message={errors.code} />
            </div>
        </div>
    );
};

export default BasicInfoTab;
