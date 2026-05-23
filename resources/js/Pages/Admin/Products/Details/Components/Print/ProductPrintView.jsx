import React from 'react';

const ProductPrintView = ({ product }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(price || 0).replace('BDT', '৳');
    };

    return (
        <div className="print-view hidden print:block bg-white text-[#081621] font-sans">
            <table className="w-full">
                <thead>
                    <tr>
                        <td><div className="h-[1cm]"></div></td>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>
                            <div className="px-10">
                                {/* Minimal Header */}
                                <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-10">
                                    <div>
                                        <h1 className="text-[24px] font-black tracking-tighter text-[#081621]">
                                            STAR <span className="text-[#ef4a23]">TECH</span>
                                        </h1>
                                        <p className="text-[10px] text-slate-400 font-bold  tracking-[0.2em]">Product Catalog</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-bold text-slate-500  tracking-widest">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                {/* Main Info Section */}
                                <div className="flex gap-12 mb-12">
                                    <div className="w-[35%]">
                                        <img
                                            src={product.primary_image?.full_url || (product.images?.[0]?.full_url)}
                                            className="w-full h-auto object-contain grayscale-[0.5] contrast-[1.1]"
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className="w-[65%]">
                                        <h2 className="text-[20px] font-bold mb-6 text-[#081621] leading-tight">{product.name}</h2>

                                        <div className="flex gap-8 mb-8">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400  tracking-widest mb-1">Cash Price</p>
                                                <p className="text-[20px] font-black text-[#ef4a23]">{formatPrice(product.price)}</p>
                                            </div>
                                            <div className="w-px h-10 bg-slate-100"></div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400  tracking-widest mb-1">Product SKU</p>
                                                <p className="text-[16px] font-bold text-slate-700">{product.sku}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-[10px] font-bold  tracking-[0.2em] text-slate-300 mb-4">Highlights</h3>
                                            <div className="grid grid-cols-1 gap-2.5">
                                                {product.features?.map((f, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                                        <p className="text-[12px] font-medium text-slate-500">{f.feature}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Minimalist Specs Table */}
                                <div className="mb-12">
                                    <h3 className="text-[12px] font-bold  tracking-widest text-slate-400 mb-6 border-b border-slate-50 pb-2">Technical Specification</h3>
                                    <div className="border-t border-slate-100">
                                        {product.tech_specs?.map((s, i) => (
                                            <div key={i} className="flex border-b border-slate-100 py-3">
                                                <div className="w-1/3 text-[11px] font-bold text-slate-400  tracking-wider">{s.spec_key}</div>
                                                <div className="w-2/3 text-[12px] font-bold text-slate-700">{s.spec_value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Clean Description */}
                                <div className="mb-12">
                                    <h3 className="text-[12px] font-bold  tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 pb-2">Overview</h3>
                                    <div
                                        className="prose-sm max-w-none text-[12px] text-slate-500 leading-relaxed font-medium prose-a:text-[#ef4a23] prose-a:no-underline"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td><div className="h-[1cm]"></div></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ProductPrintView;
