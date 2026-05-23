import { Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { ProcessorSvg, SLOT_ICONS } from './PCBuilderIcons';

export default function PCBuilderRow({ slot, product, onRemove, getQueryString, onChoose }) {
    const SvgComponent = SLOT_ICONS[slot.id] || ProcessorSvg;
    const price = product ? (product.discount_price || product.price) : 0;

    return (
        <div className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors min-h-[80px]">

            {/* Left: Icon Container */}
            <div className="w-14 h-14 bg-[#f3f5f9] rounded flex items-center justify-center shrink-0">
                <SvgComponent />
            </div>

            {/* Center: Slot Name, Badge, Selected Details or Placeholders */}
            <div className="flex-1 flex flex-col justify-center min-w-0 pl-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[13px] font-bold text-slate-700 leading-none">
                        {slot.name}
                    </h3>
                    {slot.required && !product && (
                        <span className="text-[9px] font-bold text-white bg-[#5e6f7c] px-1.5 py-0.5 rounded leading-none shrink-0 uppercase tracking-wider">Required</span>
                    )}
                </div>

                {product ? (
                    <div className="mt-1.5">
                        <Link
                            href={`/${product.slug}`}
                            className="text-xs font-semibold text-slate-800 hover:text-[#3749bb] transition-colors line-clamp-1 block leading-tight"
                        >
                            {product.name}
                        </Link>
                        {product.features && product.features.length > 0 && (
                            <span className="text-[10px] text-slate-400 line-clamp-1 leading-none mt-1">
                                {product.features.map(f => f.feature).join(' • ')}
                            </span>
                        )}
                    </div>
                ) : (
                    // Placeholder line matching the screenshot
                    <div className="mt-3.5 w-full max-w-sm h-[7px] bg-[#f1f3f5] rounded-full" />
                )}
            </div>

            {/* Right: Price Indicator & Choose/Change Actions */}
            <div className="flex items-center justify-end shrink-0">

                {/* Price Placeholder (or real price) */}
                {product ? (
                    <div className="text-right pr-4">
                        <span className="text-xs font-bold text-slate-800 block leading-none">
                            {price.toLocaleString()}৳
                        </span>
                        {product.discount_price && product.price && (
                            <span className="text-[10px] text-slate-400 line-through leading-none block mt-1">
                                {product.price.toLocaleString()}৳
                            </span>
                        )}
                    </div>
                ) : (
                    // Placeholder box for price matching the screenshot
                    <div className="w-14 h-3 bg-[#e9ecef] rounded-full mr-4" />
                )}

                {/* Vertical Divider */}
                <div className="h-8 border-l border-[#ebebeb] mr-4" />

                {/* Action Button */}
                <div className="print-hide">
                    {product ? (
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => onChoose(slot.id)}
                                className="w-16 py-1.5 text-center text-[12px] font-bold border border-slate-300 text-slate-600 hover:bg-slate-50 rounded transition-all"
                            >
                                Change
                            </button>
                            <button
                                onClick={() => onRemove(slot.id)}
                                className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded transition-all"
                                title="Remove"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onChoose(slot.id)}
                            className="w-24 py-1.5 block text-center text-[12px] font-bold rounded transition-all border border-[#3749bb] text-[#3749bb] bg-white hover:bg-[#3749bb] hover:text-white"
                        >
                            Choose
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}
