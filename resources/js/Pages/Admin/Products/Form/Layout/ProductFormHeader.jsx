import React from 'react';
import { Link } from '@inertiajs/react';
import { Loader2, FileEdit, Save } from 'lucide-react';

const ProductFormHeader = ({ title, subTitle, processing, onSaveDraft, onUpdate, isEdit = false }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">{title}</h1>
                <p className="text-[#008060] text-[13px] mt-0.5 font-bold">{subTitle}</p>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href={route("admin.products.index")}
                    className="h-[36px] px-5 bg-white border border-[#d1d1d1] rounded-[4px] text-[#202223] font-bold text-[12px] flex items-center gap-2 hover:bg-[#f6f6f7] transition-all shadow-sm"
                >
                    Cancel
                </Link>
                <button
                    type="button"
                    onClick={onSaveDraft}
                    disabled={processing}
                    className="h-[36px] px-5 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] text-[12px] font-bold flex items-center gap-2 hover:bg-[#f6f6f7] transition-all shadow-sm disabled:opacity-50"
                >
                    {processing ? <Loader2 className="animate-spin" size={16} /> : <FileEdit size={16} />}
                    Save as Draft
                </button>
                <button
                    type="button"
                    onClick={onUpdate}
                    disabled={processing}
                    className={`h-[36px] px-6 rounded-[4px] text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 ${!processing
                        ? 'bg-[#008060] text-white hover:bg-[#006e52]'
                        : 'bg-[#ebebeb] text-[#6d7175]/50 cursor-not-allowed shadow-none border border-[#d1d1d1]'
                        }`}
                >
                    {processing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {isEdit ? 'Update Product' : 'Publish Product'}
                </button>
            </div>
        </div>
    );
};

export default ProductFormHeader;
