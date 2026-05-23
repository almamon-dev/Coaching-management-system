import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, router, Link } from '@inertiajs/react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useFrontend } from '@/Contexts/FrontendContext';

const Wishlist = ({ auth, wishlist }) => {
    const { addToCart } = useFrontend();
    const hasItems = wishlist && wishlist.length > 0;

    return (
        <UserLayout user={auth.user}>
            <Head title="My Wishlist" />
            <div className="space-y-4">
                {/* Header */}
                <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">My Wishlist</h1>
                    <p className="text-[#6d7175] text-[13px] font-medium mt-0.5">Products you've saved for later</p>
                </div>

                {!hasItems ? (
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-16 text-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
                            <Heart size={36} className="text-[#008060]" fill="currentColor" fillOpacity={0.1} />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#202223] mb-2">Your wishlist is empty</h3>
                        <p className="text-[#6d7175] text-[13px] font-medium max-w-[300px] mx-auto mb-8 leading-relaxed">
                            Looks like you haven't added any products to your wishlist yet.
                        </p>
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 text-[#008060] text-[13px] font-bold hover:underline group"
                        >
                            Continue Shopping
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                        <table className="w-full text-left text-[12.5px] border-collapse">
                            <thead className="bg-[#f7f7f7] border-b border-[#ebebeb] text-[#303030] text-[12px] font-semibold">
                                <tr>
                                    <th className="px-5 py-3 text-[12px] font-semibold text-[#303030]">Product</th>
                                    <th className="px-5 py-3 text-[12px] font-semibold text-[#303030]">Price</th>
                                    <th className="px-5 py-3 text-[12px] font-semibold text-[#303030]">Availability</th>
                                    <th className="px-5 py-3 text-[12px] font-semibold text-[#303030] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ebebeb] bg-white text-[12.5px] font-medium text-[#202223]">
                                {wishlist.map((item) => (
                                    <tr key={item.id} className="group hover:bg-[#f6f6f7] transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={item.image} alt={item.name} className="w-10 h-10 object-contain border border-[#ebebeb] p-1 bg-white rounded-[2px]" />
                                                <span className="font-bold text-[#202223] text-[12px] leading-tight group-hover:text-[#008060] transition-colors">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 font-bold text-[#202223]">৳{item.price.toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-[11px] font-bold ${item.in_stock ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {item.in_stock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => addToCart(item)}
                                                    className="h-7 px-3 bg-[#008060] text-white rounded-[3px] text-[10px] font-bold flex items-center gap-1.5 hover:bg-[#006e52] transition-all shadow-xs active:scale-95"
                                                >
                                                    <ShoppingCart size={12} /> Add to Cart
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to remove this item from your wishlist?')) {
                                                            router.delete(route('user.wishlist.destroy', item.id));
                                                        }
                                                    }}
                                                    className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-100 rounded-[3px] hover:bg-slate-50 transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </UserLayout>
    );
};

export default Wishlist;
