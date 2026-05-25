import React, { useState, useMemo, useCallback, memo } from 'react';
import { MessageSquare, ClipboardList, FileText, Star, Play, Download } from 'lucide-react';

/**
 * ProductTabs Component
 * 
 * Manages the detailed product sections including Specifications, Description, 
 * User Questions, and Customer Reviews. Uses a sticky anchor navigation for high-density UX.
 */
const ProductTabs = memo(({ product, onAskQuestion, onWriteReview }) => {
    const [activeTab, setActiveTab] = useState('specification');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Memoized review pagination to prevent recalculation on every re-render
    const { totalPages, paginatedReviews } = useMemo(() => {
        const total = Math.ceil((product.reviews?.length || 0) / pageSize);
        const paginated = product.reviews?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];
        return { totalPages: total, paginatedReviews: paginated };
    }, [product.reviews, currentPage, pageSize]);

    // Group tech specs by group_name for a structured layout
    const groupedSpecs = useMemo(() => {
        if (!product.tech_specs) return {};
        return product.tech_specs.reduce((acc, spec) => {
            const group = spec.group_name || 'Basic Information';
            if (!acc[group]) acc[group] = [];
            acc[group].push(spec);
            return acc;
        }, {});
    }, [product.tech_specs]);

    const tabs = useMemo(() => [
        { id: 'description', label: 'Description' },
        { id: 'specification', label: 'Additional Information' },
        { id: 'questions', label: `Questions (${product.questions?.length || 0})` },
        { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
    ], [product.questions?.length, product.reviews?.length]);

    // Stable navigation handler for internal page anchors
    const scrollToSection = useCallback((id) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Sticky header offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    return (
        <div id="product-sections">
            {/* Minimalist Tab Navigation */}
            <div className="flex items-center gap-8 border-b border-slate-100 mb-5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-[15px] transition-all border-b-[2px] -mb-[1px] ${
                            activeTab === tab.id
                                ? 'text-[#081621] border-[#081621]'
                                : 'text-slate-600 border-transparent hover:text-[#081621]'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'specification' && (
                <section className="animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(groupedSpecs).map(([groupName, specs]) => (
                            <div key={groupName}>
                                <h3 className="text-[16px] font-bold text-slate-800 mb-4">{groupName}</h3>
                                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden bg-white">
                                    {specs.map((spec) => (
                                        <div key={spec.id || spec.key} className="flex flex-col md:flex-row p-4 hover:bg-slate-50 transition-colors">
                                            <div className="w-full md:w-[200px] text-[14px] text-slate-500 font-medium">{spec.key}</div>
                                            <div className="flex-1 text-[14px] text-slate-800 font-medium">{spec.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {Object.keys(groupedSpecs).length === 0 && (
                            <div className="text-center py-10 w-full col-span-2">
                                <p className="text-[14px] text-slate-400 italic">No additional information available.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Rich Text Description Section */}
            {activeTab === 'description' && (
                <section className="animate-fadeIn">
                    <div className="prose prose-slate max-w-none prose-p:text-[#081621] prose-p:leading-relaxed prose-headings:text-[#081621] text-[15px]">
                        <div
                            dangerouslySetInnerHTML={{ __html: product.description || '<p>No detailed description available.</p>' }}
                        />
                    </div>
                </section>
            )}

            {/* Community Questions Section */}
            {activeTab === 'questions' && (
                <section className="animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-[18px] font-bold text-slate-800">Questions ({product.questions?.length || 0})</h2>
                            <p className="text-[14px] text-slate-500 mt-1">Have a specific question about this product?</p>
                        </div>
                        <button
                            onClick={onAskQuestion}
                            className="px-6 py-2.5 bg-[#5c319e] text-white font-bold rounded-[3px] text-[13px] hover:bg-[#4a2780] transition-all shadow-sm"
                        >
                            Ask Question
                        </button>
                    </div>

                    <div className="border border-slate-100 rounded-lg overflow-hidden bg-white divide-y divide-slate-100">
                        {product.questions?.length > 0 ? (
                            product.questions.map((q) => (
                                <div key={q.id} className="p-6">
                                    <div className="mb-3">
                                        <span className="text-[14px] text-[#5c319e] font-bold">
                                            {q.user?.name || 'Guest User'}
                                        </span>
                                        <span className="text-[12px] text-slate-400 ml-2">
                                            {new Date(q.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="space-y-4 pl-3 border-l-2 border-slate-100">
                                        <div className="flex gap-2">
                                            <span className="text-[15px] font-black text-slate-800 shrink-0">Q:</span>
                                            <h4 className="text-[15px] font-bold text-slate-800">{q.question}</h4>
                                        </div>

                                        {q.answer && (
                                            <div className="flex gap-2">
                                                <span className="text-[15px] font-black text-green-600 shrink-0">A:</span>
                                                <p className="text-[15px] text-slate-600 leading-relaxed">{q.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare size={24} className="text-slate-300" />
                                </div>
                                <p className="text-[14px] text-slate-500">No questions yet. Be the first to start the conversation.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Customer Reviews Section */}
            {activeTab === 'reviews' && (
                <section className="animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-[18px] font-bold text-[#081621]">Reviews ({product.reviews?.length || 0})</h2>
                        <button
                            onClick={onWriteReview}
                            className="px-5 py-2 border-2 border-[#3749bb] text-[#3749bb] font-bold rounded-[2px] text-[12px] hover:bg-[#3749bb] hover:text-white transition-all shadow-sm"
                        >
                            Write a Review
                        </button>
                    </div>
                    <p className="text-[13px] text-slate-500 mb-5">Feedback from customers who have purchased and used this product.</p>

                    {/* Aggregated Rating Feedback - Only show if there are actual reviews */}
                    {product.reviews?.length > 0 && (
                        <div className="flex items-center gap-3 mb-5 bg-slate-50/50 p-4 rounded-sm border border-slate-100/50 inline-flex">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => {
                                    const avgRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
                                    return (
                                        <Star
                                            key={i}
                                            size={22}
                                            className={i < Math.round(avgRating) ? 'fill-[#4f46e5] text-[#4f46e5]' : 'text-slate-200'}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-[20px] font-black text-[#081621]">
                                {(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)} <span className="text-slate-400 text-[14px] font-normal">out of 5</span>
                            </span>
                        </div>
                    )}

                    <div className="border-t border-slate-100 pt-4">
                        {product.reviews?.length > 0 ? (
                            <div className="space-y-0">
                                {paginatedReviews.map((r) => (
                                    <div key={r.id} className="pb-6 border-b border-slate-100 last:border-0 first:pt-0 mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#081621] font-bold text-sm shrink-0">
                                                {r.user?.name ? r.user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-bold text-[#081621] leading-none">{r.user?.name || 'Unknown User'}</span>
                                            </div>
                                            <span className="text-[12px] text-slate-400 ml-auto">
                                                {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="pl-3 border-l-2 border-slate-100">
                                            <div className="flex items-center gap-0.5 mb-2.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < r.rating ? 'fill-[#4f46e5] text-[#4f46e5]' : 'text-slate-200'}
                                                    />
                                                ))}
                                            </div>
                                            
                                            <p className="text-[14px] text-[#081621] leading-relaxed mb-3">{r.comment}</p>

                                        {/* User Uploaded Media Section */}
                                        {(r.images?.length > 0 || r.videos?.length > 0) && (
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                {r.images?.map((img, idx) => (
                                                    <div key={`${r.id}-img-${idx}`} className="w-20 h-20 rounded-[2px] border border-slate-200 overflow-hidden bg-white relative group shadow-sm">
                                                        <img
                                                            src={`/${img}`}
                                                            alt="User attachment"
                                                            className="w-full h-full object-contain cursor-zoom-in hover:scale-110 transition-transform duration-300"
                                                            onClick={() => window.open(`/${img}`, '_blank')}
                                                            loading="lazy"
                                                        />
                                                        <a
                                                            href={`/${img}`}
                                                            download
                                                            className="absolute bottom-1 right-1 p-1.5 bg-white/95 rounded-sm opacity-0 group-hover:opacity-100 transition-all shadow-md hover:text-[#4f46e5]"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Download size={12} />
                                                        </a>
                                                    </div>
                                                ))}
                                                {r.videos?.map((vid, idx) => (
                                                    <div key={`${r.id}-vid-${idx}`} className="w-20 h-20 rounded-[2px] border border-slate-200 overflow-hidden bg-slate-900 flex items-center justify-center relative group shadow-sm">
                                                        <video src={`/${vid}`} className="w-full h-full object-contain opacity-40" />
                                                        <button
                                                            className="absolute inset-0 flex items-center justify-center text-white transition-all group-hover:scale-125"
                                                            onClick={() => window.open(`/${vid}`, '_blank')}
                                                        >
                                                            <Play size={20} fill="currentColor" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                ))}

                                {/* Localized Review Pagination Logic */}
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-1.5 pt-5">
                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 text-[11px] font-bold rounded-sm uppercase tracking-tighter transition-all ${currentPage === 1 ? 'text-slate-300 bg-slate-50 border-slate-100' : 'text-[#081621] bg-white border border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            Prev
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-9 h-9 flex items-center justify-center text-[12px] font-bold rounded-sm transition-all ${currentPage === i + 1 ? 'bg-[#4f46e5] text-white shadow-md' : 'text-[#081621] bg-white border border-slate-100 hover:border-slate-300'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 text-[11px] font-bold rounded-sm uppercase tracking-tighter transition-all ${currentPage === totalPages ? 'text-slate-300 bg-slate-50 border-slate-100' : 'text-[#081621] bg-white border border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star size={24} className="text-slate-200" />
                                </div>
                                <p className="text-[13px] text-slate-400">No reviews found for this product.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
});

ProductTabs.displayName = 'ProductTabs';

export default ProductTabs;
