import React from 'react';
import { Package } from 'lucide-react';

const ProductsCatalogView = ({ products, loadingProducts }) => {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 bg-white border border-[#ebebeb] p-5 sm:p-8 rounded-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] animate-in fade-in duration-150">
            <div className="text-center space-y-1">
                <h2 className="text-[22px] font-extrabold text-[#202223]">Featured Hot Products</h2>
                <p className="text-[#6d7175] text-[13px]">Explore available items, special offers, and current stock rates right from the kiosk.</p>
            </div>

            {loadingProducts ? (
                <div className="py-20 text-center text-[#6d7175] text-[13px]">Loading items feed...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                    {products.length > 0 ? (
                        products.map(product => (
                            <div key={product.id} className="bg-white border border-[#ebebeb] rounded-[6px] overflow-hidden flex flex-col justify-between hover:border-[#008060] transition-colors text-left shadow-sm">
                                {product.thumbnail ? (
                                    <div className="h-28 bg-[#f4f6f8] flex items-center justify-center p-2 relative overflow-hidden">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.name}
                                            className="h-full object-contain mix-blend-multiply"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-28 bg-[#f4f6f8] flex items-center justify-center text-slate-400">
                                        <Package size={26} />
                                    </div>
                                )}

                                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                                    <div>
                                        <h4 className="font-extrabold text-[#202223] text-[12.5px] truncate" title={product.name}>{product.name}</h4>
                                        <p className="text-[11px] text-[#6d7175] line-clamp-2 mt-1 leading-normal">{product.description || 'Premium retail gadget with full store warranty support.'}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 border-t border-[#ebebeb]">
                                        <span className="text-[#008060] font-black text-[13.5px]">৳ {Number(product.price).toLocaleString()}</span>
                                        <span className="text-[9px] bg-[#e4f1ef] text-[#008060] border border-[#b3e0d5] font-bold px-2 py-0.5 rounded-[4px]">In Stock</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 py-20 text-center text-slate-400 text-[13px]">
                            No active products catalog is loaded at this moment.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductsCatalogView;
